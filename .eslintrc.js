module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'template-curly-spacing': 'off',
    'indent': 'off',
    'no-labels': 'off'
  }
}
