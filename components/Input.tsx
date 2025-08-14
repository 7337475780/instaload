"use client";
import React, { useState } from "react";
import { toast } from "sonner";

interface InputProps {
  onFetched: (data: {
    title: string;
    thumbnail: string;
    downloadUrl: string;
    type: string;
  }) => void;
}

export const Input: React.FC<InputProps> = ({ onFetched }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVideoInfo = async () => {
    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Failed to fetch video info");

      const data = await res.json();
      onFetched(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch video info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-xl gap-2 px-2 sm:px-0">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Instagram URL"
        className="flex-1 p-3 border border-purple-300 rounded-full focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 placeholder:text-gray-400 transition-all w-full sm:w-auto"
      />
      <button
        onClick={fetchVideoInfo}
        disabled={loading}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 cursor-pointer hover:brightness-110 text-white font-semibold rounded-full   shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Fetching..." : "Fetch"}
      </button>
    </div>
  );
};
