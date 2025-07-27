import { Upload, Video } from "lucide-react";
import Link from "next/link";

const Header = ({ user }: { user: any }) => {
  return (
    <header className="w-full py-6">
      <div className="flex flex-col gap-4">
        {/* Title and Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
          <h1 className="text-lg">Public Library</h1>
          {user && (
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
          )}
        </div>

        <section className="flex items-center justify-between mt-6">
          <h1 className="text-2xl font-semibold">All Videos</h1>
          <select
            name=""
            id=""
            className="px-1 py-2 rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition duration-200"
          >
            <option value="">Most Viewed</option>
            <option value="date">Latest Viewed</option>
            <option value="views">Least Viewed</option>
          </select>
        </section>
      </div>
    </header>
  );
};

export default Header;
