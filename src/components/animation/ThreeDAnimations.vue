<template>
  <div class="category-section">
    <h2 class="section-title animate__animated animate__slideInLeft">3D动画</h2>
    <div class="examples-container">
      <!-- 3D旋转立方体 -->
      <div class="example-item animate__animated animate__zoomIn">
        <div class="example-header">
          <h3>3D旋转立方体</h3>
          <div class="header-right">
            <span class="example-type">rotate</span>
            <button @click="toggleFullscreen('cube')" class="fullscreen-btn">
              <span v-if="!isFullscreen('cube')">全屏</span>
              <span v-else>退出全屏</span>
            </button>
          </div>
        </div>
        <div class="animation-demo">
          <div ref="cubeContainer" class="cube-container">
            <div class="cube">
              <div class="cube-face front">前</div>
              <div class="cube-face back">后</div>
              <div class="cube-face right">右</div>
              <div class="cube-face left">左</div>
              <div class="cube-face top">上</div>
              <div class="cube-face bottom">下</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 3D球体旋转 -->
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.3s">
        <div class="example-header">
          <h3>3D球体旋转</h3>
          <div class="header-right">
            <span class="example-type">sphere</span>
            <button @click="toggleFullscreen('sphere')" class="fullscreen-btn">
              <span v-if="!isFullscreen('sphere')">全屏</span>
              <span v-else>退出全屏</span>
            </button>
          </div>
        </div>
        <div class="animation-demo">
          <div ref="sphereContainer" class="sphere-container">
            <div class="sphere">
              <div class="sphere-layer"></div>
              <div class="sphere-layer layer2"></div>
              <div class="sphere-layer layer3"></div>
              <div class="sphere-layer layer4"></div>
              <div class="sphere-layer layer5"></div>
              <div class="sphere-layer layer6"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 3D翻转卡片 -->
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.6s">
        <div class="example-header">
          <h3>3D翻转卡片</h3>
          <div class="header-right">
            <span class="example-type">flip</span>
            <button @click="toggleFullscreen('card')" class="fullscreen-btn">
              <span v-if="!isFullscreen('card')">全屏</span>
              <span v-else>退出全屏</span>
            </button>
          </div>
        </div>
        <div class="animation-demo">
          <div ref="cardContainer" class="card-container" @click="flipCard">
            <div class="card" :class="{ 'flipped': cardFlipped }">
              <div class="card-front">
                <h4>卡片正面</h4>
                <p>点击翻转</p>
              </div>
              <div class="card-back">
                <h4>卡片背面</h4>
                <p>3D翻转效果</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 3D金字塔 -->
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.9s">
        <div class="example-header">
          <h3>3D金字塔粒子</h3>
          <div class="header-right">
            <span class="example-type">pyramid</span>
            <button @click="toggleFullscreen('pyramid')" class="fullscreen-btn">
              <span v-if="!isFullscreen('pyramid')">全屏</span>
              <span v-else>退出全屏</span>
            </button>
          </div>
        </div>
        <div class="animation-demo">
          <div ref="pyramidContainer" class="pyramid-container">
            <GoldTempAnimation ref="pyramid"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoldTempAnimation from './GoldTempAnimation.vue'

