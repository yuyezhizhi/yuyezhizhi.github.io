<template>
  <div class="articles">
    <div class="container">
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

<script setup>
import { ref, computed } from 'vue'
import articlesData from '../data/articles.js'

// 将对象转换为数组，并添加description字段（使用content的前150个字符作为描述）
const articles = computed(() => {
  return Object.values(articlesData).map(article => {
    // 从content中提取纯文本作为description
    const contentText = article.content.replace(/<[^>]+>/g, '').trim()
    return {
      ...article,
      description: contentText.length > 150 ? contentText.substring(0, 150) + '...' : contentText
    }
  })
})

const searchQuery = ref('')
const selectedCategory = ref('')

const categories = computed(() => {
  return [...new Set(articles.value.map(article => article.category))]
})

const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        article.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || article.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})
</script>

<style scoped>
.articles {
  min-height: 100vh;
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