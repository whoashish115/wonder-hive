/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

module.exports = {
  darkMode: "class",
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "0px",
      sm: "576px",
      md: "768px",
      lg: "1024px",
      xl: "1080px",
      '2xl': "1536px",
    },
    extend: {
      colors: {
        primary: {
          light: withOpacity("--primary-light-color"),
          main: withOpacity("--primary-main-color"),
          dark: withOpacity("--primary-dark-color"),
        },
        secondary: {
          light: withOpacity("--secondary-light-color"),
          main: withOpacity("--secondary-main-color"),
          dark: withOpacity("--secondary-dark-color"),
        },
        success: {
          light: withOpacity("--success-light-color"),
          main: withOpacity("--success-main-color"),
          dark: withOpacity("--success-dark-color"),
        },
        info: {
          light: withOpacity("--info-light-color"),
          main: withOpacity("--info-main-color"),
          dark: withOpacity("--info-dark-color"),
        },
        warning: {
          light: withOpacity("--warning-light-color"),
          main: withOpacity("--warning-main-color"),
          dark: withOpacity("--warning-dark-color"),
        },
        error: {
          light: withOpacity("--error-light-color"),
          main: withOpacity("--error-main-color"),
          dark: withOpacity("--error-dark-color"),
        },
        text: {
          light: withOpacity("--text-light-color"),
          main: withOpacity("--text-main-color"),
          dark: withOpacity("--text-dark-color"),
        },
        background: {
          extralight: withOpacity("--background-extralight-color"),
          light: withOpacity("--background-light-color"),
          main: withOpacity("--background-main-color"),
          dark: withOpacity("--background-dark-color"),
        },
        border: {
          outline: withOpacity("--border-outline"),
        },
      },
        borderRadius: {
          custom: "var(--border-radius)",
        }
    },
  },
  plugins: [require("@tailwindcss/forms"), require('tailwind-scrollbar')({ nocompatible: true }),],
};
