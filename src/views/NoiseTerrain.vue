<template>
  <div class="noise-terrain-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">鼠标控制视角 | 滚轮缩放 | R重新生成</p>
      <div class="info">
        <p>种子: {{ noiseSeed }} | 网格: {{ gridSize }}x{{ gridSize }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const noiseSeed = ref(0)
const gridSize = ref(60)

let p5Instance = null
let terrain = []
let flying = 0
let camAngleX = -0.4
let camAngleY = 0
let camDistance = 800

const sketch = (p) => {
  let cols, rows
  let scl = 20
  let w, h

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    canvas.parent('p5-canvas')
    
    noiseSeed.value = Math.floor(p.random(1000))
    p.noiseSeed(noiseSeed.value)
    
    w = p.windowWidth * 1.5
    h = p.windowHeight * 1.5
    cols = gridSize.value
    rows = gridSize.value
    scl = w / cols
    
    // 初始化地形数组
    for (let x = 0; x < cols; x++) {
      terrain[x] = []
      for (let y = 0; y < rows; y++) {
        terrain[x][y] = 0
      }
    }
  }

  p.draw = () => {
    p.background(0)
    
    // 光照设置
    p.ambientLight(60, 60, 80)
    p.directionalLight(255, 255, 255, 0.5, 1, -0.5)
    p.pointLight(100, 150, 200, 0, -300, 200)
    
    // 相机控制
    const camX = camDistance * p.cos(camAngleY) * p.cos(camAngleX)
    const camY = camDistance * p.sin(camAngleX)
    const camZ = camDistance * p.sin(camAngleY) * p.cos(camAngleX)
    p.camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0)
    
    // 更新噪声偏移
    flying -= 0.003
    let yoff = flying
    
    for (let y = 0; y < rows; y++) {
      let xoff = 0
      for (let x = 0; x < cols; x++) {
        // 多层噪声叠加
        let noiseVal = p.noise(xoff, yoff)
        let detailNoise = p.noise(xoff * 2, yoff * 2) * 0.5
        let finalNoise = noiseVal + detailNoise * 0.3
        
        terrain[x][y] = p.map(finalNoise, 0, 1, -100, 150)
        xoff += 0.08
      }
      yoff += 0.08
    }
    
    // 绘制地形
    p.rotateX(p.PI / 2.5)
    p.translate(-w / 2, -h / 2, 0)
    
    // 绘制地形网格
    for (let y = 0; y < rows - 1; y++) {
      p.beginShape(p.TRIANGLE_STRIP)
      for (let x = 0; x < cols; x++) {
        const h1 = terrain[x][y]
        const h2 = terrain[x][y + 1]
        
        // 根据高度设置颜色
        const color1 = getHeightColor(p, h1)
        const color2 = getHeightColor(p, h2)
        
        p.fill(color1.r, color1.g, color1.b, 180)
        p.stroke(color1.r * 0.5, color1.g * 0.5, color1.b * 0.5, 100)
        p.strokeWeight(0.5)
        p.vertex(x * scl, y * scl, h1)
        
        p.fill(color2.r, color2.g, color2.b, 180)
        p.stroke(color2.r * 0.5, color2.g * 0.5, color2.b * 0.5, 100)
        p.vertex(x * scl, (y + 1) * scl, h2)
      }
      p.endShape()
    }
    
    // 绘制线框叠加
    p.stroke(255, 255, 255, 30)
    p.strokeWeight(0.3)
    p.noFill()
    for (let y = 0; y < rows - 1; y += 2) {
      p.beginShape(p.LINES)
      for (let x = 0; x < cols - 1; x += 2) {
        p.vertex(x * scl, y * scl, terrain[x][y] + 2)
        p.vertex((x + 1) * scl, y * scl, terrain[x + 1][y] + 2)
        p.vertex(x * scl, y * scl, terrain[x][y] + 2)
        p.vertex(x * scl, (y + 1) * scl, terrain[x][y + 1] + 2)
      }
      p.endShape()
    }
  }

  const getHeightColor = (p, h) => {
    // HSB色彩映射
    p.colorMode(p.HSB, 360, 100, 100)
    let hue, sat, bri
    
    if (h < -30) {
      // 深海
      hue = 220
      sat = 80
      bri = p.map(h, -100, -30, 20, 50)
    } else if (h < 10) {
      // 海洋到平原
      hue = p.map(h, -30, 10, 220, 160)
      sat = 70
      bri = p.map(h, -30, 10, 50, 70)
    } else if (h < 60) {
      // 平原到山地
      hue = p.map(h, 10, 60, 120, 80)
      sat = 60
      bri = p.map(h, 10, 60, 70, 85)
    } else {
      // 雪山
      hue = 0
      sat = 0
      bri = p.map(h, 60, 150, 85, 100)
    }
    
    const c = p.color(hue, sat, bri)
    p.colorMode(p.RGB)
    return {
      r: p.red(c),
      g: p.green(c),
      b: p.blue(c)
    }
  }

  p.mouseDragged = () => {
    if (p.mouseButton === p.LEFT) {
      camAngleY += (p.mouseX - p.pmouseX) * 0.01
      camAngleX += (p.mouseY - p.pmouseY) * 0.01
      camAngleX = p.constrain(camAngleX, -p.PI / 2 + 0.1, p.PI / 2 - 0.1)
    }
  }

  p.mouseWheel = (event) => {
    camDistance += event.delta * 0.5
    camDistance = p.constrain(camDistance, 300, 1500)
    return false
  }

  p.keyPressed = () => {
    if (p.key === 'r' || p.key === 'R') {
      noiseSeed.value = Math.floor(p.random(1000))
      p.noiseSeed(noiseSeed.value)
      flying = 0
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    w = p.windowWidth * 1.5
    h = p.windowHeight * 1.5
    scl = w / cols
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
.noise-terrain-container {
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
    cursor: grab;
    
    &:active {
      cursor: grabbing;
    }
  }

  .controls {
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    backdrop-filter: none;
    border: none;
    color: #4ca1af;

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 0.9;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .info p {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.75;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
