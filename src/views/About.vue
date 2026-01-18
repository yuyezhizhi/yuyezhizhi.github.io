<template>
  <div class="about">
    <div class="container">
      <div class="about-content">
        <!-- 3D头像区域 -->
        <div class="avatar-section">
          <PersonalAvatar3D />
        </div>
        
        <div class="profile-section">
          <div class="profile-info">
            <h1>关于我</h1>
            <p class="intro">
              你好！我是 yuyezhizhi，一名热爱前端开发的技术爱好者。
              这个博客是我分享前端开发知识和学习心得的地方。
            </p>
            
            <!-- 技术栈可视化 -->
            <div class="skills">
              <h2>技术栈</h2>
              <div class="skills-visualization">
                <div ref="skillsChart" class="skills-chart"></div>
              </div>
              
              <div class="skill-tags">
                <span class="skill-tag" v-for="skill in skills" :key="skill.name">{{ skill.name }}</span>
              </div>
            </div>
            
            <div class="contact-info">
              <h2>联系我</h2>
              <div class="contact-links">
                <a href="https://github.com/yuyezhizhi" class="contact-link" target="_blank">
                  <span class="icon">📱</span>
                  GitHub
                </a>
                <div class="contact-link">
                  <span class="icon">✉️</span>
                  邮箱: daijiangzhi@163.com
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="blog-info">
          <h2>关于这个博客</h2>
          <div class="tech-stack">
            <h3>技术实现</h3>
            <ul>
              <li><strong>前端框架：</strong>Vue 3</li>
              <li><strong>构建工具：</strong>Vite</li>
              <li><strong>路由管理：</strong>Vue Router 4</li>
              <li><strong>部署平台：</strong>GitHub Pages</li>
              <li><strong>CI/CD：</strong>GitHub Actions</li>
            </ul>
          </div>
          
          <div class="features">
            <h3>博客特性</h3>
            <ul>
              <li>响应式设计，支持移动端访问</li>
              <li>文章分类和搜索功能</li>
              <li>代码高亮显示</li>
              <li>快速的文章导航</li>
              <li>现代化的UI设计</li>
            </ul>
          </div>
        </div>
        
        <!-- 学习路径时间线 -->
        <div class="timeline-section">
          <LearningTimeline />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import PersonalAvatar3D from '@/components/PersonalAvatar3D.vue';
import LearningTimeline from '@/components/LearningTimeline.vue';

export default {
  name: 'About',
  components: {
    PersonalAvatar3D,
    LearningTimeline
  },
  data() {
    return {
      skills: [
        { name: 'CSS3', value: 90 },
        { name: 'HTML5', value: 95 },
        { name: 'JavaScript', value: 88 },
        { name: 'TypeScript', value: 80 },
        { name: 'Vue', value: 92 },
        { name: 'React', value: 85 },
        { name: 'Vite', value: 88 },
        { name: 'Webpack', value: 82 },
        { name: 'Next.js', value: 75 },
        { name: 'Node.js', value: 78 }
      ],
      skillsChart: null
    };
  },
  mounted() {
    this.initSkillsChart();
  },
  beforeUnmount() {
    if (this.skillsChart) {
      this.skillsChart.dispose();
    }
  },
  methods: {
    initSkillsChart() {
      if (!this.$refs.skillsChart) return;
      
      this.skillsChart = echarts.init(this.$refs.skillsChart);
      
      const option = {
        title: {
          text: '技术栈熟练度',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        radar: {
          indicator: this.skills.map(skill => ({
            name: skill.name,
            max: 100
          })),
          shape: 'circle',
          splitNumber: 5,
          axisName: {
            color: '#333'
          },
          splitLine: {
            lineStyle: {
              color: '#e6e6e6'
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(78, 205, 196, 0.1)', 'rgba(78, 205, 196, 0.2)']
            }
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        series: [{
          name: '技术熟练度',
          type: 'radar',
          data: [{
            value: this.skills.map(skill => skill.value),
            name: '我的技能',
            areaStyle: {
              color: 'rgba(78, 205, 196, 0.3)'
            },
            lineStyle: {
              color: '#4ecdc4',
              width: 2
            },
            itemStyle: {
              color: '#4ecdc4'
            }
          }],
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return idx * 100;
          }
        }]
      };
      
      this.skillsChart.setOption(option);
      
      // 监听窗口大小变化
      window.addEventListener('resize', this.resizeSkillsChart);
    },
    resizeSkillsChart() {
      if (this.skillsChart) {
        this.skillsChart.resize();
      }
    }
  }
}
</script>

<style scoped lang="less">
.about {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-content {
  background: white;
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* 3D头像区域 */
.avatar-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.profile-section {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  align-items: start;
}

.profile-info h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.intro {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
}

.skills {
  margin-bottom: 2rem;
}

.skills h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  text-align: center;
}

/* 技能可视化图表 */
.skills-visualization {
  margin-bottom: 2rem;
  height: 300px;
}

.skills-chart {
  width: 100%;
  height: 100%;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.skill-tag {
  background: #f0f0f0;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background: #4ecdc4;
  color: white;
  transform: translateY(-2px);
}

.contact-info {
  margin-bottom: 2rem;
}

.contact-info h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  text-align: center;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #4ecdc4;
}

.contact-link .icon {
  font-size: 1.2rem;
}

.blog-info {
  margin-top: 3rem;
}

.blog-info h2 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  text-align: center;
}

.tech-stack, .features {
  margin-bottom: 2rem;
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
}

.tech-stack h3, .features h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.tech-stack ul, .features ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  color: #666;
}

.tech-stack li, .features li {
  margin-bottom: 0.5rem;
}

.tech-stack strong {
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-content {
    padding: 1.5rem;
  }
  
  .profile-info h1 {
    font-size: 2rem;
  }
  
  .skills-visualization {
    height: 250px;
  }
}
</style>