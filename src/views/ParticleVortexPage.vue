<template>
  <div class="gravity-particles-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">鼠标移动创建粒子 | 点击产生引力波 | 1-3切换模式 | 粒子: {{ particleCount }} | 模式: {{ gravityModes[currentMode] }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const particleCount = ref(0)
const currentMode = ref(0)
const gravityStrength = ref(0.5)

const gravityModes = ['中心引力', '线性重力', '反转重力']

let p5Instance = null
let particles = []
let gravityWells = []
let lastMouseX = 0
let lastMouseY = 0
let isMouseDown = false

class GravityWell {
  constructor(x, y, strength) {
    this.x = x
    this.y = y
    this.strength = strength
    this.radius = 0
    this.maxRadius = 100
    this.alpha = 255
  }

  update() {
    this.radius += 5
    this.alpha -= 2
  }

  draw(p) {
    if (this.alpha <= 0) return

    p.noFill()
    p.stroke(255, 200, 100, this.alpha)
    p.strokeWeight(2)
    p.circle(this.x, this.y, this.radius * 2)
  }

  isDead() {
    return this.alpha <= 0
  }
}

class Particle {
  constructor(x, y) {
    this.pos = p5Instance.createVector(x, y)
    this.vel = p5Instance.createVector(
      p5Instance.random(-1, 1),
      p5Instance.random(-1, 1)
    )
    this.acc = p5Instance.createVector(0, 0)
    this.size = p5Instance.random(3, 6)
    this.mass = p5Instance.random(0.5, 2)
    this.color = p5Instance.color(
      p5Instance.random(150, 255),
      p5Instance.random(100, 200),
      p5Instance.random(200, 255)
    )
    this.life = 255
  }

  applyGravity(gravityWells, mode) {
    for (let well of gravityWells) {
      let dir = p5.Vector.sub(
        p5Instance.createVector(well.x, well.y),
        this.pos
      )
      let distance = dir.mag()

      // 避免除以零
      if (distance < 10) distance = 10

      dir.normalize()

      let strength = 0
      if (mode === 0) {
        // 中心引力（与距离平方成反比）
        strength = well.strength * 1000 / (distance * distance)
      } else if (mode === 1) {
        // 线性重力
        strength = well.strength
      } else if (mode === 2) {
        // 反转重力（排斥）
        strength = -well.strength * 500 / (distance * distance)
      }

      dir.mult(strength)
      this.acc.add(dir)
    }
  }

  applyDrag() {
    // 空气阻力
    let drag = this.vel.copy()
    drag.mult(-1)
    drag.normalize()
    drag.mult(0.01 * this.vel.magSq())
    this.applyForce(drag)
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass)
    this.acc.add(f)
  }

  update() {
    this.applyDrag()
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0)
    this.life -= 0.3

    // 边界反弹
    if (this.pos.x < 0 || this.pos.x > p5Instance.width) {
      this.vel.x *= -0.8
      this.pos.x = p5Instance.constrain(this.pos.x, 0, p5Instance.width)
    }
    if (this.pos.y < 0 || this.pos.y > p5Instance.height) {
      this.vel.y *= -0.8
      this.pos.y = p5Instance.constrain(this.pos.y, 0, p5Instance.height)
    }
  }

  draw() {
    p5Instance.noStroke()
    this.color.setAlpha(Math.floor(this.life))
    p5Instance.fill(this.color)
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
    p.background(15, 15, 25)
  }

  p.draw = () => {
    p.background(15, 15, 25, 50) // 半透明背景

    // 鼠标移动创建粒子
    let speed = p.dist(p.mouseX, p.mouseY, lastMouseX, lastMouseY)
    if (speed > 5) {
      for (let i = 0; i < Math.floor(speed / 5); i++) {
        particles.push(new Particle(
          p.mouseX + p.random(-20, 20),
          p.mouseY + p.random(-20, 20)
        ))
      }
    }

    // 更新和绘制粒子
    for (let particle of particles) {
      particle.applyGravity(gravityWells, currentMode.value)
      particle.update()
      particle.draw()
    }

    // 更新和绘制引力井
    gravityWells = gravityWells.filter(well => {
      well.update()
      well.draw(p)
      return !well.isDead()
    })

    // 移除死亡粒子
    particles = particles.filter(p => !p.isDead())

    // 限制粒子数量
    if (particles.length > 800) {
      particles.splice(0, particles.length - 800)
    }

    particleCount.value = particles.length

    lastMouseX = p.mouseX
    lastMouseY = p.mouseY
  }

  p.mousePressed = () => {
    isMouseDown = true
    // 创建引力井
    gravityWells.push(new GravityWell(p.mouseX, p.mouseY, gravityStrength.value))
  }

  p.mouseReleased = () => {
    isMouseDown = false
  }

  p.mouseDragged = () => {
    if (isMouseDown) {
      // 拖拽时产生多个引力井
      if (p.frameCount % 5 === 0) {
        gravityWells.push(new GravityWell(p.mouseX, p.mouseY, gravityStrength.value * 0.5))
      }
    }
  }

  p.keyPressed = () => {
    const key = parseInt(p.key)
    if (key >= 1 && key <= 3) {
      currentMode.value = key - 1
    } else if (p.key === '+' || p.key === '=') {
      gravityStrength.value = Math.min(gravityStrength.value + 0.1, 2)
    } else if (p.key === '-' || p.key === '_') {
      gravityStrength.value = Math.max(gravityStrength.value - 0.1, 0.1)
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
.gravity-particles-container {
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
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3CradialGradient id='gravityCore' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:1' /%3E%3Cstop offset='30%25' style='stop-color:%23ffd700;stop-opacity:0.9' /%3E%3Cstop offset='60%25' style='stop-color:%23ff8c00;stop-opacity:0.6' /%3E%3Cstop offset='100%25' style='stop-color:%23ff4500;stop-opacity:0' /%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='24' cy='24' r='6' fill='%23ffffff' stroke='%23ffd700' stroke-width='2' /%3E%3Ccircle cx='24' cy='24' r='12' fill='url(%23gravityCore)' opacity='0.7' /%3E%3Ccircle cx='24' cy='24' r='18' fill='none' stroke='%23ff8c00' stroke-width='1.5' opacity='0.5' stroke-dasharray='4,3' /%3E%3Ccircle cx='24' cy='24' r='22' fill='none' stroke='%23ff6347' stroke-width='1' opacity='0.3' stroke-dasharray='3,4' /%3E%3C/svg%3E") 24 24, auto;
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
