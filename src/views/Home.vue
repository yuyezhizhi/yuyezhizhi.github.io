<template>
  <div class="home">
    <!-- 实时状态展示区 -->
    <section class="status-section">
      <div class="container">
        <div class="status-flex">
          <!-- 学习状态卡片 -->
          <div class="status-card fade-in">
            <div class="status-icon study"></div>
            <div class="status-content">
              <h3>学习</h3>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: studyProgress + '%' }"></div>
              </div>
              <p>{{ studyStatus }}</p>
            </div>
          </div>
          
          <!-- 天气信息卡片 -->
          <div class="status-card fade-in">
            <div class="status-icon weather"></div>
            <div class="status-content">
              <h3>天气</h3>
              <p class="weather-temp">{{ weather.temperature }}°C</p>
              <p class="weather-desc">{{ weather.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="hero">
      <div class="hero-content">
        <h1>欢迎来到前端知识库</h1>
        <p>分享前端开发技术、Vue、React、JavaScript等知识</p>
        <router-link to="/articles" class="cta-button">浏览文章</router-link>
      </div>
    </section>
    <section class="recent-articles fade-in">
      <div class="container">
        <h2>最新文章</h2>
        <div class="articles-grid">
          <div
            v-for="article in recentArticles"
            :key="article.id"
            class="article-card fade-in"
          >
            <h3>{{ article.title }}</h3>
            <p>{{ article.description }}</p>
            <span class="date">{{ article.date }}</span>
            <router-link :to="`/article/${article.id}`" class="read-more"
              >阅读更多</router-link
            >
          </div>
        </div>
      </div>
    </section>

    <section class="github-trending fade-in">
      <div class="container">
        <h2>GitHub 热门趋势</h2>
        <div class="github-grid">
          <div
            v-for="repo in githubTrending"
            :key="repo.id"
            class="github-card fade-in"
          >
            <div class="github-header">
              <div
                class="github-avatar"
                :style="{ backgroundColor: repo.color }"
              >
                <i class="github-icon"></i>
              </div>
              <div class="github-info">
                <h3>{{ repo.name }}</h3>
                <p class="github-owner">{{ repo.owner }}</p>
              </div>
            </div>
            <p class="github-description">{{ repo.description }}</p>
            <div class="github-stats">
              <span class="stat-item">
                <i class="star-icon"></i> {{ repo.stars }}
              </span>
              <span class="stat-item">
                <i class="fork-icon"></i> {{ repo.forks }}
              </span>
              <span class="stat-item">
                <i class="language-icon"></i> {{ repo.language }}
              </span>
            </div>
            <a
              :href="repo.url"
              target="_blank"
              rel="noopener noreferrer"
              class="github-link"
              >查看仓库</a
            >
          </div>
        </div>
      </div>
    </section>

    <section class="resources fade-in">
      <div class="container">
        <h2>推荐资源</h2>
        <div class="resources-grid">
          <div class="resource-card fade-in">
            <h3>在线文档</h3>
            <ul>
              <li>
                <a
                  href="https://vuejs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Vue.js 官方文档</a
                >
              </li>
              <li>
                <a
                  href="https://reactjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >React 官方文档</a
                >
              </li>
              <li>
                <a
                  href="https://developer.mozilla.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >MDN Web Docs</a
                >
              </li>
            </ul>
          </div>
          <div class="resource-card fade-in">
            <h3>学习平台</h3>
            <ul>
              <li>
                <a
                  href="https://leetcode.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >LeetCode</a
                >
              </li>
              <li>
                <a
                  href="https://freecodecamp.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >freeCodeCamp</a
                >
              </li>
              <li>
                <a
                  href="https://coursera.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Coursera</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 学习状态数据
      studyStatus: '学习中',
      studyProgress: 65,
      
      // 天气数据 (初始模拟数据)
      weather: {
        city: '北京',
        country: 'CN',
        temperature: 22,
        description: '晴',
        humidity: 45,
        windSpeed: 2.5,
        icon: '☀️'
      },
      
      recentArticles: [
    {
      id: 17,
      title: '2026年AI技术发展趋势预测',
      description: '展望2026年AI技术的发展趋势，包括生成式AI、AI基础设施和各行业应用',
      date: '2026-12-15'
    },
    {
      id: 18,
      title: '生成式AI在企业中的应用与实践',
      description: '探讨生成式AI在企业中的应用价值、案例和实施建议',
      date: '2026-11-20'
    },
    {
      id: 19,
      title: 'AI伦理与法规：全球发展与挑战',
      description: '分析全球AI伦理与法规的发展现状、核心原则和企业应对策略',
      date: '2026-10-08'
    },
    {
      id: 20,
      title: '量子计算与AI的融合发展',
      description: '探讨量子计算与AI的融合发展、技术影响和应用前景',
      date: '2026-09-12'
    },
    {
      id: 21,
      title: 'AI辅助软件开发的未来',
      description: '展望AI辅助软件开发的演进、核心功能和对行业的影响',
      date: '2026-08-25'
    }
  ],
      githubTrending: [
        {
          id: 1,
          name: "vue",
          owner: "vuejs",
          description:
            "🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
          stars: "203k",
          forks: "33k",
          language: "JavaScript",
          color: "#f1e05a",
          url: "https://github.com/vuejs/vue",
        },
        {
          id: 2,
          name: "react",
          owner: "facebook",
          description:
            "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
          stars: "210k",
          forks: "45k",
          language: "JavaScript",
          color: "#61dafb",
          url: "https://github.com/facebook/react",
        },
        {
          id: 3,
          name: "vite",
          owner: "vitejs",
          description: "Next generation frontend tooling. It's fast!",
          stars: "62k",
          forks: "4k",
          language: "JavaScript",
          color: "#646cff",
          url: "https://github.com/vitejs/vite",
        },
        {
          id: 4,
          name: "tailwindcss",
          owner: "tailwindlabs",
          description:
            "A utility-first CSS framework for rapidly building custom designs.",
          stars: "68k",
          forks: "3k",
          language: "JavaScript",
          color: "#38bdf8",
          url: "https://github.com/tailwindlabs/tailwindcss",
        },
      ],
      observer: null,
    };
  },
  mounted() {
    // 初始化Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-active");
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // 观察所有需要渐入的元素
    this.$nextTick(() => {
      const fadeElements = document.querySelectorAll(".fade-in");
      fadeElements.forEach((element) => {
        this.observer.observe(element);
      });
    });
    
    // 获取天气数据
    this.fetchWeatherData();
    
    // 模拟学习状态更新
    this.startStudyProgressUpdate();
  },
  methods: {
    // 获取天气数据
    fetchWeatherData() {
      // 使用OpenWeatherMap API获取天气数据
      // 注意：需要替换为自己的API密钥
      const apiKey = 'YOUR_API_KEY'; // 请注册OpenWeatherMap获取免费API密钥
      const city = 'Beijing';
      const countryCode = 'CN';
      
      // 真实API调用（需要替换API密钥才能工作）
      /*
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
          this.weather = {
            city: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
          };
        })
        .catch(error => {
          console.error('获取天气数据失败:', error);
          // 使用模拟数据
          this.weather = {
            city: '北京',
            country: 'CN',
            temperature: 22,
            description: '晴',
            humidity: 45,
            windSpeed: 2.5
          };
        });
      */
      
      // 模拟天气数据更新
      setTimeout(() => {
        const weatherData = [
          { city: '北京', country: 'CN', temperature: 22, description: '晴', humidity: 45, windSpeed: 2.5 },
          { city: '上海', country: 'CN', temperature: 26, description: '多云', humidity: 60, windSpeed: 3.2 },
          { city: '广州', country: 'CN', temperature: 30, description: '小雨', humidity: 75, windSpeed: 1.8 }
        ];
        this.weather = weatherData[Math.floor(Math.random() * weatherData.length)];
      }, 1000);
    },
    
    // 模拟学习进度更新
    startStudyProgressUpdate() {
      // 随机更新学习进度
      setInterval(() => {
        const increment = Math.random() * 5;
        this.studyProgress = Math.min(100, this.studyProgress + increment);
        
        // 根据进度更新学习状态文本
        if (this.studyProgress < 30) {
          this.studyStatus = '刚开始学习';
        } else if (this.studyProgress < 70) {
          this.studyStatus = '学习进行中';
        } else if (this.studyProgress < 100) {
          this.studyStatus = '即将完成今日学习';
        } else {
          this.studyStatus = '今日学习已完成！';
        }
      }, 5000);
    }
  },
  beforeUnmount() {
    // 清理Observer
    if (this.observer) {
      this.observer.disconnect();
    }
  },
};
</script>

