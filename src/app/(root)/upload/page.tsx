import UploadForm from "@/components/upload/UploadForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return redirect("/signin");
  }
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <main className="w-full max-w-5xl mx-auto">
        <UploadForm />
      </main>
    </div>
  );
};

export default page;
