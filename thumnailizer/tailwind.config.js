module.exports = {
  // mode: 'jit',
  purge: [
    './pages/**/*.js',
    './components/**/*.js',
    './pages/**/*.jsx',
    './components/**/*.jsx',
    './**/*.{js,jsx,ts,tsx,vue}'
  ],
  theme: {
    fontFamily: {
      'sans': ['Montserrat', 'sans-serif'],
    },
    extend: {
      letterSpacing: {
        widest: '7px',
      },
      minHeight: {
        '12': '3rem',
      },
      inset: {
        '1/2': '50%',
        '-1/2': '-50%',
        '-1/4': '-25%',
      },
      width: {
        '120': '30rem',
        '144': '36rem',
        '200': '50rem',
      },
      height: {
        'minus-nav': 'calc(100vh - 4rem)',
        '100': '25rem',
        '120': '30rem',
        '128': '32rem',
        '144': '36rem',
        '200': '50rem',
        '400': '100rem',
      },
      fontSize: {
        '7xl': '5rem',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
        '160': '40rem',
        '192': '48rem',
        '256': '64rem',
      },
      margin: {
        '1/3': '33%',
        '1/5': '20%',
        '1/10': '10%',
      },
      flex: {
        '2': '2 2 0%',
      },
      colors: {
        sky: {
          darkest: '#0c203f',
          dark: '#006EBD',
          DEFAULT: '#006ebd',
          light: '#2E81FF'
        },
        sun: '#ffe41a'
      }
    }
  },
  variants: {
    extend: {
      scale: ['group-hover'],
    }
  }
}