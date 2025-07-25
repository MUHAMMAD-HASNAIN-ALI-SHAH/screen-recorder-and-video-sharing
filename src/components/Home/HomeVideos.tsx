import userImage from "@/assets/images/dummy.jpg";
import Image from "next/image";
import { Eye } from "lucide-react";

const HomeVideos = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex flex-col gap-2 bg-white shadow-md rounded-xl p-2 border border-gray-300 cursor-pointer hover:shadow-lg transition-shadow">
        <Image
          src={""}
          alt="Video Thumbnail"
          className="w-full h-40 object-cover rounded-md"
        />
        <div className="flex items-center justify-between mt-2 px-2">
          <div className="flex items-center">
            <Image src={userImage} alt="User" className="w-8 h-8 rounded-full" />
            <span className="ml-2">Emily</span>
          </div>
          <div>
            <Eye className="inline-block mr-1" />
            <span>75</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold px-2">SnapChat Message</h2>
      </div>
      
    </div>
  );
};

export default HomeVideos;
