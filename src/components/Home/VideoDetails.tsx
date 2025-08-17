"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import useHomeStore from "@/store/useHomeStore";

interface User {
  name: string;
  email: string;
  image: string;
}

interface VideoDetailsResponse {
  videoDetails: {
    _id: string;
    videoId: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    views: number;
    createdAt: string;
    type: string;
    userId: User;
  };
}

const VideoDetails = ({ videoId }: { videoId: string }) => {
  const { addView } = useHomeStore();
  const [data, setData] = useState<VideoDetailsResponse["videoDetails"] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/upload/${videoId}`);
        if (!res.ok) throw new Error("Failed to fetch video details");

        const result: VideoDetailsResponse = await res.json();
        setData(result.videoDetails);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const hasWatched = useRef(false);

  const handleVideoWatch = async (videoId: string) => {
    if (hasWatched.current) return;

    hasWatched.current = true;
    await addView(videoId);
  };

  if (loading)
    return (
      <div className="text-center py-10">
        <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  if (!data)
    return (
      <div className="text-center text-gray-500 py-10">No video found.</div>
    );

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8">
      {/* Video Player */}
      <div className="w-full max-w-2xl aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative">
        <video
          src={data.videoId}
          controls
          className="w-full h-full"
          poster={data.thumbnailUrl}
          onPlay={() => handleVideoWatch(data._id)}
        />
        {!data.thumbnailUrl ? null : (
          <Image
            src={data.thumbnailUrl}
            alt="Video thumbnail"
            fill
            className="object-cover absolute inset-0 pointer-events-none"
            style={{ display: "none" }}
          />
        )}
      </div>

      {/* Video Info */}
      <div className="max-w-2xl w-full p-4">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <p className="text-gray-600">{data.description}</p>
        <p className="text-sm text-gray-400 mt-2">
          {data.views} views • {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* User Info */}
      <div className="w-full max-w-2xl bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
        <Image
          src={data.userId.image}
          alt="User"
          width={60}
          height={60}
          className="rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{data.userId.name}</h2>
          <p className="text-gray-500">{data.userId.email}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
