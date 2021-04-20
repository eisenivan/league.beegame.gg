module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'head': '"Open Sans Condensed"',
      'subhead': '"Open Sans"',
      'body': '"Montserrat"'
    },
    boxShadow: {
      match: 'inset 0 0 40px 0 rgba(0, 0, 0, 0.7)'
    },
    extend: {
      backgroundImage: theme => ({
        'triangle_bg_dark': "url('/src/img/triangle_bg_dark.png')",
        'triangle_bg_light': "url('/src/img/triangle_bg_light.png')"
      }),
      gridTemplateColumns: {
        'content': '2fr 1fr'
      },

      colors: {
        blue: {
          1: '#3399ff',
          2: '#0047ff',
          3: '#2d3cb3',
          4: '#7589d5'
        },

        yellow: {
          1: '#ffcc66',
          2: '#fdb833',
          3: '#b37b2d'
        },

        gray: {
          1: '#f0f0f0',
          2: '#252827',
          3: '#080808'
        }
      },
      fontSize: {
        '2xs': '.65rem'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
