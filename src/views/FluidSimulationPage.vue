<template>
  <div class="fluid-simulation-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <h3>流体模拟</h3>
      <p class="instruction">鼠标拖拽生成流体，数字键1-3切换颜色，R重置</p>
      <div class="info">
        <p>粒子数: {{ particleCount }}</p>
        <p>当前颜色: {{ colors[currentColor].name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const particleCount = ref(0)
const currentColor = ref(0)

const colors = [
  { name: '蓝色', r: 0, g: 150, b: 255 },
  { name: '红色', r: 255, g: 80, b: 80 },
  { name: '绿色', r: 80, g: 255, b: 100 },
  { name: '紫色', r: 180, g: 100, b: 255 },
  { name: '黄色', r: 255, g: 220, b: 80 }
]

let p5Instance = null
let particles = []
let gridSize = 20
let cols, rows
let flowField = []
let isMouseDown = false
let lastMouseX = 0
let lastMouseY = 0

class Particle {
  constructor(x, y, colorIndex) {
    this.pos = p5Instance.createVector(x, y)
    this.vel = p5Instance.createVector(0, 0)
    this.acc = p5Instance.createVector(0, 0)
    this.maxSpeed = 3
    this.maxForce = 0.1
    this.size = 4
    this.colorIndex = colorIndex
    this.life = 255
  }

  applyForce(force) {
    this.acc.add(force)
  }

  follow(flowField, cols, rows) {
    const x = Math.floor(this.pos.x / gridSize)
    const y = Math.floor(this.pos.y / gridSize)

    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      const index = x + y * cols
      const force = flowField[index]
      if (force) {
        this.applyForce(force)
      }
    }
  }

  update() {
    this.vel.add(this.acc)
    this.vel.limit(this.maxSpeed)
    this.pos.add(this.vel)
    this.acc.mult(0)
    this.life -= 0.5

    // 边界处理
    if (this.pos.x < 0 || this.pos.x > p5Instance.width ||
        this.pos.y < 0 || this.pos.y > p5Instance.height) {
      this.life = 0
    }
  }

  draw() {
    const color = colors[this.colorIndex]
    p5Instance.noStroke()
    p5Instance.fill(color.r, color.g, color.b, this.life)
    p5Instance.circle(this.pos.x, this.pos.y, this.size)
  }

  isDead() {
    return this.life <= 0
  }
}

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-canvas')
    p.background(20, 20, 30)

    // 初始化流场
    cols = Math.floor(p.width / gridSize)
    rows = Math.floor(p.height / gridSize)
    flowField = new Array(cols * rows)

    // 初始化流场向量
    for (let i = 0; i < flowField.length; i++) {
      const angle = p.noise(i * 0.1) * p.TWO_PI * 2
      flowField[i] = p5.Vector.fromAngle(angle)
    }
  }

  p.draw = () => {
    p.background(20, 20, 30, 20) // 半透明背景实现拖尾

    // 更新流场（使用 Perlin 噪声）
    const time = p.millis() * 0.001
    for (let i = 0; i < flowField.length; i++) {
      const x = i % cols
      const y = Math.floor(i / cols)
      const angle = p.noise(x * 0.1, y * 0.1, time) * p.TWO_PI * 2
      flowField[i] = p5.Vector.fromAngle(angle).mult(0.1)
    }

    // 更新和绘制粒子
    for (let particle of particles) {
      particle.follow(flowField, cols, rows)
      particle.update()
      particle.draw()
    }

    // 移除死亡粒子
    particles = particles.filter(p => !p.isDead())

    // 限制粒子数量
    if (particles.length > 1000) {
      particles.splice(0, particles.length - 1000)
    }

    particleCount.value = particles.length

    // 鼠标交互
    if (isMouseDown) {
      const dx = p.mouseX - lastMouseX
      const dy = p.mouseY - lastMouseY
      const speed = p.sqrt(dx * dx + dy * dy)

      if (speed > 2) {
        // 在鼠标路径上添加粒子
        const steps = Math.floor(speed / 5)
        for (let i = 0; i < steps; i++) {
          const t = i / steps
          const x = lastMouseX + dx * t
          const y = lastMouseY + dy * t
          particles.push(new Particle(x, y, currentColor.value))
        }
      } else {
        particles.push(new Particle(p.mouseX, p.mouseY, currentColor.value))
      }

      // 影响流场
      const gridX = Math.floor(p.mouseX / gridSize)
      const gridY = Math.floor(p.mouseY / gridSize)
      if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
        const index = gridX + gridY * cols
        const angle = Math.atan2(dy, dx)
        const force = p5.Vector.fromAngle(angle).mult(2)
        flowField[index] = force
      }

      lastMouseX = p.mouseX
      lastMouseY = p.mouseY
    }
  }

  p.mousePressed = () => {
    isMouseDown = true
    lastMouseX = p.mouseX
    lastMouseY = p.mouseY

    // 点击处添加一些粒子
    for (let i = 0; i < 5; i++) {
      const offset = p.random(-20, 20)
      particles.push(new Particle(
        p.mouseX + offset,
        p.mouseY + offset,
        currentColor.value
      ))
    }
  }

  p.mouseReleased = () => {
    isMouseDown = false
  }

  p.keyPressed = () => {
    const key = parseInt(p.key)
    if (key >= 1 && key <= 5) {
      currentColor.value = key - 1
    } else if (p.key === 'r' || p.key === 'R') {
      // 重置
      particles = []
      for (let i = 0; i < flowField.length; i++) {
        const angle = p.noise(i * 0.1) * p.TWO_PI * 2
        flowField[i] = p5.Vector.fromAngle(angle)
      }
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
    cols = Math.floor(p.width / gridSize)
    rows = Math.floor(p.height / gridSize)
    flowField = new Array(cols * rows)

    for (let i = 0; i < flowField.length; i++) {
      const angle = p.noise(i * 0.1) * p.TWO_PI * 2
      flowField[i] = p5.Vector.fromAngle(angle)
    }
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
.fluid-simulation-container {
  position: relative;
  width: 100%;
  height: 100vh;
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
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    padding: 1.5rem;
    border-radius: 10px;
    color: white;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);

    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
      color: #a29bfe;
    }

    .instruction {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .info {
      p {
        margin: 0.3rem 0;
        font-size: 0.85rem;
        opacity: 0.7;
      }
    }
  }
}
</style>
