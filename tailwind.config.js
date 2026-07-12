/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Hijau alam terinspirasi langsung dari poster Greenetix Indonesia
        forest: {
          deep: '#052e16',   // Hijau tua pekat (primary teks & tombol utama)
          leaf: '#16a34a',   // Hijau daun (hover & aksen interaktif light mode)
          accent: '#22c55e', // Hijau terang menyala (aksen dark mode)
          light: '#dcfce7',  // Hijau muda transparan (subtle bg contrasts)
          dark: '#022c11'    // Hijau super gelap (untuk dark mode panel)
        },
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
