import { NextRequest } from "next/server";
import { spawn } from "child_process";
import fsp from "fs/promises";
import fs from "fs";
import os from "os";
import path from "path";

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

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing Instagram URL" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let downloadedFile: string | null = null;

  try {
    const tmpDir = os.tmpdir();
    const tmpFilename = `reel-${Date.now()}.%(ext)s`;
    const tmpFile = path.join(tmpDir, tmpFilename);

    await new Promise<void>((resolve, reject) => {
      // Use spawn to safely execute with separate arguments
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

    const files = await fsp.readdir(tmpDir);
    const fileName = files.find((f) =>
      f.startsWith(path.basename(tmpFile).split(".%(ext)s")[0])
    );
    if (!fileName) throw new Error("Downloaded file not found");

    downloadedFile = path.join(tmpDir, fileName);
    const fileHandle = await fsp.open(downloadedFile, "r");
    const fileStream = fileHandle.createReadStream();

    const headers = new Headers();
    headers.set("Content-Type", "video/mp4");
    headers.set(
      "Content-Disposition",
      `attachment; filename="instagram-reel.mp4"`
    );

    // Stream the file directly to the response
    return new Response(fileStream as any, { headers });
  } catch (err: any) {
    console.error("Download error:", err);
    return new Response(`Failed to download video: ${err.message}`, {
      status: 500,
    });
  } finally {
    if (downloadedFile) {
      await fsp.unlink(downloadedFile).catch((err) => {
        console.error(
          `Failed to delete temporary file: ${downloadedFile}`,
          err
        );
      });
    }
  }
}
