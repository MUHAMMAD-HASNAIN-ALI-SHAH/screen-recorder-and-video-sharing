import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import Upload from "@/schemas/upload.schema";
import User from "@/schemas/user.schema";
import Video from "@/schemas/video.schema";

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
