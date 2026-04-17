<template>
  <div class="data-vortex-page">
    <div class="fullscreen-canvas" ref="canvasContainer"></div>
    <div class="controls">
      <p>🖱️ 移动鼠标吸引节点 | 🖱️ 点击鼠标释放冲击波 | 🖱️ 滚轮缩放漩涡大小 | ⌨️ 空格键重置数据 | ⌨️ 数字键1-5切换颜色主题</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// === 螺旋数据网络 ===
// 参考数据可视化设计：螺旋状数据汇聚

const canvasContainer = ref(null)
let sketchInstance = null

// 响应式状态
const nodeCount = ref(80)
const connectionCount = ref(0)
const colorThemeName = ref('彩虹')

// 颜色主题
const colorThemes = [
  { name: '彩虹', hueOffset: 0, hueRange: 360 },
  { name: '海洋', hueOffset: 180, hueRange: 60 },
  { name: '火焰', hueOffset: 0, hueRange: 60 },
]
let currentTheme = 0

const sketch = (p) => {
  let nodes = []
  let numNodes = 80
  const spiralLayers = 5
  let scaleFactor = 1
  let shockwaves = []
  let mouseInfluence = { x: 0, y: 0, active: false }

  // 初始化节点
  const initNodes = () => {
    nodes = []
    for (let i = 0; i < numNodes; i++) {
      const layer = i % spiralLayers
      const angle = (i / numNodes) * p.TWO_PI * spiralLayers
      const radius = layer * 80 + 50 + p.random(-20, 20)

      nodes.push({
        x: p.width / 2 + Math.cos(angle) * radius,
        y: p.height / 2 + Math.sin(angle) * radius,
        originalX: p.width / 2 + Math.cos(angle) * radius,
        originalY: p.height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        value: p.random(0, 1).toFixed(8),
        layer: layer,
        connections: [],
        pulseOffset: p.random(p.TWO_PI),
        attracted: false
      })
    }
    nodeCount.value = nodes.length
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    initNodes()

    // 鼠标事件
    p.mouseMoved = () => {
      mouseInfluence.x = p.mouseX
      mouseInfluence.y = p.mouseY
      mouseInfluence.active = true
    }

    p.mousePressed = () => {
      // 创建冲击波
      shockwaves.push({
        x: p.mouseX,
        y: p.mouseY,
        radius: 0,
        maxRadius: 300,
        strength: 15
      })
    }

    p.mouseWheel = (event) => {
      scaleFactor += event.delta * -0.001
      scaleFactor = p.constrain(scaleFactor, 0.5, 2)
      return false
    }

    // 键盘事件
    p.keyPressed = () => {
      // 数字键1-5切换颜色主题
      if (p.key >= '1' && p.key <= '3') {
        currentTheme = parseInt(p.key) - 1
        colorThemeName.value = colorThemes[currentTheme].name
      }
      // 空格键重置
      if (p.key === ' ') {
        initNodes()
        shockwaves = []
        scaleFactor = 1
      }
    }
  }

  p.draw = () => {
    // 根据主题调整背景
    const theme = colorThemes[currentTheme]
    const bgGradient = p.drawingContext.createRadialGradient(
      p.width / 2, p.height / 2, 0,
      p.width / 2, p.height / 2, Math.max(p.width, p.height) / 2
    )

    if (currentTheme === 0) { // 彩虹主题
      bgGradient.addColorStop(0, '#E0F7FA')
      bgGradient.addColorStop(0.5, '#F3E5F5')
      bgGradient.addColorStop(1, '#FFF3E0')
    } else if (currentTheme === 1) { // 海洋
      bgGradient.addColorStop(0, '#001F3F')
      bgGradient.addColorStop(0.5, '#003366')
      bgGradient.addColorStop(1, '#004080')
    } else if (currentTheme === 2) { // 火焰
      bgGradient.addColorStop(0, '#ff0000')
      bgGradient.addColorStop(0.5, '#8B0000')
      bgGradient.addColorStop(1, '#000000')
    } 
    p.drawingContext.fillStyle = bgGradient
    p.noStroke()
    p.rect(0, 0, p.width, p.height)

    // 应用缩放
    p.push()
    p.translate(p.width / 2, p.height / 2)
    p.scale(scaleFactor)
    p.translate(-p.width / 2, -p.height / 2)

    // 更新和绘制冲击波
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const wave = shockwaves[i]
      wave.radius += 8
      wave.strength *= 0.95

      p.noFill()
      p.stroke(255, 255 - wave.radius / wave.maxRadius * 255)
      p.strokeWeight(3 - wave.radius / wave.maxRadius * 2)
      p.circle(wave.x, wave.y, wave.radius * 2)

      if (wave.radius > wave.maxRadius) {
        shockwaves.splice(i, 1)
      }
    }

    // 中心螺旋
    p.push()
    p.translate(p.width / 2, p.height / 2)

    // 绘制彩虹螺旋线
    p.noFill()
    p.colorMode(p.HSB)
    for (let l = 0; l < spiralLayers; l++) {
      const hue = (theme.hueOffset + p.frameCount * 0.5 + l * (theme.hueRange / spiralLayers)) % 360
      p.stroke(hue, 60, 90, 0.4)
      p.strokeWeight(2)
      p.beginShape()
      for (let angle = 0; angle < p.TWO_PI * 3; angle += 0.1) {
        const r = (l * 80 + angle * 20) * scaleFactor
        const x = Math.cos(angle + p.frameCount * 0.01 + l) * r
        const y = Math.sin(angle + p.frameCount * 0.01 + l) * r
        p.vertex(x, y)
      }
      p.endShape()
    }
    p.colorMode(p.RGB)
    p.pop()

    // 更新和绘制节点
    let totalConnections = 0
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]

      const centerX = p.width / 2
      const centerY = p.height / 2

      // 鼠标吸引效果
      if (mouseInfluence.active) {
        const distToMouse = Math.hypot(node.x - mouseInfluence.x, node.y - mouseInfluence.y)
        if (distToMouse < 200) {
          const attractStrength = (200 - distToMouse) / 200 * 0.05
          node.vx += (mouseInfluence.x - node.x) * attractStrength
          node.vy += (mouseInfluence.y - node.y) * attractStrength
          node.attracted = true
        } else {
          node.attracted = false
        }
      }

      // 冲击波影响
      for (let wave of shockwaves) {
        const distToWave = Math.hypot(node.x - wave.x, node.y - wave.y)
        if (Math.abs(distToWave - wave.radius) < 30 && wave.strength > 1) {
          const angle = Math.atan2(node.y - wave.y, node.x - wave.x)
          node.vx += Math.cos(angle) * wave.strength
          node.vy += Math.sin(angle) * wave.strength
        }
      }

      // 应用速度并衰减
      node.x += node.vx
      node.y += node.vy
      node.vx *= 0.95
      node.vy *= 0.95

      // 回归原位置的力
      const returnStrength = node.attracted ? 0.001 : 0.02
      node.vx += (node.originalX - node.x) * returnStrength
      node.vy += (node.originalY - node.y) * returnStrength

      // 旋转
      const angle = Math.atan2(node.y - centerY, node.x - centerX)
      node.x = centerX + Math.cos(angle + 0.002) * Math.hypot(node.x - centerX, node.y - centerY)
      node.y = centerY + Math.sin(angle + 0.002) * Math.hypot(node.x - centerX, node.y - centerY)

      // 脉冲效果
      const pulse = Math.sin(p.frameCount * 0.05 + node.pulseOffset)
      const alpha = 150 + pulse * 100

      // 计算到中心的距离
      const distToCenter = Math.hypot(node.x - centerX, node.y - centerY)

      // 连接到附近节点 - 彩虹色连线
      p.colorMode(p.HSB)
      const lineHue = (theme.hueOffset + node.layer * (theme.hueRange / spiralLayers) + p.frameCount * 0.5) % 360
      p.stroke(lineHue, 50, 80, alpha * 0.003)
      p.strokeWeight(1)

      for (let j = i + 1; j < Math.min(i + 10, nodes.length); j++) {
        const other = nodes[j]
        const distToNode = Math.hypot(node.x - other.x, node.y - other.y)
        if (distToNode < 150 * scaleFactor) {
          p.line(node.x, node.y, other.x, other.y)
          totalConnections++
        }
      }

      // 连线到中心
      if (distToCenter < 300 * scaleFactor) {
        p.stroke(lineHue, 60, 90, alpha * 0.005 * (1 - distToCenter / (300 * scaleFactor)))
        p.line(node.x, node.y, p.width / 2, p.height / 2)
      }
      p.colorMode(p.RGB)

      // 绘制节点 - 主题色
      p.noStroke()
      const nodeHue = (theme.hueOffset + node.layer * (theme.hueRange / spiralLayers) + p.frameCount) % 360
      p.colorMode(p.HSB)
      p.fill(nodeHue, 70, 95, alpha * 0.01)
      p.circle(node.x, node.y, 10)
      p.fill(nodeHue, 50, 100, 1)
      p.circle(node.x, node.y, 6)
      p.colorMode(p.RGB)

      // 绘制数值
      if (pulse > 0.5) {
        p.fill(255, 255, 255, pulse * 150)
        p.textSize(8)
        p.textAlign(p.CENTER, p.CENTER)
        p.text(node.value, node.x, node.y - 15)
      }
    }

    connectionCount.value = totalConnections

    p.pop() // 结束缩放

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
.data-vortex-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.fullscreen-canvas {
  position: absolute;
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
  color: #1e0156;
  z-index: 10;

  p {
    margin: 0;
    font-size: 0.75rem;
    opacity: 1;
    line-height: 1.3;
    white-space: nowrap;
  }
}
</style>
