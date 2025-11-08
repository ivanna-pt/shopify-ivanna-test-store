/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./config/**/*.json",
    "./layout/**/*.liquid",
    "./templates/**/*.{json,liquid}",
    "./sections/**/*.liquid",
    "./snippets/**/*.liquid",
    "./locales/**/*.json",
    "./assets/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
