import Header from "@/components/Header";
import HomeVideos from "@/components/Home/HomeVideos";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

export default async function Home() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center mt-15">
        <main className="w-full max-w-5xl mx-auto px-5 lg:px-0">
          <Header />
          <HomeVideos />
        </main>
      </div>
    </>
  );
}