export default {
  name: 'ThreeDAnimations',
  components: {
    GoldTempAnimation
  },
  data() {
    return {
      cardFlipped: false,
      fullscreenElements: {},
      originalStyles: {} // 保存原始样式
    }
  },
  
  mounted() {
    // 监听所有全屏变化事件
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('msfullscreenchange', this.handleFullscreenChange);
  },
  
  beforeUnmount() {
    // 清理所有全屏事件监听
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('msfullscreenchange', this.handleFullscreenChange);
    
    // 确保退出所有全屏
    this.exitAllFullscreen();
  },
  
  methods: {
    flipCard() {
      this.cardFlipped = !this.cardFlipped;
    },
    
    // 检查是否处于全屏状态
    isFullscreen(type) {
      return !!this.fullscreenElements[type];
    },
    
    // 切换全屏
    async toggleFullscreen(type) {
      if (this.isFullscreen(type)) {
        await this.exitFullscreen(type);
      } else {
        await this.enterFullscreen(type);
      }
    },
    
    // 进入全屏
    async enterFullscreen(type) {
      // 先退出其他可能的全屏
      await this.exitAllFullscreen();
      
      const containerRef = this.$refs[`${type}Container`];
      if (!containerRef) return;
      
      try {
        // 保存原始样式
        this.originalStyles[type] = {
          position: containerRef.style.position,
          top: containerRef.style.top,
          left: containerRef.style.left,
          width: containerRef.style.width,
          height: containerRef.style.height,
          backgroundColor: containerRef.style.backgroundColor,
          zIndex: containerRef.style.zIndex
        };
        
        // 应用全屏样式
        containerRef.style.position = 'fixed';
        containerRef.style.top = '0';
        containerRef.style.left = '0';
        containerRef.style.width = '100vw';
        containerRef.style.height = '100vh';
        containerRef.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        containerRef.style.zIndex = '9999';
        
        // 尝试进入浏览器全屏
        if (containerRef.requestFullscreen) {
          await containerRef.requestFullscreen();
        } else if (containerRef.webkitRequestFullscreen) {
          await containerRef.webkitRequestFullscreen();
        } else if (containerRef.mozRequestFullScreen) {
          await containerRef.mozRequestFullScreen();
        } else if (containerRef.msRequestFullscreen) {
          await containerRef.msRequestFullscreen();
        }
        
        // 记录全屏元素
        this.fullscreenElements[type] = containerRef;
        
      } catch (error) {
        console.error('进入全屏失败:', error);
        // 恢复原始样式
        this.restoreOriginalStyles(type);
      }
    },
    
    // 退出全屏
    async exitFullscreen(type) {
      const fullscreenElement = this.fullscreenElements[type];
      if (!fullscreenElement) return;
      
      try {
        // 退出浏览器全屏
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        
        // 恢复原始样式
        this.restoreOriginalStyles(type);
        
        // 清除记录
        delete this.fullscreenElements[type];
        delete this.originalStyles[type];
        
      } catch (error) {
        console.error('退出全屏失败:', error);
        // 强制恢复原始样式
        this.restoreOriginalStyles(type);
        delete this.fullscreenElements[type];
        delete this.originalStyles[type];
      }
    },
    
    // 恢复原始样式
    restoreOriginalStyles(type) {
      if (!this.originalStyles[type]) return;
      
      const containerRef = this.fullscreenElements[type];
      if (!containerRef) return;
      
      const originalStyle = this.originalStyles[type];
      containerRef.style.position = originalStyle.position;
      containerRef.style.top = originalStyle.top;
      containerRef.style.left = originalStyle.left;
      containerRef.style.width = originalStyle.width;
      containerRef.style.height = originalStyle.height;
      containerRef.style.backgroundColor = originalStyle.backgroundColor;
      containerRef.style.zIndex = originalStyle.zIndex;
    },
    
    // 退出所有全屏
    async exitAllFullscreen() {
      const types = Object.keys(this.fullscreenElements);
      for (const type of types) {
        await this.exitFullscreen(type);
      }
    },
    
    // 处理全屏变化事件
    handleFullscreenChange() {
      // 如果没有任何元素处于全屏状态，清除所有记录并恢复样式
      if (!document.fullscreenElement && !document.webkitFullscreenElement && 
          !document.mozFullScreenElement && !document.msFullscreenElement) {
        
        // 恢复所有原始样式
        Object.keys(this.originalStyles).forEach(type => {
          this.restoreOriginalStyles(type);
        });
        
        // 清除所有记录
        this.fullscreenElements = {};
        this.originalStyles = {};
      }
    }
  }
}
</script>

<style scoped lang="less">
// 变量定义
@text-color: #333;
@bg-color: #ffffff;
@border-radius: 8px;
@transition: all 0.3s ease;
@cube-size: 120px;
@sphere-size: 120px;
@card-width: 150px;
@card-height: 100px;

/* 3D动画容器 */
.category-section {
  width: 100%;
  
  .section-title {
    color: @text-color;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
  }
}

// 全屏样式混入
.fullscreen-container() {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
}

// 全屏元素缩放混入
.fullscreen-element(@scale: 3) {
  transform: scale(@scale);
}

.examples-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

/* 动画示例项 */
.example-item {
  background: @bg-color;
  border-radius: @border-radius;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: @transition;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
  
  .example-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    h3 {
      color: @text-color;
      font-size: 1.2rem;
      margin: 0;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
      
      .example-type {
        background-color: #f0f0f0;
        color: #666;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
      }
      
      /* 全屏按钮 */
      .fullscreen-btn {
        padding: 6px 12px;
        background-color: #42b883;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: @transition;
        font-size: 0.8rem;
        
        &:hover {
          background-color: #35495e;
        }
      }
    }
  }
  
  /* 动画演示区域 */
  .animation-demo {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px;
    perspective-origin: center;
  }
}

