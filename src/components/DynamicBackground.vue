<template>
  <div ref="canvasContainer" class="dynamic-background"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasContainer = ref(null);
let canvas, ctx, particles = [];
let animationId = null;
let mouse = { x: 0, y: 0 };

// 粒子类
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.color = `rgba(78, 205, 196, ${Math.random() * 0.5 + 0.2})`;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // 边界检测
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    
    // 鼠标交互
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const maxDistance = 100;
      const force = (maxDistance - distance) / maxDistance;
      const directionX = forceDirectionX * force * 2;
      const directionY = forceDirectionY * force * 2;
      
      this.x -= directionX;
      this.y -= directionY;
    }
  }
  
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 初始化画布
const initCanvas = () => {
  if (!canvasContainer.value) return;
  
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  
  // 设置画布大小
  resizeCanvas();
  
  canvasContainer.value.appendChild(canvas);
  
  // 创建粒子
  createParticles();
  
  // 添加事件监听
  addEventListeners();
  
  // 开始动画
  animate();
};

// 调整画布大小
const resizeCanvas = () => {
  if (!canvasContainer.value) return;
  
  canvas.width = canvasContainer.value.clientWidth;
  canvas.height = canvasContainer.value.clientHeight;
};

// 创建粒子
const createParticles = () => {
  const particleCount = Math.floor(canvas.width * canvas.height / 10000);
  particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
};

// 添加事件监听
const addEventListeners = () => {
  window.addEventListener('resize', resizeCanvas);
  
  // 鼠标移动事件
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  // 鼠标离开事件
  canvas.addEventListener('mouseleave', () => {
    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;
  });
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 更新和绘制粒子
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  // 连接邻近粒子
  connectParticles();
};

// 连接邻近粒子
const connectParticles = () => {
  const maxDistance = 100;
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxDistance) {
        ctx.strokeStyle = `rgba(78, 205, 196, ${(maxDistance - distance) / maxDistance * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
};

// 组件挂载时初始化
onMounted(() => {
  initCanvas();
});

// 组件卸载时清理
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  window.removeEventListener('resize', resizeCanvas);
  
  if (canvas) {
    canvas.removeEventListener('mousemove', () => {});
    canvas.removeEventListener('mouseleave', () => {});
  }
});
</script>

<style scoped>
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: #fff5f5;
}
</style>