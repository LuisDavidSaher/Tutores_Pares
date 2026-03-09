/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto de acá a abajo es para incluir los archivos .js, .ts, .jsx y .tsx en el archivo tailwind.config.js
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}