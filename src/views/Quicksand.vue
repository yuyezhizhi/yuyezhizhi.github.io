<template>
  <div class="quicksand-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">靠近产生漩涡 | 点击爆炸</p>
      <div class="info">
        <p>沙粒: {{ sandCount }} | 堆积: {{ maxHeight }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const sandCount = ref(0)
const maxHeight = ref(0)

let p5Instance = null
let grid = []
let particles = []
let gridCols = 0
let gridCellSize = 3
let maxStackHeight = 0

class SandParticle {
  constructor(col) {
    this.col = col
    this.row = 0
    this.x = col * gridCellSize + gridCellSize / 2
    this.y = 0
    this.vy = 0
    this.vx = 0
    this.settled = false
    this.size = p5Instance.random(2, 3)
    
    // 沙色系：色相30-45°，饱和度30-60%，明度70-100%
    this.hue = p5Instance.random(30, 45)
    this.sat = p5Instance.random(30, 60)
    this.bri = p5Instance.random(70, 100)
  }

  applyGravity() {
    if (this.settled) return
    
    this.vy += 0.3
    this.vy = p5Instance.constrain(this.vy, 0, 8)
    this.y += this.vy
    this.x += this.vx
    this.vx *= 0.9
    
    // 计算当前列的堆积高度
    let col = Math.floor(this.x / gridCellSize)
    col = p5Instance.constrain(col, 0, gridCols - 1)
    let stackHeight = p5Instance.height - grid[col] * gridCellSize
    
    // 碰到堆积或底部
    if (this.y >= stackHeight - gridCellSize / 2) {
      this.y = stackHeight - gridCellSize / 2
      this.settled = true
      this.vy = 0
      
      // 更新网格
      let gridRow = Math.floor((p5Instance.height - this.y) / gridCellSize)
      if (grid[col] < gridRow) {
        grid[col] = gridRow
      }
    }
    
    // 边界限制
    if (this.x < 0) { this.x = 0; this.vx *= -0.5 }
    if (this.x > p5Instance.width) { this.x = p5Instance.width; this.vx *= -0.5 }
  }

  applyMouseForce(mx, my) {
    if (this.settled) {
      let d = p5Instance.dist(this.x, this.y, mx, my)
      if (d < 100 && d > 5) {
        let force = 100 / (d * d)
        let angle = p5Instance.atan2(this.y - my, this.x - mx)
        // 漩涡效果
        angle += p5Instance.PI / 3
        this.vx += p5Instance.cos(angle) * force * 2
        this.vy += p5Instance.sin(angle) * force * 2
        
        // 如果力足够大，重新激活
        if (force > 0.05) {
          this.settled = false
        }
      }
    }
  }

  applyExplosion(mx, my) {
    let d = p5Instance.dist(this.x, this.y, mx, my)
    if (d < 150) {
      let force = (150 - d) / 10
      let angle = p5Instance.atan2(this.y - my, this.x - mx)
      this.vx += p5Instance.cos(angle) * force
      this.vy += p5Instance.sin(angle) * force
      this.settled = false
    }
  }

  update() {
    if (!this.settled) {
      this.applyGravity()
    }
  }

  draw(p) {
    p.colorMode(p.HSB, 360, 100, 100, 255)
    
    // 根据高度调整明度（越底部越深）
    let depthFactor = p.map(this.y, 0, p.height, 1, 0.6)
    let adjustedBri = this.bri * depthFactor
    
    p.fill(this.hue, this.sat, adjustedBri, 230)
    p.noStroke()
    p.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size)
    
    p.colorMode(p.RGB, 255)
  }
}

const initGrid = () => {
  gridCols = Math.ceil(p5Instance.width / gridCellSize)
  grid = new Array(gridCols).fill(0)
}

const checkAvalanche = () => {
  // 检查坍塌
  let threshold = 4 // 高度差阈值
  let moved = true
  let iterations = 0
  
  while (moved && iterations < 5) {
    moved = false
    iterations++
    
    for (let i = 0; i < gridCols - 1; i++) {
      let diff = grid[i] - grid[i + 1]
      if (diff > threshold) {
        // 高列滑落到低列
        let transfer = Math.floor(diff / 2)
        grid[i] -= transfer
        grid[i + 1] += transfer
        moved = true
      } else if (diff < -threshold) {
        let transfer = Math.floor(-diff / 2)
        grid[i] += transfer
        grid[i + 1] -= transfer
        moved = true
      }
    }
  }
}

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.parent('p5-canvas')
    p5Instance = p
    
    initGrid()
  }

  p.draw = () => {
    // 暗色渐变背景
    for (let i = 0; i <= p.height; i++) {
      let inter = p.map(i, 0, p.height, 0, 1)
      let c = p.lerpColor(p.color(40, 30, 20), p.color(10, 8, 5), inter)
      p.stroke(c)
      p.line(0, i, p.width, i)
    }
    
    // 每帧添加新沙粒
    let spawnCount = Math.floor(p.random(2, 4))
    for (let i = 0; i < spawnCount; i++) {
      let col = Math.floor(p.random(gridCols))
      particles.push(new SandParticle(col))
    }
    
    // 应用鼠标力（漩涡效果）
    for (let particle of particles) {
      particle.applyMouseForce(p.mouseX, p.mouseY)
    }
    
    // 更新和绘制沙粒
    for (let particle of particles) {
      particle.update()
      particle.draw(p)
    }
    
    // 检查坍塌
    checkAvalanche()
    
    // 更新最大堆积高度
    maxStackHeight = Math.max(...grid)
    maxHeight.value = maxStackHeight
    sandCount.value = particles.length
    
    // 堆满后清空
    if (maxStackHeight * gridCellSize > p.height * 0.95) {
      particles = []
      initGrid()
    }
    
    // 限制粒子数量
    if (particles.length > 3000) {
      // 移除底部的已堆积粒子
      particles = particles.filter(p => !p.settled || p.y < p.height - 50)
    }
  }

  p.mousePressed = () => {
    // 点击产生爆炸效果
    for (let particle of particles) {
      particle.applyExplosion(p.mouseX, p.mouseY)
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    initGrid()
    particles = []
  }
}

onMounted(() => {
  p5Instance = new p5(sketch)
})

onBeforeUnmount(() => {
  if (p5Instance) {
    p5Instance.remove()
  }
})
</script>

<style scoped lang="less">
.quicksand-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  #p5-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .controls {
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    backdrop-filter: none;
    border: none;

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 0.9;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      color: #c2b280;
    }

    .info {
      p {
        margin: 0;
        font-size: 0.75rem;
        opacity: 0.75;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        color: #c2b280;
      }
    }
  }
}
</style>
