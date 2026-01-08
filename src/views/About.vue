<template>
  <div class="about">
    <div class="container">
      <div class="about-content">
        <div class="profile-section">
          <div class="profile-image">
            <div class="avatar">
              <span>Y</span>
            </div>
          </div>
          <div class="profile-info">
            <h1>关于我</h1>
            <p class="intro">
              你好！我是 yuyezhizhi，一名热爱前端开发的技术爱好者。
              这个博客是我分享前端开发知识和学习心得的地方。
            </p>
            
            <div class="skills">
              <h2>技术栈</h2>
              <div class="skill-tags">
                <span class="skill-tag">CSS3</span>
                <span class="skill-tag">HTML5</span>
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">TypeScript</span>
                <span class="skill-tag">Vue</span>
                <span class="skill-tag">React</span>
                <span class="skill-tag">Vite</span>
                <span class="skill-tag">Webpack</span>
                <span class="skill-tag">Next.js</span>
                <span class="skill-tag">Node.js</span>
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about {
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.about-content {
  background: white;
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.profile-section {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  align-items: start;
}

.profile-image {
  display: flex;
  justify-content: center;
}

.avatar {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  font-weight: bold;
}

.profile-info h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.intro {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2rem;
}

.skills {
  margin-bottom: 2rem;
}

.skills h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.skill-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.contact-info h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.contact-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border: 2px solid #667eea;
  border-radius: 25px;
  transition: all 0.3s;
  font-weight: 500;
}

.contact-link:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.icon {
  font-size: 1.2rem;
}

.blog-info {
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.blog-info h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.tech-stack,
.features {
  margin-bottom: 2rem;
}

.tech-stack h3,
.features h3 {
  color: #555;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.tech-stack ul,
.features ul {
  list-style: none;
  padding: 0;
}

.tech-stack li,
.features li {
  padding: 0.8rem 0;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.tech-stack li:last-child,
.features li:last-child {
  border-bottom: none;
}

.tech-stack strong {
  color: #333;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .about-content {
    padding: 2rem;
  }
  
  .profile-section {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .avatar {
    width: 120px;
    height: 120px;
    font-size: 3rem;
  }
  
  .profile-info h1 {
    font-size: 2rem;
  }
  
  .contact-links {
    justify-content: center;
  }
  
  .skill-tags {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .about-content {
    padding: 1.5rem;
  }
  
  .contact-links {
    flex-direction: column;
    align-items: center;
  }
  
  .contact-link {
    width: 100%;
    justify-content: center;
  }
}
</style>