<style lang="less" scoped>
// 优化后的Less样式代码 - 保持视觉效果不变

// 颜色变量 - 提取所有使用的颜色
@primary-color: #f87884;
@primary-hover: #f55668;
@white: white;
@light-gray: #f0f0f0;
@dark-gray: #333;
@medium-gray: #555;
@light-text: #666;
@very-light-text: #999;
@gradient-start: #667eea;
@gradient-end: #764ba2;
@progress-start: #ffd93d;
@progress-end: #ff6b6b;
@star-color: #f1c40f;
@fork-color: #3498db;

// 尺寸变量
@border-radius: 12px;
@border-radius-sm: 10px;
@border-radius-xs: 8px;
@border-radius-circle: 50%;
@container-width: 1200px;
@padding-sm: 1rem;
@padding-md: 2rem;
@padding-lg: 2.5rem;
@margin-sm: 1rem;
@margin-md: 1.5rem;
@margin-lg: 2rem;
@margin-xl: 3rem;
@margin-xxl: 4rem;
@icon-size: 60px;
@avatar-size: 48px;

// 阴影和过渡
@box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
@box-shadow-hover: 0 8px 25px rgba(248, 120, 132, 0.15);
@box-shadow-card: 0 2px 10px rgba(0, 0, 0, 0.1);
@transition: all 0.3s ease;
@transition-transform: transform 0.3s;

