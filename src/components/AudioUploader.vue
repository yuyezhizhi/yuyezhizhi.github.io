<template>
  <div class="audio-uploader">
    <!-- 上传区域 -->
    <div
      v-if="!hasAudio"
      class="upload-zone"
      :class="{ 'drag-over': isDragOver }"
      @click="triggerFileInput"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".mp3,.wav,.ogg,.m4a,audio/*"
        @change="handleFileChange"
        style="display: none"
      />
      <div class="upload-icon">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
        </svg>
      </div>
      <p class="upload-text">拖拽音频文件到此处，或点击选择</p>
      <p class="upload-hint">支持 MP3, WAV, OGG, M4A 格式</p>
    </div>

    <!-- 播放控制条 -->
    <div v-else class="player-bar">
      <!-- 播放/暂停按钮 -->
      <button class="play-btn" @click="togglePlay">
        <svg v-if="!isPlaying" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      </button>

      <!-- 进度条 -->
      <div class="progress-section">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <input
          type="range"
          class="progress-bar"
          min="0"
          :max="duration || 100"
          :value="currentTime"
          @input="seek"
          step="0.1"
        />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>

      <!-- 音量控制 -->
      <div class="volume-section">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
        <input
          type="range"
          class="volume-slider"
          min="0"
          max="1"
          step="0.01"
          :value="volume"
          @input="setVolume"
        />
      </div>

      <!-- 更换音频按钮 -->
      <button class="change-btn" @click="resetAudio" title="更换音频">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      </button>
    </div>

    <!-- 隐藏的 audio 元素 -->
    <audio
      ref="audioEl"
      loop
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      @play="onPlay"
      @pause="onPause"
    />
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const emit = defineEmits(['audio-ready', 'audio-play', 'audio-pause'])

// Refs
const fileInput = ref(null)
const audioEl = ref(null)
const audioContext = ref(null)
const analyser = ref(null)
const source = ref(null)
const objectUrl = ref(null)

// State
const hasAudio = ref(false)
const isDragOver = ref(false)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    loadAudio(file)
  }
}

// 处理拖拽
const handleDrop = (e) => {
  isDragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('audio/')) {
    loadAudio(file)
  }
}

// 加载音频文件
const loadAudio = (file) => {
  // 清理之前的资源
  cleanup()

  // 创建对象URL
  objectUrl.value = URL.createObjectURL(file)
  audioEl.value.src = objectUrl.value

  // 初始化 Web Audio API
  initAudioContext()

  hasAudio.value = true
}

// 初始化 AudioContext
const initAudioContext = () => {
  try {
    // 创建 AudioContext
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()

    // 创建 AnalyserNode
    analyser.value = audioContext.value.createAnalyser()
    analyser.value.fftSize = 2048
    analyser.value.smoothingTimeConstant = 0.8

    // 创建 MediaElementSource
    source.value = audioContext.value.createMediaElementSource(audioEl.value)

    // 连接节点: source -> analyser -> destination
    source.value.connect(analyser.value)
    analyser.value.connect(audioContext.value.destination)

    // 通知父组件音频已就绪
    emit('audio-ready', {
      audioContext: audioContext.value,
      analyser: analyser.value,
      source: source.value,
      audioElement: audioEl.value
    })
  } catch (error) {
    console.error('初始化音频上下文失败:', error)
  }
}

// 播放/暂停切换
const togglePlay = () => {
  if (!audioEl.value) return

  // 确保 AudioContext 处于运行状态
  if (audioContext.value && audioContext.value.state === 'suspended') {
    audioContext.value.resume()
  }

  if (isPlaying.value) {
    audioEl.value.pause()
  } else {
    audioEl.value.play()
  }
}

// 跳转
const seek = (e) => {
  if (!audioEl.value) return
  const time = parseFloat(e.target.value)
  audioEl.value.currentTime = time
  currentTime.value = time
}

// 设置音量
const setVolume = (e) => {
  if (!audioEl.value) return
  const vol = parseFloat(e.target.value)
  audioEl.value.volume = vol
  volume.value = vol
}

// 时间更新
const onTimeUpdate = () => {
  if (audioEl.value) {
    currentTime.value = audioEl.value.currentTime
  }
}

// 元数据加载完成
const onLoadedMetadata = () => {
  if (audioEl.value) {
    duration.value = audioEl.value.duration
  }
}

// 播放结束
const onEnded = () => {
  isPlaying.value = false
}

// 播放事件
const onPlay = () => {
  isPlaying.value = true
  emit('audio-play')
}

// 暂停事件
const onPause = () => {
  isPlaying.value = false
  emit('audio-pause')
}

// 重置音频（更换文件）
const resetAudio = () => {
  cleanup()
  hasAudio.value = false
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
}

// 清理资源
const cleanup = () => {
  if (audioEl.value) {
    audioEl.value.pause()
    audioEl.value.src = ''
  }

  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = null
  }

  if (source.value) {
    try {
      source.value.disconnect()
    } catch (e) {}
    source.value = null
  }

  if (analyser.value) {
    try {
      analyser.value.disconnect()
    } catch (e) {}
    analyser.value = null
  }

  if (audioContext.value) {
    try {
      audioContext.value.close()
    } catch (e) {}
    audioContext.value = null
  }
}

// 格式化时间
const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 组件卸载时清理
onUnmounted(() => {
  cleanup()
})
</script>

<style scoped lang="less">
.audio-uploader {
  width: 100%;
  color: #fff;
}

// 上传区域
.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover,
  &.drag-over {
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(0, 0, 0, 0.5);
  }
}

.upload-icon {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
  transition: color 0.3s ease;

  .upload-zone:hover & {
    color: rgba(255, 255, 255, 0.9);
  }
}

.upload-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
}

.upload-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

// 播放控制条
.player-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.progress-bar {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: none;
    transition: transform 0.2s ease;
  }

  &::-moz-range-thumb:hover {
    transform: scale(1.2);
  }
}

.volume-section {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.volume-slider {
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: none;
  }
}

.change-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
}

// 响应式
@media (max-width: 600px) {
  .player-bar {
    flex-wrap: wrap;
    gap: 12px;
  }

  .progress-section {
    order: -1;
    width: 100%;
  }

  .volume-section {
    margin-left: auto;
  }
}
</style>
