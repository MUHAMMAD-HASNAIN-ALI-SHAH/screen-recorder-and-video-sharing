import Link from "next/link";
import { Upload, Video } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Header = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.image) {
    return redirect("/login");
  }
  return (
    <header className="w-full py-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
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
              <h1 className="text-sm font-bold md:text-lg md:font-bold">{user.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/upload"
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Upload />
                <span>Upload a Video</span>
              </Link>

              <button className="cursor-pointer flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                <Video />
                <span>Record a Video</span>
              </button>
            </div>
        </div>
        <h1 className="text-2xl font-semibold mt-5">My Videos</h1>
      </div>
    </header>
  );
};

export default Header;
