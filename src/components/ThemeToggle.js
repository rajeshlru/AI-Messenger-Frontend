import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ inline = false, centerMobile = false }) => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`
        ${inline ? "relative" : "fixed"}
        ${inline ? "" : "top-[10px] right-5"}
        ${centerMobile && !inline ? "max-[767px]:top-[62px] max-[767px]:right-5" : ""}
        z-[9999]
        w-[92px]
        h-11
        flex-shrink-0
        rounded-full
        flex
        items-center
        border
        overflow-hidden
        p-1
        mx-3.5
        transition-all
        duration-500
        ease-out
        hover:scale-105
        active:scale-95
        ${
          isDark
            ? `
              bg-[#151a24]
              border-white/[0.08]
              shadow-inner
              hover:shadow-lg
              hover:shadow-cyan-500/10
            `
            : `
              bg-slate-100
              border-slate-200
              shadow-inner
              hover:shadow-md
              hover:shadow-slate-300/30
            `
        }
      `}
    >
      <span
        className={`
          absolute
          top-1
          w-9
          h-9
          rounded-full
          flex
          items-center
          justify-center
          text-base
          shadow-md
          transition-all
          duration-500
          ease-out
          ${
            isDark
              ? `
                left-[49px]
                bg-[#252c38]
                text-cyan-300
                rotate-[360deg]
              `
              : `
                left-1
                bg-white
                text-amber-500
                rotate-0
              `
          }
        `}
      >
        {isDark ? "🌙" : "☀️"}
      </span>

      <span
        className={`
          absolute
          inset-y-0
          flex
          items-center
          text-[9px]
          font-semibold
          uppercase
          tracking-wide
          transition-all
          duration-300
          ${isDark ? "left-2 text-gray-500" : "right-2 text-slate-400"}
        `}
      >
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
};

export default ThemeToggle;
