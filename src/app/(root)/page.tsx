import Header from "@/components/Home/Header";
import HomeVideos from "@/components/Home/HomeVideos";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <main className="w-full max-w-5xl mx-auto px-5 lg:px-0">
          <Header user={user} />
          <HomeVideos />
        </main>
      </div>
    </>
  );
}
