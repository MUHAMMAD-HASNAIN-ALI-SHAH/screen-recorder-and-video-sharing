import Header from "@/components/Header";
import ProfileVideos from "@/components/Profile/ProfileVideos";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  const user = session?.user;
  if (!session) {
    return redirect("/signin");
  }
  return (
    <div className="w-full flex flex-col items-center justify-center mt-15">
      <main className="w-full max-w-5xl mx-auto px-5 lg:px-0">
        <Header user={user} />
        <ProfileVideos user={user} />
      </main>
    </div>
  );
};

export default page;
