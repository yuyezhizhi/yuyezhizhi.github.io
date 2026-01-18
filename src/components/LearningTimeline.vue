<template>
  <div class="learning-timeline-container">
    <h2 class="timeline-title">学习路径时间线</h2>
    <div class="timeline-wrapper">
      <div class="timeline-line"></div>
      <div 
        v-for="(item, index) in timelineItems" 
        :key="index"
        class="timeline-item"
        :class="{ 'left': index % 2 === 0, 'right': index % 2 !== 0 }"
        @click="toggleItem(index)"
      >
        <transition name="timeline-scale">
          <div class="timeline-dot" :class="{ 'active': activeItem === index }">
            <span class="dot-number">{{ index + 1 }}</span>
          </div>
        </transition>
        
        <transition name="timeline-slide">
          <div class="timeline-content" :class="{ 'active': activeItem === index }">
            <div class="content-header">
              <h3 class="item-title">{{ item.title }}</h3>
              <span class="item-period">{{ item.period }}</span>
            </div>
            <p class="item-description">{{ item.description }}</p>
            
            <transition name="timeline-fade">
              <div class="item-details" v-if="activeItem === index">
                <h4>学习内容：</h4>
                <ul class="skills-list">
                  <li v-for="(skill, skillIndex) in item.skills" :key="skillIndex">
                    <transition name="skill-item">
                      <span class="skill-tag">{{ skill }}</span>
                    </transition>
                  </li>
                </ul>
                <p class="item-achievement"><strong>成果：</strong>{{ item.achievement }}</p>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LearningTimeline',
  data() {
    return {
      activeItem: null,
      timelineItems: [
        {
          title: '前端基础入门',
          period: '2020.03 - 2020.06',
          description: '学习HTML、CSS和JavaScript基础知识，掌握网页开发的核心技术',
          skills: ['HTML5语义化标签', 'CSS3布局与动画', 'JavaScript基础语法', 'DOM操作'],
          achievement: '完成了10个静态网页项目，包括个人简历和响应式博客模板'
        },
        {
          title: 'JavaScript高级进阶',
          period: '2020.07 - 2020.12',
          description: '深入学习JavaScript高级特性，包括原型链、闭包、异步编程等',
          skills: ['ES6+特性', '异步编程(Async/Await)', '设计模式', '模块化开发'],
          achievement: '实现了一个完整的JavaScript库，包含常用工具函数和UI组件'
        },
        {
          title: 'Vue框架学习',
          period: '2021.01 - 2021.06',
          description: '学习Vue.js框架，掌握组件化开发和单页应用构建',
          skills: ['Vue基础', '组件通信', 'Vue Router', 'Vuex'],
          achievement: '开发了一个基于Vue的电商网站前端，包含商品展示、购物车等功能'
        },
        {
          title: '工程化与性能优化',
          period: '2021.07 - 2021.12',
          description: '学习前端工程化工具和性能优化技术',
          skills: ['Webpack', 'Vite', '性能优化策略', '代码分割'],
          achievement: '优化了现有项目，页面加载速度提升60%，构建时间减少50%'
        },
        {
          title: '3D与可视化',
          period: '2022.01 - 2022.06',
          description: '学习Three.js和数据可视化技术，实现3D效果和动态图表',
          skills: ['Three.js', 'WebGL', 'ECharts', 'D3.js'],
          achievement: '开发了多个3D动画效果和数据可视化图表，应用于个人博客'
        },
        {
          title: '全栈开发探索',
          period: '2022.07 - 至今',
          description: '学习Node.js和后端技术，探索全栈开发领域',
          skills: ['Node.js', 'Express', 'MongoDB', 'RESTful API'],
          achievement: '实现了个人博客的后端服务，包括文章管理、用户认证等功能'
        }
      ]
    }
  },
  mounted() {
    // 监听滚动事件，实现滚动动画
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1
    });

    // 观察所有时间线项目
    this.$nextTick(() => {
      const items = document.querySelectorAll('.timeline-item');
      items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        this.scrollObserver.observe(item);
      });
    });
  },
  beforeUnmount() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  },
  methods: {
    toggleItem(index) {
      this.activeItem = this.activeItem === index ? null : index;
    }
  }
}
</script>

<style scoped>
.learning-timeline-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.timeline-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #333;
  font-weight: bold;
}

.timeline-wrapper {
  position: relative;
  padding: 20px 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%);
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.timeline-item.left {
  justify-content: flex-end;
}

.timeline-item.right {
  justify-content: flex-start;
}

.timeline-dot {
  position: absolute;
  left: 50%;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border: 4px solid #4facfe;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.timeline-dot.active {
  background-color: #4facfe;
  transform: translateX(-50%) scale(1.3);
  border-color: #fff;
  box-shadow: 0 0 20px rgba(79, 172, 254, 0.6);
}

.dot-number {
  color: #4facfe;
  font-weight: bold;
  font-size: 14px;
}

.timeline-dot.active .dot-number {
  color: #fff;
}

.timeline-content {
  width: 40%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 0.8;
}

.timeline-content.active {
  opacity: 1;
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
  transform: translateY(-5px);
}

.left .timeline-content {
  margin-right: calc(50% + 30px);
  border-left: 4px solid #4facfe;
}

.right .timeline-content {
  margin-left: calc(50% + 30px);
  border-right: 4px solid #4facfe;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.item-period {
  font-size: 0.9rem;
  color: #4facfe;
  font-weight: bold;
  background-color: rgba(79, 172, 254, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
}

.item-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.item-details {
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.item-details h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1rem;
}

.skills-list {
  list-style: none;
  padding: 0;
  margin: 0 0 15px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background-color: #f0f8ff;
  color: #4facfe;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.item-achievement {
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* 过渡效果 */
.timeline-scale-enter-active,
.timeline-scale-leave-active {
  transition: all 0.3s ease;
}

.timeline-scale-enter-from,
.timeline-scale-leave-to {
  transform: translateX(-50%) scale(0.8);
  opacity: 0;
}

.timeline-slide-enter-active,
.timeline-slide-leave-active {
  transition: all 0.3s ease;
}

.timeline-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.timeline-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.timeline-slide-enter-from,
.timeline-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.timeline-slide-enter-from.right,
.timeline-slide-leave-to.right {
  transform: translateX(-30px);
}

.timeline-fade-enter-active,
.timeline-fade-leave-active {
  transition: opacity 0.3s ease;
}

.timeline-fade-enter-from,
.timeline-fade-leave-to {
  opacity: 0;
}

.skill-item-enter-active,
.skill-item-leave-active {
  transition: all 0.3s ease;
}

.skill-item-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.skill-item-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-line {
    left: 30px;
  }

  .timeline-item {
    justify-content: flex-start !important;
  }

  .timeline-dot {
    left: 30px;
  }

  .timeline-content {
    width: calc(100% - 80px);
    margin-left: 80px !important;
    margin-right: 0 !important;
    border-left: 4px solid #4facfe !important;
    border-right: none !important;
  }

  .timeline-title {
    font-size: 2rem;
  }

  .item-title {
    font-size: 1.3rem;
  }
}
</style>