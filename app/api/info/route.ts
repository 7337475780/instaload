import { NextRequest } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import { Writable } from "stream";

// Define the API response and request body types for clarity and safety.
interface VideoInfoResponse {
  title: string;
  thumbnail: string;
  type: string;
  downloadUrl: string;
}

interface VideoInfoRequestBody {
  url: string;
}

// A more robust way to find the yt-dlp executable
const findYtDlpPath = () => {
  if (process.platform === "win32") {
    const windowsPath = "C:\\Users\\tharu\\Downloads\\yt-dlp.exe";
    if (fs.existsSync(windowsPath)) {
      return windowsPath;
    }
  }
  return "yt-dlp"; // Fallback to system PATH
};

const ytDlpPath = findYtDlpPath();

export async function POST(req: NextRequest) {
  try {
    const { url }: VideoInfoRequestBody = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing Instagram URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use a custom stream to capture stdout without buffering the entire output
    let stdoutData = "";
    const stdoutStream = new Writable({
      write(chunk, encoding, callback) {
        stdoutData += chunk.toString();
        callback();
      },
    });

    const ytProcess = spawn(ytDlpPath, ["-j", "--no-warnings", url]);

    ytProcess.stdout.pipe(stdoutStream);

    let stderrData = "";
    ytProcess.stderr.on("data", (chunk) => {
      stderrData += chunk.toString();
    });

    await new Promise<void>((resolve, reject) => {
      ytProcess.on("exit", (code) => {
        if (code === 0) resolve();
        else
          reject(new Error(`yt-dlp exited with code ${code}: ${stderrData}`));
      });
      ytProcess.on("error", (err) => reject(err));
    });

    const info = JSON.parse(stdoutData);
    const thumbnail =
      info.thumbnail ||
      info.thumbnails?.reduce(
        (prev: { width: number }, curr: { width: number }) =>
          curr.width > prev.width ? curr : prev,
        info.thumbnails[0]
      )?.url ||
      null;

    const response: VideoInfoResponse = {
      title: info.title || "Instagram Reel",
      thumbnail: thumbnail,
      type: info.ext || "mp4",
      downloadUrl: `/api/download?url=${encodeURIComponent(url)}`,
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Info API error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch video info" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
