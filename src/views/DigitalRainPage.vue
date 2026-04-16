<template>
  <div class="meteor-shower-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">鼠标移动改变方向 | 点击产生爆发 | 空格切换速度</p>
      <div class="info">
        <p>流星: {{ meteorCount }} | 速度: {{ meteorSpeed.toFixed(1) }}x</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const meteorCount = ref(0)
const meteorSpeed = ref(1.0)
const currentConstellation = ref(0)

const constellations = [
  { name: '随机星座', meteors: [] },
  { name: '双子座', meteors: [] },
  { name: '狮子座', meteors: [] },
  { name: '英仙座', meteors: [] },
  { name: '象限仪座', meteors: [] }
]

let p5Instance = null
let meteors = []
let stars = []
let meteorBaseSpeed = 8
let meteorDirection = p5.Vector.fromAngle(p5.PI / 4) // 45度角
let lastMouseX = 0
let lastMouseY = 0

class Star {
  constructor() {
    this.x = p5Instance.random(p5Instance.width)
    this.y = p5Instance.random(p5Instance.height)
    this.size = p5Instance.random(0.5, 2)
    this.twinkleSpeed = p5Instance.random(0.02, 0.05)
    this.twinkleOffset = p5Instance.random(p5.TWO_PI)
  }

  draw(p, time) {
    const twinkle = p.sin(time * this.twinkleSpeed + this.twinkleOffset)
    const alpha = p.map(twinkle, -1, 1, 100, 255)
    p.noStroke()
    p.fill(255, 255, 255, alpha)
    p.circle(this.x, this.y, this.size)
  }
}

class Meteor {
  constructor(x, y, direction, speed, size) {
    this.pos = p5Instance.createVector(x, y)
    this.direction = direction.copy()
    this.speed = speed * p5Instance.random(0.8, 1.2)
    this.size = size || p5Instance.random(3, 6)
  }

  update() {
    // 更新位置
    this.direction.normalize()
    this.pos.add(this.direction.copy().mult(this.speed))

    // 检查是否超出屏幕
    if (this.pos.x < -100 || this.pos.x > p5Instance.width + 100 ||
        this.pos.y < -100 || this.pos.y > p5Instance.height + 100) {
      return true
    }

    return false
  }

  draw(p) {
    // 绘制短拖尾（固定长度，无放大效果）
    const tailLength = 6
    for (let i = 1; i <= tailLength; i++) {
      const t = i / tailLength
      const alpha = p.map(i, 1, tailLength, 80, 0)  // 渐变透明度
      const prevPos = p5.Vector.sub(this.pos, p5.Vector.mult(this.direction, i * this.speed * 0.8))
      
      p.noStroke()
      p.fill(255, 255, 255, Math.floor(alpha))
      p.circle(prevPos.x, prevPos.y, this.size * 0.6)  // 固定大小，无放大
    }

    // 绘制流星头部
    p.noStroke()
    p.fill(255, 255, 255, 180)
    p.circle(this.pos.x, this.pos.y, this.size)
  }

  isDead() {
    return this.update()
  }
}

class BurstParticle {
  constructor(x, y) {
    this.pos = p5Instance.createVector(x, y)
    this.vel = p5.Vector.fromAngle(p5Instance.random(p5.TWO_PI))
    this.vel.mult(p5Instance.random(2, 6))
    this.life = 255
    this.size = p5Instance.random(1, 3)
    this.color = p5Instance.color(
      p5Instance.random(200, 255),
      p5Instance.random(200, 255),
      p5Instance.random(150, 255)
    )
  }

  update() {
    this.pos.add(this.vel)
    this.vel.mult(0.95) // 减速
    this.life -= 3
  }

  draw(p) {
    p.noStroke()
    this.color.setAlpha(this.life)
    p.fill(this.color)
    p.circle(this.pos.x, this.pos.y, this.size)
  }

  isDead() {
    return this.life <= 0
  }
}

