"use client";
import userImage from "@/assets/images/dummy.jpg";
import Image from "next/image";
import { Eye, Loader2 } from "lucide-react";
import useHomeStore from "@/store/useHomeStore";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const HomeVideos = () => {
  const { getMyVideos, videos, loading } = useHomeStore();

  useEffect(() => {
    getMyVideos();
  }, [getMyVideos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div
          onClick={() => redirect(`/watch/${video._id}`)}
          key={video._id}
          className="flex flex-col gap-2 bg-white shadow-md rounded-xl p-2 border border-gray-300 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <Image
            src={video.thumbnailUrl}
            width={400}
            height={160}
            alt="Video Thumbnail"
            className="w-full h-40 object-cover rounded-md"
          />
          <div className="flex items-center justify-between mt-2 px-2">
            <div className="flex items-center">
              <Image
                src={video.user.image || userImage}
                alt="User"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="ml-2">{video.user.name}</span>
            </div>
            <div>
              <Eye className="inline-block mr-1" />
              <span>{video.views}</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold px-2">{video.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default HomeVideos;
