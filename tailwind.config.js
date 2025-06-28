import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideFadeIn: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        maskSlide: {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        },
      },
      animation: {
        'slide-fade-in': 'slideFadeIn 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards',
        'mask-slide': 'maskSlide 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards',
      },
    },
  },
  plugins: [
    typography
  ],
};
