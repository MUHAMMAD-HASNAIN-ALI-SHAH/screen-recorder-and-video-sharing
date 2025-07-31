"use client";

import Link from "next/link";
import { Upload, Video } from "lucide-react";
import Image from "next/image";
import useCreateVideoStore from "@/store/useCreateVideoStore";

const Header = ({ user }: { user?: any }) => {
  const { startRecording, isRecording, stopRecording, videoUrl } = useCreateVideoStore();

  const handleRecordClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <header className="w-full py-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-20 md:h-20 relative">
                <Image
                  src={user.image}
                  alt="User"
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-md md:text-lg">{user.email}</h1>
                <h1 className="text-sm font-bold md:text-lg md:font-bold">
                  {user.name}
                </h1>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
              <h1 className="text-lg">Public Library</h1>
            </div>
          )}
          {user && (
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/upload"
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Upload />
                <span>Upload a Video</span>
              </Link>

              <button
                onClick={handleRecordClick}
                className="cursor-pointer flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Video />
                <span>{isRecording ? "Stop Recording" : "Record a Video"}</span>
              </button>
            </div>
          )}
        </div>

        {user ? (
          <section className="flex items-center justify-between mt-6">
            <h1 className="text-2xl font-semibold">My Videos</h1>
            <select className="px-1 py-2 rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition duration-200">
              <option value="">Most Viewed</option>
              <option value="date">Latest Viewed</option>
              <option value="views">Least Viewed</option>
            </select>
          </section>
        ) : (
          <section className="flex items-center justify-between mt-6">
            <h1 className="text-2xl font-semibold">All Videos</h1>
            <select className="px-1 py-2 rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition duration-200">
              <option value="">Most Viewed</option>
              <option value="date">Latest Viewed</option>
              <option value="views">Least Viewed</option>
            </select>
          </section>
        )}
      </div>
    </header>
  );
};

export default Header;
