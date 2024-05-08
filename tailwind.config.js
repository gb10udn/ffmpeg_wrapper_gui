/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                // -> この箇所を追加。
    "./src/**/*.{js,ts,jsx,tsx}",  // -> この箇所を追加。
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}