// 字体大小
@font-size-xs: 0.9rem;
@font-size-sm: 1rem;
@font-size-md: 1.1rem;
@font-size-lg: 1.3rem;
@font-size-xl: 1.5rem;
@font-size-xxl: 2.5rem;
@font-size-xxxl: 3rem;

// 可复用的mixin
.container-mixin {
  max-width: @container-width;
  margin: 0 auto;
  padding: 0 2rem;
}

.card-base {
  background: @white;
  padding: @padding-md;
  border-radius: @border-radius;
  box-shadow: @box-shadow;
  transition: @transition;
  border: 1px solid @light-gray;
}

.card-hover {
  &:hover {
    transform: translateY(-5px);
    box-shadow: @box-shadow-hover;
    border-color: rgba(@primary-color, 0.3);
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  will-change: opacity, transform;
}

.fade-in-active {
  opacity: 1;
  transform: translateY(0);
}

.text-center {
  text-align: center;
}

.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: @margin-lg;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.grid-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: @margin-lg;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

// 主样式
.home {
  min-height: 100vh;
}

/* 实时状态展示样式 - 进一步缩小视觉占比 */
.status-section {
  padding: 0.2rem 0; /* 进一步减小上下内边距 */
  color: @white;
  
  .container {
    .container-mixin;
    padding: 0;
  }
  
  .status-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .status-card {
    background: linear-gradient(135deg, @gradient-start 0%, @gradient-end 100%);
    padding: 0.4rem 0.5rem; /* 进一步减小内边距 */
    border-radius: @border-radius-xs; /* 使用最小边框半径 */
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: @transition;
    min-height: auto;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    width: auto;
    
    &:hover {
      transform: scale(1.2); 
      background: linear-gradient(135deg, @gradient-start 0%, @gradient-end 100%);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03); 
    }
    
    .status-icon {
      width: 20px; 
      height: 20px;
      border-radius: @border-radius-circle;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      &::before {
        font-size: 0.7rem; 
      }
      
      &.study {
        background: rgba(255, 206, 86, 0.3);
        
        &::before {
          content: "📚";
        }
      }
      
      &.weather {
        background: rgba(54, 162, 235, 0.3);
        
        &::before {
          content: "🌤️";
        }
      }
    }
    
    .status-content {
      flex: 0 0 auto;
      min-width: 0;
      
      h3 {
        margin: 0 0 0.2rem 0; /* 进一步减小间距 */
        font-size: 0.75rem; /* 进一步减小标题字体 */
        font-weight: 500; /* 降低字重 */
        color: @white;
      }
      
      p {
        font-size: 0.65rem; /* 进一步减小文本大小 */
        margin: 0;
        opacity: 0.9;
      }
      
      .progress-bar {
        width: 70px; /* 减小进度条宽度 */
        height: 3px; /* 进一步减小进度条高度 */
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.2rem; /* 进一步减小间距 */
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, @progress-start, @progress-end);
          border-radius: 2px;
          transition: width 0.5s ease;
        }
      }
      
      .weather-temp {
        font-size: 0.7rem; /* 进一步减小温度字体 */
        font-weight: 600; /* 降低字重 */
        line-height: 1;
        margin-bottom: 0.1rem;
      }
      
      .weather-desc {
        font-size: 0.6rem; /* 进一步减小描述字体 */
        text-transform: capitalize;
      }
    }
  }
}

