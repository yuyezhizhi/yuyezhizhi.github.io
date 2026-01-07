<template>
  <div class="articles">
    <div class="container">
      <h1>前端开发文章</h1>
      <div class="filter-section">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索文章..." 
          class="search-input"
        >
        <select v-model="selectedCategory" class="category-select">
          <option value="">所有分类</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <div class="articles-list">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id" 
          class="article-item"
        >
          <div class="article-content">
            <h2>{{ article.title }}</h2>
            <p class="article-description">{{ article.description }}</p>
            <div class="article-meta">
              <span class="category">{{ article.category }}</span>
              <span class="date">{{ article.date }}</span>
              <span class="read-time">{{ article.readTime }}</span>
            </div>
            <router-link :to="`/article/${article.id}`" class="read-more">
              阅读全文 →
            </router-link>
          </div>
        </div>
      </div>
      
      <div v-if="filteredArticles.length === 0" class="no-results">
        <p>没有找到相关文章</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Articles',
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      articles: [
        {
          id: 1,
          title: 'Vue 3 Composition API 详解',
          description: '深入理解Vue 3的Composition API及其优势，包括setup函数、ref、reactive等核心概念的使用方法和最佳实践。',
          category: 'Vue',
          date: '2024-01-15',
          readTime: '10分钟阅读'
        },
        {
          id: 2,
          title: 'Vite vs Webpack 性能对比',
          description: '详细对比Vite和Webpack在开发环境、构建速度、热更新等方面的性能差异，帮助你选择合适的构建工具。',
          category: '构建工具',
          date: '2024-01-10',
          readTime: '8分钟阅读'
        },
        {
          id: 3,
          title: 'JavaScript ES6+ 新特性实践',
          description: '全面介绍ES6及后续版本的新特性，包括箭头函数、解构赋值、模板字符串、Promise等实用功能。',
          category: 'JavaScript',
          date: '2024-01-05',
          readTime: '12分钟阅读'
        },
        {
          id: 4,
          title: 'CSS Grid 布局完全指南',
          description: '掌握CSS Grid布局的核心概念和实用技巧，创建复杂的响应式网页布局。',
          category: 'CSS',
          date: '2024-01-03',
          readTime: '15分钟阅读'
        },
        {
          id: 5,
          title: 'TypeScript 类型系统深入',
          description: '深入学习TypeScript的类型系统，包括泛型、接口、类型别名等高级特性。',
          category: 'TypeScript',
          date: '2023-12-28',
          readTime: '20分钟阅读'
        },
        {
          id: 6,
          title: 'React Hooks 最佳实践',
          description: '分享React Hooks的使用技巧和最佳实践，避免常见的陷阱和错误。',
          category: 'React',
          date: '2023-12-25',
          readTime: '14分钟阅读'
        },
        {
          id: 7,
          title: 'ECharts 入门指南',
          description: '学习ECharts的基本使用方法，包括图表配置、动画效果和常见图表类型的实现。',
          category: '数据可视化',
          date: '2024-01-20',
          readTime: '12分钟阅读'
        },
        {
          id: 8,
          title: '前端动画原理详解',
          description: '深入探讨前端动画的原理和实现技术，包括CSS动画、JavaScript动画和性能优化。',
          category: '动画',
          date: '2024-01-25',
          readTime: '18分钟阅读'
        }
      ]
    }
  },
  computed: {
    categories() {
      return [...new Set(this.articles.map(article => article.category))]
    },
    filteredArticles() {
      return this.articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            article.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = !this.selectedCategory || article.category === this.selectedCategory
        return matchesSearch && matchesCategory
      })
    }
  }
}
</script>

<style scoped>
.articles {
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.category-select {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  font-size: 1rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-item {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.article-content h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.article-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.category {
  background: #667eea;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.date, .read-time {
  color: #999;
  font-size: 0.9rem;
}

.read-more {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.read-more:hover {
  color: #764ba2;
}

.no-results {
  text-align: center;
  color: #666;
  padding: 3rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .search-input {
    min-width: auto;
  }
  
  .article-item {
    padding: 1.5rem;
  }
}
</style>