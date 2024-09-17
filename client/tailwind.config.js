/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 10px rgba(255, 223, 0, 0.8)",
      },
      colors: {
        "yellow-100": "#FFFFE0",
      },
    },
  },
  plugins: [],
};
