<template>
  <div class="starlight-dance-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击创造星光 | 移动鼠标吸引星星</p>
      <div class="info">
        <p>星星数: {{ starCount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const starCount = ref(0)
let p5Instance = null
let stars = []

onMounted(() => {
  const sketch = (p) => {
    class Star {
      constructor(x, y, isBurst = false) {
        this.pos = p.createVector(x || p.random(p.width), y || p.random(p.height))
        this.vel = p.createVector(0, 0)
        this.acc = p.createVector(0, 0)
        this.size = isBurst ? p.random(3, 8) : p.random(2, 5)
        this.hue = p.random(40, 60) // 金黄色系
        this.brightness = p.random(85, 100)
        this.twinkleSpeed = p.random(0.05, 0.15)
        this.twinklePhase = p.random(p.TWO_PI)
        this.trail = []
        this.maxTrail = 8
        this.life = 255
        this.isBurst = isBurst
      }

      applyForce(force) {
        this.acc.add(force)
      }

      update() {
        // 保存轨迹
        this.trail.push(this.pos.copy())
        if (this.trail.length > this.maxTrail) {
          this.trail.shift()
        }

        this.vel.add(this.acc)
        this.vel.limit(3)
        this.pos.add(this.vel)
        this.acc.mult(0)
        
        // 闪烁效果
        this.twinklePhase += this.twinkleSpeed
        
        // 边界环绕
        if (this.pos.x < 0) this.pos.x = p.width
        if (this.pos.x > p.width) this.pos.x = 0
        if (this.pos.y < 0) this.pos.y = p.height
        if (this.pos.y > p.height) this.pos.y = 0
        
        // 爆发星星逐渐消失
        if (this.isBurst) {
          this.life -= 2
          this.size *= 0.99
        }
      }

      seek(target) {
        const desired = p.createVector(target.x - this.pos.x, target.y - this.pos.y)
        desired.setMag(0.5)
        const steer = p.createVector(desired.x - this.vel.x, desired.y - this.vel.y)
        steer.limit(0.3)
        this.applyForce(steer)
      }

      display() {
        // 安全检查
        if (!this.pos || this.pos.x === undefined || this.pos.y === undefined) {
          return
        }
        
        p.push()
        p.colorMode(p.HSB)
        
        const twinkle = p.sin(this.twinklePhase) * 0.3 + 0.7
        const currentBrightness = this.brightness * twinkle
        const currentAlpha = this.isBurst ? this.life : 255
        
        // 绘制轨迹
        if (this.trail.length > 1) {
          p.noFill()
          for (let i = 0; i < this.trail.length - 1; i++) {
            const alpha = p.map(i, 0, this.trail.length, 0, currentAlpha * 0.5)
            p.stroke(this.hue, 50, currentBrightness, alpha)
            p.strokeWeight(p.map(i, 0, this.trail.length, 0.5, 2))
            p.line(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y)
          }
        }
        
        // 绘制星星光晕
        for (let r = this.size * 3; r > 0; r -= 2) {
          const alpha = p.map(r, 0, this.size * 3, currentAlpha * 0.8, 0)
          p.noStroke()
          p.fill(this.hue, 40, currentBrightness, alpha)
          p.ellipse(this.pos.x, this.pos.y, r * 2)
        }
        
        // 绘制星星核心
        p.fill(this.hue, 60, 100, currentAlpha)
        p.ellipse(this.pos.x, this.pos.y, this.size * 2)
        
        // 十字光芒
        p.stroke(this.hue, 50, 100, currentAlpha * 0.6)
        p.strokeWeight(1)
        const rayLength = this.size * 2.5
        p.line(this.pos.x - rayLength, this.pos.y, this.pos.x + rayLength, this.pos.y)
        p.line(this.pos.x, this.pos.y - rayLength, this.pos.x, this.pos.y + rayLength)
        
        p.pop()
      }

      isDead() {
        return this.isBurst && this.life <= 0
      }
    }

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')
      
      // 初始创建星星
      for (let i = 0; i < 50; i++) {
        stars.push(new Star())
      }
    }

    p.draw = () => {
      // 深蓝色渐变背景
      const bgGradient = p.drawingContext.createRadialGradient(
        p.width / 2, p.height / 2, 0,
        p.width / 2, p.height / 2, p.width * 0.7
      )
      bgGradient.addColorStop(0, '#1a1a3e')
      bgGradient.addColorStop(0.5, '#0f0f2e')
      bgGradient.addColorStop(1, '#050518')
      p.drawingContext.fillStyle = bgGradient
      p.rect(0, 0, p.width, p.height)
      
      // 添加星云效果
      p.push()
      p.colorMode(p.HSB)
      p.noStroke()
      for (let i = 0; i < 3; i++) {
        const x = p.width / 2 + p.sin(p.millis() * 0.0003 + i * 2) * 200
        const y = p.height / 2 + p.cos(p.millis() * 0.0004 + i * 2) * 150
        const gradient = p.drawingContext.createRadialGradient(x, y, 0, x, y, 250)
        gradient.addColorStop(0, `hsla(${240 + i * 30}, 60%, 50%, 0.08)`)
        gradient.addColorStop(1, 'transparent')
        p.drawingContext.fillStyle = gradient
        p.rect(0, 0, p.width, p.height)
      }
      p.pop()

      // 更新和显示星星
      for (let i = stars.length - 1; i >= 0; i--) {
        // 向鼠标移动
        if (!stars[i].isBurst) {
          const mouseVec = p.createVector(p.mouseX, p.mouseY)
          stars[i].seek(mouseVec)
        }
        
        stars[i].update()
        stars[i].display()
        
        if (stars[i].isDead()) {
          stars.splice(i, 1)
        }
      }

      // 绘制自定义鼠标 - 闪耀的星星
      p.push()
      p.colorMode(p.HSB)
      p.translate(p.mouseX, p.mouseY)
      
      const twinkle = p.sin(p.frameCount * 0.1) * 0.3 + 0.7
      
      // 光芒
      p.stroke(50, 50, 100, 200 * twinkle)
      p.strokeWeight(2)
      const rayLength = 15 * twinkle
      p.line(-rayLength, 0, rayLength, 0)
      p.line(0, -rayLength, 0, rayLength)
      p.line(-rayLength * 0.7, -rayLength * 0.7, rayLength * 0.7, rayLength * 0.7)
      p.line(rayLength * 0.7, -rayLength * 0.7, -rayLength * 0.7, rayLength * 0.7)
      
      // 核心
      p.noStroke()
      p.fill(50, 60, 100)
      p.ellipse(0, 0, 10 * twinkle)
      
      // 光晕
      for (let r = 20; r > 10; r -= 3) {
        const alpha = p.map(r, 10, 20, 100, 20) * twinkle
        p.fill(50, 40, 100, alpha)
        p.ellipse(0, 0, r * 2)
      }
      
      p.pop()

      starCount.value = stars.length
    }

    p.mouseClicked = () => {
      // 创建爆发效果
      for (let i = 0; i < 20; i++) {
        stars.push(new Star(p.mouseX, p.mouseY, true))
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
.starlight-dance-container {
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
    cursor: none; /* 隐藏默认鼠标 */
  }

  .controls {
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    color: #ffd700;
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
        margin: 0;
        font-size: 0.75rem;
        opacity: 0.75;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
