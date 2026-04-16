<template>
  <div class="cell-division-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击创建新细胞 | 空格清空重来</p>
      <div class="info">
        <p>细胞数: {{ cellCount }} | 世代: {{ generation }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const cellCount = ref(0)
const generation = ref(0)

let p5Instance = null
let cells = []
let connections = []
let maxGeneration = 0
const MAX_CELLS = 500

class Cell {
  constructor(x, y, gen, parentHue) {
    this.pos = { x, y }
    this.targetRadius = 12 + p5Instance.random(8)
    this.radius = 0
    this.hue = (parentHue + 15) % 360
    this.age = 0
    this.generation = gen
    this.children = []
    this.growing = true
    this.drift = { x: 0, y: 0 }
    this.driftVel = { x: p5Instance.random(-0.3, 0.3), y: p5Instance.random(-0.3, 0.3) }
    this.splitThreshold = 120 + p5Instance.random(60)
  }

  update(p) {
    // 生长动画
    if (this.growing && this.radius < this.targetRadius) {
      this.radius += (this.targetRadius - this.radius) * 0.05
      if (p.abs(this.radius - this.targetRadius) < 0.1) {
        this.radius = this.targetRadius
        this.growing = false
      }
    }
    
    // 布朗运动
    this.driftVel.x += p.random(-0.02, 0.02)
    this.driftVel.y += p.random(-0.02, 0.02)
    this.driftVel.x *= 0.98
    this.driftVel.y *= 0.98
    this.drift.x += this.driftVel.x
    this.drift.y += this.driftVel.y
    this.drift.x *= 0.95
    this.drift.y *= 0.95
    
    this.age++
  }

  draw(p) {
    const x = this.pos.x + this.drift.x
    const y = this.pos.y + this.drift.y
    
    p.colorMode(p.HSB, 360, 100, 100, 100)
    
    // 发光效果 - 外层
    for (let i = 4; i > 0; i--) {
      p.noStroke()
      p.fill(this.hue, 60, 90, 8)
      p.circle(x, y, this.radius * 2 + i * 8)
    }
    
    // 发光效果 - 中层
    p.fill(this.hue, 40, 95, 20)
    p.circle(x, y, this.radius * 2 + 4)
    
    // 主体
    p.fill(this.hue, 50, 100, 80)
    p.circle(x, y, this.radius * 2)
    
    // 高光
    p.fill(this.hue, 20, 100, 60)
    p.circle(x - this.radius * 0.3, y - this.radius * 0.3, this.radius * 0.5)
    
    // 细胞核
    p.fill(this.hue, 80, 60, 90)
    p.circle(x, y, this.radius * 0.4)
    
    p.colorMode(p.RGB)
  }

  canSplit() {
    return this.age > this.splitThreshold && !this.growing && cells.length < MAX_CELLS
  }

  split(p) {
    const angle = p.random(p.TWO_PI)
    const distance = this.radius * 2.5
    const x1 = this.pos.x + p.cos(angle) * distance
    const y1 = this.pos.y + p.sin(angle) * distance
    const x2 = this.pos.x + p.cos(angle + p.PI) * distance
    const y2 = this.pos.y + p.sin(angle + p.PI) * distance
    
    const child1 = new Cell(x1, y1, this.generation + 1, this.hue)
    const child2 = new Cell(x2, y2, this.generation + 1, this.hue)
    
    this.children.push(child1, child2)
    
    return [child1, child2]
  }
}

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.parent('p5-canvas')
    
    // 初始细胞
    const initialCell = new Cell(p.width / 2, p.height / 2, 0, 270)
    cells.push(initialCell)
    updateStats()
  }

  p.draw = () => {
    // 明亮渐变背景
    const bgGradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height)
    bgGradient.addColorStop(0, '#F3E5F5')
    bgGradient.addColorStop(0.5, '#E1F5FE')
    bgGradient.addColorStop(1, '#FFF8E1')
    p.drawingContext.fillStyle = bgGradient
    p.noStroke()
    p.rect(0, 0, p.width, p.height)
    
    // 更新和绘制连接
    p.stroke(180, 140, 200, 40)
    p.strokeWeight(1)
    for (let cell of cells) {
      for (let child of cell.children) {
        if (cells.includes(child)) {
          p.line(
            cell.pos.x + cell.drift.x,
            cell.pos.y + cell.drift.y,
            child.pos.x + child.drift.x,
            child.pos.y + child.drift.y
          )
        }
      }
    }
    
    // 细胞分裂
    const newCells = []
    for (let cell of cells) {
      if (cell.canSplit() && p.random() < 0.02) {
        const children = cell.split(p)
        newCells.push(...children)
      }
    }
    cells.push(...newCells)
    
    // 更新和绘制细胞
    for (let cell of cells) {
      cell.update(p)
      cell.draw(p)
    }
    
    // 更新统计
    if (newCells.length > 0 || p.frameCount % 30 === 0) {
      updateStats()
    }
  }

  p.mousePressed = () => {
    // 点击创建新细胞
    const newCell = new Cell(p.mouseX, p.mouseY, 0, p.random(360))
    cells.push(newCell)
    updateStats()
  }

  p.keyPressed = () => {
    if (p.key === ' ') {
      // 清空重来
      cells = []
      connections = []
      maxGeneration = 0
      const initialCell = new Cell(p.width / 2, p.height / 2, 0, 270)
      cells.push(initialCell)
      updateStats()
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

const updateStats = () => {
  cellCount.value = cells.length
  maxGeneration = 0
  for (let cell of cells) {
    if (cell.generation > maxGeneration) {
      maxGeneration = cell.generation
    }
  }
  generation.value = maxGeneration
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
.cell-division-container {
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
    cursor: crosshair;
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
    color: #ff6a00;

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 0.9;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .info p {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.75;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
