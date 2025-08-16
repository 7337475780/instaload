"use client";
import React, { useState } from "react";
import { toast } from "sonner";

// Define the shape of the data returned from the API for better type safety
interface FetchedData {
  title: string;
  thumbnail: string;
  downloadUrl: string;
  type: string;
}

interface InputProps {
  onFetched: (data: FetchedData) => void;
}

/**
 * A component for a user to enter an Instagram URL and fetch video info.
 * It handles input state, API communication, and user feedback.
 */
export const Input: React.FC<InputProps> = ({ onFetched }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVideoInfo = async () => {
    if (!url || !url.startsWith("https://www.instagram.com/")) {
      toast.error("Please enter a valid Instagram URL");
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

      const data: FetchedData = await res.json();
      onFetched(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch video info");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") fetchVideoInfo();
  };

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-xl gap-3 px-2 sm:px-0">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Paste Instagram URL"
        className="flex-1 p-3 border border-purple-300 dark:border-purple-700 dark:bg-gray-800 dark:text-white rounded-full focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 placeholder:text-gray-400 shadow-sm transition-all duration-300 w-full sm:w-auto"
      />
      <button
        onClick={fetchVideoInfo}
        disabled={loading}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 cursor-pointer hover:brightness-110 text-white font-semibold rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {loading ? "Fetching..." : "Fetch"}
      </button>
    </div>
  );
};
