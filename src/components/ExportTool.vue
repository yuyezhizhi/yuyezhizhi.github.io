<template>
  <div class="export-tool">
    <!-- 导出按钮 -->
    <button 
      class="export-trigger"
      @click="togglePanel"
      title="导出作品"
    >
      <span class="export-icon">📤</span>
    </button>

    <!-- 导出面板 -->
    <Transition name="panel">
      <div v-if="showPanel" class="export-panel" @click.stop>
        <div class="panel-header">
          <h3>📤 导出作品</h3>
          <button class="close-btn" @click="showPanel = false">✕</button>
        </div>

        <div class="export-options">
          <!-- 截图选项 -->
          <div class="option-group">
            <h4>🖼️ 截图</h4>
            <div class="option-buttons">
              <button 
                class="option-btn"
                @click="captureScreenshot('png')"
                :disabled="isCapturing"
              >
                <span class="btn-icon">🖼️</span>
                <span class="btn-text">PNG 高清</span>
              </button>
              <button 
                class="option-btn"
                @click="captureScreenshot('jpg')"
                :disabled="isCapturing"
              >
                <span class="btn-icon">📷</span>
                <span class="btn-text">JPG 压缩</span>
              </button>
            </div>
          </div>

          <!-- GIF 选项 -->
          <div class="option-group">
            <h4>🎬 动画 GIF</h4>
            <div class="gif-settings">
              <div class="setting-row">
                <label>时长 (秒)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  v-model="gifDuration"
                  class="setting-slider"
                />
                <span class="setting-value">{{ gifDuration }}s</span>
              </div>
              <div class="setting-row">
                <label>帧率 (fps)</label>
                <input 
                  type="range" 
                  min="10" 
                  max="30" 
                  v-model="gifFps"
                  class="setting-slider"
                />
                <span class="setting-value">{{ gifFps }}fps</span>
              </div>
              <div class="setting-row">
                <label>尺寸</label>
                <select v-model="gifSize" class="setting-select">
                  <option value="1">原始尺寸</option>
                  <option value="0.75">75%</option>
                  <option value="0.5">50%</option>
                  <option value="0.25">25%</option>
                </select>
              </div>
            </div>
            <button 
              class="export-action-btn"
              @click="captureGif"
              :disabled="isCapturing"
            >
              <span v-if="isCapturing" class="loading-spinner"></span>
              <span v-else>🎬 生成 GIF</span>
            </button>
          </div>

          <!-- 壁纸选项 -->
          <div class="option-group">
            <h4>🖥️ 壁纸</h4>
            <div class="wallpaper-presets">
              <button 
                v-for="preset in wallpaperPresets" 
                :key="preset.name"
                class="preset-btn"
                @click="captureWallpaper(preset)"
                :disabled="isCapturing"
              >
                <span class="preset-icon">{{ preset.icon }}</span>
                <span class="preset-name">{{ preset.name }}</span>
                <span class="preset-res">{{ preset.width }}×{{ preset.height }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 进度条 -->
        <div v-if="isCapturing" class="capture-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${captureProgress}%` }" />
          </div>
          <span class="progress-text">{{ progressText }}</span>
        </div>
      </div>
    </Transition>

    <!-- 遮罩层 -->
    <div 
      v-if="showPanel" 
      class="overlay" 
      @click="showPanel = false"
    />

    <!-- 隐藏的 canvas 用于处理图像 -->
    <canvas ref="processCanvas" style="display: none" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GIF from 'gif.js.optimized'

const props = defineProps({
  canvasSelector: {
    type: String,
    default: 'canvas'
  },
  filename: {
    type: String,
    default: 'artwork'
  }
})

const showPanel = ref(false)
const isCapturing = ref(false)
const captureProgress = ref(0)
const processCanvas = ref(null)

// GIF 设置
const gifDuration = ref(3)
const gifFps = ref(15)
const gifSize = ref('0.5')

// 壁纸预设
const wallpaperPresets = [
  { name: '桌面壁纸', icon: '🖥️', width: 1920, height: 1080 },
  { name: '手机壁纸', icon: '📱', width: 1080, height: 1920 },
  { name: '平板壁纸', icon: '💻', width: 2048, height: 1536 },
  { name: '4K 超清', icon: '📺', width: 3840, height: 2160 }
]

const progressText = computed(() => {
  if (captureProgress.value < 30) return '正在捕获帧...'
  if (captureProgress.value < 60) return '正在处理图像...'
  if (captureProgress.value < 90) return '正在生成文件...'
  return '即将完成...'
})

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

// 获取目标 canvas
const getTargetCanvas = () => {
  const canvas = document.querySelector(props.canvasSelector)
  if (!canvas) {
    alert('未找到画布元素')
    return null
  }
  return canvas
}

// 截图功能
const captureScreenshot = (format = 'png') => {
  const canvas = getTargetCanvas()
  if (!canvas) return

  try {
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png'
    const quality = format === 'jpg' ? 0.9 : undefined
    const dataUrl = canvas.toDataURL(mimeType, quality)
    
    downloadFile(dataUrl, `${props.filename}_${getTimestamp()}.${format}`)
    showPanel.value = false
  } catch (e) {
    console.error('Screenshot failed:', e)
    alert('截图失败，请重试')
  }
}

// GIF 录制功能
const captureGif = async () => {
  const canvas = getTargetCanvas()
  if (!canvas) return

  isCapturing.value = true
  captureProgress.value = 0

  try {
    const totalFrames = gifDuration.value * gifFps.value
    const frameDelay = 1000 / gifFps.value
    const scale = parseFloat(gifSize.value)

    // 创建 GIF
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvas.width * scale,
      height: canvas.height * scale,
      workerScript: '/gif.worker.js'
    })

    // 捕获帧
    for (let i = 0; i < totalFrames; i++) {
      await new Promise(resolve => setTimeout(resolve, frameDelay))
      
      // 创建缩略图
      const thumbCanvas = document.createElement('canvas')
      thumbCanvas.width = canvas.width * scale
      thumbCanvas.height = canvas.height * scale
      const ctx = thumbCanvas.getContext('2d')
      ctx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height)
      
      gif.addFrame(thumbCanvas, { delay: frameDelay })
      captureProgress.value = (i / totalFrames) * 80
    }

    // 渲染 GIF
    gif.on('progress', (p) => {
      captureProgress.value = 80 + p * 20
    })

    gif.on('finished', (blob) => {
      const url = URL.createObjectURL(blob)
      downloadFile(url, `${props.filename}_${getTimestamp()}.gif`)
      isCapturing.value = false
      captureProgress.value = 0
      showPanel.value = false
    })

    gif.render()
  } catch (e) {
    console.error('GIF capture failed:', e)
    alert('GIF 生成失败，请重试')
    isCapturing.value = false
  }
}

