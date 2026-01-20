<template>
  <div class="home">
    <!-- 实时状态展示区 -->
    <section class="status-section">
      <div class="container">
        <div class="status-grid">
          <!-- 学习状态卡片 -->
          <div class="status-card fade-in">
            <div class="status-icon study">
              <i class="study-icon"></i>
            </div>
            <h3>学习状态</h3>
            <div class="status-info">
              <p class="status-text">{{ studyStatus }}</p>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: studyProgress + '%' }"></div>
              </div>
              <p class="progress-text">今日学习进度: {{ studyProgress }}%</p>
            </div>
          </div>
          
          <!-- 天气信息卡片 -->
          <div class="status-card fade-in">
            <div class="status-icon weather">
              <i class="weather-icon"></i>
            </div>
            <h3>当前天气</h3>
            <div class="status-info">
              <p class="weather-location">{{ weather.city }}, {{ weather.country }}</p>
              <div class="weather-main">
                <span class="weather-temp">{{ weather.temperature }}°C</span>
                <span class="weather-desc">{{ weather.description }}</span>
              </div>
              <div class="weather-details">
                <span>湿度: {{ weather.humidity }}%</span>
                <span>风速: {{ weather.windSpeed }} m/s</span>
              </div>
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
          id: 9,
          title: "Next.js + React 项目实战指南",
          description: "从项目初始化到部署上线，全面讲解Next.js与React结合开发的最佳实践和核心功能。",
          date: "2024-01-30",
        },
        {
          id: 1,
          title: "Vue 3 Composition API 详解",
          description: "深入理解Vue 3的Composition API及其优势",
          date: "2024-01-15",
        },
        {
          id: 2,
          title: "Vite vs Webpack 性能对比",
          description: "现代构建工具的性能分析和选择建议",
          date: "2024-01-10",
        },
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

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  padding: 4rem 0;
  text-align: center;
}

/* 实时状态展示样式 */
.status-section {
  padding: 2rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.status-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.status-icon.study {
  background: rgba(255, 206, 86, 0.3);
}

.status-icon.weather {
  background: rgba(54, 162, 235, 0.3);
}

.status-icon::before {
  font-size: 1.8rem;
}

.status-icon.study::before {
  content: "📚";
}

.status-icon.weather::before {
  content: "🌤️";
}

.status-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
}

.status-info {
  text-align: left;
}

.status-text {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd93d, #ff6b6b);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.weather-location {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.weather-temp {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.weather-desc {
  font-size: 1.1rem;
  text-transform: capitalize;
}

.weather-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .weather-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .weather-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  color: #555;
}

.cta-button {
  display: inline-block;
  background: white;
  color: #f87884;
  padding: 0.8rem 2rem;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 10px rgba(248, 120, 132, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
}

.features {
  padding: 4rem 0;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  color: #f87884;
  margin-bottom: 1rem;
}

.recent-articles {
  padding: 4rem 0;
}

.recent-articles h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}


.github-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.github-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(248, 120, 132, 0.15);
  border-color: rgba(248, 120, 132, 0.3);
}

.github-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.github-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  position: relative;
  overflow: hidden;
}

.github-avatar::before {
  content: "G";
}

.github-info h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}

.github-info .github-owner {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.github-description {
  color: #555;
  margin-bottom: 1.5rem;
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
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
/* 推荐资源模块样式 */
.resources {
  padding: 4rem 0;
  background-color: #fff5f5;
  margin-top: 4rem;
}

.resources .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.resources h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.resource-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(248, 120, 132, 0.15);
  border-color: rgba(248, 120, 132, 0.3);
}

.resource-card h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #f87884;
  font-weight: 600;
  border-bottom: 2px solid #f87884;
  padding-bottom: 0.8rem;
}

.resource-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.resource-card li {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.resource-card li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: #f87884;
  font-weight: bold;
}

.resource-card a {
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.resource-card a:hover {
  color: #f87884;
  transform: translateX(5px);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #666;
  font-size: 0.9rem;
}

.stat-item::before {
  font-size: 1.1rem;
}

.stat-item:nth-child(1)::before {
  content: "★";
  color: #f1c40f;
}

.stat-item:nth-child(2)::before {
  content: "⑂";
  color: #3498db;
}

.stat-item:nth-child(3)::before {
  content: "●";
  font-size: 0.7rem;
}

.github-link {
  display: inline-block;
  background: rgba(248, 120, 132, 0.1);
  color: #f87884;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(248, 120, 132, 0.3);
}

.github-link:hover {
  background: #f87884;
  color: white;
  transform: translateY(-2px);
}

.article-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.article-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.article-card p {
  color: #666;
  margin-bottom: 1rem;
}

.date {
  color: #999;
  font-size: 0.9rem;
}

.read-more {
  display: inline-block;
  color: #f87884;
  text-decoration: none;
  font-weight: bold;
  margin-top: 1rem;
  transition: color 0.3s;
}

.read-more:hover {
  color: #f55668;
}

/* 滚动渐入动画 */
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

/* 添加交错动画延迟 */
.feature-card:nth-child(2) {
  transition-delay: 0.2s;
}

.feature-card:nth-child(3) {
  transition-delay: 0.4s;
}

.feature-card:nth-child(4) {
  transition-delay: 0.6s;
}

.article-card:nth-child(2) {
  transition-delay: 0.2s;
}

.article-card:nth-child(3) {
  transition-delay: 0.4s;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .feature-grid,
  .articles-grid {
    grid-template-columns: 1fr;
  }

  /* GitHub 热门趋势样式 */
.github-trending {
  padding: 4rem 0;
  background: white;
}

.github-trending h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

  .github-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  /* 推荐资源样式 */
  .resources {
    padding: 4rem 0;
  }

  .resources h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .resource-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .resource-card h3 {
    color: #667eea;
    margin-bottom: 1.5rem;
  }

  .resource-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .resource-card li {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    position: relative;
  }

  .resource-card li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: #667eea;
  }

  .resource-card a {
    color: #333;
    text-decoration: none;
    transition: color 0.3s;
  }

  .resource-card a:hover {
    color: #667eea;
    text-decoration: underline;
  }

  /* 移动端减少动画延迟 */
  .feature-card:nth-child(2),
  .feature-card:nth-child(3),
  .feature-card:nth-child(4),
  .article-card:nth-child(2),
  .article-card:nth-child(3),
  .github-card:nth-child(2),
  .github-card:nth-child(3),
  .github-card:nth-child(4) {
    transition-delay: 0.1s;
  }
}
</style>