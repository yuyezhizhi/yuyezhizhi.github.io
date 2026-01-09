<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="logo">
          <router-link to="/">前端知识库</router-link>
        </h1>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-link">首页</router-link></li>
          <li><router-link to="/articles" class="nav-link">文章</router-link></li>
          <li><router-link to="/interview" class="nav-link">面试题</router-link></li>
          <li><router-link to="/animation" class="nav-link">示例</router-link></li>
          <li><router-link to="/file" class="nav-link">文件预览</router-link></li>
          <li><router-link to="/about" class="nav-link">关于</router-link></li>
        </ul>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 yuyezhizhi 的前端博客. 保留所有权利.</p>
      </div>
    </footer>
    
    <!-- 回到顶部按钮 -->
    <button 
      v-if="showBackToTop"
      @click="backToTop"
      class="back-to-top-btn"
    >
      ↑
    </button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showBackToTop: false
    }
  },
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      // 当滚动超过200px时显示回到顶部按钮
      this.showBackToTop = window.scrollY > 200
    },
    backToTop() {
      // 平滑滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  transition: background-color 0.3s ease;
  backdrop-filter: saturate(180%) blur(6px);
  background: rgba(255, 255, 255, 0.9);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 3rem;
}

.logo a {
  color: #333;
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(248, 120, 132, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(248, 120, 132, 0.2);
  color: #f87884;
  font-weight: 600;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 8rem 2rem 2rem;
  width: 100%;
}

.footer {
  background-color: #343a40;
  color: white;
  text-align: center;
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .main-content {
    padding: 8rem 1rem 1rem;
  }
}

/* 回到顶部按钮样式 */
.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(248, 120, 132, 0.9);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s, transform 0.3s;
  z-index: 999;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.back-to-top-btn:hover {
  opacity: 1;
  transform: translateY(-5px);
}
</style>