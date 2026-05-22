import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.vite/**']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off'
    }
  }
]
