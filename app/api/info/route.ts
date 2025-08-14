import { NextRequest } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const ytDlpPath =
  process.platform === "win32"
    ? "C:\\Users\\tharu\\Downloads\\yt-dlp.exe"
    : "yt-dlp";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "Missing Instagram URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { stdout } = await execAsync(
      `"${ytDlpPath}" -j --no-warnings "${url}"`
    );
    const info = JSON.parse(stdout);

    return new Response(
      JSON.stringify({
        title: info.title || "Instagram Reel",
        thumbnail: info.thumbnail,
        type: info.ext || "mp4",
        downloadUrl: `/api/download?url=${encodeURIComponent(url)}`,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
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
