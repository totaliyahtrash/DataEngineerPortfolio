/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hotpink: '#FF73B5',
      },
      fontFamily: {
        mono: ['"Space Mono"', '"Fira Code"', 'monospace'],
        bubble: ['Modak', 'Oi', 'cursive'],
      },
      letterSpacing: {
        'super-tight': '-0.08em',
        'mega-tight': '-0.12em',
      }
    },
  },
  plugins: [],
}
