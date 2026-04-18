/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Spectral', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          950: '#0b0d10',
          900: '#11141a',
          800: '#181c24',
          700: '#232833',
          500: '#6b7180',
          200: '#d7dbe3',
          100: '#eef0f5',
        },
      },
    },
  },
  plugins: [],
};
