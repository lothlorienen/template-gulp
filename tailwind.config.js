export default {
  mode: 'jit', // Just-In-Time Compiler
  purge: [
    './src/app/hbs/**/*.hbs',
    './src/app/scss/**/*.scss',
    './src/app/scripts/**/*.{ts,js}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}