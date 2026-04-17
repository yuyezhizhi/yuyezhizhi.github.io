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
const gridSize = ref(200)

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
    
    // 只在初始化时生成一次地形，不再更新（地形静止）
    if (terrain[0][0] === 0) {
      let yoff = 0
      for (let y = 0; y < rows; y++) {
        let xoff = 0
        for (let x = 0; x < cols; x++) {
          // 使用更平滑的噪声（降低频率，减小高度范围）
          let noiseVal = p.noise(xoff * 0.5, yoff * 0.5)
          terrain[x][y] = p.map(noiseVal, 0, 1, -40, 80)
          xoff += 0.08
        }
        yoff += 0.08
      }
    }
    
    // 绘制地形
    p.rotateX(p.PI / 2.5)
    p.translate(-w / 2, -h / 2, 0)
    
    // 禁用描边以提高性能
    p.noStroke()
    
    // 绘制地形网格
    for (let y = 0; y < rows - 1; y++) {
      p.beginShape(p.TRIANGLE_STRIP)
      for (let x = 0; x < cols; x++) {
        const h1 = terrain[x][y]
        const h2 = terrain[x][y + 1]
        
        // 根据高度设置更丰富的颜色（适应新的高度范围-40到80）
        let r1, g1, b1, r2, g2, b2
        
        // 高度1的颜色
        if (h1 < -20) {
          r1 = 20; g1 = 40; b1 = 100  // 深海
        } else if (h1 < -10) {
          r1 = 40; g1 = 90; b1 = 160  // 中海
        } else if (h1 < 0) {
          r1 = 80; g1 = 150; b1 = 200  // 浅海
        } else if (h1 < 15) {
          r1 = 194; g1 = 178; b1 = 128  // 沙滩
        } else if (h1 < 35) {
          r1 = 34; g1 = 139; b1 = 34  // 森林绿
        } else if (h1 < 60) {
          r1 = 120; g1 = 100; b1 = 80  // 岩石棕
        } else {
          r1 = 255; g1 = 250; b1 = 250  // 纯白雪山
        }
        
        // 高度2的颜色
        if (h2 < -20) {
          r2 = 20; g2 = 40; b2 = 100
        } else if (h2 < -10) {
          r2 = 40; g2 = 90; b2 = 160
        } else if (h2 < 0) {
          r2 = 80; g2 = 150; b2 = 200
        } else if (h2 < 15) {
          r2 = 194; g2 = 178; b2 = 128
        } else if (h2 < 35) {
          r2 = 34; g2 = 139; b2 = 34
        } else if (h2 < 60) {
          r2 = 120; g2 = 100; b2 = 80
        } else {
          r2 = 255; g2 = 250; b2 = 250
        }
        
        p.fill(r1, g1, b1, 220)
        p.vertex(x * scl, y * scl, h1)
        
        p.fill(r2, g2, b2, 220)
        p.vertex(x * scl, (y + 1) * scl, h2)
      }
      p.endShape()
    }
    
    // 线框绘制已移除以提高性能
  }

  p.mouseDragged = () => {
    // 左键拖动控制视角（降低灵敏度，上下方向反转）
    camAngleY += (p.mouseX - p.pmouseX) * 0.003
    camAngleX -= (p.mouseY - p.pmouseY) * 0.003
    camAngleX = p.constrain(camAngleX, -p.PI / 2 + 0.1, p.PI / 2 - 0.1)
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
      // 清空地形数组，触发重新生成
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          terrain[x][y] = 0
        }
      }
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
    background: rgba(255, 255, 255, 0.2);
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 1;
      font-weight: 500;
    }

    .info p {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.9;
    }
  }
}
</style>
