<template>
  <div class="fluid-simulation-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">粒子: {{ particleCount }} | 颜色: {{ colors[currentColor].name }} |鼠标拖拽生成流体 | 1-8切换颜色 | R重置</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const particleCount = ref(0)
const currentColor = ref(0)

const colors = [
  { name: '天蓝', r: 100, g: 200, b: 255 },
  { name: '珊瑚', r: 255, g: 120, b: 120 },
  { name: '薄荷', r: 100, g: 255, b: 150 },
  { name: '薰衣草', r: 200, g: 150, b: 255 },
  { name: '金黄', r: 255, g: 230, b: 100 },
  { name: '蜜桃', r: 255, g: 180, b: 120 },
  { name: '青柠', r: 150, g: 255, b: 200 },
  { name: '玫瑰', r: 255, g: 150, b: 200 }
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
    // 深色渐变背景
    const bgGradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height)
    bgGradient.addColorStop(0, '#1a1a2e')
    bgGradient.addColorStop(0.5, '#16213e')
    bgGradient.addColorStop(1, '#0f3460')
    p.drawingContext.fillStyle = bgGradient
    p.noStroke()
    p.rect(0, 0, p.width, p.height)

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
    if (key >= 1 && key <= 8) {
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
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='20' viewBox='0 0 16 20'%3E%3Cdefs%3E%3CradialGradient id='waterDrop' cx='40%25' cy='35%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%23e0f7ff;stop-opacity:0.9' /%3E%3Cstop offset='50%25' style='stop-color:%234fc3f7;stop-opacity:0.8' /%3E%3Cstop offset='100%25' style='stop-color:%230288d1;stop-opacity:0.6' /%3E%3C/radialGradient%3E%3ClinearGradient id='highlight' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.8' /%3E%3Cstop offset='100%25' style='stop-color:%23ffffff;stop-opacity:0' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M8 1 C8 1 2 9 2 12 C2 15.3 4.7 18 8 18 C11.3 18 14 15.3 14 12 C14 9 8 1 8 1 Z' fill='url(%23waterDrop)' stroke='%230277bd' stroke-width='0.75' /%3E%3Cellipse cx='6' cy='10' rx='2' ry='3' fill='url(%23highlight)' transform='rotate(-30 6 10)' /%3E%3C/svg%3E") 8 18, auto;
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
