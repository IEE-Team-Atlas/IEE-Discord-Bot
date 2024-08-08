/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundColor:{
        skin: {
          base: 'var(--color-background-base)',
          accent: 'var(--color-background-accent)'
        }
      },
      textColor: {
        skin: {
          base: 'var(--color-text-base)',
          hover: 'var(--color-text-hover)'
        }
      },
    },
  },
  plugins: [],
}

