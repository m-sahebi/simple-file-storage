/* eslint-disable -- config */

/** @type {import('tailwindcss').Config} */
export default {
  important: "#app",
  content: ["./src/**/*.{html,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
