/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript', // 确保用于 TypeScript 的扩展
    'plugin:vue/vue3-recommended',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  plugins: [
    'import' // 确保 import 插件已被包含
  ],
  settings: {
    'import/resolver': {
      typescript: {
        // 这里可以指定你的 tsconfig 文件路径，如果不是根目录下的 tsconfig.json
        project: './tsconfig.json'
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
      }
    }
  },
  rules: {
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off', // 不报告未使用的变量
    'import/no-unresolved': 'warn', // 确保所有的 import 都能正确解析
    '@typescript-eslint/no-explicit-any': 'off'
  }
}
