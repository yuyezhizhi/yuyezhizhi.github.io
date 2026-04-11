<template>
  <div class="journey-player" v-if="currentJourney">
    <!-- 旅程进度条 -->
    <div class="journey-progress">
      <div class="progress-track">
        <div 
          class="progress-fill" 
          :style="{ width: `${(currentArtworkIndex / currentJourney.artworks.length) * 100}%` }"
        />
      </div>
      <div class="progress-steps">
        <div 
          v-for="(artwork, index) in currentJourney.artworks" 
          :key="artwork.id"
          class="step"
          :class="{ 
            active: index === currentArtworkIndex,
            completed: index < currentArtworkIndex 
          }"
          @click="goToArtwork(index)"
        >
          <span class="step-number">{{ index + 1 }}</span>
        </div>
      </div>
    </div>

    <!-- 叙事文本 -->
    <Transition name="narrative" mode="out-in">
      <div v-if="showNarrative" class="narrative-overlay" @click="dismissNarrative">
        <div class="narrative-content">
          <span class="journey-icon">{{ currentJourney.icon }}</span>
          <h3 class="artwork-title">{{ currentArtwork.title }}</h3>
          <p class="narrative-text">{{ currentArtwork.narrative }}</p>
          <span class="continue-hint">点击继续</span>
        </div>
      </div>
    </Transition>

    <!-- 导航控制 -->
    <div class="journey-controls">
      <button 
        class="control-btn prev" 
        @click="previousArtwork"
        :disabled="currentArtworkIndex === 0"
      >
        ← 上一个
      </button>
      
      <div class="journey-info">
        <span class="journey-name">{{ currentJourney.title }}</span>
        <span class="artwork-counter">{{ currentArtworkIndex + 1 }} / {{ currentJourney.artworks.length }}</span>
      </div>
      
      <button 
        class="control-btn next" 
        @click="nextArtwork"
        :disabled="currentArtworkIndex === currentJourney.artworks.length - 1"
      >
        {{ isLastArtwork ? '完成旅程' : '下一个 →' }}
      </button>
    </div>

    <!-- 退出旅程按钮 -->
    <button class="exit-journey" @click="exitJourney">
      ✕ 退出旅程
    </button>

    <!-- 旅程完成弹窗 -->
    <Transition name="modal">
      <div v-if="showCompletion" class="completion-modal">
        <div class="completion-content">
          <span class="completion-icon">🎉</span>
          <h2>旅程完成！</h2>
          <p>你已完成「{{ currentJourney.title }}」</p>
          <p class="completion-quote">{{ completionQuote }}</p>
          <div class="completion-actions">
            <button class="btn-primary" @click="restartJourney">重新体验</button>
            <button class="btn-secondary" @click="exitJourney">返回首页</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  journey: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['exit'])

const router = useRouter()
const currentJourney = computed(() => props.journey)
const currentArtworkIndex = ref(0)
const showNarrative = ref(true)
const showCompletion = ref(false)
const autoPlayTimer = ref(null)

const currentArtwork = computed(() => {
  return currentJourney.value.artworks[currentArtworkIndex.value]
})

const isLastArtwork = computed(() => {
  return currentArtworkIndex.value === currentJourney.value.artworks.length - 1
})

const completionQuotes = [
  '艺术是心灵的镜子',
  '每一次旅程都是一次内心的探索',
  '美存在于观察者的眼中',
  '代码可以是诗，算法可以是画',
  '感谢你与艺术同行'
]

const completionQuote = computed(() => {
  return completionQuotes[Math.floor(Math.random() * completionQuotes.length)]
})

// 导航到指定作品
const goToArtwork = (index) => {
  currentArtworkIndex.value = index
  showNarrative.value = true
  navigateToCurrentArtwork()
}

// 下一个作品
const nextArtwork = () => {
  if (isLastArtwork.value) {
    showCompletion.value = true
  } else {
    currentArtworkIndex.value++
    showNarrative.value = true
    navigateToCurrentArtwork()
  }
}

// 上一个作品
const previousArtwork = () => {
  if (currentArtworkIndex.value > 0) {
    currentArtworkIndex.value--
    showNarrative.value = true
    navigateToCurrentArtwork()
  }
}

// 导航到当前作品的路由
const navigateToCurrentArtwork = () => {
  const artwork = currentArtwork.value
  if (artwork) {
    router.push(artwork.id)
  }
}

// 关闭叙事
const dismissNarrative = () => {
  showNarrative.value = false
  // 如果是自动播放模式，开始计时
  if (!currentArtwork.value.interactive) {
    startAutoPlay()
  }
}

// 自动播放下一个
const startAutoPlay = () => {
  clearTimeout(autoPlayTimer.value)
  const duration = currentArtwork.value.duration === '自由' ? 30000 : currentArtwork.value.duration * 1000
  autoPlayTimer.value = setTimeout(() => {
    if (!isLastArtwork.value) {
      nextArtwork()
    }
  }, duration)
}

