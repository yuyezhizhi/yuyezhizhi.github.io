<template>
  <div class="fireworks-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击发射烟花 | 空格暂停/继续</p>
      <div class="info">
        <p>粒子: {{ particleCount }} | 爆炸: {{ explosionCount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const particleCount = ref(0)
const explosionCount = ref(0)

let p5Instance = null
let rockets = []
let particles = []
let sparks = []
let autoFire = true
let lastAutoFire = 0
let flashes = []

class Rocket {
  constructor(x, targetY) {
    this.pos = p5Instance.createVector(x, p5Instance.height)
    this.vel = p5Instance.createVector(0, p5Instance.random(-8, -12))
    this.acc = p5Instance.createVector(0, 0)
    this.targetY = targetY
    this.exploded = false
    this.hue = p5Instance.random(360)
    this.trail = []
  }

  applyForce(force) {
    this.acc.add(force)
  }

  update() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0)
    
    // 记录轨迹
    this.trail.push(this.pos.copy())
    if (this.trail.length > 10) {
      this.trail.shift()
    }
    
    // 到达目标高度或速度向上减小时爆炸
    if (this.vel.y > -2 || this.pos.y < this.targetY) {
      this.explode()
    }
  }

  explode() {
    this.exploded = true
    explosionCount.value++
    
    // 闪光效果（缩小到1/5）
    flashes.push({
      x: this.pos.x,
      y: this.pos.y,
      radius: 0,
      maxRadius: 20,
      alpha: 255
    })
    
    // 随机爆炸类型
    let type = Math.floor(p5Instance.random(4))
    let count = p5Instance.random(100, 150)
    
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(this.pos.x, this.pos.y, this.hue, type, i, count))
    }
  }

  draw(p) {
    p.colorMode(p.HSB, 360, 100, 100, 255)
    
    // 绘制尾迹
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = p.map(i, 0, this.trail.length, 50, 200)
      p.fill(this.hue, 80, 100, alpha)
      p.noStroke()
      let size = p.map(i, 0, this.trail.length, 1, 4)
      p.circle(this.trail[i].x, this.trail[i].y, size)
    }
    
    // 绘制火箭
    p.fill(this.hue, 80, 100)
    p.circle(this.pos.x, this.pos.y, 5)
    
    p.colorMode(p.RGB, 255)
  }
}

class Particle {
  constructor(x, y, hue, type, index, total) {
    this.pos = p5Instance.createVector(x, y)
    this.hue = hue + p5Instance.random(-20, 20)
    this.sat = p5Instance.random(60, 100)
    this.bri = p5Instance.random(80, 100)
    this.life = 255
    this.decay = p5Instance.random(2, 5)
    this.size = p5Instance.random(2, 5)
    
    // 根据爆炸类型设置速度
    let angle, speed
    switch(type) {
      case 0: // 圆形爆炸
        angle = p5Instance.random(p5Instance.TWO_PI)
        speed = p5Instance.random(2, 8)
        break
      case 1: // 环形爆炸
        angle = (index / total) * p5Instance.TWO_PI
        speed = p5Instance.random(4, 7)
        break
      case 2: // 心形爆炸
        let t = (index / total) * p5Instance.TWO_PI
        let heartX = 16 * Math.pow(Math.sin(t), 3)
        let heartY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
        angle = Math.atan2(heartY, heartX)
        speed = p5Instance.random(3, 6)
        break
      case 3: // 螺旋爆炸
        angle = index * 0.3
        speed = p5Instance.random(2, 6)
        break
    }
    
    this.vel = p5.Vector.fromAngle(angle)
    this.vel.mult(speed)
  }

  update() {
    // 重力
    this.vel.y += 0.05
    // 阻力
    this.vel.mult(0.98)
    this.pos.add(this.vel)
    this.life -= this.decay
    
    // 生命末期产生火星
    if (this.life < 50 && this.life > 10 && p5Instance.random() < 0.1) {
      sparks.push(new Spark(this.pos.x, this.pos.y, this.hue))
    }
  }

  draw(p) {
    p.colorMode(p.HSB, 360, 100, 100, 255)
    p.fill(this.hue, this.sat, this.bri, this.life)
    p.noStroke()
    p.circle(this.pos.x, this.pos.y, this.size)
    p.colorMode(p.RGB, 255)
  }

  isDead() {
    return this.life <= 0
  }
}

class Spark {
  constructor(x, y, hue) {
    this.pos = p5Instance.createVector(x, y)
    this.vel = p5.Vector.random2D()
    this.vel.mult(p5Instance.random(0.5, 2))
    this.hue = hue
    this.life = 100
    this.size = p5Instance.random(1, 2)
  }

  update() {
    this.vel.y += 0.03
    this.vel.mult(0.95)
    this.pos.add(this.vel)
    this.life -= 3
  }

  draw(p) {
    p.colorMode(p.HSB, 360, 100, 100, 255)
    p.fill(this.hue, 60, 100, this.life)
    p.noStroke()
    p.circle(this.pos.x, this.pos.y, this.size)
    p.colorMode(p.RGB, 255)
  }

  isDead() {
    return this.life <= 0
  }
}

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.parent('p5-canvas')
    p5Instance = p
    p.background(0)
  }

  p.draw = () => {
    // 半透明黑色覆盖产生拖尾
    p.background(0, 30)
    
    // 自动发射
    if (autoFire && p.millis() - lastAutoFire > p.random(1000, 2000)) {
      let x = p.random(p.width * 0.2, p.width * 0.8)
      let targetY = p.random(p.height * 0.2, p.height * 0.5)
      rockets.push(new Rocket(x, targetY))
      lastAutoFire = p.millis()
    }
    
    // 更新和绘制火箭
    for (let i = rockets.length - 1; i >= 0; i--) {
      rockets[i].update()
      rockets[i].draw(p)
      if (rockets[i].exploded) {
        rockets.splice(i, 1)
      }
    }
    
    // 更新和绘制粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update()
      particles[i].draw(p)
      if (particles[i].isDead()) {
        particles.splice(i, 1)
      }
    }
    
    // 更新和绘制火星
    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update()
      sparks[i].draw(p)
      if (sparks[i].isDead()) {
        sparks.splice(i, 1)
      }
    }
    
    // 更新和绘制闪光
    for (let i = flashes.length - 1; i >= 0; i--) {
      let f = flashes[i]
      f.radius += 2  // 减小扩散速度
      f.alpha -= 20  // 加快淡出
      
      // 限制最大半径
      if (f.radius > f.maxRadius) {
        f.radius = f.maxRadius
      }
      
      if (f.alpha > 0) {
        p.noStroke()
        p.fill(255, f.alpha)
        p.circle(f.x, f.y, f.radius * 2)
      } else {
        flashes.splice(i, 1)
      }
    }
    
    // 更新计数
    particleCount.value = particles.length + sparks.length
  }

  p.mousePressed = () => {
    // 鼠标点击发射烟花
    let targetY = p.random(p.height * 0.2, p.height * 0.5)
    rockets.push(new Rocket(p.mouseX, targetY))
  }

  p.keyPressed = () => {
    if (p.key === ' ') {
      autoFire = !autoFire
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    p.background(0)
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
.fireworks-container {
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
    right: 80px;
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
      color: #f5af19;
    }

    .info {
      p {
        margin: 0;
        font-size: 0.75rem;
        opacity: 0.75;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        color: #f5af19;
      }
    }
  }
}
</style>
