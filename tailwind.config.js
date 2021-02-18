module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: {
          1: '#3399ff',
          2: '#0047ff',
          3: '#2d3cb3'
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
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
