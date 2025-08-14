"use client";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  title: string;
  thumbnail: string;
  downloadUrl: string; // API endpoint
  type: string;
};

export default function VideoCard({
  title,
  thumbnail,
  downloadUrl,
  type,
}: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const toastId = toast.loading("Starting download...");

    try {
      // Create a hidden link and let the browser handle streaming
      const a = document.createElement("a");
      a.href = downloadUrl; // Direct GET to /api/download?url=...
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
    <div className="border rounded-lg shadow-md p-4 flex flex-col items-center">
      <img src={thumbnail} alt={title} className="w-full rounded-md" />
      <h2 className="mt-2 font-semibold text-center">{title}</h2>
      <p className="text-sm text-gray-500">{type}</p>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`mt-4 px-4 py-2 rounded-md text-white transition ${
          downloading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        {downloading ? "Downloading..." : "Download"}
      </button>
    </div>
  );
}
