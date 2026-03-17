/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        fondo: '#FAFAF8',
        texto: '#1A1A1A',
        verde: '#1B6B3A',
        dorado: '#C9963E',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Source Sans 3"', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'slide-in-right': 'slide-in-right 0.5s ease-out both',
        'scale-in': 'scale-in 0.4s ease-out both',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.texto / 85%'),
            '--tw-prose-headings': theme('colors.texto'),
            '--tw-prose-links': theme('colors.verde'),
            '--tw-prose-bold': theme('colors.texto'),
            '--tw-prose-quotes': theme('colors.texto / 70%'),
            '--tw-prose-quote-borders': theme('colors.verde'),
            '--tw-prose-counters': theme('colors.verde'),
            '--tw-prose-bullets': theme('colors.verde / 60%'),
            '--tw-prose-th-borders': theme('colors.texto / 15%'),
            '--tw-prose-td-borders': theme('colors.texto / 10%'),
            maxWidth: 'none',
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
