<template>
  <div class="fullscreen-canvas">
    <canvas id="interactive-net-canvas"></canvas>
    <div class="hint-text">拖动网中的任意点来交互</div>
  </div>
</template>

<script>
export default {
  name: "InteractiveNet",
  data() {
    return {
      canvas: null,
      ctx: null,
      animationId: null,
      nodes: [],
      springs: [],
      mouse: { x: 0, y: 0, isDown: false },
      draggedNode: null
    };
  },
  mounted() {
    this.initCanvas();
    this.createNet();
    this.addEventListeners();
    this.animate();
  },
  beforeUnmount() {
    this.cleanup();
    // 离开页面时恢复鼠标光标
    document.body.style.cursor = 'default';
  },
  methods: {
    initCanvas() {
      this.canvas = document.getElementById('interactive-net-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
    },
    
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    
    createNet() {
      const cols = 40; // 增加一倍密度
      const rows = 30; // 增加一倍密度
      const spacingX = this.canvas.width / (cols + 1);
      const spacingY = this.canvas.height / (rows + 1);
      
      // 创建节点
      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          const node = {
            x: col * spacingX + spacingX / 2,
            y: row * spacingY + spacingY / 2,
            oldX: col * spacingX + spacingX / 2,
            oldY: row * spacingY + spacingY / 2,
            pinned: row === 0 || row === rows || col === 0 || col === cols, // 边缘固定
            row: row,
            col: col
          };
          this.nodes.push(node);
        }
      }
      
      // 创建弹簧（连接）
      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          const index = row * (cols + 1) + col;
          
          // 水平连接
          if (col < cols) {
            this.springs.push({
              node1: index,
              node2: index + 1,
              length: spacingX
            });
          }
          
          // 垂直连接
          if (row < rows) {
            this.springs.push({
              node1: index,
              node2: index + (cols + 1),
              length: spacingY
            });
          }
        }
      }
    },
    
    updatePhysics() {
      const gravity = 0.3; // 减小重力
      const friction = 0.95; // 增加摩擦力，减少波动传递
      const bounce = 0.5; // 减小反弹系数
      
      // 更新节点位置
      this.nodes.forEach(node => {
        if (!node.pinned && node !== this.draggedNode) {
          const vx = (node.x - node.oldX) * friction;
          const vy = (node.y - node.oldY) * friction;
          
          node.oldX = node.x;
          node.oldY = node.y;
          
          node.x += vx;
          node.y += vy + gravity;
          
          // 边界检测
          if (node.x < 0) {
            node.x = 0;
            node.oldX = node.x + vx * bounce;
          } else if (node.x > this.canvas.width) {
            node.x = this.canvas.width;
            node.oldX = node.x + vx * bounce;
          }
          
          if (node.y < 0) {
            node.y = 0;
            node.oldY = node.y + vy * bounce;
          } else if (node.y > this.canvas.height) {
            node.y = this.canvas.height;
            node.oldY = node.y + vy * bounce;
          }
        }
      });
      
      // 更新弹簧（增加迭代次数以提高稳定性）
      const iterations = 3; // 增加约束求解迭代次数
      for (let iter = 0; iter < iterations; iter++) {
        this.springs.forEach(spring => {
          const node1 = this.nodes[spring.node1];
          const node2 = this.nodes[spring.node2];
          
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance === 0) return;
          
          const difference = spring.length - distance;
          const percent = difference / distance / 2;
          const offsetX = dx * percent;
          const offsetY = dy * percent;
          
          if (!node1.pinned && node1 !== this.draggedNode) {
            node1.x -= offsetX;
            node1.y -= offsetY;
          }
          
          if (!node2.pinned && node2 !== this.draggedNode) {
            node2.x += offsetX;
            node2.y += offsetY;
          }
        });
      }
    },
    
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 绘制白色背景
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 绘制连接线（蓝色）
      this.ctx.strokeStyle = 'rgba(66, 133, 244, 0.4)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      
      this.springs.forEach(spring => {
        const node1 = this.nodes[spring.node1];
        const node2 = this.nodes[spring.node2];
        
        this.ctx.moveTo(node1.x, node1.y);
        this.ctx.lineTo(node2.x, node2.y);
      });
      
      this.ctx.stroke();
      
      // 绘制节点（蓝色）
      this.nodes.forEach(node => {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.pinned ? 3 : 2, 0, Math.PI * 2);
        
        if (node.pinned) {
          this.ctx.fillStyle = 'rgba(66, 133, 244, 0.8)';
        } else if (node === this.draggedNode) {
          this.ctx.fillStyle = 'rgba(255, 165, 0, 1)';
        } else {
          this.ctx.fillStyle = 'rgba(66, 133, 244, 0.6)';
        }
        
        this.ctx.fill();
      });
      
      // 绘制提示文字（移到draw方法外，使用HTML显示）
      // 提示文字已通过HTML元素显示在右上角
    },
    
    animate() {
      this.updatePhysics();
      this.draw();
      this.animationId = requestAnimationFrame(this.animate);
    },
    
    getNearestNode(x, y) {
      let nearest = null;
      let minDistance = Infinity;
      
      this.nodes.forEach(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance && distance < 50) {
          minDistance = distance;
          nearest = node;
        }
      });
      
      return nearest;
    },
    
    handleMouseDown(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isDown = true;
      
      this.draggedNode = this.getNearestNode(this.mouse.x, this.mouse.y);
    },
    
    handleMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      
      if (this.draggedNode && !this.draggedNode.pinned) {
        this.draggedNode.x = this.mouse.x;
        this.draggedNode.y = this.mouse.y;
        this.draggedNode.oldX = this.mouse.x;
        this.draggedNode.oldY = this.mouse.y;
      }
    },
    
    handleMouseUp() {
      this.mouse.isDown = false;
      this.draggedNode = null;
    },
    
    addEventListeners() {
      this.canvas.addEventListener('mousedown', this.handleMouseDown);
      this.canvas.addEventListener('mousemove', this.handleMouseMove);
      this.canvas.addEventListener('mouseup', this.handleMouseUp);
      this.canvas.addEventListener('mouseleave', this.handleMouseUp);
      
      window.addEventListener('resize', () => {
        this.resizeCanvas();
      });
    },
    
    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
      this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
    }
  }
};
</script>

<style scoped>
.fullscreen-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: #ffffff;
  z-index: 1;
}

#interactive-net-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
}

#interactive-net-canvas:active {
  cursor: grabbing;
}

.hint-text {
  position: absolute;
  top: 20px;
  right: 20px;
  color: rgba(66, 133, 244, 0.9);
  font-size: 16px;
  font-family: Arial, sans-serif;
  pointer-events: none;
  user-select: none;
  z-index: 10;
}
</style>
