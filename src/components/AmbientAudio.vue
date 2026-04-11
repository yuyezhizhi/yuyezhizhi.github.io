<template>
  <div class="ambient-audio">
    <!-- 音频控制按钮 -->
    <button 
      class="audio-control"
      :class="{ playing: isPlaying, muted: isMuted }"
      @click="toggleAudio"
      :title="buttonTitle"
    >
      <span class="audio-icon">{{ icon }}</span>
      <span class="audio-wave" v-if="isPlaying && !isMuted">
        <span v-for="i in 4" :key="i" class="wave-bar" :style="{ animationDelay: `${i * 0.1}s` }" />
      </span>
    </button>

    <!-- 音量控制滑块 -->
    <Transition name="volume">
      <div v-if="showVolume" class="volume-control" @click.stop>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="volume"
          class="volume-slider"
          @input="updateVolume"
        />
        <span class="volume-value">{{ volume }}%</span>
      </div>
    </Transition>

    <!-- 音频选择面板 -->
    <Transition name="panel">
      <div v-if="showPanel" class="audio-panel" @click.stop>
        <div class="panel-header">
          <h3>🎵 环境音效</h3>
          <button class="close-btn" @click="showPanel = false">✕</button>
        </div>
        
        <div class="audio-tracks">
          <div 
            v-for="track in tracks" 
            :key="track.id"
            class="track-item"
            :class="{ active: currentTrack?.id === track.id }"
            @click="selectTrack(track)"
          >
            <span class="track-icon">{{ track.icon }}</span>
            <div class="track-info">
              <span class="track-name">{{ track.name }}</span>
              <span class="track-desc">{{ track.description }}</span>
            </div>
            <span v-if="currentTrack?.id === track.id" class="playing-indicator">
              <span v-for="i in 3" :key="i" class="indicator-bar" />
            </span>
          </div>
        </div>

        <div class="panel-footer">
          <label class="autoplay-toggle">
            <input type="checkbox" v-model="autoplay" />
            <span>进入页面自动播放</span>
          </label>
        </div>
      </div>
    </Transition>

    <!-- 遮罩层 -->
    <div 
      v-if="showPanel || showVolume" 
      class="overlay" 
      @click="closePanels"
    />

    <!-- 隐藏的音频元素 -->
    <audio 
      ref="audioElement"
      loop
      preload="auto"
      @loadeddata="onAudioLoaded"
      @error="onAudioError"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// 音频轨道配置 - 使用在线音效资源
const tracks = [
  {
    id: 'ambient-nature',
    name: '自然之声',
    description: '轻柔的鸟鸣与风声',
    icon: '🌿',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'ambient-space',
    name: '宇宙回响',
    description: '深邃的空灵音景',
    icon: '🌌',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'ambient-rain',
    name: '雨声白噪音',
    description: '舒缓的雨天氛围',
    icon: '🌧️',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 'ambient-meditation',
    name: '冥想音乐',
    description: '平静的冥想背景音',
    icon: '🧘',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 'ambient-piano',
    name: '轻音乐',
    description: '优美的钢琴旋律',
    icon: '🎹',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  }
]

const STORAGE_KEY = 'ambient-audio-settings'

// 状态
const audioElement = ref(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(30)
const currentTrack = ref(tracks[0])
const showPanel = ref(false)
const showVolume = ref(false)
const autoplay = ref(false)
const audioLoaded = ref(false)

// 计算属性
const icon = computed(() => {
  if (isMuted.value || volume.value === 0) return '🔇'
  if (!isPlaying.value) return '🔈'
  if (volume.value < 50) return '🔉'
  return '🔊'
})

const buttonTitle = computed(() => {
  if (showPanel.value) return '关闭面板'
  if (isMuted.value) return '取消静音'
  if (!isPlaying.value) return '播放环境音效'
  return currentTrack.value.name
})

// 方法
const loadSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const settings = JSON.parse(stored)
      volume.value = settings.volume ?? 30
      currentTrack.value = tracks.find(t => t.id === settings.trackId) || tracks[0]
      autoplay.value = settings.autoplay ?? false
      isMuted.value = settings.muted ?? false
    }
  } catch (e) {
    console.error('Failed to load audio settings:', e)
  }
}

const saveSettings = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      volume: volume.value,
      trackId: currentTrack.value.id,
      autoplay: autoplay.value,
      muted: isMuted.value
    }))
  } catch (e) {
    console.error('Failed to save audio settings:', e)
  }
}

const toggleAudio = () => {
  if (showPanel.value) {
    showPanel.value = false
    return
  }
  
  // 长按或右键显示面板，单击切换播放
  if (!isPlaying.value) {
    play()
  } else {
    showVolume.value = !showVolume.value
  }
}

