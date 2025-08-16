"use client";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  title: string;
  thumbnail: string;
  downloadUrl: string;
  type: string;
};

export default function VideoCard({
  title,
  thumbnail,
  downloadUrl,
  type,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const toastId = toast.loading("Starting download...");
    try {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${title || "instagram-video"}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Download started!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Download failed.", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="dark:border border border-gray-100 dark:border-white/10 mb-10 dark:backdrop-blur-3xl dark:bg-[rgba(0,0,0,0.1)] rounded-lg shadow-md p-4 flex flex-col items-center">
      {!imageLoaded && (
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md mb-2" />
      )}
      <Image
        src={thumbnail}
        alt={title}
        width={300}
        height={250}
        className={`w-auto h-auto rounded-md object-cover transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadingComplete={() => setImageLoaded(true)}
      />
      <h2 className="mt-2 font-semibold text-center text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-200">{type}</p>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`mt-4 w-full px-4 cursor-pointer py-2 rounded-full text-white transition ${
          downloading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-violet-600 hover:to-purple-700"
        }`}
      >
        {downloading ? "Downloading..." : "Download"}
      </button>
    </div>
  );
}
