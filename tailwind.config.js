/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: '#53d2f4',
        orange: '#eb925d',
        pink: '#d80170',
        blue: '#072468'
      },
      fontFamily: {
        cera: ["var(--font-cera)"],
        brother: ["var(--font-brother)"]
      }
    },
  },
  plugins: [],
};
