import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className={`
        fixed
        top-4
        left-56
        lg:right-5
        md:top-5
        md:right-5
        z-[9999]
        w-11
        h-11
        rounded-xl
        flex
        items-center
        justify-center
        border
        transition-all
        duration-200

        ${
          theme === "dark"
            ? "bg-[#11161f] border-white/[0.08] text-gray-300 hover:bg-[#181e28] hover:text-white"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
