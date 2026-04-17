<template>
  <div class="bubble-pop-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击产生泡泡 | 移动鼠标引导 | 泡泡数: {{ bubbleCount }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const bubbleCount = ref(0)
let p5Instance = null
let bubbles = []

onMounted(() => {
  const sketch = (p) => {
    class Bubble {
      constructor(x, y) {
        this.pos = p.createVector(x, y)
        this.vel = p.createVector(p.random(-0.3, 0.3), p.random(-1.5, -0.8))  // 向上飘
        this.size = p.random(20, 50)
        this.hue = p.random(360)
        this.saturation = p.random(60, 80)
        this.brightness = p.random(85, 95)
        this.wobble = p.random(p.TWO_PI)
        this.wobbleSpeed = p.random(0.02, 0.05)
        this.birthTime = p.millis()  // 记录创建时间
        // 泡泡越小，寿命越长（10-20秒）
        this.lifespan = p.map(this.size, 20, 50, 20000, 10000)  // 小泡泡20秒，大泡泡10秒
      }

      update() {
        this.pos.add(this.vel)
        this.wobble += this.wobbleSpeed
        
        // 左右摇摆
        this.pos.x += p.sin(this.wobble) * 0.5
        
        // 逐渐变小
        this.size *= 0.999
      }

      display() {
        // 安全检查
        if (!this.pos || this.pos.x === undefined || this.pos.y === undefined) {
          return
        }
        
        // 计算生命周期进度，从出生到死亡全程渐变透明
        const age = p.millis() - this.birthTime
        const lifeProgress = age / this.lifespan  // 0到1之间
        let alpha = p.map(lifeProgress, 0, 1, 255, 0)  // 从完全不透明到完全透明
        
        p.push()
        p.colorMode(p.HSB, 360, 100, 100, 255)
        p.noStroke()
        
        // 简化绘制：只用3层代替多层循环
        for (let i = 0; i < 3; i++) {
          const r = this.size * (1 - i * 0.3)
          const layerAlpha = alpha * (1 - i * 0.3)
          const hueShift = i * 10
          p.fill((this.hue + hueShift) % 360, this.saturation, this.brightness, layerAlpha)
          p.ellipse(this.pos.x, this.pos.y, r * 2, r * 2)
        }
        
        // 高光 - 半透明白色
        p.fill(0, 0, 100, alpha * 0.6)
        p.ellipse(this.pos.x - this.size * 0.3, this.pos.y - this.size * 0.3, this.size * 0.4, this.size * 0.3)
        
        p.pop()
      }

      isDead() {
        const age = p.millis() - this.birthTime
        return this.size < 2 || this.pos.y < -this.size || age >= this.lifespan
      }

      checkMouseInteraction(mouseX, mouseY) {
        const d = p.dist(mouseX, mouseY, this.pos.x, this.pos.y)
        return d < this.size
      }
    }

    class PopParticle {
      constructor(x, y, hue) {
        this.pos = p.createVector(x, y)
        const angle = p.random(p.TWO_PI)
        this.vel = p.createVector(p.cos(angle), p.sin(angle)).mult(p.random(2, 5))
        this.size = p.random(3, 8)
        this.hue = hue
        this.life = 255
      }

      update() {
        this.pos.add(this.vel)
        this.vel.y += 0.1 // 重力
        this.life -= 8
        this.size *= 0.95
      }

      display() {
        // 安全检查
        if (!this.pos || this.pos.x === undefined || this.pos.y === undefined) {
          return
        }
        
        p.push()
        p.colorMode(p.HSB)
        p.noStroke()
        p.fill(this.hue, 70, 90, this.life)
        p.ellipse(this.pos.x, this.pos.y, this.size * 2)
        p.pop()
      }

      isDead() {
        return this.life <= 0
      }
    }

    let popParticles = []

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')
      
      // 减少初始泡泡数量
      for (let i = 0; i < 8; i++) {
        bubbles.push(new Bubble(p.random(p.width), p.random(p.height)))
      }
    }

    p.draw = () => {
      // 简单的纯色背景，提升性能
      p.background(240, 230, 255)
      
      // 更新和显示泡泡
      for (let i = bubbles.length - 1; i >= 0; i--) {
        bubbles[i].update()
        bubbles[i].display()
        
        // 检查是否死亡（寿命到期或飘出屏幕）
        if (bubbles[i].isDead()) {
          bubbles.splice(i, 1)
        }
      }

      // 定期生成新泡泡（降低频率和最大数量）
      if (p.frameCount % 120 === 0 && bubbles.length < 15) {
        bubbles.push(new Bubble(p.random(p.width), p.height + 50))
      }

      // 绘制自定义鼠标 - 极简泡泡枪
      p.push()
      p.translate(p.mouseX, p.mouseY)
      p.rotate(-p.HALF_PI)
      p.noStroke()
      p.fill(200, 60, 80)
      p.rect(-8, -5, 20, 10, 3)
      p.fill(180, 50, 70)
      p.rect(8, -3, 8, 6, 2)
      p.pop()

      bubbleCount.value = bubbles.length
    }

    p.mouseClicked = () => {
      // 计算枪口的实际位置（枪口朝上，所以在鼠标上方22像素）
      const gunTipX = p.mouseX
      const gunTipY = p.mouseY - 22
      
      // 从枪口生成泡泡
      bubbles.push(new Bubble(gunTipX, gunTipY))
    }

    p.mouseMoved = () => {
      // 鼠标移动时引导泡泡
      if (bubbles.length > 0 && p.frameCount % 5 === 0) {
        const nearestBubble = bubbles.reduce((nearest, bubble) => {
          const distToMouse = p.dist(bubble.pos.x, bubble.pos.y, p.mouseX, p.mouseY)
          const distToNearest = p.dist(nearest.pos.x, nearest.pos.y, p.mouseX, p.mouseY)
          return distToMouse < distToNearest ? bubble : nearest
        })
        
        // 引导最近的泡泡向鼠标移动
        const dir = p.createVector(p.mouseX - nearestBubble.pos.x, p.mouseY - nearestBubble.pos.y)
        dir.normalize()
        dir.mult(0.3)
        nearestBubble.vel.add(dir)
        nearestBubble.vel.limit(2)
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
.bubble-pop-container {
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
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 0 0 0 8px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: none;
    border-right: none;
    color: #161515;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    .instruction {
      margin: 0;
      font-size: 0.75rem;
      opacity: 1;
      line-height: 1.3;
      white-space: nowrap;
    }
  }
}
</style>
