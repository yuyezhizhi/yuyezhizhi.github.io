<template>
  <div class="flower-garden-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击种植花朵 | 自动绽放</p>
      <div class="info">
        <p>花朵数: {{ flowerCount }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const flowerCount = ref(0)
let p5Instance = null
let flowers = []

onMounted(() => {
  const sketch = (p) => {
    class Flower {
      constructor(x, y) {
        this.pos = p.createVector(x, y)
        this.petals = p.floor(p.random(5, 9))
        this.size = 0
        this.maxSize = p.random(30, 60)
        this.hue = p.random(360)
        this.growthSpeed = p.random(0.5, 1.5)
        this.rotation = p.random(p.TWO_PI)
        this.rotationSpeed = p.random(-0.01, 0.01)
        this.stemHeight = 0
        this.maxStemHeight = p.random(80, 150)
        this.bloomPhase = 'growing' // growing, blooming, full
      }

      update() {
        if (this.bloomPhase === 'growing') {
          this.stemHeight += this.growthSpeed * 3  // 加快茎的生长速度
          if (this.stemHeight >= this.maxStemHeight) {
            this.bloomPhase = 'blooming'
          }
        } else if (this.bloomPhase === 'blooming') {
          this.size += this.growthSpeed * 2  // 加快花的开放速度
          this.rotation += this.rotationSpeed
          if (this.size >= this.maxSize) {
            this.bloomPhase = 'full'
          }
        } else {
          this.rotation += this.rotationSpeed * 0.3
        }
      }

      display() {
        // 安全检查
        if (!this.pos || this.pos.x === undefined || this.pos.y === undefined) {
          return
        }
        
        p.push()
        p.colorMode(p.HSB)
        p.translate(this.pos.x, this.pos.y)
        
        // 绘制茎（向上生长，所以是负方向）
        if (this.stemHeight > 0) {
          p.stroke(120, 60, 70)
          p.strokeWeight(3)
          p.line(0, 0, 0, -this.stemHeight)  // 改为负值，向上生长
          
          // 叶子
          if (this.stemHeight > 30) {
            p.noStroke()
            p.fill(120, 50, 75, 200)
            p.push()
            p.translate(0, -this.stemHeight * 0.6)  // 改为负值
            p.rotate(p.PI / 4)
            p.ellipse(15, 0, 20, 8)
            p.pop()
            
            p.push()
            p.translate(0, -this.stemHeight * 0.4)  // 改为负值
            p.rotate(-p.PI / 4)
            p.ellipse(-15, 0, 20, 8)
            p.pop()
          }
        }
        
        // 绘制花瓣（在茎的顶部）
        if (this.size > 5) {  // 确保花朵有足够大小才绘制
          p.push()  // 添加push保存当前状态
          p.translate(0, -this.stemHeight)  // 移动到茎的顶部
          p.rotate(this.rotation)
          p.noStroke()
          
          for (let i = 0; i < this.petals; i++) {
            const angle = p.map(i, 0, this.petals, 0, p.TWO_PI)
            p.push()
            p.rotate(angle)
            
            // 使用简单的椭圆代替复杂的贝塞尔曲线，提升性能
            p.fill(this.hue, 70, 85, 200)
            p.ellipse(this.size * 0.5, 0, this.size, this.size * 0.6)
            
            p.pop()
          }
          
          // 花心
          p.fill(50, 80, 90)
          p.ellipse(0, 0, this.size * 0.4)
          
          // 花心细节
          p.fill(45, 70, 85)
          for (let i = 0; i < 5; i++) {
            const angle = p.map(i, 0, 5, 0, p.TWO_PI)
            const x = p.cos(angle) * this.size * 0.1
            const y = p.sin(angle) * this.size * 0.1
            p.ellipse(x, y, this.size * 0.15)
          }
          
          p.pop()  // 添加pop恢复状态
        }
        
        p.pop()
      }

      isFullyGrown() {
        return this.bloomPhase === 'full'
      }
    }

    class Sparkle {
      constructor(x, y) {
        this.pos = p.createVector(x, y)
        const angle = p.random(p.TWO_PI)
        this.vel = p.createVector(p.cos(angle), p.sin(angle)).mult(p.random(0.5, 2))
        this.size = p.random(2, 5)
        this.life = 255
        this.hue = p.random(360)
      }

      update() {
        this.pos.add(this.vel)
        this.life -= 5
        this.size *= 0.98
      }

      display() {
        // 安全检查
        if (!this.pos || this.pos.x === undefined || this.pos.y === undefined) {
          return
        }
        
        p.push()
        p.colorMode(p.HSB)
        p.noStroke()
        p.fill(this.hue, 50, 95, this.life)
        p.ellipse(this.pos.x, this.pos.y, this.size * 2)
        p.pop()
      }

      isDead() {
        return this.life <= 0
      }
    }

    let sparkles = []

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')
      
      // 初始创建一些花朵
      for (let i = 0; i < 5; i++) {
        flowers.push(new Flower(p.random(100, p.width - 100), p.height - 20))
      }
    }

    p.draw = () => {
      // 温暖的渐变背景
      const gradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height)
      gradient.addColorStop(0, '#FFE5F0')
      gradient.addColorStop(0.5, '#FFF5E6')
      gradient.addColorStop(1, '#E8F5E9')
      p.drawingContext.fillStyle = gradient
      p.rect(0, 0, p.width, p.height)
      
      // 阳光效果
      p.push()
      p.noStroke()
      const sunGradient = p.drawingContext.createRadialGradient(
        p.width * 0.8, 100, 0,
        p.width * 0.8, 100, 200
      )
      sunGradient.addColorStop(0, 'rgba(255, 255, 200, 0.3)')
      sunGradient.addColorStop(1, 'transparent')
      p.drawingContext.fillStyle = sunGradient
      p.rect(0, 0, p.width, p.height)
      p.pop()

      // 更新和显示花朵
      for (let flower of flowers) {
        flower.update()
        flower.display()
        
        // 完全绽放时产生闪光
        if (flower.bloomPhase === 'full' && p.frameCount % 120 === 0) {
          for (let i = 0; i < 3; i++) {
            sparkles.push(new Sparkle(
              flower.pos.x + p.random(-20, 20),
              flower.pos.y - flower.maxStemHeight + p.random(-20, 20)
            ))
          }
        }
      }

      // 更新和显示闪光
      for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].update()
        sparkles[i].display()
        if (sparkles[i].isDead()) {
          sparkles.splice(i, 1)
        }
      }

      // 绘制自定义鼠标 - 小花
      p.push()
      p.colorMode(p.HSB)
      p.translate(p.mouseX, p.mouseY)
      
      // 花瓣
      p.noStroke()
      for (let i = 0; i < 5; i++) {
        const angle = p.map(i, 0, 5, 0, p.TWO_PI)
        p.push()
        p.rotate(angle + p.frameCount * 0.02)
        p.fill(340, 60, 90, 180)
        p.ellipse(8, 0, 12, 8)
        p.pop()
      }
      
      // 花心
      p.fill(50, 70, 95)
      p.ellipse(0, 0, 8)
      
      p.pop()

      flowerCount.value = flowers.length
    }

    p.mouseClicked = () => {
      // 花朵始终从底部开始生长，X坐标为点击位置
      const groundY = p.height - 20
      const newFlower = new Flower(p.mouseX, groundY)
      flowers.push(newFlower)
      
      // 种植时的闪光效果
      for (let i = 0; i < 8; i++) {
        sparkles.push(new Sparkle(p.mouseX, groundY))
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
.flower-garden-container {
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
    color: #ff8a80;
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
