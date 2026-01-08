<template>
  <div class="home">
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
      recentArticles: [
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
        {
          id: 3,
          title: "JavaScript ES6+ 新特性实践",
          description: "掌握现代JavaScript开发必备特性",
          date: "2024-01-05",
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

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
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
  background: #f8f9fa;
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
    background: #f8f9fa;
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