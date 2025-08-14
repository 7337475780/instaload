import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "InstaLoad",
  description:
    "Download Instagram Reels & Videos in HD — fast, free, and secure.",
  keywords: [
    "instagram downloader",
    "reels download",
    "instaload",
    "video downloader",
    "download instagram videos",
  ],
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} transition-colors duration-300 antialiased bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen`}
      >
        <Toaster position="top-center" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
