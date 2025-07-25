import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/connectDb";
import { auth } from "@/lib/auth";
import Video from "@/schemas/video.schema";
import Upload from "@/schemas/upload.schema";
import User from "@/schemas/user.schema";
import mongoose from "mongoose";

function uploadToCloudinary(buffer: Buffer, options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const videoFile = formData.get("video") as File;
  let type = formData.get("type") as string;
  const thumbnailFile = formData.get("thumbnail") as File;

  if (!title || !description || !videoFile || !thumbnailFile) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  if (!type) {
    type = "public";
  }

  const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
  const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());

  try {
    // Upload video
    const videoResult = await uploadToCloudinary(videoBuffer, {
      resource_type: "video",
      folder: "screeny/videos",
    });

    // Save video to DB
    const newVideo = new Video({ videoUrl: videoResult.secure_url });
    await newVideo.save();

    // Upload thumbnail
    const thumbResult = await uploadToCloudinary(thumbnailBuffer, {
      resource_type: "image",
      folder: "screeny/thumbnails",
    });

    // Save upload entry
    const newUpload = new Upload({
      userId: session.user.id,
      videoId: newVideo._id,
      thumbnailUrl: thumbResult.secure_url,
      title,
      description,
      type,
      views: 0,
    });

    await newUpload.save();

    return NextResponse.json(
      {
        message: "Upload successful",
        upload: newUpload,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const uploads = await Upload.find({ type: "public" }).lean();

    const userIds = uploads.map((u) => u.userId);

    if (!mongoose.connection.db) {
      throw new Error("Database connection is not established.");
    }
    const users = await mongoose.connection.db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .project({ name: 1, email: 1, image: 1 })
      .toArray();

    const uploadsWithUser = uploads.map((upload) => {
      const user = users.find(
        (u) => u._id.toString() === upload.userId.toString()
      );
      return { ...upload, user };
    });

    return NextResponse.json(
      {
        uploads: uploadsWithUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
