<template>
  <div class="animation-page">
    <div class="container">      
      <!-- 示例分类导航 -->
      <div class="examples-nav">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['example-btn', { active: activeCategory === category.id }]"
          @click="activeCategory = category.id"
          class="animate__animated animate__fadeIn"
          :style="{ animationDelay: `${category.id * 0.1}s` }"
        >
          {{ category.name }}
        </button>
      </div>
      <!-- 示例内容区域 -->
      <div class="examples-container">
        <!-- 数据可视化示例 -->
        <DataVisualization v-if="activeCategory === 1" />
        <!-- CSS动画示例 -->
        <CSSAnimations v-if="activeCategory === 2" />
        <!-- 过渡动画示例 -->
        <TransitionAnimations v-if="activeCategory === 3" />
        <!-- 3D动画示例 - 戴森球 -->
        <ThreeDAnimations v-if="activeCategory === 4" />
        <!-- AI聊天示例 -->
        <AIChat v-if="activeCategory === 5" />
        <!-- 排序算法可视化示例 -->
        <SortingVisualizations v-if="activeCategory === 6" />
      </div>
    </div>
  </div>
</template>

<script>
import 'animate.css'
import DataVisualization from '@/components/animation/DataVisualization.vue'
import CSSAnimations from '@/components/animation/CSSAnimations.vue'
import TransitionAnimations from '@/components/animation/TransitionAnimations.vue'
import ThreeDAnimations from '@/components/animation/ThreeDAnimations.vue'
import AIChat from '@/components/animation/AIChat.vue'
import SortingVisualizations from '@/components/animation/SortingVisualizations.vue'
export default {
  name: 'Animation',
  components: {
    DataVisualization,
    CSSAnimations,
    TransitionAnimations,
    ThreeDAnimations,
    AIChat,
    SortingVisualizations
  },
  data() {
    return {
      categories: [
        { id: 1, name: '数据可视化' },
        { id: 2, name: 'CSS动画' },
        { id: 3, name: '过渡动画' },
        { id: 4, name: '3D动画' },
        { id: 5, name: 'AI聊天' },
        { id: 6, name: '排序算法' }
      ],
      activeCategory: 1
    }
  },
  mounted() {

  },
  beforeUnmount() {

  },
  methods: {
    
  }
}
</script>

<style scoped>
/* 示例栏目页面容器 */
.animation-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 页面标题 */
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

/* 示例分类导航 */
.examples-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.example-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: white;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  outline: none;
}

.example-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #42b983;
}

.example-btn.active {
  background: #42b983;
  color: white;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

/* 示例内容区域 */
.examples-container {
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .examples-nav {
    gap: 0.5rem;
  }
  
  .example-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}
</style>