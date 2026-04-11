<template>
  <div class="gravity-field-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击创建吸引点 | 右键删除最近吸引点</p>
      <div class="info">
        <p>吸引点: {{ attractorCount }}</p>
        <p>粒子数: {{ particleCount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const attractorCount = ref(0)
const particleCount = ref(0)
let p5Instance = null
let attractors = []
let particles = []

onMounted(() => {
  const sketch = (p) => {
    class Attractor {
      constructor(x, y) {
        this.pos = p.createVector(x, y)
        this.mass = p.random(50, 150)
        this.pulsePhase = p.random(p.TWO_PI)
        this.pulseSpeed = p.random(0.02, 0.05)
        this.colorHue = p.random(180, 320)
      }

      display() {
        this.pulsePhase += this.pulseSpeed
        const pulse = p.sin(this.pulsePhase) * 0.3 + 0.7
        const baseSize = p.map(this.mass, 50, 150, 15, 30)
        
        p.push()
        p.colorMode(p.HSB)
        p.noFill()
        
        // 多层发光圆环
        for (let i = 3; i > 0; i--) {
          const alpha = p.map(i, 0, 3, 200, 50) * pulse
          p.stroke(this.colorHue, 70, 100, alpha)
          p.strokeWeight(i * 1.5)
          p.ellipse(this.pos.x, this.pos.y, baseSize * i * 1.5)
        }
        
        // 核心
        p.noStroke()
        p.fill(this.colorHue, 80, 100, 255)
        p.ellipse(this.pos.x, this.pos.y, baseSize * 0.5)
        
        p.pop()
      }
    }

    class Particle {
      constructor() {
        this.pos = p.createVector(p.random(p.width), p.random(p.height))
        this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1))
        this.acc = p.createVector(0, 0)
        this.trail = []
        this.maxTrail = 10
        this.mass = 1
      }

      applyGravity(attractors) {
        for (let attractor of attractors) {
          const force = p.createVector(
            attractor.pos.x - this.pos.x,
            attractor.pos.y - this.pos.y
          )
          let d = force.mag()
          d = p.constrain(d, 10, 500)
          force.normalize()
          const G = 0.5
          const strength = (G * attractor.mass * this.mass) / (d * d)
          force.mult(strength)
          this.acc.add(force)
        }
      }

      update() {
        // 保存轨迹
        this.trail.push(this.pos.copy())
        if (this.trail.length > this.maxTrail) {
          this.trail.shift()
        }

        this.vel.add(this.acc)
        this.vel.limit(8)
        this.pos.add(this.vel)
        this.acc.mult(0)

        // 边界环绕
        if (this.pos.x < 0) this.pos.x = p.width
        if (this.pos.x > p.width) this.pos.x = 0
        if (this.pos.y < 0) this.pos.y = p.height
        if (this.pos.y > p.height) this.pos.y = 0
      }

      display() {
        const speed = this.vel.mag()
        const hue = p.map(speed, 0, 8, 220, 0) // 慢=蓝色，快=红色
        const brightness = p.map(speed, 0, 8, 70, 100)
        
        p.push()
        p.colorMode(p.HSB)
        
        // 绘制拖尾
        if (this.trail.length > 1) {
          p.noFill()
          for (let i = 0; i < this.trail.length - 1; i++) {
            const alpha = p.map(i, 0, this.trail.length, 0, 150)
            const weight = p.map(i, 0, this.trail.length, 0.5, 2)
            p.stroke(hue, 60, brightness, alpha)
            p.strokeWeight(weight)
            p.line(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y)
          }
        }
        
        // 绘制粒子
        p.noStroke()
        p.fill(hue, 70, brightness, 200)
        p.ellipse(this.pos.x, this.pos.y, 4)
        
        p.pop()
      }
    }

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')
      
      // 创建初始吸引点
      for (let i = 0; i < 3; i++) {
        attractors.push(new Attractor(p.random(p.width * 0.2, p.width * 0.8), p.random(p.height * 0.2, p.height * 0.8)))
      }
      
      // 创建粒子
      for (let i = 0; i < 250; i++) {
        particles.push(new Particle())
      }
    }

    p.draw = () => {
      // 半透明背景覆盖产生拖尾效果
      p.push()
      p.noStroke()
      p.fill(5, 10, 25, 30)
      p.rect(0, 0, p.width, p.height)
      p.pop()
      
      // 绘制吸引点
      for (let attractor of attractors) {
        attractor.display()
      }
      
      // 更新和绘制粒子
      for (let particle of particles) {
        particle.applyGravity(attractors)
        particle.update()
        particle.display()
      }

      attractorCount.value = attractors.length
      particleCount.value = particles.length
    }

    p.mouseClicked = () => {
      // 左键创建新吸引点
      if (p.mouseButton === p.LEFT) {
        attractors.push(new Attractor(p.mouseX, p.mouseY))
      }
    }

    p.mousePressed = () => {
      // 右键删除最近的吸引点
      if (p.mouseButton === p.RIGHT) {
        if (attractors.length > 0) {
          let closestIndex = 0
          let closestDist = Infinity
          for (let i = 0; i < attractors.length; i++) {
            const d = p.dist(p.mouseX, p.mouseY, attractors[i].pos.x, attractors[i].pos.y)
            if (d < closestDist) {
              closestDist = d
              closestIndex = i
            }
          }
          if (closestDist < 100) {
            attractors.splice(closestIndex, 1)
          }
        }
        return false
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  p5Instance = new p5(sketch)
})

onBeforeUnmount(() => {
  if (p5Instance) {
    p5Instance.remove()
  }
})
</script>

<style scoped lang="less">
.gravity-field-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #050a19;

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
    color: #00d2ff;
    backdrop-filter: none;
    border: none;

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 0.9;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .info {
      p {
        margin: 0 0 0.3rem 0;
        font-size: 0.75rem;
        opacity: 0.75;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
