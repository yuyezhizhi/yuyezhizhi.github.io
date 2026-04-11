<template>
  <div class="fractal-tree-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">空格重新生成 | 1-4切换季节</p>
      <div class="info">
        <p>季节: {{ seasonName }} | 深度: {{ maxDepth }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const seasonName = ref('春')
const maxDepth = ref(10)
const currentSeason = ref(1)

let p5Instance = null
let treeSeed = 0
let windOffset = 0

// 四季配色配置
const seasons = {
  1: { name: '春', branch: [101, 67, 33], leaf: [255, 183, 197], bg: [10, 25, 15] },
  2: { name: '夏', branch: [34, 85, 51], leaf: [76, 175, 80], bg: [5, 20, 10] },
  3: { name: '秋', branch: [139, 69, 19], leaf: [255, 140, 0], bg: [25, 15, 8] },
  4: { name: '冬', branch: [120, 120, 130], leaf: [255, 255, 255], bg: [15, 18, 25] }
}

const sketch = (p) => {
  let snowflakes = []
  let fallingLeaves = []

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.parent('p5-canvas')
    treeSeed = p.random(1000)
    p.randomSeed(treeSeed)
  }

  p.draw = () => {
    const season = seasons[currentSeason.value]
    
    // 渐变背景
    drawGradientBackground(p, season.bg)
    
    windOffset += 0.01
    
    // 绘制树
    p.push()
    p.translate(p.width / 2, p.height)
    p.randomSeed(treeSeed)
    drawBranch(p, p.height * 0.22, 0, maxDepth.value, season)
    p.pop()
    
    // 冬季雪花效果
    if (currentSeason.value === 4) {
      drawSnow(p)
    }
    
    // 秋季落叶效果
    if (currentSeason.value === 3) {
      drawFallingLeaves(p, season)
    }
  }

  const drawGradientBackground = (p, bgColor) => {
    p.noFill()
    for (let y = 0; y < p.height; y += 2) {
      const inter = p.map(y, 0, p.height, 0, 1)
      const r = p.lerp(bgColor[0] * 0.5, bgColor[0], inter)
      const g = p.lerp(bgColor[1] * 0.3, bgColor[1], inter)
      const b = p.lerp(bgColor[2] * 0.8, bgColor[2], inter)
      p.stroke(r, g, b)
      p.line(0, y, p.width, y)
    }
  }

  const drawBranch = (p, len, angle, depth, season) => {
    if (depth === 0) {
      // 绘制叶片/花朵
      if (currentSeason.value !== 4) {
        drawLeaf(p, season)
      }
      return
    }
    
    // 微风摇摆效果
    const sway = p.sin(windOffset + depth * 0.5) * 0.02 * (maxDepth.value - depth)
    const finalAngle = angle + sway
    
    // 计算终点
    const endX = p.sin(finalAngle) * len
    const endY = -p.cos(finalAngle) * len
    
    // 树枝颜色渐变
    const branchColor = season.branch
    const alpha = p.map(depth, maxDepth.value, 0, 255, 100)
    const weight = p.map(depth, maxDepth.value, 0, 8, 1)
    
    p.stroke(branchColor[0], branchColor[1], branchColor[2], alpha)
    p.strokeWeight(weight)
    p.line(0, 0, endX, endY)
    
    // 递归绘制分支
    p.push()
    p.translate(endX, endY)
    
    const angleOffset = p.PI / 5 + p.random(-0.2, 0.2)
    const lengthRatio = 0.67 + p.random(-0.05, 0.05)
    
    drawBranch(p, len * lengthRatio, -angleOffset, depth - 1, season)
    drawBranch(p, len * lengthRatio, angleOffset, depth - 1, season)
    
    p.pop()
  }

  const drawLeaf = (p, season) => {
    const leafColor = season.leaf
    const size = p.random(4, 8)
    
    p.noStroke()
    
    // 发光效果
    for (let i = 3; i > 0; i--) {
      p.fill(leafColor[0], leafColor[1], leafColor[2], 30)
      p.circle(0, 0, size + i * 3)
    }
    
    // 主叶片
    p.fill(leafColor[0], leafColor[1], leafColor[2], 200)
    
    if (currentSeason.value === 1) {
      // 春季花朵
      drawFlower(p, size)
    } else {
      // 叶片
      p.circle(0, 0, size)
    }
  }

  const drawFlower = (p, size) => {
    const petals = 5
    for (let i = 0; i < petals; i++) {
      const angle = p.TWO_PI / petals * i
      const x = p.cos(angle) * size * 0.6
      const y = p.sin(angle) * size * 0.6
      p.circle(x, y, size * 0.5)
    }
    p.fill(255, 255, 150)
    p.circle(0, 0, size * 0.3)
  }

  const drawSnow = (p) => {
    // 添加新雪花
    if (p.random() < 0.3) {
      snowflakes.push({
        x: p.random(p.width),
        y: -10,
        size: p.random(2, 5),
        speed: p.random(1, 3),
        drift: p.random(-0.5, 0.5)
      })
    }
    
    // 更新和绘制雪花
    p.noStroke()
    p.fill(255, 255, 255, 180)
    
    for (let i = snowflakes.length - 1; i >= 0; i--) {
      const flake = snowflakes[i]
      flake.y += flake.speed
      flake.x += flake.drift + p.sin(p.frameCount * 0.02 + i) * 0.5
      
      p.circle(flake.x, flake.y, flake.size)
      
      if (flake.y > p.height) {
        snowflakes.splice(i, 1)
      }
    }
  }

  const drawFallingLeaves = (p, season) => {
    // 添加新落叶
    if (p.random() < 0.1) {
      fallingLeaves.push({
        x: p.random(p.width),
        y: -10,
        size: p.random(5, 10),
        speed: p.random(1, 2),
        rotation: p.random(p.TWO_PI),
        rotSpeed: p.random(-0.05, 0.05)
      })
    }
    
    // 更新和绘制落叶
    p.fill(season.leaf[0], season.leaf[1], season.leaf[2], 150)
    
    for (let i = fallingLeaves.length - 1; i >= 0; i--) {
      const leaf = fallingLeaves[i]
      leaf.y += leaf.speed
      leaf.x += p.sin(p.frameCount * 0.03 + i) * 0.5
      leaf.rotation += leaf.rotSpeed
      
      p.push()
      p.translate(leaf.x, leaf.y)
      p.rotate(leaf.rotation)
      p.noStroke()
      p.ellipse(0, 0, leaf.size, leaf.size * 0.6)
      p.pop()
      
      if (leaf.y > p.height) {
        fallingLeaves.splice(i, 1)
      }
    }
  }

  p.keyPressed = () => {
    if (p.key === ' ') {
      treeSeed = p.random(1000)
      p.randomSeed(treeSeed)
      snowflakes = []
      fallingLeaves = []
    } else if (p.key >= '1' && p.key <= '4') {
      currentSeason.value = parseInt(p.key)
      seasonName.value = seasons[currentSeason.value].name
      snowflakes = []
      fallingLeaves = []
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
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
.fractal-tree-container {
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
    color: #38ef7d;

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
