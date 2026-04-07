<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// 简化版蝴蝶网 - 专注于动画
const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  let butterflies = []
  let leaves = []
  let flowers = []
  let colors = []
  let flowerColors = []
  let time = 0

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(60)
    p.angleMode(p.RADIANS)

    // 预生成随机值，减少 p.random() 调用
    const randomValues = []
    for (let i = 0; i < 500; i++) {
      randomValues.push(p.random())
    }
    let randIndex = 0

    const getNextRandom = () => randomValues[randIndex++ % randomValues.length]

    // 颜色
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

    // 蝴蝶
    for (let i = 0; i < 15; i++) {
      butterflies.push({
        x: getNextRandom() * p.width,
        y: getNextRandom() * p.height,
        vx: getNextRandom() * 4 - 2,
        vy: getNextRandom() * 4 - 2,
        size: 20 + getNextRandom() * 20,
        color: colors[p.floor(getNextRandom() * colors.length)],
        wingAngle: 0,
        wingSpeed: 0.1 + getNextRandom() * 0.2
      })
    }

    // 叶子
    for (let i = 0; i < 40; i++) {
      const side = i % 2 === 0 ? 1 : -1
      leaves.push({
        x: p.width / 2 + side * (50 + getNextRandom() * 100),
        y: p.height / 2 + getNextRandom() * 150 - 200,
        length: 30 + getNextRandom() * 30,
        angle: getNextRandom() * 0.6 - 0.3,
        swayOffset: getNextRandom() * p.TWO_PI,
        swaySpeed: 0.01 + getNextRandom() * 0.02
      })
    }

    // 花朵
    for (let i = 0; i < 20; i++) {
      const leafIndex = p.floor(getNextRandom() * leaves.length)
      flowers.push({
        x: leaves[leafIndex].x + getNextRandom() * 60 - 30,
        y: leaves[leafIndex].y + getNextRandom() * 40 - 20,
        size: 8 + getNextRandom() * 7,
        color: flowerColors[p.floor(getNextRandom() * flowerColors.length)],
        petals: 5 + p.floor(getNextRandom() * 3)
      })
    }
  }

  p.draw = () => {
    time += 0.016  // 约 60fps
    
    p.background(250, 248, 245)

    // 显示帧数
    p.fill(0)
    p.textSize(20)
    p.text(`Frame: ${p.frameCount}`, 50, 50)

    // 绘制手柄
    p.push()
    p.translate(p.width / 2, p.height / 2 + 100)
    p.rotate(p.sin(time * 0.1) * 0.05)
    
    for (let i = 0; i < 3; i++) {
      p.stroke(34, 139, 34, 200 - i * 50)
      p.strokeWeight(15 - i * 4)
      p.noFill()
      p.beginShape()
      for (let y = 0; y > -300; y -= 15) {
        const wave = p.sin(y * 0.03 + time * 2 + i) * 20
        p.vertex(wave, y)
      }
      p.endShape()
    }
    p.pop()

    // 绘制网圈
    p.push()
    p.translate(p.width / 2, p.height / 2 - 200)
    p.rotate(time * 0.2)
    
    const pulse = 1 + p.sin(time * 0.5) * 0.05
    p.scale(pulse)
    
    p.noFill()
    p.stroke(34, 139, 34, 180)
    p.strokeWeight(8)
    p.circle(0, 0, 120)
    
    p.stroke(34, 139, 34, 100)
    p.strokeWeight(1)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * p.TWO_PI + time * 0.5
      p.line(0, 0, p.cos(angle) * 60, p.sin(angle) * 60)
    }
    p.pop()

    // 绘制叶子
    for (let leaf of leaves) {
      const sway = p.sin(time * 2 + leaf.swayOffset) * 0.2
      
      p.push()
      p.translate(leaf.x, leaf.y)
      p.rotate(leaf.angle + sway)
      p.noStroke()
      p.fill(85, 107, 47, 220)
      
      p.beginShape()
      for (let t = 0; t <= leaf.length; t += 8) {
        const w = p.sin(t * 0.1) * 15 * (1 - t / leaf.length)
        p.vertex(-w / 2, t)
      }
      for (let t = leaf.length; t >= 0; t -= 8) {
        const w = p.sin(t * 0.1) * 15 * (1 - t / leaf.length)
        p.vertex(w / 2, t)
      }
      p.endShape(p.CLOSE)
      p.pop()
    }

    // 绘制花朵
    for (let flower of flowers) {
      p.push()
      p.translate(flower.x, flower.y)
      p.rotate(time * 0.3)
      
      p.noStroke()
      p.fill(flower.color)
      for (let i = 0; i < flower.petals; i++) {
        const angle = (i / flower.petals) * p.TWO_PI
        p.push()
        p.rotate(angle)
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
      
      if (b.x < 50) { b.x = 50; b.vx *= -1; }
      if (b.x > p.width - 50) { b.x = p.width - 50; b.vx *= -1; }
      if (b.y < 50) { b.y = 50; b.vy *= -1; }
      if (b.y > p.height - 50) { b.y = p.height - 50; b.vy *= -1; }

      b.wingAngle = p.sin(time * 10 + b.size) * 0.6

      p.push()
      p.translate(b.x, b.y)
      p.rotate(p.atan2(b.vy, b.vx))
      p.fill(b.color)

      // 左翅膀
      p.push()
      p.rotate(b.wingAngle)
      p.beginShape()
      p.vertex(0, 0)
      p.bezierVertex(-b.size, -b.size / 2, -b.size * 1.2, b.size / 3, -b.size / 2, 0)
      p.bezierVertex(-b.size * 1.2, -b.size / 3, -b.size, b.size / 2, 0, 0)
      p.endShape()
      p.pop()

      // 右翅膀
      p.push()
      p.scale(-1, 1)
      p.rotate(b.wingAngle)
      p.beginShape()
      p.vertex(0, 0)
      p.bezierVertex(-b.size, -b.size / 2, -b.size * 1.2, b.size / 3, -b.size / 2, 0)
      p.bezierVertex(-b.size * 1.2, -b.size / 3, -b.size, b.size / 2, 0, 0)
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
