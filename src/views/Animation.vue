<template>
  <div class="animation-page">
    <div class="container">
      <h1 class="animate__animated animate__fadeInDown">示例栏目</h1>
      
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
        <div v-if="activeCategory === 1" class="category-section">
          <h2 class="section-title animate__animated animate__slideInLeft">数据可视化</h2>
          <div class="charts-container">
            <!-- 前端开发仓库排名 - 柱状图 -->
            <div class="example-item chart-item animate__animated animate__zoomIn">
              <div class="example-header">
                <h3>前端开发仓库排名</h3>
                <span class="example-type">柱状图</span>
              </div>
              <div id="repoChart" class="chart"></div>
            </div>
            
            <!-- 前端开发工具使用率 - 饼图 -->
            <div class="example-item chart-item animate__animated animate__zoomIn" style="animation-delay: 0.2s">
              <div class="example-header">
                <h3>前端开发工具使用率</h3>
                <span class="example-type">饼图</span>
              </div>
              <div id="toolChart" class="chart"></div>
            </div>
            
            <!-- AI工具使用率 - 折线图 -->
            <div class="example-item chart-item animate__animated animate__zoomIn" style="animation-delay: 0.4s">
              <div class="example-header">
                <h3>AI工具使用率趋势</h3>
                <span class="example-type">折线图</span>
              </div>
              <div id="aiChart" class="chart"></div>
            </div>
          </div>
        </div>
        
        <!-- CSS动画示例 -->
        <div v-if="activeCategory === 2" class="category-section">
          <h2 class="section-title animate__animated animate__slideInLeft">CSS动画</h2>
          <div class="css-animations-container">
            <!-- 旋转动画示例 -->
            <div class="example-item css-animation-item animate__animated animate__fadeInUp">
              <div class="example-header">
                <h3>旋转动画</h3>
                <span class="example-type">CSS</span>
              </div>
              <div @mouseenter="triggerAnimation($event, 'animate__rotateIn infinite animate__slow')" class="animation-demo">
                <div class="animated-box animate__animated"></div>
              </div>
            </div>
            
            <!-- 弹跳动画示例 -->
            <div class="example-item css-animation-item animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
              <div class="example-header">
                <h3>弹跳动画</h3>
                <span class="example-type">CSS</span>
              </div>
              <div @mouseenter="triggerAnimation($event, 'animate__bounce infinite animate__slow')" class="animation-demo">
                <div class="animated-box bounce-box animate__animated"></div>
              </div>
            </div>
            
            <!-- 脉冲动画示例 -->
            <div class="example-item css-animation-item animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
              <div class="example-header">
                <h3>脉冲动画</h3>
                <span class="example-type">CSS</span>
              </div>
              <div @mouseenter="triggerAnimation($event, 'animate__pulse infinite animate__slow')" class="animation-demo">
                <div class="animated-box pulse-box animate__animated"></div>
              </div>
            </div>
            
            <!-- 摇摆动画示例 -->
            <div class="example-item css-animation-item animate__animated animate__fadeInUp" style="animation-delay: 0.6s">
              <div class="example-header">
                <h3>摇摆动画</h3>
                <span class="example-type">CSS</span>
              </div>
              <div @mouseenter="triggerAnimation($event, 'animate__swing infinite animate__slow')" class="animation-demo">
                <div class="animated-box swing-box animate__animated"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 过渡动画示例 -->
        <div v-if="activeCategory === 3" class="category-section">
          <h2 class="section-title animate__animated animate__slideInLeft">过渡动画</h2>
          <div class="transition-container">
            <div class="example-item transition-item animate__animated animate__fadeIn">
              <div class="example-header">
                <h3>淡入淡出过渡</h3>
                <span class="example-type">Vue Transition</span>
              </div>
              <div class="transition-demo">
                <button @click="showBox = !showBox" class="toggle-btn">切换显示</button>
                <transition name="fade">
                  <div v-if="showBox" class="transition-box"></div>
                </transition>
              </div>
            </div>
            
            <div class="example-item transition-item animate__animated animate__fadeIn" style="animation-delay: 0.2s">
              <div class="example-header">
                <h3>滑动过渡</h3>
                <span class="example-type">Vue Transition</span>
              </div>
              <div class="transition-demo">
                <button @click="showSlideBox = !showSlideBox" class="toggle-btn">切换显示</button>
                <transition name="slide">
                  <div v-if="showSlideBox" class="transition-box slide-box"></div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'animate.css'

