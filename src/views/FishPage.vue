<template>
  <div class="fish-page">
    <canvas id="fishCanvas"></canvas>
    <div class="controls">
      <p class="instruction">鼠标移动驱赶鱼群 | 静止时自动漩涡</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FishPage',
  mounted() {
    const canvas = document.getElementById('fishCanvas');
    const ctx = canvas.getContext('2d');
    
    // 初始化画布尺寸
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 鱼群粒子系统
    class Fish {
      constructor() {
        this.reset(true);
        this.size = 4 + Math.random() * 6; // 鱼大小变大一倍
        this.speed = 0.5 + Math.random();
        this.color = `hsl(200, 80%, ${50 + Math.random() * 30}%)`;
        this.radiusOffset = 100 + Math.random() * 200; // 旋转半径偏移翻倍
      }
      
      reset(init) {
        const angle = Math.random() * Math.PI * 2;
        const radius = init ? Math.random() * 200 : 100;
        this.x = canvas.width/2 + Math.cos(angle) * radius;
        this.y = canvas.height/2 + Math.sin(angle) * radius;
        this.targetX = this.x;
        this.targetY = this.y;
        this.angle = angle;
      }
      
      update(mouseX, mouseY, isMouseActive) {
        // 计算漩涡中心或鼠标影响
        const centerX = isMouseActive ? mouseX : canvas.width/2;
        const centerY = isMouseActive ? mouseY : canvas.height/2;
        
        // 计算目标位置（漩涡或散开状态）
        if (!isMouseActive) {
          this.angle += 0.01;
          this.targetX = centerX + Math.cos(this.angle) * this.radiusOffset;
          this.targetY = centerY + Math.sin(this.angle) * this.radiusOffset;
        } else {
          const distance = Math.sqrt(
            Math.pow(this.x - centerX, 2) + 
            Math.pow(this.y - centerY, 2)
          );
          if (distance < 150) {
            const escapeAngle = Math.atan2(
              this.y - centerY, 
              this.x - centerX
            );
            this.targetX = this.x + Math.cos(escapeAngle) * 50;
            this.targetY = this.y + Math.sin(escapeAngle) * 50;
          }
        }
        
        // 平滑移动
        this.x += (this.targetX - this.x) * 0.05 * this.speed;
        this.y += (this.targetY - this.y) * 0.05 * this.speed;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // 绘制简化的鱼形（三角形）
        const headAngle = Math.atan2(
          this.targetY - this.y, 
          this.targetX - this.x
        );
        ctx.moveTo(
          this.x + Math.cos(headAngle) * this.size * 2, 
          this.y + Math.sin(headAngle) * this.size * 2
        );
        ctx.lineTo(
          this.x + Math.cos(headAngle + 2.8) * this.size, 
          this.y + Math.sin(headAngle + 2.8) * this.size
        );
        ctx.lineTo(
          this.x + Math.cos(headAngle - 2.8) * this.size, 
          this.y + Math.sin(headAngle - 2.8) * this.size
        );
        ctx.closePath();
        ctx.fill();
      }
    }

    // 创建鱼群
    const fishes = [];
    const redFishCount = 4; // 红色鱼的数量
    const redFishIndices = new Set();
    
    // 随机选择4个位置来放置红色鱼
    while (redFishIndices.size < redFishCount) {
      redFishIndices.add(Math.floor(Math.random() * 300));
    }
    
    for (let i = 0; i < 300; i++) {
      const fish = new Fish();
      // 如果是红色鱼的位置，创建红色的鱼，比其他鱼大一倍
      if (redFishIndices.has(i)) {
        fish.color = `hsl(0, 80%, ${50 + Math.random() * 30}%)`; // 红色
        fish.size = fish.size * 2; // 大小翻倍
      }
      fishes.push(fish);
    }

    // 鼠标交互
    let mouseX = 0;
    let mouseY = 0;
    let isMouseActive = false;
    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseActive = true;
    });
    canvas.addEventListener('mouseout', () => {
      isMouseActive = false;
    });

    // 动画循环
    function animate() {
      ctx.fillStyle = '#112233';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fishes.forEach(fish => {
        fish.update(mouseX, mouseY, isMouseActive);
        fish.draw();
      });

      // 绘制半透明小圆形鼠标（无拖尾）
      if (isMouseActive) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    }
    animate();
  }
}
</script>

<style scoped lang="less">
.fish-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: #112233;
  z-index: 1;
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: none;
  }

  .controls {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 0 0 0 8px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: none;
    border-right: none;
    color: #ffffff;

    .instruction {
      margin: 0;
      font-size: 0.75rem;
      opacity: 1;
      line-height: 1.3;
      white-space: nowrap;
    }
  }
}
</style>