<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// 使用 p5 的 sin/cos 替代 Math.sin/cos
const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  let butterflies = []
  let leaves = []
  let flowers = []
  let colors = []
  let flowerColors = []

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(60)
    p.angleMode(p.RADIANS)

    // 定义颜色
    colors = [
      p.color(135, 206, 250),
      p.color(255, 140, 0),
      p.color(255, 182, 193),
      p.color(255, 255, 0)
    ]

    flowerColors = [
      p.color(255, 105, 180),
      p.color(100, 149, 237),
      p.color(186, 85, 211),
      p.color(255, 215, 0)
    ]

    // 创建蝴蝶
    for (let i = 0; i < 20; i++) {
      butterflies.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-2, 2),
        vy: p.random(-2, 2),
        size: p.random(20, 40),
        color: colors[p.floor(p.random(colors.length))],
        wingAngle: 0,
        wingSpeed: p.random(0.1, 0.3)
      })
    }

    // 创建叶子
    for (let i = 0; i < 50; i++) {
      const side = i % 2 === 0 ? 1 : -1
      leaves.push({
        x: p.width / 2 + side * (50 + p.random() * 100),
        y: p.height / 2 + p.random(-200, -50),
        length: p.random(30, 60),
        angle: p.random(-0.3, 0.3),
        swayOffset: p.random(p.TWO_PI),
        swaySpeed: p.random(0.01, 0.03)
      })
    }

    // 创建花朵
    for (let i = 0; i < 25; i++) {
      const leafIndex = p.floor(p.random(leaves.length))
      flowers.push({
        x: leaves[leafIndex].x + p.random(-30, 30),
        y: leaves[leafIndex].y + p.random(-20, 20),
        size: p.random(8, 15),
        color: flowerColors[p.floor(p.random(flowerColors.length))],
        petals: p.floor(p.random(5, 8)),
        rotationOffset: p.random(p.TWO_PI)
      })
    }
  }

  p.draw = () => {
    p.background(250, 248, 245)

    // 测试：显示帧数
    p.fill(0)
    p.textSize(20)
    p.text(`Frame: ${p.frameCount}`, 50, 50)

    // 测试：移动的圆（使用 p5 方法）
    const testX = (p.frameCount * 3) % (p.width + 100) - 50
    p.noStroke()
    p.fill(200, 100, 255)
    p.circle(testX, 100, 30)

    // 绘制叶子
    for (let leaf of leaves) {
      // 使用 p5 的 sin 而不是 Math.sin
      const sway = p.sin(p.frameCount * leaf.swaySpeed + leaf.swayOffset) * 0.15
      
      p.push()
      p.translate(leaf.x, leaf.y)
      p.rotate(leaf.angle + sway)
      p.noStroke()
      p.fill(85, 107, 47, 220)
      
      p.beginShape()
      for (let t = 0; t <= leaf.length; t += 5) {
        const w = p.sin(t * 0.1) * 15 * (1 - t / leaf.length)
        const jitterX = p.random(-1, 1)
        const jitterY = p.random(-1, 1)
        p.vertex(-w / 2 + jitterX, t + jitterY)
      }
      for (let t = leaf.length; t >= 0; t -= 5) {
        const w = p.sin(t * 0.1) * 15 * (1 - t / leaf.length)
        const jitterX = p.random(-1, 1)
        const jitterY = p.random(-1, 1)
        p.vertex(w / 2 + jitterX, t + jitterY)
      }
      p.endShape(p.CLOSE)
      p.pop()
    }

    // 绘制花朵
    for (let flower of flowers) {
      p.push()
      p.translate(flower.x, flower.y)
      p.rotate(p.frameCount * 0.01 + flower.rotationOffset)
      
      p.noStroke()
      p.fill(flower.color)
      for (let i = 0; i < flower.petals; i++) {
        const angle = (i / flower.petals) * p.TWO_PI
        p.push()
        p.rotate(angle)
        p.beginShape()
        p.ellipse(0, flower.size / 2, flower.size / 3, flower.size)
        p.pop()
      }
      
      p.fill(255, 215, 0)
      p.circle(0, 0, flower.size / 3)
      p.pop()
    }

    // 绘制蝴蝶
    for (let b of butterflies) {
      b.x += b.vx
      b.y += b.vy
      
      // 边界检查
      if (b.x < 50) { b.x = 50; b.vx *= -1; }
      if (b.x > p.width - 50) { b.x = p.width - 50; b.vx *= -1; }
      if (b.y < 50) { b.y = 50; b.vy *= -1; }
      if (b.y > p.height - 50) { b.y = p.height - 50; b.vy *= -1; }

      b.wingAngle = p.sin(p.frameCount * b.wingSpeed) * 0.6

      p.push()
      p.translate(b.x, b.y)
      
      // 使用 p5 的 atan2
      const flightAngle = p.atan2(b.vy, b.vx)
      p.rotate(flightAngle)
      p.fill(b.color)

      // 左翅膀
      p.push()
      p.rotate(b.wingAngle)
      p.beginShape()
      p.vertex(0, 0)
      p.bezierVertex(
        -b.size, -b.size / 2,
        -b.size * 1.2, b.size / 3,
        -b.size / 2, 0
      )
      p.bezierVertex(
        -b.size * 1.2, -b.size / 3,
        -b.size, b.size / 2,
        0, 0
      )
      p.endShape()
      p.pop()

      // 右翅膀
      p.push()
      p.scale(-1, 1)
      p.rotate(b.wingAngle)
      p.beginShape()
      p.vertex(0, 0)
      p.bezierVertex(
        -b.size, -b.size / 2,
        -b.size * 1.2, b.size / 3,
        -b.size / 2, 0
      )
      p.bezierVertex(
        -b.size * 1.2, -b.size / 3,
        -b.size, b.size / 2,
        0, 0
      )
      p.endShape()
      p.pop()

      p.fill(50)
      p.ellipse(0, 0, b.size / 4, b.size)
      p.pop()
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
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
    sketchInstance = null
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
  background: #faf8f5;
  z-index: 1;
}

.fullscreen-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
