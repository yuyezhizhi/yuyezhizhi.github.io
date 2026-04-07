<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// 蝴蝶网 - 交互式版本
const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  let butterflies = []
  let leaves = []
  let flowers = []
  let frame = 0
  let netX = 0
  let netY = 0
  let netRadius = 80
  let caughtCount = 0

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(60)
    netX = p.width / 2
    netY = p.height / 2

    // 蝴蝶
    for (let i = 0; i < 15; i++) {
      butterflies.push({
        x: Math.random() * p.width,
        y: Math.random() * p.height,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        size: 20 + Math.random() * 20,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        wingAngle: 0,
        caught: false
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

    // 网圈跟随鼠标（带平滑）
    netX += (p.mouseX - netX) * 0.1
    netY += (p.mouseY - netY) * 0.1

    // 绘制叶子（在网后面）
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
    for (let i = butterflies.length - 1; i >= 0; i--) {
      const b = butterflies[i]
      
      if (b.caught) {
        // 已捕捉的蝴蝶，跟随网圈
        const angle = (i / butterflies.length) * Math.PI * 2 + frame * 0.05
        b.x = netX + Math.cos(angle) * netRadius * 0.3
        b.y = netY + Math.sin(angle) * netRadius * 0.3
        b.wingAngle = Math.sin(frame * 0.15) * 0.8
      } else {
        // 自由飞行的蝴蝶
        b.x += b.vx
        b.y += b.vy
        
        // 边界反弹
        if (b.x < 50) { b.x = 50; b.vx *= -1; }
        if (b.x > p.width - 50) { b.x = p.width - 50; b.vx *= -1; }
        if (b.y < 50) { b.y = 50; b.vy *= -1; }
        if (b.y > p.height - 50) { b.y = p.height - 50; b.vy *= -1; }

        b.wingAngle = Math.sin(frame * 0.1 + i) * 0.5

        // 检测是否被网捕捉
        const dist = Math.hypot(b.x - netX, b.y - netY)
        if (dist < netRadius) {
          b.caught = true
          caughtCount++
          // 捕捉特效：网圈闪烁
        }
      }

      p.push()
      p.translate(b.x, b.y)
      p.rotate(b.caught ? frame * 0.1 : Math.atan2(b.vy, b.vx))
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

    // 绘制手柄
    p.push()
    p.translate(netX, netY + netRadius)
    p.stroke(34, 139, 34, 180)
    p.strokeWeight(6)
    p.line(0, 0, 0, -200)
    p.pop()

    // 绘制网圈（真正的织网纹理）
    p.push()
    p.translate(netX, netY)
    
    // 外框
    p.stroke(34, 139, 34, 200)
    p.strokeWeight(3)
    p.circle(0, 0, netRadius * 2)
    
    // 网格线 - 径向线
    p.stroke(34, 139, 34, 150)
    p.strokeWeight(1)
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + frame * 0.002
      p.line(0, 0, Math.cos(angle) * netRadius, Math.sin(angle) * netRadius)
    }
    
    // 网格线 - 同心圆
    for (let r = 0.25; r <= 1; r += 0.25) {
      p.noFill()
      p.circle(0, 0, netRadius * 2 * r)
    }
    
    // 织网纹理 - 菱形网格
    p.stroke(34, 139, 34, 100)
    p.strokeWeight(1)
    for (let ring = 0; ring < 4; ring++) {
      const ringRadius = (ring + 1) * (netRadius / 4)
      const segments = 8 + ring * 4
      for (let i = 0; i < segments; i++) {
        const angle1 = (i / segments) * Math.PI * 2
        const angle2 = ((i + 1) / segments) * Math.PI * 2
        
        // 径向连接
        const x1 = Math.cos(angle1) * ringRadius
        const y1 = Math.sin(angle1) * ringRadius
        const x2 = Math.cos(angle2) * ringRadius
        const y2 = Math.sin(angle2) * ringRadius
        p.line(x1, y1, x2, y2)
        
        // 跨圈连接（形成菱形）
        if (ring < 3) {
          const nextRingRadius = (ring + 2) * (netRadius / 4)
          const midAngle = (angle1 + angle2) / 2
          const mx = Math.cos(midAngle) * nextRingRadius
          const my = Math.sin(midAngle) * nextRingRadius
          p.line(x1, y1, mx, my)
          p.line(x2, y2, mx, my)
        }
      }
    }
    
    // 中心点
    if (caughtCount > 0 && frame % 20 < 10) {
      p.fill(255, 215, 0, 200)
    } else {
      p.fill(34, 139, 34)
    }
    p.circle(0, 0, 8)
    p.pop()

    // 显示信息
    p.fill(0)
    p.textSize(16)
    p.text(`已捕捉: ${caughtCount}/${butterflies.length}`, 20, 30)
    p.text(`移动鼠标控制网圈`, 20, 55)
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
  cursor: crosshair;
}

.fullscreen-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
