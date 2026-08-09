import SignInFormClient from "@/modules/auth/components/sign-in-form-client";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div 
      className="min-h-screen bg-[#0F0E17] flex items-center justify-center px-4 sm:px-6 md:px-8 py-8"
      style={{ fontFamily: "'Rubik', sans-serif" }}
    >
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 bg-[#1A2238]/40 border border-white/10 p-6 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[32px] shadow-2xl backdrop-blur-xl">
        
        {/* Left Side */}
        <div className="flex flex-1 flex-col items-center md:items-start text-center md:text-left justify-center gap-5 w-full">
          <div className="space-y-1 sm:space-y-2">
            <h1 
              className="text-3xl sm:text-4xl font-black tracking-tight text-white"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              Welcome to
            </h1>

            <h2 
              className="text-3xl sm:text-4xl font-black tracking-tight text-[#C6EB8B]"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              ABTalks
            </h2>
          </div>

          <p className="max-w-sm text-gray-300 leading-relaxed text-sm sm:text-base font-medium opacity-90">
            A structured 60-day coding journey designed to build skills, discipline, and recruiter visibility.
          </p>

          <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square mt-2 flex items-center justify-center">
            <Image
              src="/login.svg"
              alt="Login-Image"
              fill
              className="object-contain opacity-95"
              priority
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-1 justify-center w-full md:-translate-y-2">
          <div className="w-full max-w-md bg-[#1A2238] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
            <SignInFormClient />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;