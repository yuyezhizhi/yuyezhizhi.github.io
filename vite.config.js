import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/yuyezhizhi.github.io/',
  build: {
    outDir: 'dist'
  }
})