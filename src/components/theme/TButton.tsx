import React from "react";
import { useTheme } from "next-themes";
import { MoonFilledIcon, SunFilledIcon } from "../icons";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center justify-center p-2 rounded-full transition-all duration-300"
    >
      {theme === "light" ? (
        <MoonFilledIcon className="w-6 h-6" />
      ) : (
        <SunFilledIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggle;
