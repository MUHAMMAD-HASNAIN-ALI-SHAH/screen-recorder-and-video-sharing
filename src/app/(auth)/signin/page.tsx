import SigninComponent from "@/components/auth/SigninComponent";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/");
  }
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <SigninComponent />
    </div>
  );
};

export default SignInPage;