/* 立方体样式 */
.cube-container {
  width: @cube-size;
  height: @cube-size;
  position: relative;
  transform-style: preserve-3d;
  animation: rotateCube 10s infinite linear;
  
  .cube {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    
    .cube-face {
      position: absolute;
      width: @cube-size;
      height: @cube-size;
      border: 2px solid @text-color;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      font-weight: bold;
      opacity: 0.8;
      
      &.front {
        background-color: #ff6b6b;
        transform: translateZ(@cube-size / 2);
      }
      
      &.back {
        background-color: #4ecdc4;
        transform: rotateY(180deg) translateZ(@cube-size / 2);
      }
      
      &.right {
        background-color: #45b7d1;
        transform: rotateY(90deg) translateZ(@cube-size / 2);
      }
      
      &.left {
        background-color: #ffe66d;
        transform: rotateY(-90deg) translateZ(@cube-size / 2);
      }
      
      &.top {
        background-color: #96ceb4;
        transform: rotateX(90deg) translateZ(@cube-size / 2);
      }
      
      &.bottom {
        background-color: #feca57;
        transform: rotateX(-90deg) translateZ(@cube-size / 2);
      }
    }
  }
}

/* 球体样式 */
.sphere-container {
  width: @sphere-size;
  height: @sphere-size;
  position: relative;
  transform-style: preserve-3d;
  animation: rotateSphere 8s infinite linear;
  
  .sphere {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    
    .sphere-layer {
      position: absolute;
      width: @sphere-size;
      height: @sphere-size;
      border: 3px solid #3498db;
      border-radius: 50%;
      opacity: 0.7;
      
      &.layer2 {
        transform: rotateY(30deg);
      }
      &.layer3 {
        transform: rotateY(60deg);
      }
      &.layer4 {
        transform: rotateY(90deg);
      }
      &.layer5 {
        transform: rotateY(120deg);
      }
      &.layer6 {
        transform: rotateY(150deg);
      }
    }
  }
}

/* @keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
} */

@keyframes rotateCube {
  from {
    transform: rotateX(0deg) rotateY(0deg);
  }
  to {
    transform: rotateX(360deg) rotateY(360deg);
  }
}

@keyframes rotateSphere {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}

/* 翻转卡片样式 */
.card-container {
  width: @card-width;
  height: @card-height;
  position: relative;
  perspective: 1000px;
  cursor: pointer;
  
  .card {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    transition: transform 0.6s ease;
    
    &.flipped {
      transform: rotateY(180deg);
    }
    
    .card-front, .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: @border-radius;
      color: white;
      font-weight: bold;
      
      h4 {
        margin: 0 0 5px 0;
        font-size: 1rem;
      }
      
      p {
        margin: 0;
        font-size: 0.8rem;
        opacity: 0.9;
      }
    }
    
    .card-front {
      background-color: #2ecc71;
    }
    
    .card-back {
      background-color: #e74c3c;
      transform: rotateY(180deg);
    }
  }
}

/* 金字塔容器样式 */
.pyramid-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 全屏模式样式 */
.cube-container,
.sphere-container,
.card-container,
.pyramid-container {
  &:fullscreen, 
  &:-webkit-full-screen, 
  &:-moz-full-screen, 
  &:-ms-fullscreen {
    .fullscreen-container();
  }
  
  &:fullscreen .cube, 
  &:-webkit-full-screen .cube, 
  &:-moz-full-screen .cube, 
  &:-ms-fullscreen .cube,
  &:fullscreen .sphere, 
  &:-webkit-full-screen .sphere, 
  &:-moz-full-screen .sphere, 
  &:-ms-fullscreen .sphere,
  &:fullscreen .card, 
  &:-webkit-full-screen .card, 
  &:-moz-full-screen .card, 
  &:-ms-fullscreen .card,
  &:fullscreen .pyramid-container, 
  &:-webkit-full-screen .pyramid-container, 
  &:-moz-full-screen .pyramid-container, 
  &:-ms-fullscreen .pyramid-container {
    .fullscreen-element();
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .examples-container {
    grid-template-columns: 1fr;
  }
  
  .cube-container,
  .sphere-container,
  .card-container,
  .pyramid-container {
    &:fullscreen .cube, 
    &:-webkit-full-screen .cube, 
    &:-moz-full-screen .cube, 
    &:-ms-fullscreen .cube,
    &:fullscreen .sphere, 
    &:-webkit-full-screen .sphere, 
    &:-moz-full-screen .sphere, 
    &:-ms-fullscreen .sphere,
    &:fullscreen .card, 
    &:-webkit-full-screen .card, 
    &:-moz-full-screen .card, 
    &:-ms-fullscreen .card,
    &:fullscreen .pyramid-container, 
    &:-webkit-full-screen .pyramid-container, 
    &:-moz-full-screen .pyramid-container, 
    &:-ms-fullscreen .pyramid-container {
      .fullscreen-element(1.5);
    }
  }
}
</style>