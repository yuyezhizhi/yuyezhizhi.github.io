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
    // 网格坐标缓存，用于空间分区优化
    this.gridX = 0;
    this.gridY = 0;
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

// 保存函数引用以便正确移除监听器
const handleMouseMove = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

const handleMouseLeave = () => {
  if (canvas) {
    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;
  }
};

// 添加事件监听
const addEventListeners = () => {
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
};

// 使用空间分区优化的粒子连线（网格哈希法，O(n) 复杂度）
const connectParticles = () => {
  const maxDistance = 100;
  const cellSize = maxDistance;
  const grid = new Map();

  // 将粒子分配到网格单元格
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const gx = Math.floor(p.x / cellSize);
    const gy = Math.floor(p.y / cellSize);
    const key = gx + ',' + gy;

    if (!grid.has(key)) {
      grid.set(key, []);
    }
    grid.get(key).push(i);
    p.gridX = gx;
    p.gridY = gy;
  }

  // 只检查相邻单元格中的粒子对
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const gx = p.gridX;
    const gy = p.gridY;

    // 检查当前单元格及右、下、右下、左下4个方向的相邻单元格
    // 避免重复检查（只检查半个邻域）
    const neighbors = [
      [gx, gy], [gx + 1, gy], [gx, gy + 1],
      [gx + 1, gy + 1], [gx - 1, gy + 1]
    ];

    for (const [nx, ny] of neighbors) {
      const key = nx + ',' + ny;
      const cell = grid.get(key);
      if (!cell) continue;

      for (const j of cell) {
        if (j <= i) continue;

        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.strokeStyle = `rgba(78, 205, 196, ${(maxDistance - distance) / maxDistance * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
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
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
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
