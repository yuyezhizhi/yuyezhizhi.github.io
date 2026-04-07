<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// 极简蝴蝶网 - 只保留核心动画
const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  let butterflies = []
  let leaves = []
  let flowers = []
  let frame = 0

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(60)

    // 蝴蝶
    for (let i = 0; i < 10; i++) {
      butterflies.push({
        x: Math.random() * p.width,
        y: Math.random() * p.height,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        size: 20 + Math.random() * 20,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        wingAngle: 0
      })
    }

    // 叶子
    for (let i = 0; i < 30; i++) {
      const side = i % 2 === 0 ? 1 : -1
      leaves.push({
        x: p.width / 2 + side * (50 + Math.random() * 100),
        y: p.height / 2 + Math.random() * 150 - 200,
        length: 30 + Math.random() * 30,
        angle: Math.random() * 0.6 - 0.3,
        swayOffset: Math.random() * Math.PI * 2
      })
    }

    // 花朵
    for (let i = 0; i < 15; i++) {
      flowers.push({
        x: Math.random() * p.width * 0.6 + p.width * 0.2,
        y: Math.random() * p.height * 0.6 + p.height * 0.2,
        size: 8 + Math.random() * 7,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        petals: 5 + Math.floor(Math.random() * 3)
      })
    }
  }

  p.draw = () => {
    frame++
    p.background(250, 248, 245)

    // 显示帧数
    p.fill(0)
    p.textSize(20)
    p.text(`Frame: ${frame}`, 50, 50)

    // 绘制手柄
    p.push()
    p.translate(p.width / 2, p.height / 2 + 100)
    p.stroke(34, 139, 34, 180)
    p.strokeWeight(8)
    p.line(0, 0, 0, -250)
    p.pop()

    // 绘制网圈
    p.push()
    p.translate(p.width / 2, p.height / 2 - 200)
    p.rotate(frame * 0.01)
    p.noFill()
    p.stroke(34, 139, 34, 150)
    p.strokeWeight(4)
    p.circle(0, 0, 100)
    p.pop()

    // 绘制叶子
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i]
      const sway = Math.sin(frame * 0.05 + leaf.swayOffset) * 0.2
      
      p.push()
      p.translate(leaf.x, leaf.y)
      p.rotate(leaf.angle + sway)
      p.noStroke()
      p.fill(85, 107, 47)
      p.ellipse(0, leaf.length / 2, 10, leaf.length)
      p.pop()
    }

    // 绘制花朵
    for (let i = 0; i < flowers.length; i++) {
      const flower = flowers[i]
      p.push()
      p.translate(flower.x, flower.y)
      p.rotate(frame * 0.02)
      p.noStroke()
      p.fill(flower.color)
      for (let j = 0; j < flower.petals; j++) {
        p.push()
        p.rotate((j / flower.petals) * Math.PI * 2)
        p.ellipse(0, flower.size / 2, flower.size / 3, flower.size)
        p.pop()
      }
      p.fill(255, 215, 0)
      p.circle(0, 0, flower.size / 3)
      p.pop()
    }

    // 绘制蝴蝶
    for (let i = 0; i < butterflies.length; i++) {
      const b = butterflies[i]
      b.x += b.vx
      b.y += b.vy
      
      if (b.x < 50) { b.x = 50; b.vx *= -1; }
      if (b.x > p.width - 50) { b.x = p.width - 50; b.vx *= -1; }
      if (b.y < 50) { b.y = 50; b.vy *= -1; }
      if (b.y > p.height - 50) { b.y = p.height - 50; b.vy *= -1; }

      b.wingAngle = Math.sin(frame * 0.1 + i) * 0.5

      p.push()
      p.translate(b.x, b.y)
      p.rotate(Math.atan2(b.vy, b.vx))
      p.fill(b.color)

      // 左翅膀
      p.push()
      p.rotate(b.wingAngle)
      p.ellipse(-b.size / 2, 0, b.size, b.size * 0.6)
      p.pop()

      // 右翅膀
      p.push()
      p.scale(-1, 1)
      p.rotate(b.wingAngle)
      p.ellipse(-b.size / 2, 0, b.size, b.size * 0.6)
      p.pop()

      // 身体
      p.fill(50)
      p.ellipse(0, 0, b.size / 5, b.size)
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
