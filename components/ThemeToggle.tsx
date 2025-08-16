"use client";

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

/**
 * A client-side component to toggle between light and dark themes.
 * It persists the user's preference using local storage.
 */
export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
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
      title="Toggle Theme"
      onClick={toggleTheme}
      className="p-2 rounded-full cursor-pointer transition-colors duration-300 dark:border-gray-100/10 border border-gray-200 dark:hover:bg-gray-600"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <FaSun size={20} className="text-yellow-400" />
      ) : (
        <FaMoon size={20} className="text-blue-500" />
      )}
    </button>
  );
};
