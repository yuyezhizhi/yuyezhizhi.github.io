<template>
  <div class="black-hole-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">移动鼠标控制黑洞 | 点击产生引力波</p>
      <div class="info">
        <p>粒子数: {{ particleCount }}</p>
        <p>已吸入: {{ absorbedCount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const particleCount = ref(0)
const absorbedCount = ref(0)
let p5Instance = null
let particles = []
let jetParticles = []
let blackHolePos = null
let targetBlackHolePos = null
let wavePulse = 0
let waveActive = false

onMounted(() => {
  const sketch = (p) => {
    class Particle {
      constructor(x, y, isJet = false) {
        if (isJet) {
          // 喷流粒子从中心产生
          this.pos = p.createVector(blackHolePos.x, blackHolePos.y)
          const angle = p.random() < 0.5 ? -p.HALF_PI : p.HALF_PI
          const spread = p.random(-0.3, 0.3)
          this.vel = p5.Vector.fromAngle(angle + spread).mult(p.random(3, 8))
          this.isJet = true
          this.life = 255
        } else {
          // 普通粒子从边缘产生
          const edge = p.floor(p.random(4))
          switch(edge) {
            case 0: this.pos = p.createVector(p.random(p.width), -10); break
            case 1: this.pos = p.createVector(p.width + 10, p.random(p.height)); break
            case 2: this.pos = p.createVector(p.random(p.width), p.height + 10); break
            case 3: this.pos = p.createVector(-10, p.random(p.height)); break
          }
          
          // 初始切向速度
          const toCenter = p.createVector(blackHolePos.x - this.pos.x, blackHolePos.y - this.pos.y)
          const angle = toCenter.heading()
          const tangentAngle = angle + p.random(-0.5, 0.5) + (p.random() < 0.5 ? p.HALF_PI : -p.HALF_PI)
          this.vel = p5.Vector.fromAngle(tangentAngle).mult(p.random(1, 3))
          this.isJet = false
          this.life = 255
        }
        
        this.acc = p.createVector(0, 0)
        this.size = p.random(2, 5)
      }

      applyBlackHoleGravity() {
        const force = p.createVector(
          blackHolePos.x - this.pos.x,
          blackHolePos.y - this.pos.y
        )
        const d = force.mag()
        
        if (!this.isJet && d < 15) {
          return true // 被吸入
        }
        
        force.normalize()
        const G = this.isJet ? 0.1 : 0.8
        const strength = G * 1000 / (d * d + 100)
        force.mult(strength)
        
        // 切向力保持旋转
        if (!this.isJet) {
          const tangent = p.createVector(-force.y, force.x)
          tangent.mult(0.3)
          this.acc.add(tangent)
        }
        
        this.acc.add(force)
        return false
      }

      update() {
        if (this.isJet) {
          this.vel.mult(0.98)
          this.life -= 3
        }
        
        this.vel.add(this.acc)
        this.vel.limit(this.isJet ? 15 : 12)
        this.pos.add(this.vel)
        this.acc.mult(0)
      }

      display() {
        const d = p.dist(this.pos.x, this.pos.y, blackHolePos.x, blackHolePos.y)
        let hue = p.map(d, 0, 300, 300, 240)
        if (hue > 360) hue -= 360
        
        const brightness = p.map(d, 0, 400, 100, 60)
        const speed = this.vel.mag()
        const alpha = this.isJet ? this.life : p.map(speed, 0, 10, 100, 255)
        
        p.push()
        p.colorMode(p.HSB)
        p.noStroke()
        p.fill(hue, this.isJet ? 40 : 70, brightness, alpha)
        
        const glowSize = this.size * (1 + speed * 0.3)
        p.ellipse(this.pos.x, this.pos.y, glowSize)
        
        // 高亮核心
        p.fill(hue, 30, 100, alpha * 0.8)
        p.ellipse(this.pos.x, this.pos.y, this.size * 0.5)
        p.pop()
      }

      isDead() {
        return this.isJet && this.life <= 0
      }
    }

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')
      
      blackHolePos = p.createVector(p.width / 2, p.height / 2)
      targetBlackHolePos = p.createVector(p.width / 2, p.height / 2)
    }

    p.draw = () => {
      // 极淡的背景覆盖产生拖尾
      p.push()
      p.noStroke()
      p.fill(0, 0, 0, 15)
      p.rect(0, 0, p.width, p.height)
      p.pop()
      
      // 黑洞位置缓动跟随鼠标
      targetBlackHolePos.x = p.mouseX
      targetBlackHolePos.y = p.mouseY
      blackHolePos.x += (targetBlackHolePos.x - blackHolePos.x) * 0.05
      blackHolePos.y += (targetBlackHolePos.y - blackHolePos.y) * 0.05
      
      // 绘制引力波
      if (waveActive) {
        wavePulse += 5
        p.push()
        p.noFill()
        p.strokeWeight(2)
        for (let i = 0; i < 3; i++) {
          const r = wavePulse - i * 30
          if (r > 0 && r < 400) {
            const alpha = p.map(r, 0, 400, 200, 0)
            p.stroke(280, 50, 100, alpha)
            p.ellipse(blackHolePos.x, blackHolePos.y, r * 2)
          }
        }
        if (wavePulse > 500) {
          waveActive = false
          wavePulse = 0
        }
        p.pop()
      }
      
      // 绘制黑洞
      const breath = p.sin(p.frameCount * 0.03) * 0.1 + 1
      p.push()
      
      // 外层光晕 - 紫色
      for (let r = 80 * breath; r > 40; r -= 5) {
        const alpha = p.map(r, 40, 80, 30, 5)
        p.noStroke()
        p.fill(270, 60, 40, alpha)
        p.ellipse(blackHolePos.x, blackHolePos.y, r * 2)
      }
      
      // 吸积盘光晕
      p.colorMode(p.HSB)
      for (let r = 45; r > 20; r -= 2) {
        const hue = p.map(r, 20, 45, 300, 260)
        const alpha = p.map(r, 20, 45, 150, 50)
        p.fill(hue, 80, 90, alpha)
        p.ellipse(blackHolePos.x, blackHolePos.y, r * 2)
      }
      
      // 事件视界 - 纯黑
      p.fill(0, 0, 0, 255)
      p.ellipse(blackHolePos.x, blackHolePos.y, 35)
      
      // 中心亮点
      p.fill(280, 70, 100, 200)
      p.ellipse(blackHolePos.x, blackHolePos.y, 8)
      
      p.pop()
      
      // 生成新粒子
      if (p.frameCount % 2 === 0) {
        const count = p.floor(p.random(3, 6))
        for (let i = 0; i < count; i++) {
          particles.push(new Particle())
        }
      }
      
      // 偶尔产生喷流
      if (p.random() < 0.03) {
        for (let i = 0; i < 15; i++) {
          jetParticles.push(new Particle(0, 0, true))
        }
      }
      
      // 更新和绘制普通粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        const absorbed = particles[i].applyBlackHoleGravity()
        if (absorbed) {
          particles.splice(i, 1)
          absorbedCount.value++
        } else {
          particles[i].update()
          particles[i].display()
        }
      }
      
      // 更新和绘制喷流粒子
      for (let i = jetParticles.length - 1; i >= 0; i--) {
        jetParticles[i].update()
        jetParticles[i].display()
        if (jetParticles[i].isDead()) {
          jetParticles.splice(i, 1)
        }
      }

      particleCount.value = particles.length + jetParticles.length
    }

    p.mouseClicked = () => {
      waveActive = true
      wavePulse = 0
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
.black-hole-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000000;

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
    color: #9b59b6;
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