// Hero 部分
.hero {
  padding: @margin-xxl 0;
  text-align: center;
  
  .hero-content {
    h1 {
      font-size: @font-size-xxxl;
      margin-bottom: @margin-sm;
      color: @dark-gray;
      
      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
    
    p {
      font-size: @font-size-md;
      margin-bottom: @margin-lg;
      opacity: 0.9;
      color: @medium-gray;
    }
    
    .cta-button {
      display: inline-block;
      background: @white;
      color: @primary-color;
      padding: 0.8rem 2rem;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 2px 10px rgba(@primary-color, 0.3);
      
      &:hover {
        transform: translateY(-2px);
      }
    }
  }
}



// 最新文章部分
.recent-articles {
  padding: @margin-xxl 0;
  
  .container {
    .container-mixin;
  }
  
  h2 {
    .text-center;
    font-size: @font-size-xxl;
    margin-bottom: @margin-xl;
    color: @dark-gray;
  }
  
  .articles-grid {
    .grid-responsive;
  }
  
  .article-card {
    background: @white;
    padding: @padding-md;
    border-radius: @border-radius-sm;
    box-shadow: @box-shadow-card;
    
    h3 {
      color: @dark-gray;
      margin-bottom: @margin-sm;
    }
    
    p {
      color: @light-text;
      margin-bottom: @margin-sm;
    }
    
    .date {
      color: @very-light-text;
      font-size: @font-size-xs;
    }
    
    .read-more {
      display: inline-block;
      color: @primary-color;
      text-decoration: none;
      font-weight: bold;
      margin-top: @margin-sm;
      transition: color 0.3s;
      
      &:hover {
        color: @primary-hover;
      }
    }
    
    &:nth-child(2) { transition-delay: 0.2s; }
    &:nth-child(3) { transition-delay: 0.4s; }
  }
}

// GitHub 热门趋势部分
.github-trending {
  padding: @margin-xxl 0;
  
  .container {
    .container-mixin;
  }
  
  h2 {
    .text-center;
    font-size: @font-size-xxl;
    margin-bottom: @margin-xl;
    color: @dark-gray;
  }
  
  .github-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: @margin-lg;
  }
  
  .github-card {
    .card-base;
    .card-hover;
    
    .github-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: @margin-sm;
      
      .github-avatar {
        width: @avatar-size;
        height: @avatar-size;
        border-radius: @border-radius-circle;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @white;
        font-weight: bold;
        font-size: 1.5rem;
        position: relative;
        overflow: hidden;
        
        &::before {
          content: "G";
        }
      }
      
      .github-info {
        h3 {
          margin: 0;
          font-size: @font-size-lg;
          color: @dark-gray;
        }
        
        .github-owner {
          margin: 0;
          font-size: @font-size-xs;
          color: @light-text;
        }
      }
    }
    
    .github-description {
      color: @medium-gray;
      margin-bottom: @margin-md;
      line-height: 1.6;
      font-size: 0.95rem;
      overflow: hidden;
      display: -webkit-box;
      line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    
    .github-stats {
      display: flex;
      gap: 1.5rem;
      margin-bottom: @margin-md;
      flex-wrap: wrap;
      
      .stat-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: @light-text;
        font-size: @font-size-xs;
        
        &::before {
          font-size: 1.1rem;
        }
        
        &:nth-child(1)::before {
          content: "★";
          color: @star-color;
        }
        
        &:nth-child(2)::before {
          content: "⑂";
          color: @fork-color;
        }
        
        &:nth-child(3)::before {
          content: "●";
          font-size: 0.7rem;
        }
      }
    }
    
    .github-link {
      display: inline-block;
      background: rgba(@primary-color, 0.1);
      color: @primary-color;
      text-decoration: none;
      padding: 0.6rem 1.2rem;
      border-radius: @border-radius-xs;
      font-weight: 500;
      transition: @transition;
      border: 1px solid rgba(@primary-color, 0.3);
      
      &:hover {
        background: @primary-color;
        color: @white;
        transform: translateY(-2px);
      }
    }
  }
}

