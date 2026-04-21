<template>
  <div class="flower-fireworks-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击鼠标让花朵飘上天空</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

let p5Instance = null
let flowers = []
let time = 0
let isFloating = false
let resetTimer = 0  // 重置计时器（帧数）


onMounted(() => {
  const sketch = (p) => {
    // 预计算花瓣的角度常量
    const PETAL_ANGLES = []
    for (let i = 0; i < 5; i++) {
      PETAL_ANGLES.push({
        base: (p.TWO_PI / 5) * i,
        offset1: (p.TWO_PI / 5) * i + 0.25,
        cos_r: Math.cos((p.TWO_PI / 5) * i) * 0.35,
        sin_r: Math.sin((p.TWO_PI / 5) * i) * 0.25,
        cos_r2: Math.cos((p.TWO_PI / 5) * i + 0.25) * 0.35,
        sin_r2: Math.sin((p.TWO_PI / 5) * i + 0.25) * 0.25
      })
    }

    class Flower {
      constructor(x, y, hue, size) {
        this.x = x
        this.y = y
        this.hue = hue
        this.size = size
        this.swayPhase = p.random(p.TWO_PI)
        this.swaySpeed = p.random(0.005, 0.012)
        // 飘浮属性
        this.floatDelay = p.random(0, 20)
        this.floatSpeed = p.random(1.8, 6.0)
        this.floatDrift = p.random(-1.8, 1.8)
        this.floatWobble = p.random(0.06, 0.18)
        this.floatPhase = p.random(p.TWO_PI)
        this.alpha = 255
        // 预计算轮廓颜色
        this.outlineR = hue[0] * 0.6
        this.outlineG = hue[1] * 0.6
        this.outlineB = hue[2] * 0.6
      }

      update() {
        this.swayPhase += this.swaySpeed

        if (isFloating) {
          this.floatDelay--
          if (this.floatDelay <= 0) {
            this.y -= this.floatSpeed
            this.x += this.floatDrift + Math.sin(this.floatPhase) * 0.2
            this.floatPhase += this.floatWobble
            // 飞出屏幕顶部或两侧时快速淡出
            if (this.y < p.height * 0.15 || this.x < -50 || this.x > p.width + 50) {
              this.alpha = Math.max(0, this.alpha - 8)
            }
            // 完全飞出屏幕直接标记消失
            if (this.y < -100) {
              this.alpha = 0
            }
          }
        }
      }

      isGone() {
        return this.alpha <= 0
      }

      display() {
        if (this.alpha <= 0) return

        const sway = Math.sin(this.swayPhase) * 2
        const cx = this.x + sway
        const s = this.size
        const al = this.alpha

        // 花茎 - 垂直
        p.stroke(80, 150, 80, Math.min(160, al))
        p.strokeWeight(2)
        p.line(cx, this.y, cx, this.y + 25)

        // 外层花瓣（带轮廓）
        const s0 = s * 0.75
        p.fill(this.hue[0], this.hue[1], this.hue[2], Math.min(180, al))
        p.stroke(this.outlineR, this.outlineG, this.outlineB, Math.min(160, al))
        p.strokeWeight(1)
        for (let i = 0; i < 5; i++) {
          const a = PETAL_ANGLES[i]
          p.ellipse(cx + Math.cos(a.offset1) * s0 * 0.35, this.y + Math.sin(a.offset1) * s0 * 0.25, s0 * 0.5, s0 * 0.32)
        }

        // 内层花瓣
        const s1 = s * 0.55
        p.noStroke()
        p.fill(this.hue[0], this.hue[1], this.hue[2], Math.min(220, al))
        for (let i = 0; i < 5; i++) {
          const a = PETAL_ANGLES[i]
          p.ellipse(cx + Math.cos(a.base) * s1 * 0.35, this.y + Math.sin(a.base) * s1 * 0.25, s1 * 0.5, s1 * 0.32)
        }

        // 花蕊
        p.fill(255, 220, 100, al)
        p.ellipse(cx, this.y, s * 0.22)
      }
    }

    // 花朵颜色
    const flowerColors = [
      [255, 180, 200],  // 粉色
      [200, 160, 240],  // 紫色
      [255, 200, 160],  // 橙色
      [200, 230, 200],  // 浅绿
      [160, 200, 240]   // 蓝色
    ]

    // 初始化花朵排列的函数（sketch级别，draw可访问）
    const initFlowers = () => {
      flowers = []
      isFloating = false
      resetTimer = 0
      const totalRows = 24
      const startY = p.height * 0.35
      const endY = p.height * 0.92
      const rowSpacing = (endY - startY) / (totalRows - 1)
      const centerX = p.width / 2
      const maxRowWidth = p.width * 0.30

      for (let row = 0; row < totalRows; row++) {
        const progress = row / (totalRows - 1)

        let flowersInRow
        if (progress < 0.55) {
          flowersInRow = Math.floor(26 - (progress / 0.55) * 4)
        } else {
          flowersInRow = Math.max(1, Math.floor(22 - ((progress - 0.55) / 0.45) * 21))
        }
        flowersInRow = Math.max(1, flowersInRow)

        const rowY = startY + row * rowSpacing
        const colorIndex = Math.min(Math.floor(progress * 5), 4)
        const color = flowerColors[colorIndex]

        const rowWidth = maxRowWidth * (1 - progress * 0.95)
        const spacingX = flowersInRow > 1 ? rowWidth / (flowersInRow - 1) : 0
        const rowStartX = centerX - spacingX * (flowersInRow - 1) / 2
        const offsetRange = (1 - progress) * 10

        for (let col = 0; col < flowersInRow; col++) {
          const x = flowersInRow === 1 ? centerX : rowStartX + spacingX * col + p.random(-offsetRange, offsetRange)
          const y = rowY + p.random(-offsetRange * 0.8, offsetRange * 0.8)
          const sizeMultiplier = 1 - progress * 0.45
          const flowerSize = p.random(38, 55) * sizeMultiplier
          const flower = new Flower(x, y, color, flowerSize)
          flowers.push(flower)
        }
      }
    }

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')
      p.colorMode(p.RGB, 255)
      initFlowers()
    }

    p.draw = () => {
      p.background(255, 255, 255)
      time += 0.01

      // 更新和显示花朵
      for (let i = flowers.length - 1; i >= 0; i--) {
        flowers[i].update()
        flowers[i].display()
        if (flowers[i].isGone()) {
          flowers.splice(i, 1)
        }
      }

      // 花朵全部消失后，5秒（300帧）后重新初始化
      if (isFloating && flowers.length === 0) {
        resetTimer++
        if (resetTimer >= 300) {
          initFlowers()
        }
      }
    }

    p.mouseClicked = () => {
      if (!isFloating) {
        isFloating = true
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
.flower-fireworks-container {
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
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 0 0 0 8px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: none;
    border-right: none;
    color: #ff6b9d;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    .instruction {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.7;
      line-height: 1.3;
      white-space: nowrap;
    }
  }
}
</style>
