import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    // 调整chunk大小警告限制，因为echarts库本身确实很大
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          // 拆分核心依赖
          'vue-vendor': ['vue', 'vue-router'],
          // 拆分各个第三方库
          'highlightjs': ['highlight.js'],
          'marked': ['marked'],
          'dompurify': ['dompurify'],
          // 拆分echarts（只在Animation页面使用）
          'echarts': ['echarts']
        }
      }
    }
  }
})