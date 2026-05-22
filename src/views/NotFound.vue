<template>
  <div class="not-found">
    <div class="error-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面走丢了</h1>
      <p class="error-desc">你访问的页面不存在，也许它变成了一个粒子飘走了</p>
      <router-link to="/" class="back-home">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="less">
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff5f5 0%, #f0f0ff 100%);
}

.error-content {
  text-align: center;
  padding: 3rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

.error-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.error-desc {
  font-size: 1.1rem;
  color: #999;
  margin-bottom: 2rem;
}

.back-home {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
</style>
