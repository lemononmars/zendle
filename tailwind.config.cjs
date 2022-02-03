module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  plugins:[
    require('daisyui'),
  ],
  daisyui: {
    styled: true,
    themes: [
      'dark',
      'emerald'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
}
