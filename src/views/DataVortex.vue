<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// === 螺旋数据网络 ===
// 参考数据可视化设计：螺旋状数据汇聚

const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  let nodes = []
  const numNodes = 80
  const spiralLayers = 5

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    
    // 创建螺旋节点
    for (let i = 0; i < numNodes; i++) {
      const layer = i % spiralLayers
      const angle = (i / numNodes) * p.TWO_PI * spiralLayers
      const radius = layer * 80 + 50 + p.random(-20, 20)
      
      nodes.push({
        x: p.width / 2 + Math.cos(angle) * radius,
        y: p.height / 2 + Math.sin(angle) * radius,
        targetX: p.width / 2 + Math.cos(angle) * radius,
        targetY: p.height / 2 + Math.sin(angle) * radius,
        value: p.random(0, 1).toFixed(8),
        layer: layer,
        connections: [],
        pulseOffset: p.random(p.TWO_PI)
      })
    }
  }

  p.draw = () => {
    p.background(0)

    // 中心螺旋
    p.push()
    p.translate(p.width / 2, p.height / 2)
    
    // 绘制螺旋线
    p.noFill()
    for (let l = 0; l < spiralLayers; l++) {
      p.stroke(255, 255, 255, 30)
      p.strokeWeight(1)
      p.beginShape()
      for (let angle = 0; angle < p.TWO_PI * 3; angle += 0.1) {
        const r = l * 80 + angle * 20
        const x = Math.cos(angle + p.frameCount * 0.01 + l) * r
        const y = Math.sin(angle + p.frameCount * 0.01 + l) * r
        p.vertex(x, y)
      }
      p.endShape()
    }
    p.pop()

    // 更新和绘制节点
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      
      // 缓慢向中心移动
      const centerX = p.width / 2
      const centerY = p.height / 2
      const angle = Math.atan2(node.y - centerY, node.x - centerX)
      
      // 旋转
      node.x = centerX + Math.cos(angle + 0.002) * Math.hypot(node.x - centerX, node.y - centerY)
      node.y = centerY + Math.sin(angle + 0.002) * Math.hypot(node.x - centerX, node.y - centerY)
      
      // 脉冲效果
      const pulse = Math.sin(p.frameCount * 0.05 + node.pulseOffset)
      const alpha = 150 + pulse * 100
      
      // 连接到附近节点
      p.stroke(255, 255, 255, alpha * 0.3)
      p.strokeWeight(0.5)
      
      for (let j = i + 1; j < Math.min(i + 10, nodes.length); j++) {
        const other = nodes[j]
        const dist = Math.hypot(node.x - other.x, node.y - other.y)
        if (dist < 150) {
          p.line(node.x, node.y, other.x, other.y)
        }
      }
      
      // 连线到中心
      if (dist < 100) {
        p.stroke(255, 255, 255, alpha * 0.5 * (1 - dist / 300))
        p.line(node.x, node.y, p.width / 2, p.height / 2)
      }
      
      // 绘制节点
      p.noStroke()
      p.fill(255, 255, 255, alpha)
      p.rect(node.x - 4, node.y - 4, 8, 8)
      
      // 绘制数值
      if (pulse > 0.5) {
        p.fill(255, 255, 255, pulse * 150)
        p.textSize(8)
        p.textAlign(p.CENTER, p.CENTER)
        p.text(node.value, node.x, node.y - 15)
      }
    }

    // 中心数据流
    p.noStroke()
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * p.TWO_PI + p.frameCount * 0.05
      const r = 10 + Math.sin(p.frameCount * 0.1 + i) * 5
      p.fill(255, 255, 255, 100 - i * 5)
      p.circle(
        p.width / 2 + Math.cos(angle) * r,
        p.height / 2 + Math.sin(angle) * r,
        3
      )
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
  background: #000;
  z-index: 1;
}

.fullscreen-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
