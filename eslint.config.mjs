// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-useless-catch': 'off',
    'no-console': 'off',
    'comma-dangle': ['error', 'never'],
    'style/comma-dangle': ['error', 'never'],
    'style/no-tabs': 'off'
  }
})
