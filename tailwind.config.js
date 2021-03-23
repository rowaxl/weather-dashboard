module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  important: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  darkMode: 'media',
  plugins: [
    require('tailwindcss-filters'),
    require('@tailwindcss/forms'),
  ],
}
