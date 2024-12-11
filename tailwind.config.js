/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,tsx,ts,jsx,js}'],
  theme: {
    // se quisesse sobrescrever todas as cores do tailwind, colocaria as cores nesse nivel de chave aqui
    
    screens: { // definicoes dos tamanhos das telas para aplicar diferentes estilos (aqui estah sobrescrevendo, o tailwind ja possui essas propriedades)
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },

    extend: {
      colors: {
        'neonpurple': '#AA00FF', // estudo de cores personalizadas
        neongreen: {
          100: '#00FF55',
          200: '#00FF99',
          300: '#00FFFF'
        }
      },
      flexBasis: {
        '200px': '200px'
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'sans-serif']
      },
    },
  },
  plugins: [],
}

