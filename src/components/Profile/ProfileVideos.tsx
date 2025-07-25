"use client";
import Image from "next/image";
import { Eye, Loader2 } from "lucide-react";
import useProfileUploadStore from "@/store/useProfileUploadStore";
import { useEffect, useState } from "react";

const ProfileVideos = ({ user }: { user: any }) => {
  const { getMyVideos, videos } = useProfileUploadStore();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoader(true);
      await getMyVideos();
      setLoader(false);
    };
    fetchVideos();
  }, [getMyVideos]);

  return (
    <div className="w-full">
      {loader ? (
        <div className="w-full h-96 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-gray-500 mx-auto mt-20" />
        </div>
      ) : (
        <>
          {videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-5">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="flex flex-col gap-2 bg-white shadow-md rounded-xl p-2 border border-gray-300 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={video.thumbnailUrl}
                    alt="Video Thumbnail"
                    width={400}
                    height={160}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <div className="flex items-center justify-between mt-2 px-2">
                    <div className="flex items-center">
                      <Image
                        src={user.image}
                        alt="User"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="ml-2">{user.name.split(" ")[0]}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="inline-block mr-1 w-4 h-4" />
                      <span>{video.views}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold px-2">
                    {video.title.length > 30
                      ? `${video.title.slice(0, 30)}...`
                      : video.title}
                  </h2>
                </div>
              ))}
            </div>
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No videos found.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileVideos;
