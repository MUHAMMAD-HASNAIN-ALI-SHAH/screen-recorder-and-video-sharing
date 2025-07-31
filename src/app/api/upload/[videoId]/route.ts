import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import Upload from "@/schemas/upload.schema";
import User from "@/schemas/user.schema";
import Video from "@/schemas/video.schema";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  await connectDB();

  try {
    const { videoId } = params;

    const upload = await Upload.findById(videoId).lean();

    if (!upload || Array.isArray(upload)) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    const user = await User.findById((upload as any).userId).lean();

    if (!user || Array.isArray(user)) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const video = await Video.findById(upload.videoId).lean();
    console.log("Video details:", video);

    if (!video || Array.isArray(video)) {
      return NextResponse.json(
        { message: "Video file not found" },
        { status: 404 }
      );
    }

    // Manually attach user data to the upload object
    upload.userId = {
      name: user.name,
      email: user.email,
      image: user.image,
    };

    upload.videoId = video.videoUrl;

    return NextResponse.json({ videoDetails: upload }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching video details:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  await connectDB();

  try {
    const { videoId } = params;

    const upload = await Upload.findById(videoId).lean();

    if (!upload || Array.isArray(upload)) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    upload.views = (upload.views || 0) + 1;
    await Upload.findByIdAndUpdate(videoId, { views: upload.views });

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching video details:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  await connectDB();
  const { videoId: uploadId } = params;

  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!uploadId) {
    return NextResponse.json({ message: "Missing upload ID" }, { status: 400 });
  }

  try {
    const upload = await Upload.findById(uploadId);
    if (!upload) {
      return NextResponse.json(
        { message: "Upload not found" },
        { status: 404 }
      );
    }

    if (upload.userId.toString() !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Delete video from Cloudinary
    if (upload.videoId) {
      const video = await Video.findById(upload.videoId);
      if (video) {
        const getPublicId = (url: string) => {
          try {
            const split1 = url.split("/upload/")[1];
            const withoutVersion = split1.split("/").slice(1).join("/");
            const publicId = withoutVersion.split(".")[0];
            return publicId;
          } catch {
            return null;
          }
        };

        const videoPublicId = getPublicId(video.videoUrl);
        if (videoPublicId) {
          const res = await cloudinary.uploader.destroy(videoPublicId, {
            resource_type: "video",
          });
        }

        await video.deleteOne();
      }
    }

    // Delete thumbnail from Cloudinary
    if (upload.thumbnailId) {
      const thumbPublicId = upload.thumbnailId
        .split("/upload/")[1]
        ?.split(".")[0];
      if (thumbPublicId) {
        const res = await cloudinary.uploader.destroy(thumbPublicId);
      }
    }

    await upload.deleteOne();

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

// Extract public ID from full Cloudinary URL
function extractCloudinaryPublicId(url: string) {
  try {
    const withoutExtension = url.split(".")[0];
    const parts = withoutExtension.split("/");
    return parts.slice(-2).join("/"); // works for folders or root uploads
  } catch {
    return null;
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  await connectDB();
  const { videoId } = params;
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    const upload = await Upload.findById(videoId);

    if (!upload) {
      return NextResponse.json(
        { message: "Upload not found" },
        { status: 404 }
      );
    }

    if (upload.userId.toString() !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    upload.title = title;
    upload.description = description;

    await upload.save();

    return NextResponse.json(
      { message: "Upload updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
