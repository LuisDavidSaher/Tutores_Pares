/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores Institucionales de la Universidad de Cartagena
        'udc-primary': '#1B2631',   // Azul Profundo
        'udc-secondary': '#EBB700', // Dorado
      }
    },
  },
  plugins: [],
}