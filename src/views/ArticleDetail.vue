<template>
  <div class="article-detail">
    <div class="container">
      <div v-if="article" class="article-content">
        <nav class="breadcrumb">
          <router-link to="/articles">文章列表</router-link>
          <span> / </span>
          <span>{{ article.title }}</span>
        </nav>
        
        <header class="article-header">
          <h1>{{ article.title }}</h1>
          <div class="article-meta">
            <span class="category">{{ article.category }}</span>
            <span class="date">{{ article.date }}</span>
            <span class="read-time">{{ article.readTime }}</span>
          </div>
        </header>
        
        <div class="article-body">
          <div v-html="article.content"></div>
        </div>
        
        <div class="article-footer">
          <div class="tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
          <div class="navigation">
            <button 
              v-if="prevArticle" 
              @click="$router.push(`/article/${prevArticle.id}`)"
              class="nav-btn prev"
            >
              ← {{ prevArticle.title }}
            </button>
            <button 
              v-if="nextArticle" 
              @click="$router.push(`/article/${nextArticle.id}`)"
              class="nav-btn next"
            >
              {{ nextArticle.title }} →
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="loading">
        <p>文章加载中...</p>
      </div>
    </div>
  </div>
</template>

<script>
const articlesData = {
  1: {
    id: 1,
    title: 'Vue 3 Composition API 详解',
    category: 'Vue',
    date: '2024-01-15',
    readTime: '10分钟阅读',
    tags: ['Vue3', 'Composition API', 'JavaScript'],
    content: `
      <h2>什么是Composition API？</h2>
      <p>Vue 3引入的Composition API是一种新的编写组件逻辑的方式，它解决了Options API在复杂组件中的一些限制。</p>
      
      <h3>主要优势</h3>
      <ul>
        <li>更好的逻辑复用</li>
        <li>更灵活的类型推导</li>
        <li>更清晰的代码组织</li>
        <li>更好的Tree-shaking支持</li>
      </ul>
      
      <h2>setup函数</h2>
      <p>setup函数是Composition API的入口点，它在组件创建之前执行。</p>
      
      <pre><code>import { ref, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      message: 'Hello Vue 3'
    })
    
    return {
      count,
      state
    }
  }
}</code></pre>
      
      <h2>ref和reactive</h2>
      <p>ref用于创建响应式的基本类型数据，reactive用于创建响应式的对象。</p>
    `
  },
  2: {
    id: 2,
    title: 'Vite vs Webpack 性能对比',
    category: '构建工具',
    date: '2024-01-10',
    readTime: '8分钟阅读',
    tags: ['Vite', 'Webpack', '构建工具'],
    content: `
      <h2>开发服务器启动速度</h2>
      <p>Vite利用ES模块的原生支持，实现了秒级的开发服务器启动速度。</p>
      
      <h3>Vite的优势</h3>
      <ul>
        <li>基于ES模块的按需编译</li>
        <li>无需打包的快速冷启动</li>
        <li>高效的热模块替换(HMR)</li>
        <li>开箱即用的TypeScript支持</li>
      </ul>
      
      <h2>构建性能</h2>
      <p>在生产构建方面，Vite使用Rollup进行打包，提供了优秀的构建性能。</p>
      
      <h3>性能对比数据</h3>
      <table>
        <tr><th>指标</th><th>Vite</th><th>Webpack</th></tr>
        <tr><td>冷启动时间</td><td>1-2秒</td><td>30-60秒</td></tr>
        <tr><td>热更新速度</td><td>50-100ms</td><td>1-3秒</td></tr>
        <tr><td>生产构建</td><td>快速</td><td>中等</td></tr>
      </table>
    `
  },
  3: {
    id: 3,
    title: 'JavaScript ES6+ 新特性实践',
    category: 'JavaScript',
    date: '2024-01-05',
    readTime: '12分钟阅读',
    tags: ['ES6', 'JavaScript', '新特性'],
    content: `
      <h2>箭头函数</h2>
      <p>箭头函数提供了更简洁的函数语法，并且自动绑定this。</p>
      
      <pre><code>// 传统函数
function add(a, b) {
  return a + b
}

// 箭头函数
const add = (a, b) => a + b</code></pre>
      
      <h2>解构赋值</h2>
      <p>解构赋值可以方便地从数组或对象中提取数据。</p>
      
      <pre><code>// 数组解构
const [first, second] = [1, 2]

// 对象解构
const { name, age } = person</code></pre>
      
      <h2>模板字符串</h2>
      <p>模板字符串支持多行文本和表达式插值。</p>
      
      <pre><code>const name = '张三'
const message = \`
  你好，\${name}！
  欢迎来到我们的网站。
\`</code></pre>
    `
  }
}

export default {
  name: 'ArticleDetail',
  data() {
    return {
      article: null
    }
  },
  computed: {
    articleId() {
      return parseInt(this.$route.params.id)
    },
    prevArticle() {
      const prevId = this.articleId - 1
      return articlesData[prevId] || null
    },
    nextArticle() {
      const nextId = this.articleId + 1
      return articlesData[nextId] || null
    }
  },
  watch: {
    articleId: {
      immediate: true,
      handler(newId) {
        this.article = articlesData[newId] || null
      }
    }
  }
}
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.breadcrumb {
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #667eea;
  text-decoration: none;
}

.article-header {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.article-header h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  gap: 1rem;
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

.article-body {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  line-height: 1.8;
}

.article-body h2 {
  color: #333;
  margin: 2rem 0 1rem 0;
  font-size: 1.8rem;
}

.article-body h3 {
  color: #555;
  margin: 1.5rem 0 0.8rem 0;
  font-size: 1.4rem;
}

.article-body p {
  margin-bottom: 1rem;
  color: #444;
}

.article-body ul {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.article-body li {
  margin-bottom: 0.5rem;
}

.article-body pre {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin: 1rem 0;
}

.article-body code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.article-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.article-body th,
.article-body td {
  border: 1px solid #ddd;
  padding: 0.8rem;
  text-align: left;
}

.article-body th {
  background: #f8f9fa;
  font-weight: bold;
}

.article-footer {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.tags {
  margin-bottom: 2rem;
}

.tag {
  display: inline-block;
  background: #e9ecef;
  color: #495057;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.nav-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
  max-width: 45%;
  text-align: center;
}

.nav-btn:hover {
  background: #764ba2;
}

.nav-btn.prev {
  text-align: left;
}

.nav-btn.next {
  text-align: right;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: #666;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .article-header h1 {
    font-size: 2rem;
  }
  
  .article-body,
  .article-header,
  .article-footer {
    padding: 1.5rem;
  }
  
  .navigation {
    flex-direction: column;
  }
  
  .nav-btn {
    max-width: 100%;
  }
}
</style>