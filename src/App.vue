<template>
  <div id="app">
    <DynamicBackground />
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="logo">
          <router-link to="/">前端知识库</router-link>
        </h1>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-link">首页</router-link></li>
          <li><router-link to="/about" class="nav-link">关于</router-link></li>
        </ul>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 yuyezhizhi 的前端博客. 保留所有权利.</p>
      </div>
    </footer>
    
    <!-- 回到顶部按钮 -->
    <button 
      v-if="showBackToTop"
      @click="backToTop"
      class="back-to-top-btn"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" class="progress-ring">
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
      <span class="back-to-top-arrow">↑</span>
    </button>
  </div>
</template>

<script>
import DynamicBackground from './components/DynamicBackground.vue';

export default {
  name: 'App',
  components: {
    DynamicBackground
  },
  data() {
    return {
      showBackToTop: false,
      scrollProgress: 0,
      ringRadius: 10,
      ringCircumference: 0
    }
  },
  computed: {
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
}

// 主应用容器
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

// 导航栏
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  transition: @transition;
  backdrop-filter: saturate(180%) blur(6px);
  background: rgba(255, 255, 255, 0.9);
  
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
      font-size: 1.8rem;
      font-weight: bold;
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
        
        &:hover {
          background-color: rgba(@primary-color, 0.1);
        }
        
        &.router-link-active {
          background-color: rgba(@primary-color, 0.2);
          color: @primary-color;
          font-weight: 600;
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
}

// 页脚
.footer {
  background-color: @dark-gray;
  color: @white;
  text-align: center;
  padding: 1.5rem 0;
  margin-top: auto;
  
  .footer-content {
    max-width: @container-width;
    margin: 0 auto;
    padding: 0 2rem;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .navbar {
    .nav-container {
      flex-direction: column;
      gap: 1rem;
      
      .nav-menu {
        gap: 1rem;
      }
    }
  }
  
  .main-content {
    padding: 8rem 1rem 1rem;
  }
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
</style>