// 退出旅程
const exitJourney = () => {
  clearTimeout(autoPlayTimer.value)
  emit('exit')
}

// 重新开始
const restartJourney = () => {
  currentArtworkIndex.value = 0
  showCompletion.value = false
  showNarrative.value = true
  navigateToCurrentArtwork()
}

// 监听旅程变化
watch(() => props.journey, () => {
  currentArtworkIndex.value = 0
  showNarrative.value = true
  showCompletion.value = false
  navigateToCurrentArtwork()
}, { immediate: true })

onUnmounted(() => {
  clearTimeout(autoPlayTimer.value)
})
</script>

<style scoped lang="less">
.journey-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
}

// 进度条 - 右下角紧凑样式
.journey-progress {
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  width: auto;
  min-width: 200px;
  max-width: 300px;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.6rem 0.875rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1001;

  .progress-track {
    height: 3px;
    background: #e0e0e0;
    border-radius: 2px;
    margin-bottom: 0.5rem;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
      transition: width 0.5s ease;
    }
  }

  .progress-steps {
    display: flex;
    justify-content: center;
    gap: 0.4rem;
    align-items: center;

    .step {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      .step-number {
        font-size: 0.7rem;
        font-weight: 600;
        color: #666;
      }

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: scale(1.1);

        .step-number {
          color: white;
        }
      }

      &.completed {
        background: #4caf50;

        .step-number {
          color: white;
        }
      }

      &:hover:not(.active) {
        background: #d0d0d0;
      }
    }
  }
}

// 叙事覆盖层
.narrative-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  cursor: pointer;

  .narrative-content {
    text-align: center;
    color: white;
    max-width: 600px;
    padding: 2rem;
    animation: fadeInUp 0.6s ease;

    .journey-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1.5rem;
    }

    .artwork-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .narrative-text {
      font-size: 1.2rem;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
      font-style: italic;
    }

    .continue-hint {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      animation: pulse 2s infinite;
    }
  }
}

// 控制栏 - 右下角紧凑样式
.journey-controls {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 0.75rem;
  border-radius: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1001;

  .control-btn {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      background: #e0e0e0;
      color: #999;
      cursor: not-allowed;
    }
  }

  .journey-info {
    text-align: center;
    min-width: auto;
    padding: 0 0.25rem;

    .journey-name {
      display: none; // 隐藏旅程名称，节省空间
    }

    .artwork-counter {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: #333;
    }
  }
}

// 退出按钮 - 右下角紧凑样式
.exit-journey {
  position: fixed;
  bottom: 1rem;
  right: 11rem; // 放在控制栏左侧
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ff6b6b;
    color: white;
    transform: scale(1.1);
  }
}

// 完成弹窗
.completion-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1003;

  .completion-content {
    text-align: center;
    color: white;
    max-width: 500px;
    padding: 3rem;
    animation: scaleIn 0.5s ease;

    .completion-icon {
      font-size: 5rem;
      display: block;
      margin-bottom: 1.5rem;
    }

    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    p {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.5rem;
    }

    .completion-quote {
      font-style: italic;
      color: rgba(255, 255, 255, 0.6);
      margin: 1.5rem 0;
      padding: 1rem;
      border-left: 3px solid #667eea;
    }

    .completion-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;

      button {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 2rem;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &.btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
        }

        &.btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);

          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        }
      }
    }
  }
}

// 动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// 过渡动画
.narrative-enter-active,
.narrative-leave-active {
  transition: all 0.5s ease;
}

.narrative-enter-from,
.narrative-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

// 响应式
@media (max-width: 768px) {
  .journey-progress {
    right: 0.5rem;
    bottom: 4.5rem;
    min-width: 160px;
    max-width: 220px;
    padding: 0.5rem 0.75rem;

    .progress-steps {
      gap: 0.3rem;

      .step {
        width: 1.25rem;
        height: 1.25rem;

        .step-number {
          font-size: 0.65rem;
        }
      }
    }
  }

  .journey-controls {
    right: 0.5rem;
    bottom: 0.5rem;
    padding: 0.4rem 0.6rem;
    gap: 0.4rem;

    .control-btn {
      padding: 0.35rem 0.6rem;
      font-size: 0.7rem;
    }

    .journey-info {
      .artwork-counter {
        font-size: 0.75rem;
      }
    }
  }

  .exit-journey {
    right: 9rem;
    bottom: 0.5rem;
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.9rem;
  }

  .narrative-overlay .narrative-content {
    padding: 1.5rem;

    .journey-icon {
      font-size: 3rem;
    }

    .artwork-title {
      font-size: 1.5rem;
    }

    .narrative-text {
      font-size: 1rem;
    }
  }
}
</style>
