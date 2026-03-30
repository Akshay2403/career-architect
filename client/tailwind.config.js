/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,jsx}"],
  theme: {
    extend: {
      colors: {
        // Professional Slate & Blue Palette
        primary: "#0F172A",   // Deep Navy for text/bg
        accent: "#2563EB",    // Electric Blue for buttons
        surface: "#F8FAFC",  // Light Grey for cards
        glass: "rgba(255, 255, 255, 0.7)",
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};