let burstParticles = []

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-canvas')
    
    // 初始化星星
    for (let i = 0; i < 150; i++) {
      stars.push(new Star())
    }
  }

  p.draw = () => {
    // 暗色渐变背景 - 夜空色彩（只绘制一次，不刷新）
    const bgGradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height)
    bgGradient.addColorStop(0, '#1a1a2e')
    bgGradient.addColorStop(0.3, '#16213e')
    bgGradient.addColorStop(0.7, '#0f3460')
    bgGradient.addColorStop(1, '#1a1a2e')
    p.drawingContext.fillStyle = bgGradient
    p.noStroke()
    p.rect(0, 0, p.width, p.height)

    // 绘制星星
    const time = p.millis()
    for (let star of stars) {
      star.draw(p, time)
    }

    // 自动生成流星
    if (p.random() < 0.03 * meteorSpeed.value) {
      const side = Math.floor(p.random(4))
      let x, y

      switch(side) {
        case 0: // 上
          x = p.random(p.width)
          y = -50
          break
        case 1: // 右
          x = p.width + 50
          y = p.random(p.height)
          break
        case 2: // 下
          x = p.random(p.width)
          y = p.height + 50
          break
        case 3: // 左
          x = -50
          y = p.random(p.height)
          break
      }

      const direction = meteorDirection.copy()
      if (currentConstellation.value > 0) {
        // 特定星座方向
        const angle = p5.Vector.sub(
          p5.Vector.fromAngle(p5.random(p5.TWO_PI)),
          p5.Vector.fromAngle(p5.random(p5.TWO_PI))
        ).heading()
        const variance = 0.2
        direction.rotate(p5.random(-variance, variance))
      }

      meteors.push(new Meteor(x, y, direction, meteorBaseSpeed * meteorSpeed.value))
    }

    // 更新和绘制流星
    meteors = meteors.filter(meteor => {
      meteor.draw(p)
      return !meteor.isDead()
    })

    // 更新和绘制爆发粒子
    burstParticles = burstParticles.filter(particle => {
      particle.update()
      particle.draw(p)
      return !particle.isDead()
    })

    // 限制流星数量
    if (meteors.length > 50) {
      meteors.splice(0, meteors.length - 50)
    }

    meteorCount.value = meteors.length

    // 根据鼠标移动调整方向
    const mouseSpeed = p.dist(p.mouseX, p.mouseY, lastMouseX, lastMouseY)
    if (mouseSpeed > 10) {
      const targetDirection = p5.Vector.sub(
        p5Instance.createVector(p.mouseX, p.mouseY),
        p5Instance.createVector(lastMouseX, lastMouseY)
      )
      targetDirection.normalize()
      meteorDirection.lerp(targetDirection, 0.1)
    }

    lastMouseX = p.mouseX
    lastMouseY = p.mouseY
  }

  p.mouseClicked = () => {
    // 产生流星爆发
    for (let i = 0; i < 20; i++) {
      const angle = p.random(p.TWO_PI)
      const speed = meteorBaseSpeed * meteorSpeed.value * 1.5
      meteors.push(new Meteor(
        p.mouseX,
        p.mouseY,
        p.createVector(Math.cos(angle), Math.sin(angle)),
        speed,
        p.random(3, 6)
      ))
    }

    // 添加爆发粒子
    for (let i = 0; i < 15; i++) {
      burstParticles.push(new BurstParticle(p.mouseX, p.mouseY))
    }
  }

  p.keyPressed = () => {
    if (p.key === ' ') {
      // 切换速度
      meteorSpeed.value = meteorSpeed.value >= 3 ? 0.5 : meteorSpeed.value + 0.5
    } else if (p.key === 'r' || p.key === 'R') {
      // 重置流星
      meteors = []
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
    stars = []
    for (let i = 0; i < 300; i++) {
      stars.push(new Star())
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
.meteor-shower-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(to bottom, #0a0a1a 0%, #1a1a3a 100%);

  #p5-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cdefs%3E%3CradialGradient id='blackHole' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:1' /%3E%3Cstop offset='60%25' style='stop-color:%23000000;stop-opacity:0.9' /%3E%3Cstop offset='80%25' style='stop-color:%234a0080;stop-opacity:0.6' /%3E%3Cstop offset='100%25' style='stop-color:%238b00ff;stop-opacity:0' /%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='20' cy='20' r='18' fill='url(%23blackHole)' /%3E%3Ccircle cx='20' cy='20' r='8' fill='%23000000' /%3E%3Ccircle cx='20' cy='20' r='12' fill='none' stroke='%239d4edd' stroke-width='1.5' opacity='0.7' /%3E%3C/svg%3E") 20 20, auto;
  }

  .controls {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.6);
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    color: #a29bfe;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 1;
      font-weight: 500;
    }

    .info {
      p {
        margin: 0;
        font-size: 0.75rem;
        opacity: 0.9;
      }
    }
  }
}
</style>
