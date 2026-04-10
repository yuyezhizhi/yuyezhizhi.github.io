<template>
  <div class="particle-vortex-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <h3>粒子漩涡</h3>
      <p class="instruction">移动鼠标吸引粒子，点击爆炸，空格切换形状</p>
      <div class="info">
        <p>粒子数: {{ particleCount }}</p>
        <p>当前形状: {{ currentShape }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const particleCount = ref(200)
const currentShape = ref('圆形')

let p5Instance = null
let particles = []
let shapeMode = 0 // 0: 圆形, 1: 方形, 2: 三角形
const shapes = ['圆形', '方形', '三角形']

class Particle {
  constructor(x, y) {
    this.pos = p5Instance.createVector(x, y)
    this.vel = p5Instance.createVector(
      p5Instance.random(-2, 2),
      p5Instance.random(-2, 2)
    )
    this.acc = p5Instance.createVector(0, 0)
    this.size = p5Instance.random(3, 8)
    this.color = p5Instance.color(
      p5Instance.random(100, 255),
      p5Instance.random(100, 255),
      p5Instance.random(150, 255)
    )
    this.life = 255
  }

  applyForce(force) {
    this.acc.add(force)
  }

  update() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0)
    this.life -= 0.5

    // 边界反弹
    if (this.pos.x < 0 || this.pos.x > p5Instance.width) {
      this.vel.x *= -1
    }
    if (this.pos.y < 0 || this.pos.y > p5Instance.height) {
      this.vel.y *= -1
    }
  }

  draw() {
    p5Instance.noStroke()
    this.color.setAlpha(Math.floor(this.life))
    p5Instance.fill(this.color)

    if (shapeMode === 0) {
      p5Instance.circle(this.pos.x, this.pos.y, this.size)
    } else if (shapeMode === 1) {
      p5Instance.rectMode(p5Instance.CENTER)
      p5Instance.rect(this.pos.x, this.pos.y, this.size, this.size)
    } else if (shapeMode === 2) {
      this.drawTriangle(this.pos.x, this.pos.y, this.size)
    }
  }

  drawTriangle(x, y, size) {
    p5Instance.triangle(
      x, y - size,
      x - size * 0.866, y + size * 0.5,
      x + size * 0.866, y + size * 0.5
    )
  }

  isDead() {
    return this.life <= 0
  }
}

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-canvas')
    p.background(10, 10, 30)

    // 初始化粒子
    for (let i = 0; i < 200; i++) {
      particles.push(new Particle(
        p.random(p.width),
        p.random(p.height)
      ))
    }
  }

  p.draw = () => {
    p.background(10, 10, 30, 50) // 半透明背景实现拖尾效果

    // 鼠标吸引力
    for (let particle of particles) {
      let mouse = p.createVector(p.mouseX, p.mouseY)
      let dir = p5.Vector.sub(mouse, particle.pos)
      let distance = dir.mag()

      if (distance < 200) {
        dir.normalize()
        dir.mult(0.3)
        particle.applyForce(dir)
      }

      // 漩涡效果
      let vortex = p5.Vector.sub(mouse, particle.pos)
      vortex.mult(-0.05) // 向心力
      let angle = p.atan2(vortex.y, vortex.x)
      vortex.rotate(p.PI / 2) // 旋转90度
      vortex.mult(0.2)
      particle.applyForce(vortex)

      particle.update()
      particle.draw()
    }

    // 移除死亡粒子
    particles = particles.filter(p => !p.isDead())

    // 维持粒子数量
    while (particles.length < 200) {
      particles.push(new Particle(
        p.random(p.width),
        p.random(p.height)
      ))
    }

    particleCount.value = particles.length
  }

  p.mousePressed = () => {
    // 粒子爆炸
    let mouse = p.createVector(p.mouseX, p.mouseY)
    for (let i = 0; i < 30; i++) {
      let particle = new Particle(mouse.x, mouse.y)
      let angle = p.random(p.TWO_PI)
      let force = p.random(2, 8)
      particle.vel = p5.Vector.fromAngle(angle).mult(force)
      particles.push(particle)
    }
  }

  p.keyPressed = () => {
    if (p.key === ' ') {
      shapeMode = (shapeMode + 1) % 3
      currentShape.value = shapes[shapeMode]
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
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
.particle-vortex-container {
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
      color: #4ecdc4;
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
