/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/**/*.njk",
    "src/**/*.js",
    "src/**/*.ts",
    "src/**/*.jsx",
    "src/**/*.tsx",
    "src/**/*.md",
    "src/**/*.mdx",
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx,scss}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        mainColor: 'var(--mainColor)',
        subColor: 'var(--subColor)',
        customBlack: '#333333',
        neutral400: '#7C7C7C', // رمادي متوسط
        neutral300: '#ADADAD', // رمادي فاتح
        neutral200: '#E9E9E9', // رمادي ناعم جداً
        neutral100: '#F4F4F4', // رمادي شبه أبيض
      },
      order: {
        '13': '13',
      },
      borderRadius: {
        mainRadius: 'var(--mainRadius)',
      },
      screens: {
        xs: "410px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1400px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "0.5rem",
          sm: "0.5rem",
          md: "1rem",
          lg: "2rem",
          xl: "3rem",
          "2xl": "4rem",
        },
      },
      animation: {
        slide: 'slide 20s linear infinite', // أنيميشن للـ slider
     'spin-slow': 'spin 5s linear infinite',
    'spin-slow-reverse': 'spin-reverse 5s linear infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }, // نصف المسافة بسبب التكرار
        },
        'spin-reverse': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animated'),
    require('tailwindcss-animate'),
  ],
};