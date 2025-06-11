/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'], 
        heading: ['Righteous', 'ui-sans-serif', 'system-ui'] 
      },
      colors: {
        primary: '#FF006E',
        secondary: '#8338EC',
        accent: '#FB5607',
        surface: '#3A0CA3',
        background: '#0A0A0A',
        success: '#06FFA5',
        warning: '#FFBE0B',
        error: '#FF4365',
        info: '#3A86FF',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 4s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'confetti': 'confetti 0.6s ease-out'
      },
      keyframes: {
        glow: {
          '0%': { 
            'box-shadow': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' 
          },
          '100%': { 
            'box-shadow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' 
          }
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' }
        },
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(180deg)', opacity: '0' }
        }
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      }
    },
  },
  plugins: [],
}