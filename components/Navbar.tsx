"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  return (
    <nav className="w-full px-6 md:px-4 py-3 dark:bg-[rgba(0,0,0,0.1)] backdrop-blur-3xl flex shadow-md    justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="InstaLoad logo"
          width={32}
          height={32}
        />
        <span className="font-bold text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          InstaLoad
        </span>
      </Link>
      <ThemeToggle />
    </nav>
  );
};
