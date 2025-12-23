/** @type {import('tailwindcss').Config} */
export default {
 content: [
   "./index.html",
   "./src/**/*.{js,ts,jsx,tsx}",
 ],
 theme: {
   extend: {
     colors: {
       primary: {
         DEFAULT: '#3b82f6',
         dark: '#1e40af',
         light: '#60a5fa',
       },
       dark: {
         DEFAULT: '#1a1a1a',
         lighter: '#2d2d2d',
         light: '#404040',
       },
     },
   },
 },
 plugins: [],
}