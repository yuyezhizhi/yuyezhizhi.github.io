<template>
  <div class="about">
    <div class="container">
      <div class="about-content">
        <!-- 3D头像区域 -->
        <div class="avatar-section">
          <PersonalAvatar3D />
        </div>
        
        <div class="profile-section">
          <div class="profile-info">
            <h1 class="colorful-title">关于我</h1>
            <p class="intro">
              <span class="colorful-text">热爱vibe coding的前端开发工程师</span>
            </p>
            
            <div class="contact-info">
              <h2 class="colorful-title">联系我</h2>
              <div class="contact-links">
                <a href="https://github.com/yuyezhizhi" class="contact-link" target="_blank">
                  <span class="icon">📱</span>
                  GitHub
                </a>
                <div class="contact-link">
                  <span class="icon">✉️</span>
                  邮箱: daijiangzhi@163.com
                </div>
                <div class="contact-link">
                  <span class="icon">💬</span>
                  微信公众号: 汁汁学AI
                </div>
                <div class="contact-link">
                  <span class="icon">📕</span>
                  小红书: 汁汁学AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalAvatar3D from '@/components/PersonalAvatar3D.vue';

export default {
  name: 'About',
  components: {
    PersonalAvatar3D
  },
  data() {
    return {
    };
  }
}
</script>

<style scoped lang="less">
.about {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-content {
  background: white;
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* 3D头像区域 */
.avatar-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.profile-section {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  align-items: start;
}

.colorful-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease infinite;
}

.colorful-text {
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.contact-info {
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease infinite;
}

.contact-link:hover {
  transform: scale(1.05);
}

.contact-link .icon {
  font-size: 1.4rem;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .about-content {
    padding: 1.5rem;
  }
  
  .colorful-title {
    font-size: 2rem;
  }
  
  .colorful-text {
    font-size: 1.2rem;
  }
}
</style>