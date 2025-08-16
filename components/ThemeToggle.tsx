// components/ThemeToggle.tsx
"use client";

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage and system preference on initial load
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (!storedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 cursor-pointer rounded-full transition-colors duration-300 dark:border-gray-200/10 border border-gray-200 dark:hover:bg-gray-600"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <FaSun size={20} className="text-yellow-400" />
      ) : (
        <FaMoon size={20} className="text-gray-500" />
      )}
    </button>
  );
};
