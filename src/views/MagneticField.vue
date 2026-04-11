<template>
  <div class="magnetic-field-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">拖拽移动磁极 | 空格切换极性</p>
      <div class="info">
        <p>磁极: 2 | 粒子: {{ particleCount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const particleCount = ref(300)

let p5Instance = null
let particles = []
let magnets = []
let draggedMagnet = null
let polarity = 1 // 1: N左S右, -1: S左N右

class Magnet {
  constructor(x, y, type) {
    this.pos = p5Instance.createVector(x, y)
    this.type = type // 'N' 或 'S'
    this.radius = 25
    this.pulsePhase = type === 'N' ? 0 : Math.PI
  }

  getFieldAt(target) {
    let dir = p5.Vector.sub(target, this.pos)
    let dist = dir.mag()
    if (dist < 10) dist = 10
    dir.normalize()
    
    // 磁场强度与距离平方成反比
    let strength = 50000 / (dist * dist)
    
    // N极排斥，S极吸引（简化模型）
    if (this.type === 'N') {
      dir.mult(-strength)
    } else {
      dir.mult(strength)
    }
    return dir
  }

  update() {
    this.pulsePhase += 0.05
  }

  draw(p) {
    let pulse = Math.sin(this.pulsePhase) * 5
    
    // 光晕效果
    for (let i = 3; i > 0; i--) {
      let alpha = 80 - i * 20
      let r = this.radius + i * 15 + pulse
      p.noStroke()
      if (this.type === 'N') {
        p.fill(255, 80, 80, alpha)
      } else {
        p.fill(80, 150, 255, alpha)
      }
      p.circle(this.pos.x, this.pos.y, r * 2)
    }
    
    // 磁极主体
    p.stroke(255, 200)
    p.strokeWeight(2)
    if (this.type === 'N') {
      p.fill(255, 60, 60)
    } else {
      p.fill(60, 120, 255)
    }
    p.circle(this.pos.x, this.pos.y, this.radius * 2)
    
    // 文字
    p.noStroke()
    p.fill(255)
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(20)
    p.textStyle(p.BOLD)
    p.text(this.type, this.pos.x, this.pos.y)
  }
}

class Particle {
  constructor() {
    this.reset()
  }

  reset() {
    this.pos = p5Instance.createVector(
      p5Instance.random(p5Instance.width),
      p5Instance.random(p5Instance.height)
    )
    this.vel = p5Instance.createVector(0, 0)
    this.history = []
    this.maxHistory = 8
  }

  update() {
    // 计算磁场合力
    let totalField = p5Instance.createVector(0, 0)
    let fieldStrength = 0
    
    for (let magnet of magnets) {
      let field = magnet.getFieldAt(this.pos)
      totalField.add(field)
      fieldStrength += field.mag()
    }
    
    // 沿磁力线运动
    totalField.normalize()
    totalField.mult(3)
    this.vel = totalField
    this.pos.add(this.vel)
    
    // 记录轨迹
    this.history.push(this.pos.copy())
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }
    
    // 边界处理
    if (this.pos.x < 0 || this.pos.x > p5Instance.width ||
        this.pos.y < 0 || this.pos.y > p5Instance.height) {
      this.reset()
    }
    
    return fieldStrength
  }

  draw(p, fieldStrength) {
    // 根据磁场强度映射颜色
    // 弱场=深蓝(240°), 中场=青绿(180°), 强场=亮白
    let hue = p.map(fieldStrength, 0, 2, 240, 180, true)
    let sat = p.map(fieldStrength, 0, 2, 80, 0, true)
    let bri = p.map(fieldStrength, 0, 2, 60, 100, true)
    
    p.colorMode(p.HSB, 360, 100, 100, 255)
    
    // 绘制拖尾
    for (let i = 0; i < this.history.length; i++) {
      let alpha = p.map(i, 0, this.history.length, 20, 150)
      let size = p.map(i, 0, this.history.length, 1, 3)
      p.fill(hue, sat, bri, alpha)
      p.noStroke()
      p.circle(this.history[i].x, this.history[i].y, size)
    }
    
    // 绘制粒子
    p.fill(hue, sat, bri, 200)
    p.circle(this.pos.x, this.pos.y, 4)
    
    p.colorMode(p.RGB, 255)
  }
}

const initMagnets = () => {
  magnets = []
  let centerY = p5Instance.height / 2
  let offsetX = p5Instance.width / 4
  
  if (polarity === 1) {
    magnets.push(new Magnet(offsetX, centerY, 'N'))
    magnets.push(new Magnet(p5Instance.width - offsetX, centerY, 'S'))
  } else {
    magnets.push(new Magnet(offsetX, centerY, 'S'))
    magnets.push(new Magnet(p5Instance.width - offsetX, centerY, 'N'))
  }
}

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.parent('p5-canvas')
    p5Instance = p
    
    initMagnets()
    
    // 初始化粒子
    for (let i = 0; i < 300; i++) {
      particles.push(new Particle())
    }
  }

  p.draw = () => {
    // 暗色背景带拖尾
    p.background(10, 10, 26, 30)
    
    // 更新和绘制磁极
    for (let magnet of magnets) {
      magnet.update()
      magnet.draw(p)
    }
    
    // 更新和绘制粒子
    for (let particle of particles) {
      let strength = particle.update()
      particle.draw(p, strength)
    }
    
    // 绘制拖拽线
    if (draggedMagnet) {
      p.stroke(255, 100)
      p.strokeWeight(1)
      p.line(draggedMagnet.pos.x, draggedMagnet.pos.y, p.mouseX, p.mouseY)
    }
  }

  p.mousePressed = () => {
    // 查找最近的磁极
    let minDist = Infinity
    for (let magnet of magnets) {
      let d = p.dist(p.mouseX, p.mouseY, magnet.pos.x, magnet.pos.y)
      if (d < magnet.radius + 10 && d < minDist) {
        minDist = d
        draggedMagnet = magnet
      }
    }
  }

  p.mouseDragged = () => {
    if (draggedMagnet) {
      draggedMagnet.pos.x = p.mouseX
      draggedMagnet.pos.y = p.mouseY
    }
  }

  p.mouseReleased = () => {
    draggedMagnet = null
  }

  p.keyPressed = () => {
    if (p.key === ' ') {
      polarity *= -1
      initMagnets()
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    initMagnets()
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
.magnetic-field-container {
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
      color: #4facfe;
    }

    .info {
      p {
        margin: 0;
        font-size: 0.75rem;
        opacity: 0.75;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        color: #4facfe;
      }
    }
  }
}
</style>
