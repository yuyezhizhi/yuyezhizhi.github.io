<template>
  <div class="mandala-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">按住鼠标绘制 | 1-8调节对称 | C清空 | S保存</p>
      <div class="info">
        <p>对称: {{ symmetry }}折 | 模式: {{ drawMode }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const symmetry = ref(8)
const drawMode = ref('自由')

let p5Instance = null
let pg = null // 离屏图形缓冲区
let symmetryOptions = [2, 4, 6, 8, 10, 12, 16, 24]
let hueOffset = 0
let isDrawing = false

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.parent('p5-canvas')
    
    // 创建离屏缓冲区 - 明亮背景
    pg = p.createGraphics(p.windowWidth, p.windowHeight)
    pg.background(255, 250, 245)
    
    p.background(255, 250, 245)
    p.colorMode(p.HSB, 360, 100, 100, 100)
  }

  p.draw = () => {
    // 显示缓冲区内容
    p.image(pg, 0, 0)
    
    // 绘制旋转的引导线
    drawGuideLines(p)
    
    // 中心光晕
    drawCenterGlow(p)
    
    // 绘制模式
    if (isDrawing && p.mouseIsPressed) {
      drawSymmetrical(p)
    }
    
    // 色相缓慢变化
    hueOffset = (hueOffset + 0.2) % 360
  }

  const drawGuideLines = (p) => {
    const cx = p.width / 2
    const cy = p.height / 2
    const radius = p.min(p.width, p.height) * 0.45
    
    p.push()
    p.translate(cx, cy)
    
    // 旋转效果
    const rotation = p.frameCount * 0.005
    p.rotate(rotation)
    
    p.stroke(200, 180, 220, 40)
    p.strokeWeight(1)
    
    for (let i = 0; i < symmetry.value; i++) {
      const angle = p.TWO_PI / symmetry.value * i
      const x = p.cos(angle) * radius
      const y = p.sin(angle) * radius
      p.line(0, 0, x, y)
    }
    
    // 外围圆环
    p.noFill()
    p.stroke(180, 200, 220, 30)
    p.circle(0, 0, radius * 2)
    
    p.pop()
  }

  const drawCenterGlow = (p) => {
    const cx = p.width / 2
    const cy = p.height / 2
    
    p.push()
    p.translate(cx, cy)
    
    // 旋转光晕
    const rotation = p.frameCount * 0.01
    p.rotate(rotation)
    
    for (let i = 5; i > 0; i--) {
      p.noStroke()
      p.fill((hueOffset + 180) % 360, 50, 95, 5)
      p.circle(0, 0, i * 40)
    }
    
    p.pop()
  }

  const drawSymmetrical = (p) => {
    const cx = p.width / 2
    const cy = p.height / 2
    
    // 计算鼠标相对于中心的位置
    const dx = p.mouseX - cx
    const dy = p.mouseY - cy
    const dist = p.sqrt(dx * dx + dy * dy)
    const baseAngle = p.atan2(dy, dx)
    
    // 根据距离计算色相（近=紫色，远=青色）
    const hue = p.map(dist, 0, p.min(p.width, p.height) / 2, 280, 180)
    const finalHue = (hue + hueOffset) % 360
    
    pg.push()
    pg.translate(cx, cy)
    
    // 在每个对称扇区绘制
    for (let i = 0; i < symmetry.value; i++) {
      const sectorAngle = p.TWO_PI / symmetry.value * i
      
      pg.push()
      pg.rotate(sectorAngle)
      
      // 绘制线条
      drawGlowingLine(pg, p.pmouseX - cx, p.pmouseY - cy, dx, dy, finalHue)
      
      // 镜像绘制
      pg.push()
      pg.scale(1, -1)
      drawGlowingLine(pg, p.pmouseX - cx, -(p.pmouseY - cy), dx, -dy, finalHue)
      pg.pop()
      
      pg.pop()
    }
    
    pg.pop()
  }

  const drawGlowingLine = (pg, prevX, prevY, currX, currY, hue) => {
    // 发光效果 - 粗线半透明
    pg.stroke(hue, 80, 100, 30)
    pg.strokeWeight(12)
    pg.line(prevX, prevY, currX, currY)
    
    // 中层
    pg.stroke(hue, 70, 100, 50)
    pg.strokeWeight(6)
    pg.line(prevX, prevY, currX, currY)
    
    // 核心亮线
    pg.stroke(hue, 60, 100, 90)
    pg.strokeWeight(2)
    pg.line(prevX, prevY, currX, currY)
  }

  p.mousePressed = () => {
    isDrawing = true
  }

  p.mouseReleased = () => {
    isDrawing = false
  }

  p.keyPressed = () => {
    const key = p.key
    
    // 数字键切换对称数
    if (key >= '1' && key <= '8') {
      const index = parseInt(key) - 1
      if (index < symmetryOptions.length) {
        symmetry.value = symmetryOptions[index]
      }
    }
    
    // C键清空
    if (key === 'c' || key === 'C') {
      pg.background(255, 250, 245)
    }
    
    // S键保存
    if (key === 's' || key === 'S') {
      p.saveCanvas('mandala_' + Date.now(), 'png')
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    
    // 保存当前绘制内容
    const oldPg = pg
    pg = p.createGraphics(p.windowWidth, p.windowHeight)
    pg.background(255, 250, 245)
    pg.image(oldPg, 0, 0)
  }
}

onMounted(() => {
  p5Instance = new p5(sketch)
})

onBeforeUnmount(() => {
  if (p5Instance) {
    p5Instance.remove()
  }
})
</script>

<style scoped lang="less">
.mandala-container {
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
    cursor: crosshair;
  }

  .controls {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.8);
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(200, 180, 220, 0.3);
    color: #6B5B95;

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 0.9;
    }

    .info p {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.75;
    }
  }
}
</style>
