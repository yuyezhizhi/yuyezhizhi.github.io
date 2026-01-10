<template>
  <div class="category-section">
    <h2 class="section-title animate__animated animate__slideInLeft">CSS动画</h2>
    <div class="examples-container">
      <div class="example-item animate__animated animate__zoomIn">
        <div class="example-header">
          <h3>旋转动画</h3>
          <span class="example-type">spin</span>
        </div>
        <div class="animation-demo">
          <div class="demo-box spin"></div>
        </div>
      </div>
      
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.2s">
        <div class="example-header">
          <h3>弹跳动画</h3>
          <span class="example-type">bounce</span>
        </div>
        <div class="animation-demo">
          <div class="demo-box bounce"></div>
        </div>
      </div>
      
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.4s">
        <div class="example-header">
          <h3>脉冲动画</h3>
          <span class="example-type">pulse</span>
        </div>
        <div class="animation-demo">
          <div class="demo-box pulse"></div>
        </div>
      </div>
      
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.6s">
        <div class="example-header">
          <h3>摇摆动画</h3>
          <span class="example-type">swing</span>
        </div>
        <div class="animation-demo">
          <div class="demo-box swing"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CSSAnimations'
}
</script>

<style scoped lang="less">
// 变量定义
@text-color: #333;
@bg-color: #ffffff;
@border-radius: 8px;
@transition: all 0.3s ease;
@demo-color: #42b883;

/* CSS动画容器 */
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
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      
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
    }
    
    /* 动画演示区域 */
    .animation-demo {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      /* 演示盒子 */
      .demo-box {
        width: 100px;
        height: 100px;
        background-color: @demo-color;
        border-radius: @border-radius;
        
        /* 旋转动画 */
        &.spin {
          animation: spin 2s linear infinite;
        }
        
        /* 弹跳动画 */
        &.bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        /* 脉冲动画 */
        &.pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        /* 摇摆动画 */
        &.swing {
          animation: swing 2s ease-in-out infinite;
          transform-origin: center top;
        }
      }
    }
  }
}

/* 动画定义 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes swing {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-15deg); }
  100% { transform: rotate(0deg); }
}
</style>