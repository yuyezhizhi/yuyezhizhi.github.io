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
  // 优化缓存配置
  cacheDir: '.vite/cache',
  build: {
    outDir: 'dist',
    // 调整chunk大小警告限制，因为echarts库本身确实很大
    chunkSizeWarningLimit: 1200,
    // 启用更高级的压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 启用构建报告
    reportCompressedSize: true,
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
          'echarts': ['echarts'],
          // 拆分p5.js（用于Canvas动画）
          'p5': ['p5'],
          // 拆分three.js（用于3D效果）
          'three': ['three']
        },
        // 优化代码分割策略
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})