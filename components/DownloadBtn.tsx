"use client";
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { toast } from "sonner";

type Props = {
  reelUrl: string;
};

const DownloadBtn = ({ reelUrl }: Props) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    const toastId = toast.loading("Preparing your reel...");

    try {
      setDownloading(true);

      const response = await fetch(
        `/api/download?url=${encodeURIComponent(reelUrl)}`,
        { method: "GET" }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `instagram-reel-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(blobUrl);
      toast.success("Download complete!", { id: toastId });
    } catch (err) {
      toast.error("Download failed. Please try again.", { id: toastId });
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`flex items-center gap-2 text-white px-4 py-2 rounded-md transition-all ${
        downloading
          ? "bg-purple-400 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700"
      }`}
    >
      <FaDownload size={18} />
      {downloading ? "Downloading..." : "Download"}
    </button>
  );
};

export default DownloadBtn;
