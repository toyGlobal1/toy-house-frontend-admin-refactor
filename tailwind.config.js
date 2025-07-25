import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};
