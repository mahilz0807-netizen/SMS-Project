import { useTheme } from "../../context/ThemeContext";

export default function ThemeButton() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={
        dark
          ? "bg-white text-black px-4 py-2 rounded-xl"
          : "bg-slate-900 text-white px-4 py-2 rounded-xl"
      }
    >
      {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}