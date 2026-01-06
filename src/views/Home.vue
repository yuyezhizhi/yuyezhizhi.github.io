<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>欢迎来到前端知识库</h1>
        <p>分享前端开发技术、Vue、React、JavaScript等知识</p>
        <router-link to="/articles" class="cta-button">浏览文章</router-link>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>技术栈</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>Vue 3</h3>
            <p>渐进式JavaScript框架，构建用户界面</p>
          </div>
          <div class="feature-card">
            <h3>Vite</h3>
            <p>下一代前端构建工具，快速开发体验</p>
          </div>
          <div class="feature-card">
            <h3>JavaScript</h3>
            <p>Web开发的核心语言，现代ES6+特性</p>
          </div>
          <div class="feature-card">
            <h3>CSS3</h3>
            <p>样式设计，响应式布局和动画效果</p>
          </div>
        </div>
      </div>
    </section>

    <section class="recent-articles">
      <div class="container">
        <h2>最新文章</h2>
        <div class="articles-grid">
          <div v-for="article in recentArticles" :key="article.id" class="article-card">
            <h3>{{ article.title }}</h3>
            <p>{{ article.description }}</p>
            <span class="date">{{ article.date }}</span>
            <router-link :to="`/article/${article.id}`" class="read-more">阅读更多</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      recentArticles: [
        {
          id: 1,
          title: 'Vue 3 Composition API 详解',
          description: '深入理解Vue 3的Composition API及其优势',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Vite vs Webpack 性能对比',
          description: '现代构建工具的性能分析和选择建议',
          date: '2024-01-10'
        },
        {
          id: 3,
          title: 'JavaScript ES6+ 新特性实践',
          description: '掌握现代JavaScript开发必备特性',
          date: '2024-01-05'
        }
      ]
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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
  color: #667eea;
  padding: 0.8rem 2rem;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: transform 0.3s;
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
  color: #667eea;
  margin-bottom: 1rem;
}

.recent-articles {
  padding: 4rem 0;
  background: #f8f9fa;
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

.article-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .feature-grid,
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>