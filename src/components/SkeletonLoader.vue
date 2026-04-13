<template>
  <div class="skeleton-loader">
    <div class="skeleton-item skeleton-header"></div>
    <div class="skeleton-item skeleton-content"></div>
    <div class="skeleton-item skeleton-footer"></div>
  </div>
</template>

<style scoped>
.skeleton-loader {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: #f5f5f5;
}

.skeleton-item {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-header {
  height: 60px;
  width: 100%;
}

.skeleton-content {
  flex: 1;
  width: 100%;
}

.skeleton-footer {
  height: 40px;
  width: 100%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>