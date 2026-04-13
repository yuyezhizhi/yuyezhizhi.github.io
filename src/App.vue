<template>
  <div id="app">
    <DynamicBackground v-if="!isRainTextPage" />
    <nav class="navbar" aria-label="主导航">
      <div class="nav-container">
        <h1 class="logo">
          <router-link to="/" class="animated-text" aria-label="首页">
            <span class="letter" style="color: #ff6b6b;">好</span>
            <span class="letter" style="color: #4ecdc4;">玩</span>
            <span class="letter" style="color: #45b7d1;">的</span>
            <span class="letter" style="color: #96ceb4;">动</span>
            <span class="letter" style="color: #ffeaa7;">画</span>
          </router-link>
        </h1>
        <ul class="nav-menu" role="menubar">
          <li role="none"><router-link to="/journeys" class="nav-link animated-text" role="menuitem" tabindex="0" aria-label="旅程">
            <span class="letter" style="color: #ff6b6b;">旅</span>
            <span class="letter" style="color: #4ecdc4;">程</span>
          </router-link></li>
          <li role="none"><router-link to="/about" class="nav-link animated-text" role="menuitem" tabindex="0" aria-label="关于">
            <span class="letter" style="color: #45b7d1;">关</span>
            <span class="letter" style="color: #96ceb4;">于</span>
          </router-link></li>
        </ul>
      </div>
    </nav>
    
    <main :class="['main-content', { 'fullscreen': isFullscreenPage }]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" @start-journey="startJourney" />
        </transition>
      </router-view>
    </main>
    
    <!-- 环境音效控制 -->
    <AmbientAudio 
      v-if="!isFullscreenPage"
      class="ambient-audio-control"
    />

    <!-- 回到顶部按钮 -->
    <button 
      v-if="showBackToTop && !isFullscreenPage"
      @click="backToTop"
      @keyup.enter="backToTop"
      @keyup.space="backToTop"
      class="back-to-top-btn"
      aria-label="回到顶部"
      tabindex="0"
      role="button"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" class="progress-ring" aria-hidden="true">
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.3)" 
          stroke-width="2"
        />
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          fill="none" 
          stroke="#f87884" 
          stroke-width="2"
          stroke-linecap="round"
          :style="{ 
            strokeDasharray: ringCircumference, 
            strokeDashoffset: ringDashoffset 
          }"
          class="progress-ring-circle"
        />
      </svg>
      <span class="back-to-top-arrow" aria-hidden="true">↑</span>
    </button>

    <!-- 旅程播放器 - 全局显示 -->
    <JourneyPlayer 
      v-if="activeJourney"
      :journey="activeJourney"
      @exit="exitJourney"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
// 使用懒加载导入大型组件
const DynamicBackground = defineAsyncComponent(() => import('./components/DynamicBackground.vue'));
const AmbientAudio = defineAsyncComponent(() => import('./components/AmbientAudio.vue'));
const JourneyPlayer = defineAsyncComponent(() => import('./components/JourneyPlayer.vue'));
import { journeys } from './data/journeys.js';

export default {
  name: 'App',
  components: {
    DynamicBackground,
    AmbientAudio,
    JourneyPlayer
  },
  data() {
    return {
      showBackToTop: false,
      scrollProgress: 0,
      ringRadius: 10,
      ringCircumference: 0,
      activeJourney: null,
      journeys: journeys
    }
  },
  computed: {
    isRainTextPage() {
      // 判断是否为文字雨滴页面
      return this.$route.path === '/raintext';
    },
    isSpinningTopsPage() {
      // 判断是否为陀螺碰撞页面
      return this.$route.path === '/spinningtops';
    },
    isFullscreenPage() {
      // 判断是否为全屏动画页面（需要隐藏导航和控制元素）
      return this.$route.meta.fullscreen === true;
    },
    ringDashoffset() {
      return this.ringCircumference - (this.scrollProgress / 100) * this.ringCircumference
    }
  },
  mounted() {
    // 计算圆环周长
    this.ringCircumference = 2 * Math.PI * this.ringRadius
    
    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      // 当滚动超过200px时显示回到顶部按钮
      this.showBackToTop = window.scrollY > 200
      
      // 计算页面滚动进度
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (window.scrollY / totalHeight) * 100
      this.scrollProgress = Math.min(Math.max(progress, 0), 100)
    },
    backToTop() {
      // 平滑滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    
    // 开始旅程
    startJourney(journey) {
      this.activeJourney = journey
      // 导航到第一个作品
      if (journey.artworks.length > 0) {
        this.$router.push(journey.artworks[0].id)
      }
    },
    
    // 退出旅程
    exitJourney() {
      this.activeJourney = null
      this.$router.push('/journeys')
    }
  }
}
</script>

