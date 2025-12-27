import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette Luxe & Or pour mariage
        gold: {
          50: '#FDF9ED',
          100: '#FAF0D1',
          200: '#F5E0A3',
          300: '#EFCF6B',
          400: '#E9BD3E',
          500: '#D4A420',
          600: '#B8891A',
          700: '#8C6615',
          800: '#614711',
          900: '#3A2A0B',
        },
        champagne: {
          50: '#FDFBF7',
          100: '#FAF5EB',
          200: '#F5EBD7',
          300: '#EFE0C3',
          400: '#E5D1A8',
          500: '#D4BC8A',
          600: '#C4A76C',
          700: '#A68B4E',
          800: '#7A6639',
          900: '#4D4024',
        },
        ivory: {
          50: '#FFFFFE',
          100: '#FFFFF0',
          200: '#FEFCE8',
          300: '#FEF9C3',
          400: '#FEF08A',
          500: '#FEFCE8',
        },
        rose: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
        },
        burgundy: {
          50: '#FDF2F4',
          100: '#FCE4E8',
          200: '#F9CCD5',
          300: '#F4A5B5',
          400: '#EC7089',
          500: '#722F37',
          600: '#5C252C',
          700: '#4A1E23',
          800: '#3A181C',
          900: '#2A1215',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4A420 0%, #F5E0A3 50%, #D4A420 100%)',
        'gradient-luxury': 'linear-gradient(180deg, #FFFFF0 0%, #FAF5EB 100%)',
        'pattern-damask': "url('/images/damask-pattern.svg')",
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(212, 164, 32, 0.39)',
        'luxury': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
