/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        category: {
          alkali: '#f87171',          // red-400
          alkaline: '#fb923c',        // orange-400
          transition: '#fbbf24',      // amber-400
          lanthanide: '#f472b6',      // pink-400
          actinide: '#c084fc',        // purple-400
          postTransition: '#34d399',  // emerald-400
          metalloid: '#22d3ee',      // cyan-400
          nonmetal: '#a3e635',       // lime-400
          halogen: '#60a5fa',        // blue-400
          noble: '#818cf8',          // indigo-400
          unknown: '#94a3b8',        // slate-400
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-alkali': '0 0 10px rgba(248, 113, 113, 0.4)',
        'neon-alkaline': '0 0 10px rgba(251, 146, 60, 0.4)',
        'neon-transition': '0 0 10px rgba(251, 191, 36, 0.4)',
        'neon-lanthanide': '0 0 10px rgba(244, 114, 182, 0.4)',
        'neon-actinide': '0 0 10px rgba(192, 132, 252, 0.4)',
        'neon-postTransition': '0 0 10px rgba(52, 211, 153, 0.4)',
        'neon-metalloid': '0 0 10px rgba(34, 211, 238, 0.4)',
        'neon-nonmetal': '0 0 10px rgba(163, 230, 53, 0.4)',
        'neon-halogen': '0 0 10px rgba(96, 165, 250, 0.4)',
        'neon-noble': '0 0 10px rgba(129, 140, 248, 0.4)',
        'neon-unknown': '0 0 10px rgba(148, 163, 184, 0.4)',
      }
    },
  },
  plugins: [],
}
