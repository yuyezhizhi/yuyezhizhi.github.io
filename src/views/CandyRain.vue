<template>
  <div class="candy-rain-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击下糖果雨 | 接住糖果</p>
      <div class="info">
        <p>得分: {{ score }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const score = ref(0)
let p5Instance = null
let candies = []
let collectedParticles = []

onMounted(() => {
  const sketch = (p) => {
    class Candy {
      constructor(x, y) {
        this.pos = p.createVector(x || p.random(p.width), y || -30)
        this.vel = p.createVector(p.random(-1, 1), p.random(2, 4))
        this.size = p.random(15, 30)
        this.rotation = p.random(p.TWO_PI)
        this.rotationSpeed = p.random(-0.05, 0.05)
        
        // 糖果颜色类型
        const candyTypes = [
          { hue: 340, sat: 70, bri: 90 }, // 粉红
          { hue: 45, sat: 80, bri: 95 },  // 金黄
          { hue: 160, sat: 65, bri: 85 }, // 薄荷绿
          { hue: 280, sat: 60, bri: 90 }, // 紫色
          { hue: 20, sat: 75, bri: 92 },  // 橙色
          { hue: 190, sat: 70, bri: 88 }  // 天蓝
        ]
        this.color = candyTypes[p.floor(p.random(candyTypes.length))]
        
        this.wobble = p.random(p.TWO_PI)
        this.wobbleSpeed = p.random(0.03, 0.08)
      }

      update() {
        this.pos.add(this.vel)
        this.rotation += this.rotationSpeed
        this.wobble += this.wobbleSpeed
        
        // 左右摇摆
        this.pos.x += p.sin(this.wobble) * 0.8
        
        // 加速下落
        this.vel.y += 0.05
      }

      display() {
        // 安全检查
        if (!this.pos || this.pos.x === undefined || this.pos.y === undefined) {
          return
        }
        
        p.push()
        p.translate(this.pos.x, this.pos.y)
        p.rotate(this.rotation)
        p.colorMode(p.HSB)
        
        // 糖果主体
        p.noStroke()
        p.fill(this.color.hue, this.color.sat, this.color.bri)
        
        // 绘制圆形糖果
        p.ellipse(0, 0, this.size * 2)
        
        // 高光
        p.fill(255, 255, 255, 150)
        p.ellipse(-this.size * 0.3, -this.size * 0.3, this.size * 0.6, this.size * 0.5)
        
        // 条纹装饰
        p.stroke(255, 255, 255, 100)
        p.strokeWeight(2)
        for (let i = -1; i <= 1; i++) {
          p.line(i * this.size * 0.4, -this.size * 0.6, i * this.size * 0.4, this.size * 0.6)
        }
        
        p.pop()
      }

      isOffScreen() {
        return this.pos.y > p.height + this.size
      }

      checkCollision(mouseX, mouseY) {
        const d = p.dist(mouseX, mouseY, this.pos.x, this.pos.y)
        return d < this.size + 20
      }
    }

    class CollectionParticle {
      constructor(x, y, hue) {
        this.pos = p.createVector(x, y)
        const angle = p.random(p.TWO_PI)
        this.vel = p.createVector(p.cos(angle), p.sin(angle)).mult(p.random(3, 6))
        this.size = p.random(4, 10)
        this.hue = hue
        this.life = 255
      }

      update() {
        this.pos.add(this.vel)
        this.vel.y += 0.15
        this.life -= 6
        this.size *= 0.96
      }

      display() {
        // 安全检查
        if (!this.pos || this.pos.x === undefined || this.pos.y === undefined) {
          return
        }
        
        p.push()
        p.colorMode(p.HSB)
        p.noStroke()
        p.fill(this.hue, 60, 90, this.life)
        p.ellipse(this.pos.x, this.pos.y, this.size * 2)
        p.pop()
      }

      isDead() {
        return this.life <= 0
      }
    }

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')
    }

    p.draw = () => {
      // 甜美的渐变背景
      const bgGradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height)
      bgGradient.addColorStop(0, '#FFE5F5')
      bgGradient.addColorStop(0.3, '#FFF0F8')
      bgGradient.addColorStop(0.7, '#E8F8FF')
      bgGradient.addColorStop(1, '#F0E8FF')
      p.drawingContext.fillStyle = bgGradient
      p.rect(0, 0, p.width, p.height)
      
      // 添加云朵装饰
      p.push()
      p.colorMode(p.HSB)
      p.noStroke()
      p.fill(0, 0, 100, 60)
      for (let i = 0; i < 5; i++) {
        const x = ((p.millis() * 0.02 + i * 200) % (p.width + 200)) - 100
        const y = 80 + i * 40
        p.ellipse(x, y, 120, 50)
        p.ellipse(x + 40, y - 10, 100, 45)
        p.ellipse(x - 40, y - 10, 100, 45)
      }
      p.pop()

      // 生成新糖果
      if (p.frameCount % 30 === 0) {
        candies.push(new Candy())
      }

      // 更新和显示糖果
      for (let i = candies.length - 1; i >= 0; i--) {
        candies[i].update()
        candies[i].display()
        
        // 检查是否被收集
        if (candies[i].checkCollision(p.mouseX, p.mouseY)) {
          // 收集效果
          for (let j = 0; j < 10; j++) {
            collectedParticles.push(new CollectionParticle(
              candies[i].pos.x,
              candies[i].pos.y,
              candies[i].color.hue
            ))
          }
          score.value += 10
          candies.splice(i, 1)
        } else if (candies[i].isOffScreen()) {
          candies.splice(i, 1)
        }
      }

      // 更新和显示收集粒子
      for (let i = collectedParticles.length - 1; i >= 0; i--) {
        collectedParticles[i].update()
        collectedParticles[i].display()
        if (collectedParticles[i].isDead()) {
          collectedParticles.splice(i, 1)
        }
      }
      
      // 显示鼠标范围的提示圈
      p.push()
      p.colorMode(p.HSB)
      p.noFill()
      p.stroke(320, 50, 90, 100)
      p.strokeWeight(2)
      p.ellipse(p.mouseX, p.mouseY, 50)
      p.pop()
      
      // 绘制自定义鼠标 - 糖果
      p.push()
      p.translate(p.mouseX, p.mouseY)
      p.colorMode(p.HSB)
      
      // 糖果主体
      p.noStroke()
      const candyHue = (p.frameCount * 2) % 360
      p.fill(candyHue, 70, 90)
      p.ellipse(0, 0, 20)
      
      // 条纹
      p.stroke(255, 255, 255, 150)
      p.strokeWeight(2)
      for (let i = -1; i <= 1; i++) {
        p.line(i * 5, -8, i * 5, 8)
      }
      
      // 高光
      p.noStroke()
      p.fill(255, 255, 255, 180)
      p.ellipse(-4, -4, 6, 5)
      
      p.pop()
    }

    p.mouseClicked = () => {
      // 点击产生糖果雨
      for (let i = 0; i < 8; i++) {
        candies.push(new Candy(
          p.mouseX + p.random(-100, 100),
          p.mouseY - 100 + p.random(-50, 50)
        ))
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
.candy-rain-container {
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
    color: #ff6b9d;
    backdrop-filter: none;
    border: none;

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 0.9;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .info {
      p {
        margin: 0;
        font-size: 0.75rem;
        opacity: 0.75;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>
