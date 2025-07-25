"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import LogoImage from "@/assets/icons/logo.svg";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

const SigninComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google");
      redirect("/");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setIsLoading(false);
    }
  };

  return (
      <div className="w-full h-full mx-auto grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl overflow-hidden">
        {/* Left Side */}
        <div className="bg-[#DE4B88] text-white flex flex-col justify-center items-start p-10 space-y-6 h-full">
          <Image
            src={LogoImage}
            alt="Screeny Logo"
            width={60}
            height={60}
            className="rounded-md"
          />
          <h2 className="text-3xl font-bold">Welcome to Screeny</h2>
          <p className="text-sm leading-relaxed text-white/90">
            Screeny is your all-in-one solution to <strong>record your screen</strong>,{" "}
            <strong>upload videos</strong>, and <strong>share effortlessly</strong> with your team or audience.
          </p>
          <p className="text-xs text-white/60">Fast. Secure. Simple.</p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center items-center p-10 space-y-6 h-full">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to continue</p>

          <button
            className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-60"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FcGoogle className="text-xl" />
            {isLoading ? (
              <span className="text-sm font-medium text-gray-700 animate-pulse">Signing in...</span>
            ) : (
              <span className="text-sm font-medium text-gray-700 cursor-pointer">
                Sign in with Google
              </span>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By signing in, you agree to our{" "}
            <a href="#" className="underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
  );
}

export default SigninComponent
