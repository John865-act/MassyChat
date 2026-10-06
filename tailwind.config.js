/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#5AC8FA',
        background: '#F2F2F7',
        surface: '#FFFFFF',
        text: '#000000',
        'text-secondary': '#999999',
      },
    },
  },
  plugins: [],
}
