<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// === 手绘蝴蝶网 ===
// 所有元素都带动画

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
    for (let i = 0; i < 20; i++) {  // 增加蝴蝶数量
      butterflies.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-2, 2),
        vy: p.random(-2, 2),
        targetX: p.random(p.width),
        targetY: p.random(p.height),
        size: p.random(20, 40),
        color: colors[Math.floor(p.random(colors.length))],
        wingAngle: 0,
        wingSpeed: p.random(0.1, 0.3),
        changeTargetTimer: 0
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
        baseX: leaves[leafIndex].x + p.random(-30, 30),
        baseY: leaves[leafIndex].y + p.random(-20, 20),
        size: p.random(8, 15),
        color: flowerColors[Math.floor(p.random(flowerColors.length))],
        petals: Math.floor(p.random(5, 8)),
        rotationOffset: p.random(p.TWO_PI),
        rotationSpeed: p.random(-0.02, 0.02),
        floatOffset: p.random(p.TWO_PI),
        floatSpeed: p.random(0.02, 0.05)
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

    // 绘制手柄（绿色编织）- 添加扭动动画
    p.push()
    p.translate(p.width / 2, p.height / 2 + 100)
    
    // 整体轻微扭动
    p.rotate(Math.sin(p.frameCount * 0.01) * 0.02)
    
    // 手柄
    p.noFill()
    for (let i = 0; i < 3; i++) {
      p.stroke(34, 139, 34, 200 - i * 50)
      p.strokeWeight(15 - i * 4)
      p.beginShape()
      for (let y = 0; y > -300; y -= 10) {
        // 添加动态波浪
        const x = Math.sin(y * 0.05 + p.frameCount * 0.02 + i) * 20
        p.vertex(x, y)
      }
      p.endShape()
    }
    p.pop()

    // 绘制网圈 - 添加旋转动画
    p.push()
    p.translate(p.width / 2, p.height / 2 - 200)
    
    // 网圈整体旋转
    p.rotate(p.frameCount * 0.005)
    
    // 网圈（脉动效果）
    const pulse = 1 + Math.sin(p.frameCount * 0.05) * 0.05
    p.scale(pulse)
    
    p.noFill()
    p.stroke(34, 139, 34, 180)
    p.strokeWeight(8)
    p.circle(0, 0, 120)
    
    // 网格线（旋转）
    p.stroke(34, 139, 34, 100)
    p.strokeWeight(1)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * p.TWO_PI + p.frameCount * 0.01
      p.line(0, 0, Math.cos(angle) * 60, Math.sin(angle) * 60)
    }
    p.pop()

    // 绘制叶子（带摇摆动画）
    for (let leaf of leaves) {
      const sway = Math.sin(p.frameCount * leaf.swaySpeed + leaf.swayOffset) * 0.15
      
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

    // 绘制花朵 - 添加旋转和飘动动画
    for (let flower of flowers) {
      // 计算飘动位置
      const floatX = Math.sin(p.frameCount * flower.floatSpeed + flower.floatOffset) * 3
      const floatY = Math.cos(p.frameCount * flower.floatSpeed * 1.3 + flower.floatOffset) * 2
      
      p.push()
      p.translate(flower.baseX + floatX, flower.baseY + floatY)
      
      // 旋转动画
      p.rotate(p.frameCount * flower.rotationSpeed + flower.rotationOffset)
      
      // 花瓣（轻微摆动）
      p.noStroke()
      p.fill(flower.color)
      for (let i = 0; i < flower.petals; i++) {
        const angle = (i / flower.petals) * p.TWO_PI
        p.push()
        p.rotate(angle)
        // 花瓣轻微摆动
        const petalSway = Math.sin(p.frameCount * 0.03 + i) * 0.1
        p.rotate(petalSway)
        p.beginShape()
        const jitter = p.random(-0.3, 0.3)
        p.ellipse(0, flower.size / 2, flower.size / 3, flower.size)
        p.pop()
      }
      
      // 花心（脉动）
      const centerPulse = 1 + Math.sin(p.frameCount * 0.1) * 0.1
      p.fill(255, 215, 0)
      p.circle(0, 0, (flower.size / 3) * centerPulse)
      p.pop()
    }

    // 绘制蝴蝶
    for (let b of butterflies) {
      // 每隔一段时间改变目标点
      b.changeTargetTimer++
      if (b.changeTargetTimer > p.random(60, 180)) {
        b.targetX = p.random(50, p.width - 50)
        b.targetY = p.random(50, p.height - 50)
        b.changeTargetTimer = 0
      }

      // 向目标点飞
      const dx = b.targetX - b.x
      const dy = b.targetY - b.y
      const dist = Math.hypot(dx, dy)
      
      if (dist > 5) {
        b.vx = (dx / dist) * 2.5  // 稍微加快速度
        b.vy = (dy / dist) * 2.5
      }

      // 添加随机摆动
      b.vx += Math.sin(p.frameCount * 0.1 + b.size) * 0.3
      b.vy += Math.cos(p.frameCount * 0.08 + b.size) * 0.3

      // 更新位置
      b.x += b.vx
      b.y += b.vy

      // 边界反弹
      if (b.x < 50) {
        b.x = 50
        b.vx = Math.abs(b.vx)
        b.targetX = p.random(p.width * 0.5, p.width - 50)
      }
      if (b.x > p.width - 50) {
        b.x = p.width - 50
        b.vx = -Math.abs(b.vx)
        b.targetX = p.random(50, p.width * 0.5)
      }
      if (b.y < 50) {
        b.y = 50
        b.vy = Math.abs(b.vy)
        b.targetY = p.random(p.height * 0.5, p.height - 50)
      }
      if (b.y > p.height - 50) {
        b.y = p.height - 50
        b.vy = -Math.abs(b.vy)
        b.targetY = p.random(50, p.height * 0.5)
      }

      // 翅膀动画
      b.wingAngle = Math.sin(p.frameCount * b.wingSpeed) * 0.6  // 增大翅膀扇动幅度

      p.push()
      p.translate(b.x, b.y)

      // 朝向飞行方向旋转
      const flightAngle = Math.atan2(b.vy, b.vx)
      p.rotate(flightAngle)

      p.fill(b.color)

      // 左翅膀
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
