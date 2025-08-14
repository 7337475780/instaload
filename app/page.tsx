"use client";
import React, { useState } from "react";
import { Input } from "@/components/Input";
import VideoCard from "@/components/VideoCard";

const Page = () => {
  const [videoData, setVideoData] = useState<null | {
    title: string;
    thumbnail: string;
    downloadUrl: string;
    type: string;
  }>(null);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-20 sm:pt-24">
      <h1 className="mb-10 text-3xl sm:text-4xl lg:text-5xl font-semibold text-center">
        <span className="  bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent break-words">
          Download Instagram Reels & Videos in HD
        </span>
      </h1>

      <Input onFetched={setVideoData} />

      {videoData && (
        <div className="mt-10 w-full max-w-xl animate-fade-in">
          <VideoCard {...videoData} />
        </div>
      )}
    </main>
  );
};

export default Page;
