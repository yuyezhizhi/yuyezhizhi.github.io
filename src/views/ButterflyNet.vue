<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// === 手绘蝴蝶网 ===
// 模拟蜡笔手绘风格的蝴蝶和花朵

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
    p.angleMode(p.RADIANS)

    // 定义颜色
    colors = [
      p.color(135, 206, 250), // 浅蓝
      p.color(255, 140, 0),   // 橙
      p.color(255, 182, 193), // 粉
      p.color(255, 255, 0)    // 黄
    ]

    flowerColors = [
      p.color(255, 105, 180), // 粉红
      p.color(100, 149, 237), // 蓝紫
      p.color(186, 85, 211),  // 紫
      p.color(255, 215, 0)    // 金黄
    ]

    // 创建蝴蝶
    for (let i = 0; i < 15; i++) {
      butterflies.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-1, 1),
        vy: p.random(-1, 1),
        size: p.random(20, 40),
        color: colors[Math.floor(p.random(colors.length))],
        wingAngle: 0,
        wingSpeed: p.random(0.1, 0.3)
      })
    }

    // 创建叶子
    for (let i = 0; i < 50; i++) {
      const side = i % 2 === 0 ? 1 : -1
      leaves.push({
        x: p.width / 2 + side * (50 + Math.random() * 100),
        y: p.height / 2 + p.random(-200, -50),
        length: p.random(30, 60),
        angle: p.random(-0.3, 0.3),
        swayOffset: p.random(p.TWO_PI),
        swaySpeed: p.random(0.01, 0.03)
      })
    }

    // 创建花朵
    for (let i = 0; i < 25; i++) {
      const leafIndex = Math.floor(p.random(leaves.length))
      flowers.push({
        x: leaves[leafIndex].x + p.random(-30, 30),
        y: leaves[leafIndex].y + p.random(-20, 20),
        size: p.random(8, 15),
        color: flowerColors[Math.floor(p.random(flowerColors.length))],
        petals: Math.floor(p.random(5, 8))
      })
    }
  }

  p.draw = () => {
    // 米白色背景，带纹理
    p.background(250, 248, 245)
    
    // 添加纸质纹理
    for (let i = 0; i < 1000; i++) {
      p.stroke(0, 0, 0, 10)
      p.point(p.random(p.width), p.random(p.height))
    }

    // 绘制手柄（绿色编织）
    p.push()
    p.translate(p.width / 2, p.height / 2 + 100)
    
    // 手柄
    p.noFill()
    for (let i = 0; i < 3; i++) {
      p.stroke(34, 139, 34, 200 - i * 50)
      p.strokeWeight(15 - i * 4)
      p.beginShape()
      for (let y = 0; y > -300; y -= 10) {
        const x = Math.sin(y * 0.05 + i) * 20
        p.vertex(x, y)
      }
      p.endShape()
    }
    p.pop()

    // 绘制网圈
    p.push()
    p.translate(p.width / 2, p.height / 2 - 200)
    
    // 网圈
    p.noFill()
    p.stroke(34, 139, 34, 180)
    p.strokeWeight(8)
    p.circle(0, 0, 120)
    
    // 网格线
    p.stroke(34, 139, 34, 100)
    p.strokeWeight(1)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * p.TWO_PI
      p.line(0, 0, Math.cos(angle) * 60, Math.sin(angle) * 60)
    }
    p.pop()

    // 绘制叶子（带摇摆动画）
    for (let leaf of leaves) {
      const sway = Math.sin(p.frameCount * leaf.swaySpeed + leaf.swayOffset) * 0.1
      
      p.push()
      p.translate(leaf.x, leaf.y)
      p.rotate(leaf.angle + sway)
      
      p.noStroke()
      p.fill(85, 107, 47, 220)
      
      // 手绘叶子（带抖动）
      p.beginShape()
      for (let t = 0; t <= leaf.length; t += 5) {
        const w = Math.sin(t * 0.1) * 15 * (1 - t / leaf.length)
        const jitterX = p.random(-1, 1)
        const jitterY = p.random(-1, 1)
        p.vertex(-w / 2 + jitterX, t + jitterY)
      }
      for (let t = leaf.length; t >= 0; t -= 5) {
        const w = Math.sin(t * 0.1) * 15 * (1 - t / leaf.length)
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
      
      // 花瓣
      p.noStroke()
      p.fill(flower.color)
      for (let i = 0; i < flower.petals; i++) {
        const angle = (i / flower.petals) * p.TWO_PI
        p.push()
        p.rotate(angle)
        p.beginShape()
        const jitter = p.random(-0.5, 0.5)
        p.ellipse(0, flower.size / 2, flower.size / 3, flower.size)
        p.pop()
      }
      
      // 花心
      p.fill(255, 215, 0)
      p.circle(0, 0, flower.size / 3)
      p.pop()
    }

    // 绘制蝴蝶
    for (let b of butterflies) {
      // 更新位置
      b.x += b.vx
      b.y += b.vy

      // 飞舞模式
      if (p.frameCount % 100 < 50) {
        b.x += Math.sin(p.frameCount * 0.05) * 2
        b.y += Math.cos(p.frameCount * 0.05) * 2
      }

      // 边界检查
      if (b.x < -50) b.x = p.width + 50
      if (b.x > p.width + 50) b.x = -50
      if (b.y < -50) b.y = p.height + 50
      if (b.y > p.height + 50) b.y = -50

      // 翅膀动画
      b.wingAngle = Math.sin(p.frameCount * b.wingSpeed) * 0.5

      p.push()
      p.translate(b.x, b.y)
      
      // 飞行方向
      const flightAngle = Math.atan2(b.vy, b.vx)
      p.rotate(flightAngle)

      p.fill(b.color)

      // 左翅膀（带手绘抖动）
      p.push()
      p.rotate(b.wingAngle)
      p.beginShape()
      p.vertex(0, 0)
      p.bezierVertex(
        -b.size + p.random(-1, 1), -b.size / 2 + p.random(-1, 1),
        -b.size * 1.2 + p.random(-1, 1), b.size / 3 + p.random(-1, 1),
        -b.size / 2 + p.random(-1, 1), 0
      )
      p.bezierVertex(
        -b.size * 1.2 + p.random(-1, 1), -b.size / 3 + p.random(-1, 1),
        -b.size + p.random(-1, 1), b.size / 2 + p.random(-1, 1),
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
        -b.size + p.random(-1, 1), -b.size / 2 + p.random(-1, 1),
        -b.size * 1.2 + p.random(-1, 1), b.size / 3 + p.random(-1, 1),
        -b.size / 2 + p.random(-1, 1), 0
      )
      p.bezierVertex(
        -b.size * 1.2 + p.random(-1, 1), -b.size / 3 + p.random(-1, 1),
        -b.size + p.random(-1, 1), b.size / 2 + p.random(-1, 1),
        0, 0
      )
      p.endShape()
      p.pop()

      // 身体
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
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: #faf8f5;
  z-index: 1;
}

.fullscreen-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
