import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import { auth } from "@/lib/auth";
import Upload from "@/schemas/upload.schema";

export async function GET(req: NextRequest) {
  await connectDB();

  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const uploads = await Upload.find({ userId: session.user.id });
    if (!uploads || uploads.length === 0) {
      return NextResponse.json({ uploads: [] }, { status: 200 });
    }

    return NextResponse.json(
      {
        uploads,
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
