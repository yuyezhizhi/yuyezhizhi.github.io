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
          <div v-html="sanitizedContent"></div>
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
import articlesData from '../data/articles.js';
import DOMPurify from 'dompurify';
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
    },
    sanitizedContent() {
      if (!this.article) return ''
      return DOMPurify.sanitize(this.article.content)
    }
  },
  watch: {
    articleId: {
      immediate: true,
      handler(newId) {
        this.article = articlesData[newId] || null
        this.$nextTick(() => {
          this.highlightCode()
        })
      }
    }
  },
  methods: {
    highlightCode() {
      const codeBlocks = document.querySelectorAll('.article-body pre code')
      codeBlocks.forEach(block => {
        // 使用更安全的highlight方法替代highlightBlock
        const code = block.textContent
        const language = block.getAttribute('class') ? block.getAttribute('class').replace('language-', '') : 'plaintext'
        
        try {
          // 高亮代码
          const highlighted = this.$hljs.highlight(code, { language }).value
          // 安全地设置高亮后的HTML
          block.innerHTML = highlighted
          // 添加hljs类
          block.classList.add('hljs')
        } catch (err) {
          console.error('代码高亮失败:', err)
        }
        
        // 添加复制按钮
        const pre = block.parentElement
        if (!pre.querySelector('.copy-btn')) {
          const copyBtn = document.createElement('button')
          copyBtn.className = 'copy-btn'
          copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> 复制代码'
          copyBtn.title = '复制代码'
          copyBtn.addEventListener('click', () => this.copyCode(block))
          pre.appendChild(copyBtn)
        }
      })
    },
    copyCode(codeElement) {
      const text = codeElement.textContent
      navigator.clipboard.writeText(text).then(() => {
        const copyBtn = codeElement.parentElement.querySelector('.copy-btn')
        const originalContent = copyBtn.innerHTML
        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 复制成功'
        copyBtn.classList.add('copied')
        
        setTimeout(() => {
          copyBtn.innerHTML = originalContent
          copyBtn.classList.remove('copied')
        }, 2000)
      }).catch(err => {
        console.error('复制失败:', err)
      })
    }
  }
}
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.breadcrumb {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #42b983;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.article-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.article-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.article-meta .category {
  background: #42b983;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.article-body {
  color: #333;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.article-body h2 {
  color: #2c3e50;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.article-body h3 {
  color: #34495e;
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
}

.article-body p {
  margin-bottom: 1rem;
}

.article-body ul, .article-body ol {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.article-body li {
  margin-bottom: 0.5rem;
}

.article-body pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
}

.article-body pre::before {
  content: '';
  position: absolute;
  top: 12px;
  right: 12px;
  width: 12px;
  height: 12px;
  background: #ff5f56;
  border-radius: 50%;
  box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
  opacity: 0.8;
}

/* 复制按钮样式 */
.article-body :deep(pre) {
  position: relative;
}

.article-body :deep(pre .copy-btn) {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #aaa;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-body :deep(pre .copy-btn.copied) {
  background: rgb(46, 204, 113);
}

.article-body :deep(pre .copy-btn svg) {
  display: inline-block;
  vertical-align: middle;
}

.article-body code {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 0.95rem;
  line-height: 1.6;
}

.article-body pre code {
  display: block;
  padding: 0;
  background: transparent;
  color: inherit;
  border: none;
}

.article-body code:not(pre code) {
  background: #e9ecef;
  color: #495057;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.article-footer {
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tags .tag {
  background: #e9ecef;
  color: #495057;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.navigation {
  display: flex;
  justify-content: space-between;
}

.nav-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.nav-btn:hover {
  background: #359e6f;
}

.nav-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>