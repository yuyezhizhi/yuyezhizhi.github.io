<template>
  <div class="fish-group-page">
    <div class="fullscreen-canvas" ref="canvasContainer"></div>
    <div class="controls">
      <p class="instruction">点击产生波浪驱赶鱼群</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// === 鱼群模拟 (Boids Algorithm) ===
// 基于 Processing 示例转换为 Vue 3 + p5.js

const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  let boids = []
  const numBoids = 100
  let waves = [] // 存储波浪
  let mouseCircleSize = 30 // 鼠标圆圈大小

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    for (let i = 0; i < numBoids; i++) {
      boids.push(new Boid(
        p.random(p.width),
        p.random(p.height)
      ))
    }
  }

  p.draw = () => {
    p.background(30, 40, 60)

    // 更新和绘制波浪
    for (let i = waves.length - 1; i >= 0; i--) {
      let wave = waves[i]
      wave.update()
      wave.show()
      if (wave.isDead()) {
        waves.splice(i, 1)
      }
    }

    for (let boid of boids) {
      boid.edges()
      boid.flock(boids)
      boid.reactToWaves(waves) // 鱼群对波浪的反应
      boid.update()
      boid.show()
    }

    // 绘制半透明小圆形鼠标
    drawMouseCircle()

  }

  // 绘制半透明小圆形鼠标
  const drawMouseCircle = () => {
    p.push()
    p.fill(255, 255, 255, 100)
    p.noStroke()
    p.circle(p.mouseX, p.mouseY, 16)
    p.pop()
  }

  // 鼠标点击产生波浪
  p.mousePressed = () => {
    waves.push(new Wave(p.mouseX, p.mouseY))
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  // 波浪类
  class Wave {
    constructor(x, y) {
      this.pos = p.createVector(x, y)
      this.radius = 10
      this.maxRadius = 300
      this.speed = 4
      this.alpha = 255
      this.strength = 2 // 波浪强度
    }

    update() {
      this.radius += this.speed
      this.alpha = p.map(this.radius, 10, this.maxRadius, 255, 0)
    }

    show() {
      p.push()
      p.noFill()
      p.stroke(100, 200, 255, this.alpha)
      p.strokeWeight(3)
      p.circle(this.pos.x, this.pos.y, this.radius * 2)
      
      // 内部弱一点的波纹
      p.stroke(150, 220, 255, this.alpha * 0.5)
      p.strokeWeight(2)
      p.circle(this.pos.x, this.pos.y, this.radius * 1.5)
      p.pop()
    }

    isDead() {
      return this.radius > this.maxRadius
    }

    // 获取在波浪影响范围内的力
    getForce(boidPos) {
      let d = p.dist(this.pos.x, this.pos.y, boidPos.x, boidPos.y)
      // 只在波浪边缘附近产生力
      let waveWidth = 30
      if (d > this.radius - waveWidth && d < this.radius + waveWidth) {
        let force = p5.Vector.sub(boidPos, this.pos)
        force.normalize()
        force.mult(this.strength)
        return force
      }
      return p.createVector(0, 0)
    }
  }

  class Boid {
    constructor(x, y) {
      this.pos = p.createVector(x, y)
      this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1))
      this.acc = p.createVector(0, 0)
      this.maxSpeed = 3
      this.maxForce = 0.1
    }

    edges() {
      if (this.pos.x > p.width) this.pos.x = 0
      if (this.pos.x < 0) this.pos.x = p.width
      if (this.pos.y > p.height) this.pos.y = 0
      if (this.pos.y < 0) this.pos.y = p.height
    }

    flock(boids) {
      let alignment = this.align(boids)
      let cohesion = this.cohere(boids)
      let separation = this.separate(boids)

      alignment.mult(1.5)
      cohesion.mult(1.0)
      separation.mult(1.8)

      this.acc.add(alignment)
      this.acc.add(cohesion)
      this.acc.add(separation)
    }

    align(boids) {
      let perceptionRadius = 50
      let steering = p.createVector(0, 0)
      let total = 0

      for (let other of boids) {
        let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
        if (other !== this && d < perceptionRadius) {
          steering.add(other.vel)
          total++
        }
      }

      if (total > 0) {
        steering.div(total)
        steering.setMag(this.maxSpeed)
        steering.sub(this.vel)
        steering.limit(this.maxForce)
      }
      return steering
    }

    cohere(boids) {
      let perceptionRadius = 75
      let steering = p.createVector(0, 0)
      let total = 0

      for (let other of boids) {
        let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
        if (other !== this && d < perceptionRadius) {
          steering.add(other.pos)
          total++
        }
      }

      if (total > 0) {
        steering.div(total)
        steering.sub(this.pos)
        steering.setMag(this.maxSpeed)
        steering.sub(this.vel)
        steering.limit(this.maxForce)
      }
      return steering
    }

    separate(boids) {
      let perceptionRadius = 50
      let steering = p.createVector(0, 0)
      let total = 0

      for (let other of boids) {
        let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
        if (other !== this && d < perceptionRadius) {
          let diff = p5.Vector.sub(this.pos, other.pos)
          diff.div(d)
          steering.add(diff)
          total++
        }
      }

      if (total > 0) {
        steering.div(total)
        steering.setMag(this.maxSpeed)
        steering.sub(this.vel)
        steering.limit(this.maxForce)
      }
      return steering
    }

    update() {
      this.pos.add(this.vel)
      this.vel.add(this.acc)
      this.vel.limit(this.maxSpeed)
      this.acc.mult(0)
    }

    // 对波浪的反应
    reactToWaves(waves) {
      for (let wave of waves) {
        let force = wave.getForce(this.pos)
        if (force.mag() > 0) {
          this.acc.add(force)
        }
      }
    }

    show() {
      let speed = this.vel.mag()
      let hue = p.map(speed, 0, this.maxSpeed, 200, 300)
      p.colorMode(p.HSB)
      p.fill(hue, 70, 90)
      p.noStroke()
      
      p.push()
      p.translate(this.pos.x, this.pos.y)
      p.rotate(this.vel.heading() + p.PI / 2)
      p.beginShape()
      p.vertex(0, -8)
      p.vertex(-5, 8)
      p.vertex(5, 8)
      p.endShape(p.CLOSE)
      p.pop()
      
      p.colorMode(p.RGB)
    }
  }
}

onMounted(() => {
  if (canvasContainer.value) {
    sketchInstance = new p5(sketch, canvasContainer.value)
  }
})

onUnmounted(() => {
  if (sketchInstance) {
    sketchInstance.remove()
  }
})
</script>

<style scoped>
.fish-group-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.fullscreen-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: #1e283c;
  z-index: 1;
  cursor: none;
}

.fullscreen-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: none;
}

.controls {
  position: fixed;
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
  z-index: 10;

  .instruction {
    margin: 0;
    font-size: 0.75rem;
    opacity: 1;
    line-height: 1.3;
    white-space: nowrap;
  }
}
</style>