export default {
  name: 'Animation',
  data() {
    return {
      categories: [
        { id: 1, name: '数据可视化' },
        { id: 2, name: 'CSS动画' },
        { id: 3, name: '过渡动画' }
      ],
      activeCategory: 1,
      showBox: false,
      showSlideBox: false
    }
  },
  mounted() {
    this.initRepoChart()
    this.initToolChart()
    this.initAiChart()
    
    // 监听分类切换，重新初始化图表
    this.$watch('activeCategory', (newCategory) => {
      if (newCategory === 1) {
        // 延迟初始化图表，确保DOM已渲染
        setTimeout(() => {
          this.initRepoChart()
          this.initToolChart()
          this.initAiChart()
        }, 100)
      }
    })
  },
  beforeUnmount() {
    // 销毁图表实例
    if (this.repoChart) {
      this.repoChart.dispose()
    }
    if (this.toolChart) {
      this.toolChart.dispose()
    }
    if (this.aiChart) {
      this.aiChart.dispose()
    }
  },
  methods: {
    // 触发动画效果
    triggerAnimation(event, animationClass) {
      const element = event.currentTarget;
      // 移除所有animate.css动画类
      element.classList.remove(...Array.from(element.classList).filter(cls => cls.startsWith('animate__')));
      // 保留基础类
      element.classList.add('animate__animated');
      // 添加新动画类
      animationClass.split(' ').forEach(cls => {
        element.classList.add(cls);
      });
      // 清除动画结束事件
      const handleAnimationEnd = () => {
        element.classList.remove(...animationClass.split(' '));
        element.removeEventListener('animationend', handleAnimationEnd);
      };
      // 监听动画结束事件
      element.addEventListener('animationend', handleAnimationEnd);
    },
    initRepoChart() {
      // 前端开发仓库排名数据
      const repoData = {
        names: ['Vue.js', 'React', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Vite', 'Webpack'],
        stars: [205000, 220000, 88000, 74000, 120000, 50000, 78000, 64000]
      }
      
      // 初始化图表
      this.repoChart = echarts.init(document.getElementById('repoChart'))
      
      // 配置图表
      const option = {
        title: {
          text: 'GitHub Stars 排名',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: repoData.names,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: 'Stars'
        },
        series: [
          {
            name: 'Stars',
            type: 'bar',
            data: repoData.stars,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ]),
              borderRadius: [5, 5, 0, 0]
            },
            animationDelay: function (idx) {
              return idx * 100
            }
          }
        ],
        animationEasing: 'elasticOut'
      }
      
      // 设置图表选项
      this.repoChart.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', () => {
        this.repoChart.resize()
      })
    },
    
    initToolChart() {
      // 前端开发工具使用率数据
      const toolData = [
        { value: 45, name: 'Visual Studio Code' },
        { value: 15, name: 'WebStorm' },
        { value: 10, name: 'Sublime Text' },
        { value: 8, name: 'Atom' },
        { value: 7, name: 'Vim' },
        { value: 5, name: 'IntelliJ IDEA' },
        { value: 10, name: '其他' }
      ]
      
      // 初始化图表
      this.toolChart = echarts.init(document.getElementById('toolChart'))
      
      // 配置图表
      const option = {
        title: {
          text: '开发工具使用占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}% ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: toolData.map(item => item.name)
        },
        series: [
          {
            name: '使用率',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: toolData
          }
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut'
      }
      
      // 设置图表选项
      this.toolChart.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', () => {
        this.toolChart.resize()
      })
    },
    
    initAiChart() {
      // AI工具使用率趋势数据
      const aiData = {
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        usage: [15, 20, 28, 35, 42, 48, 55, 62, 68, 72, 78, 85]
      }
      
      // 初始化图表
      this.aiChart = echarts.init(document.getElementById('aiChart'))
      
      // 配置图表
      const option = {
        title: {
          text: 'AI辅助开发工具使用率',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: aiData.months
        },
        yAxis: {
          type: 'value',
          name: '使用率 (%)'
        },
        series: [
          {
            name: '使用率',
            type: 'line',
            data: aiData.usage,
            smooth: true,
            itemStyle: {
              color: '#5470c6'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(84, 112, 198, 0.8)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
              ])
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ],
        animationEasing: 'cubicOut'
      }
      
      // 设置图表选项
      this.aiChart.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', () => {
        this.aiChart.resize()
      })
    }
  }
}
</script>

<style scoped>
.animation-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
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
  background: #fff;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  outline: none;
}

.example-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.example-btn.active {
  background: #42b983;
  color: white;
}

/* 示例内容区域 */
.examples-container {
  margin-bottom: 2rem;
}

.category-section {
  animation: fadeIn 0.5s ease-in;
}

.section-title {
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #42b983;
  display: inline-block;
}

/* 示例项通用样式 */
.example-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 3px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.example-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 25px rgba(0,0,0,0.15);
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.example-header h3 {
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.example-type {
  background: #42b983;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 数据可视化示例 */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart {
  width: 100%;
  height: 400px;
}

/* CSS动画示例 */
.css-animations-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.animation-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.animated-box {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}

.bounce-box {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.pulse-box {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.swing-box {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* 过渡动画示例 */
.transition-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.transition-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

.toggle-btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: #42b983;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: #359867;
  transform: translateY(-2px);
}

.transition-box {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 8px;
}

.slide-box {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

/* Vue过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 动画定义 */
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
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .css-animations-container {
    grid-template-columns: 1fr;
  }
  
  .transition-container {
    grid-template-columns: 1fr;
  }
  
  .chart {
    height: 300px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
</style>