/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "border-lime-400",
    "bg-lime-500",
    "stroke-lime-500",
    "text-lime-600",
    "border-emerald-400",
    "bg-emerald-500",
    "stroke-emerald-500",
    "text-emerald-600",
    "border-indigo-400",
    "bg-indigo-500",
    "stroke-indigo-500",
    "text-indigo-600",
    "border-amber-400",
    "bg-amber-500",
    "stroke-amber-500",
    "text-amber-600",
    "border-red-400",
    "bg-red-500",
    "stroke-red-500",
    "text-red-600",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