<style lang="less">
// 变量定义
@primary-color: #f87884;
@bg-color: #fff5f5;
@text-color: #333;
@white: #ffffff;
@dark-gray: #343a40;
@container-width: 1200px;
@border-radius: 5px;
@transition: all 0.3s ease;

// 重置样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: @text-color;
  background-color: @bg-color;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

// 主应用容器
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
}

// 导航栏
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem 0;
  box-shadow: none;
  z-index: 1000;
  transition: @transition, opacity 0.3s ease;
  backdrop-filter: none;
  background: none;
  opacity: 0.3;
  
  &:hover {
    opacity: 1;
  }
  
  .nav-container {
    max-width: @container-width;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 3rem;
    
    .logo a {
      color: @text-color;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .animated-text {
      display: inline-block;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      
      .letter {
        display: inline-block;
        animation: bounce 2s infinite ease-in-out;
        animation-delay: calc(var(--index) * 0.1s);
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        
        &:nth-child(1) { --index: 0; }
        &:nth-child(2) { --index: 1; }
        &:nth-child(3) { --index: 2; }
        &:nth-child(4) { --index: 3; }
        &:nth-child(5) { --index: 4; }
      }
    }
    
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
      
      .nav-link {
        color: @text-color;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: @border-radius;
        transition: @transition;
        font-size: 1.5rem;
        font-weight: bold;
        
        &:hover {
          background-color: transparent;
        }
        
        &.router-link-active {
          background-color: transparent;
          color: @primary-color;
          font-weight: bold;
        }
      }
    }
  }
}

// 主要内容区域
.main-content {
  flex: 1;
  max-width: @container-width;
  margin: 0 auto;
  padding: 8rem 2rem 2rem;
  width: 100%;
  
  &.fullscreen {
    max-width: 100%;
    margin: 0;
    padding: 0;
    height: 100vh;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .navbar {
    .nav-container {
      max-width: 90%;
      padding: 0 1rem;
    }
  }
  
  .main-content {
    max-width: 90%;
    padding: 8rem 1rem 1rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    .nav-container {
      flex-direction: column;
      gap: 1rem;
      
      .logo a {
        font-size: 1.2rem;
      }
      
      .nav-menu {
        gap: 1rem;
        
        .nav-link {
          font-size: 1.2rem;
          padding: 0.3rem 0.8rem;
        }
      }
    }
  }
  
  .main-content {
    padding: 8rem 1rem 1rem;
  }
  
  .back-to-top-btn {
    width: 2.5rem;
    height: 2.5rem;
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .ambient-audio-control {
    bottom: 1.5rem;
    left: 1.5rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    .nav-container {
      .logo a {
        font-size: 1rem;
      }
      
      .nav-menu {
        .nav-link {
          font-size: 1rem;
          padding: 0.2rem 0.6rem;
        }
      }
    }
  }
  
  .main-content {
    padding: 7rem 0.5rem 0.5rem;
  }
  
  .back-to-top-btn {
    width: 2rem;
    height: 2rem;
    bottom: 1rem;
    right: 1rem;
    
    .back-to-top-arrow {
      font-size: 1rem;
    }
  }
  
  .ambient-audio-control {
    bottom: 1rem;
    left: 1rem;
  }
}

// 环境音效控制
.ambient-audio-control {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 999;
}

// 回到顶部按钮
.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: @primary-color;
  border: none;
  cursor: pointer;
  opacity: 0.9;
  transition: @transition;
  z-index: 999;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  
  &:hover {
    opacity: 1;
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
  
  .progress-ring {
    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }
  
  .progress-ring-circle {
    transition: stroke-dashoffset 0.3s ease;
  }
  
  .back-to-top-arrow {
    font-size: 1.2rem;
    font-weight: bold;
    position: relative;
    z-index: 1;
  }
}

// 路由过渡效果
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>