// 壁纸截图功能
const captureWallpaper = async (preset) => {
  const canvas = getTargetCanvas()
  if (!canvas) return

  isCapturing.value = true
  captureProgress.value = 10

  try {
    // 创建壁纸 canvas
    const wallpaperCanvas = document.createElement('canvas')
    wallpaperCanvas.width = preset.width
    wallpaperCanvas.height = preset.height
    const ctx = wallpaperCanvas.getContext('2d')

    captureProgress.value = 30

    // 计算缩放和居中
    const scale = Math.max(
      preset.width / canvas.width,
      preset.height / canvas.height
    )
    const scaledWidth = canvas.width * scale
    const scaledHeight = canvas.height * scale
    const offsetX = (preset.width - scaledWidth) / 2
    const offsetY = (preset.height - scaledHeight) / 2

    captureProgress.value = 50

    // 填充背景色
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, preset.width, preset.height)

    // 绘制原图
    ctx.drawImage(canvas, offsetX, offsetY, scaledWidth, scaledHeight)

    captureProgress.value = 80

    // 添加水印
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '14px sans-serif'
    ctx.fillText('好玩的动画', 20, preset.height - 20)

    captureProgress.value = 90

    // 导出
    const dataUrl = wallpaperCanvas.toDataURL('image/jpeg', 0.95)
    downloadFile(dataUrl, `${props.filename}_wallpaper_${preset.width}x${preset.height}_${getTimestamp()}.jpg`)

    captureProgress.value = 100
    isCapturing.value = false
    showPanel.value = false
  } catch (e) {
    console.error('Wallpaper capture failed:', e)
    alert('壁纸生成失败，请重试')
    isCapturing.value = false
  }
}

// 下载文件
const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 获取时间戳
const getTimestamp = () => {
  const now = new Date()
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped lang="less">
.export-tool {
  position: relative;
}

// 导出触发按钮
.export-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  .export-icon {
    font-size: 1.2rem;
  }
}

// 导出面板
.export-panel {
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  width: 360px;
  max-height: 80vh;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 1002;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    flex-shrink: 0;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .export-options {
    overflow-y: auto;
    padding: 1rem;
    flex-grow: 1;

    .option-group {
      margin-bottom: 1.5rem;

      &:last-child {
        margin-bottom: 0;
      }

      h4 {
        margin: 0 0 0.75rem 0;
        font-size: 0.95rem;
        color: #333;
        font-weight: 600;
      }

      .option-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;

        .option-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px solid #eee;
          border-radius: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover:not(:disabled) {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.05);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .btn-icon {
            font-size: 1.5rem;
          }

          .btn-text {
            font-size: 0.85rem;
            color: #666;
          }
        }
      }

      .gif-settings {
        background: #f8f8f8;
        border-radius: 1rem;
        padding: 1rem;
        margin-bottom: 0.75rem;

        .setting-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;

          &:last-child {
            margin-bottom: 0;
          }

          label {
            font-size: 0.85rem;
            color: #666;
            min-width: 60px;
          }

          .setting-slider {
            flex-grow: 1;
            height: 6px;
            -webkit-appearance: none;
            background: #ddd;
            border-radius: 3px;
            outline: none;

            &::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 16px;
              height: 16px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              cursor: pointer;
            }
          }

          .setting-select {
            flex-grow: 1;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 0.5rem;
            font-size: 0.85rem;
            background: white;
          }

          .setting-value {
            font-size: 0.85rem;
            color: #333;
            min-width: 50px;
            text-align: right;
          }
        }
      }

      .export-action-btn {
        width: 100%;
        padding: 0.875rem;
        border: none;
        border-radius: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      }

      .wallpaper-presets {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;

        .preset-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.875rem;
          border: 2px solid #eee;
          border-radius: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover:not(:disabled) {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.05);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .preset-icon {
            font-size: 1.5rem;
          }

          .preset-name {
            font-size: 0.85rem;
            font-weight: 500;
            color: #333;
          }

          .preset-res {
            font-size: 0.75rem;
            color: #999;
          }
        }
      }
    }
  }

  .capture-progress {
    padding: 1rem 1.5rem;
    background: #f8f8f8;
    border-top: 1px solid #eee;
    flex-shrink: 0;

    .progress-bar {
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 3px;
        transition: width 0.3s ease;
      }
    }

    .progress-text {
      font-size: 0.85rem;
      color: #666;
    }
  }
}

// 遮罩层
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
}

// 动画
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// 过渡动画
.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

// 响应式
@media (max-width: 768px) {
  .export-panel {
    right: 1rem;
    left: 1rem;
    width: auto;
    bottom: 4rem;
  }
}
</style>
