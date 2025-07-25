import Image from "next/image";
import Link from "next/link";
import LOGO from "@/assets/icons/logo.svg";
import { logout } from "@/lib/Logout";
import { LogOutIcon } from "lucide-react";

interface User {
  image?: string;
}

const Navbar = ({ user }: { user?: User }) => {
  const userImage = user?.image;

  return (
    <header className="w-full bg-white shadow-md px-4 py-4">
      <nav className="flex justify-between items-center max-w-5xl mx-auto">
        <Link className="flex items-center gap-2" href="/">
          <Image
            src={LOGO}
            alt="Logo"
            width={32}
            height={32}
            className="inline-block"
          />
          <h1 className="font-semibold text-lg">Screeny</h1>
        </Link>

        {!user ? (
          <Link
            href="/signin"
            className="text-white bg-[#DE4B88] px-3 py-1 rounded-md"
          >
            Sign In
          </Link>
        ) : (
          <form action={logout}>
            <figure className="flex items-center gap-2">
              <Link href="/profile">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt="User Profile"
                    className="rounded-full aspect-square object-cover"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                )}
              </Link>
              <button type="submit" className="cursor-pointer">
                <LogOutIcon className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
              </button>
            </figure>
          </form>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
