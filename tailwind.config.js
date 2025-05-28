/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFBEB',
        green: '#0B680D',
        olive: '#5C9559',
        red: '#D41357',
        pink: '#FFA6C4',
        orange: '#F2501F',
        purple: '#5A31F4',
        black: '#000000'
      },
      fontFamily: {
        sora: ["var(--font-sora)"],
        sentient: ["var(--font-sentient)"]
      }
    },
  },
  plugins: [],
};
