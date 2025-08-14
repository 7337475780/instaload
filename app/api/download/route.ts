import { NextRequest } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const ytDlpPath =
  process.platform === "win32"
    ? "C:\\Users\\tharu\\Downloads\\yt-dlp.exe"
    : "yt-dlp";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing Instagram URL" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const tmpDir = os.tmpdir();
    // Allow yt-dlp to handle extensions for merging
    const tmpFile = path.join(tmpDir, `reel-${Date.now()}.%(ext)s`);

    // Download video to temp file
    await new Promise<void>((resolve, reject) => {
      const ytProcess = spawn(ytDlpPath, [
        "-f",
        "bestvideo+bestaudio",
        "--merge-output-format",
        "mp4",
        "-o",
        tmpFile,
        url,
      ]);

      let stderr = "";
      ytProcess.stderr.on("data", (chunk) => (stderr += chunk.toString()));
      ytProcess.on("error", reject);
      ytProcess.on("exit", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`yt-dlp exited with code ${code}: ${stderr}`));
      });
    });

    // Find the actual downloaded file (yt-dlp replaces %(ext)s)
    const files = fs
      .readdirSync(tmpDir)
      .filter((f) => f.startsWith(path.basename(tmpFile).split(".%(ext)s")[0]));
    if (files.length === 0) throw new Error("Downloaded file not found");

    const downloadedFile = path.join(tmpDir, files[0]);
    const fileStream = fs.createReadStream(downloadedFile);

    // Convert Node ReadStream to Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => {
          controller.close();
          fs.unlink(downloadedFile, () => {}); // cleanup
        });
        fileStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
        fs.unlink(downloadedFile, () => {});
      },
    });

    const headers = new Headers();
    headers.set("Content-Type", "video/mp4");
    headers.set(
      "Content-Disposition",
      `attachment; filename="instagram-reel.mp4"`
    );

    return new Response(readableStream, { headers });
  } catch (err: any) {
    console.error("Download error:", err);
    return new Response(`Failed to download video: ${err.message}`, {
      status: 500,
    });
  }
}
