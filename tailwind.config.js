/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ns-muted": "var(--ns-muted)",
        "ns-accent": "var(--ns-accent)",
      },
    },
  },
  plugins: [],
};