const play = async () => {
  if (!audioElement.value || !currentTrack.value) return
  
  try {
    // 如果音频未加载或URL不同，先加载
    if (!audioLoaded.value || audioElement.value.src !== currentTrack.value.url) {
      audioElement.value.src = currentTrack.value.url
      audioElement.value.load()
      // 等待音频加载完成
      await new Promise((resolve, reject) => {
        const onCanPlay = () => {
          audioElement.value.removeEventListener('canplaythrough', onCanPlay)
          audioElement.value.removeEventListener('error', onError)
          resolve()
        }
        const onError = (e) => {
          audioElement.value.removeEventListener('canplaythrough', onCanPlay)
          audioElement.value.removeEventListener('error', onError)
          reject(e)
        }
        audioElement.value.addEventListener('canplaythrough', onCanPlay)
        audioElement.value.addEventListener('error', onError)
        // 超时处理
        setTimeout(() => reject(new Error('Audio load timeout')), 10000)
      })
      audioLoaded.value = true
    }
    
    audioElement.value.volume = isMuted.value ? 0 : volume.value / 100
    await audioElement.value.play()
    isPlaying.value = true
  } catch (e) {
    console.error('Failed to play audio:', e)
    isPlaying.value = false
  }
}

const pause = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    isPlaying.value = false
  }
}

const selectTrack = (track) => {
  currentTrack.value = track
  audioLoaded.value = false
  saveSettings()
  play()
}

const updateVolume = () => {
  if (audioElement.value) {
    audioElement.value.volume = volume.value / 100
  }
  isMuted.value = volume.value === 0
  saveSettings()
}

const onAudioLoaded = () => {
  audioLoaded.value = true
}

const onAudioError = (e) => {
  console.error('Audio error:', e)
  isPlaying.value = false
}

const closePanels = () => {
  showPanel.value = false
  showVolume.value = false
}

// 监听设置变化
watch([volume, isMuted, autoplay], saveSettings, { deep: true })

// 监听当前轨道变化
watch(currentTrack, () => {
  if (isPlaying.value) {
    play()
  }
})

onMounted(() => {
  loadSettings()
  
  // 如果设置了自动播放，延迟播放
  if (autoplay.value) {
    setTimeout(() => {
      play()
    }, 1000)
  }
})

onUnmounted(() => {
  pause()
})

// 暴露方法给父组件
defineExpose({
  play,
  pause,
  showPanel: () => { showPanel.value = true }
})
</script>

<style scoped lang="less">
.ambient-audio {
  position: relative;
}

// 音频控制按钮
.audio-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  &.playing {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  &.muted {
    opacity: 0.6;
  }

  .audio-icon {
    font-size: 1.2rem;
  }

  .audio-wave {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 16px;

    .wave-bar {
      width: 3px;
      height: 100%;
      background: currentColor;
      border-radius: 2px;
      animation: wave 1s ease-in-out infinite;
    }
  }
}

// 音量控制
.volume-control {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0;
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 40px;
  z-index: 1002;

  .volume-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100px;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
  }

  .volume-value {
    font-size: 0.75rem;
    color: #666;
    font-weight: 500;
  }
}

// 音频选择面板
.audio-panel {
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  width: 320px;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 1002;
  overflow: hidden;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

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

  .audio-tracks {
    max-height: 300px;
    overflow-y: auto;
    padding: 0.75rem;

    .track-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f5f5f5;
      }

      &.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border: 1px solid rgba(102, 126, 234, 0.3);
      }

      .track-icon {
        font-size: 1.5rem;
      }

      .track-info {
        flex-grow: 1;
        display: flex;
        flex-direction: column;

        .track-name {
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
        }

        .track-desc {
          font-size: 0.8rem;
          color: #999;
        }
      }

      .playing-indicator {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 16px;

        .indicator-bar {
          width: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
          animation: indicator 0.8s ease-in-out infinite;

          &:nth-child(1) { height: 8px; animation-delay: 0s; }
          &:nth-child(2) { height: 14px; animation-delay: 0.2s; }
          &:nth-child(3) { height: 10px; animation-delay: 0.4s; }
        }
      }
    }
  }

  .panel-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;

    .autoplay-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #666;

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #667eea;
      }
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
@keyframes wave {
  0%, 100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}

@keyframes indicator {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

// 过渡动画
.volume-enter-active,
.volume-leave-active {
  transition: all 0.3s ease;
}

.volume-enter-from,
.volume-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

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
  .audio-panel {
    right: 1rem;
    left: 1rem;
    width: auto;
    bottom: 4rem;
  }

  .volume-control {
    right: 50%;
    transform: translateX(50%);
  }
}
</style>