// 推荐资源部分
.resources {
  padding: @margin-xxl 0;
  background-color: #fff5f5;
  margin-top: @margin-xxl;
  
  .container {
    .container-mixin;
  }
  
  h2 {
    .text-center;
    font-size: @font-size-xxl;
    margin-bottom: @margin-xl;
    color: @dark-gray;
  }
  
  .resources-grid {
    .grid-responsive;
  }
  
  .resource-card {
    .card-base;
    padding: @padding-lg;
    .card-hover;
    
    h3 {
      margin-top: 0;
      margin-bottom: @margin-md;
      font-size: @font-size-xl;
      color: @primary-color;
      font-weight: 600;
      border-bottom: 2px solid @primary-color;
      padding-bottom: 0.8rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: @margin-sm;
        padding-left: 1.5rem;
        position: relative;
        
        &::before {
          content: "→";
          position: absolute;
          left: 0;
          color: @primary-color;
          font-weight: bold;
        }
        
        a {
          color: @dark-gray;
          text-decoration: none;
          transition: @transition;
          display: inline-block;
          
          &:hover {
            color: @primary-color;
            transform: translateX(5px);
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  // 移动端减少动画延迟
  .article-card,
  .github-card {
    &:nth-child(2), &:nth-child(3), &:nth-child(4) {
      transition-delay: 0.1s;
    }
  }
  
  // GitHub 热门趋势移动端样式
  .github-grid {
    .grid-responsive;
  }
  
  // 推荐资源移动端样式
  .resources {
    padding: @margin-xxl 0;
    
    .resource-card {
      padding: @padding-md;
      border-radius: @border-radius-sm;
      box-shadow: @box-shadow-card;
      
      h3 {
        color: @gradient-start;
        margin-bottom: @margin-md;
      }
      
      li::before {
        color: @gradient-start;
      }
      
      a {
        transition: color 0.3s;
        
        &:hover {
          color: @gradient-start;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>