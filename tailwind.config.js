/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ph: {
          beige: '#EEEFE9',
          'beige-dark': '#E5E7E0',
          orange: '#F54E00', //   Orange
          'orange-hover': '#D64000',
          black: '#151515', // Primary Text/Border
          gray: '#8D8D8D', // Secondary Text
          'gray-light': '#D0D1C9', // Dividers
          blue: '#1D4AFF', // Links/Accents
        },
        // Keep existing colors for compatibility if needed, but they are deprecated
        warm: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e4df',
          300: '#d4cec6',
          400: '#b8b0a4',
          500: '#9c9285',
          600: '#8b7e74',
          700: '#736960',
          800: '#605850',
          900: '#504a44',
          950: '#2a2723',
        },
        desktop: {
          bg: '#EEEFE9', // Maps to ph-beige
          surface: '#FDFDFD', // White-ish for windows
          elevated: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        // Add a pixel or retro font if available later
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'window-open': 'windowOpen 0.2s cubic-bezier(0.2, 0, 0, 1) forwards',
        'window-close': 'windowClose 0.15s ease-in forwards',
        'dock-bounce': 'dockBounce 0.5s ease-in-out',
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        'icon-jiggle': 'iconJiggle 0.3s ease-in-out',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-down': 'slideDown 0.15s ease-out forwards',
        'confetti': 'confetti 3s ease-out forwards',
      },
      keyframes: {
        windowOpen: {
          '0%': { transform: 'scale(0.95) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        windowClose: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        dockBounce: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '30%': { transform: 'translateY(-20px) scale(1.1)' },
          '50%': { transform: 'translateY(-10px) scale(1.05)' },
          '70%': { transform: 'translateY(-5px) scale(1.02)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        iconJiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
      boxShadow: {
        //   style "retro" shadows (sharp, no blur often)
        'window': '4px 4px 0px 0px rgba(21, 21, 21, 0.2)',
        'window-hover': '6px 6px 0px 0px rgba(21, 21, 21, 0.2)',
        'dock': '0 -2px 0 0 rgba(21, 21, 21, 0.1)',
        'btn': '2px 2px 0px 0px #151515',
        'btn-active': '0px 0px 0px 0px #151515', // Pressed state
        'input': 'inset 2px 2px 0px 0px rgba(21, 21, 21, 0.1)',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
};
