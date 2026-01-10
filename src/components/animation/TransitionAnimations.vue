<template>
  <div class="category-section">
    <h2 class="section-title animate__animated animate__slideInLeft">过渡动画</h2>
    <div class="examples-container">
      <div class="example-item animate__animated animate__zoomIn">
        <div class="example-header">
          <h3>淡入淡出</h3>
          <span class="example-type">fade</span>
          <button @click="showFade = !showFade" class="demo-button">切换显示</button>
        </div>
        <div class="animation-demo">
          <transition name="fade">
            <div v-if="showFade" class="demo-box fade-box"></div>
          </transition>
        </div>
      </div>
      
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.2s">
        <div class="example-header">
          <h3>滑动效果</h3>
          <span class="example-type">slide</span>
          <button @click="showSlide = !showSlide" class="demo-button">切换显示</button>
        </div>
        <div class="animation-demo">
          <transition name="slide">
            <div v-if="showSlide" class="demo-box slide-box"></div>
          </transition>
        </div>
      </div>
      
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.4s">
        <div class="example-header">
          <h3>缩放效果</h3>
          <span class="example-type">scale</span>
          <button @click="showScale = !showScale" class="demo-button">切换显示</button>
        </div>
        <div class="animation-demo">
          <transition name="scale">
            <div v-if="showScale" class="demo-box scale-box"></div>
          </transition>
        </div>
      </div>
      
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.6s">
        <div class="example-header">
          <h3>旋转效果</h3>
          <span class="example-type">rotate</span>
          <button @click="showRotate = !showRotate" class="demo-button">切换显示</button>
        </div>
        <div class="animation-demo">
          <transition name="rotate">
            <div v-if="showRotate" class="demo-box rotate-box"></div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransitionAnimations',
  data() {
    return {
      showFade: true,
      showSlide: true,
      showScale: true,
      showRotate: true
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
@demo-color: #42b883;

/* 过渡动画容器 */
.category-section {
  width: 100%;
  
  .section-title {
    color: @text-color;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  .examples-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
    
    /* 响应式设计 */
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
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
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 10px;
      
      h3 {
        color: @text-color;
        font-size: 1.2rem;
        margin: 0;
      }
      
      .example-type {
        background-color: #f0f0f0;
        color: #666;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
      }
      
      /* 演示按钮 */
      .demo-button {
        padding: 6px 12px;
        background-color: @demo-color;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        font-size: 0.8rem;
        margin-left: 10px;
        
        &:hover {
          background-color: #35495e;
          transform: translateY(-2px);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
    }
    
    /* 动画演示区域 */
    .animation-demo {
      height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      
      /* 演示盒子 */
      .demo-box {
        width: 100px;
        height: 100px;
        background-color: @demo-color;
        border-radius: @border-radius;
      }
    }
  }
}

/* 过渡动画定义 */
// 淡入淡出过渡
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.5s ease;
  }
  
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

// 滑动过渡
.slide {
  &-enter-active,
  &-leave-active {
    transition: @transition;
  }
  
  &-enter-from {
    transform: translateX(-100%);
  }
  
  &-leave-to {
    transform: translateX(100%);
  }
}

// 缩放过渡
.scale {
  &-enter-active,
  &-leave-active {
    transition: @transition;
  }
  
  &-enter-from,
  &-leave-to {
    transform: scale(0);
    opacity: 0;
  }
}

// 旋转过渡
.rotate {
  &-enter-active,
  &-leave-active {
    transition: all 0.5s ease;
  }
  
  &-enter-from {
    transform: rotate(0deg) scale(0);
    opacity: 0;
  }
  
  &-leave-to {
    transform: rotate(360deg) scale(0);
    opacity: 0;
  }
}
</style>