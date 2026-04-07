<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
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

    for (let boid of boids) {
      boid.edges()
      boid.flock(boids)
      boid.update()
      boid.show()
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
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
.fullscreen-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: #1e283c;
  z-index: 1;
}

.fullscreen-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>