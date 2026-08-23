import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        w-full
        flex
        items-center
        gap-3
        px-3
        py-3
        rounded-xl
        text-left
        transition-all
        duration-300
        ease-out
        hover:-translate-y-0.5
        hover:scale-[1.01]
        ${
          isDark
            ? "text-gray-300 hover:text-white hover:bg-white/[0.05]"
            : "text-slate-700 bg-slate-200/70 hover:bg-slate-300/70 hover:text-slate-900"
        }
      `}
    >
      <span
        className={`
          w-11
          h-11
          flex
          items-center
          justify-center
          rounded-xl
          text-lg
          flex-shrink-0
          ${isDark ? "bg-[#20283a]" : "bg-purple-100"}
        `}
      >
        {isDark ? "☀️" : "🌙"}
      </span>

      <span className="flex flex-col min-w-0">
        <span className="text-sm font-semibold">
          {isDark ? "Light theme" : "Dark theme"}
        </span>

        <span
          className={`
            text-xs
            mt-0.5
            ${isDark ? "text-gray-500" : "text-slate-500"}
          `}
        >
          Switch your appearance
        </span>
      </span>
    </button>
  );
};

export default ThemeToggleButton;
