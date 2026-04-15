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

// 四季配色配置 - 更柔和的背景色
const seasons = {
  1: { name: '春', branch: [101, 67, 33], leaf: [255, 183, 197], bg: [220, 238, 220] },
  2: { name: '夏', branch: [34, 85, 51], leaf: [76, 175, 80], bg: [210, 235, 225] },
  3: { name: '秋', branch: [139, 69, 19], leaf: [255, 140, 0], bg: [235, 228, 215] },
  4: { name: '冬', branch: [100, 100, 110], leaf: [255, 255, 255], bg: [225, 230, 240] }
}

const sketch = (p) => {
  let snowflakes = []
  let fallingLeaves = []
  let butterflies = []
  let bees = []
  let birds = []

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.parent('p5-canvas')
    treeSeed = p.random(1000)
    p.randomSeed(treeSeed)
  }

  // 跟踪上一个季节，用于检测季节变化
  let lastSeason = currentSeason.value
  
  p.draw = () => {
    const season = seasons[currentSeason.value]
    
    // 渐变背景 - 在第一帧或季节变化时重绘
    if (p.frameCount === 1 || currentSeason.value !== lastSeason) {
      drawGradientBackground(p, season.bg)
      lastSeason = currentSeason.value
    } else {
      // 使用半透明覆盖来清除上一帧的动画元素
      p.fill(season.bg[0], season.bg[1], season.bg[2], 80)
      p.noStroke()
      p.rect(0, 0, p.width, p.height)
    }
    
    windOffset += 0.01
    
    // 绘制树 - 调整初始高度
    p.push()
    p.translate(p.width / 2, p.height)
    p.randomSeed(treeSeed)
    // 初始枝干稍短，让整体更协调
    drawBranch(p, p.height * 0.18, 0, maxDepth.value, season)
    p.pop()
    
    // 春季蝴蝶和蜜蜂
    if (currentSeason.value === 1) {
      drawButterflies(p, season)
      drawBees(p, season)
    }
    
    // 夏季鸟儿
    if (currentSeason.value === 2) {
      drawBirds(p, season)
    }
    
    // 秋季落叶效果
    if (currentSeason.value === 3) {
      drawFallingLeaves(p, season)
    }
    
    // 冬季雪花效果
    if (currentSeason.value === 4) {
      drawSnow(p)
    }
  }

  const drawGradientBackground = (p, bgColor) => {
    // 使用更简洁的径向渐变背景
    const gradient = p.drawingContext.createRadialGradient(
      p.width / 2, p.height * 0.8, 0,
      p.width / 2, p.height * 0.5, p.height * 0.8
    )
    
    // 中心亮，边缘暗的柔和渐变
    gradient.addColorStop(0, `rgb(${bgColor[0] + 15}, ${bgColor[1] + 10}, ${bgColor[2] + 5})`)
    gradient.addColorStop(0.5, `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`)
    gradient.addColorStop(1, `rgb(${bgColor[0] - 20}, ${bgColor[1] - 15}, ${bgColor[2] - 10})`)
    
    p.drawingContext.fillStyle = gradient
    p.noStroke()
    p.rect(0, 0, p.width, p.height)
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
    const sway = p.sin(windOffset + depth * 0.5) * 0.015 * (maxDepth.value - depth)
    const finalAngle = angle + sway
    
    // 计算终点
    const endX = p.sin(finalAngle) * len
    const endY = -p.cos(finalAngle) * len
    
    // 树枝颜色渐变 - 越往上越细
    const branchColor = season.branch
    const alpha = p.map(depth, maxDepth.value, 0, 220, 80)
    // 枝干更细：底部最大4px，顶部最小0.5px
    const weight = p.map(depth, maxDepth.value, 0, 4, 0.5)
    
    p.stroke(branchColor[0], branchColor[1], branchColor[2], alpha)
    p.strokeWeight(weight)
    p.line(0, 0, endX, endY)
    
    // 递归绘制分支
    p.push()
    p.translate(endX, endY)
    
    // 调整角度分布：底部角度大（分散），顶部角度小（集中）
    // 这样底部更密，顶部更疏
    const depthRatio = depth / maxDepth.value  // 0-1，1是底部，0是顶部
    const baseAngle = p.PI / 4 * (0.6 + 0.4 * depthRatio)  // 底部角度大，顶部角度小
    const angleOffset = baseAngle + p.random(-0.15, 0.15)
    
    // 长度比例也随深度变化
    const lengthRatio = 0.72 + p.random(-0.03, 0.03)
    
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
    // 添加新雪花 - 全屏飘落
    if (p.frameCount % 2 === 1 && snowflakes.length < 60) {
      snowflakes.push({
        x: p.random(p.width),
        y: p.random(-50, -10),  // 从屏幕上方不同高度开始
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

  const drawButterflies = (p, season) => {
    // 添加新蝴蝶 - 在树冠顶部周围生成
    if (p.frameCount % 60 === 1 && butterflies.length < 5) {
      // 树冠顶部位置（屏幕中间偏上）
      const treeTopX = p.width / 2
      const treeTopY = p.height * 0.35
      const angle = p.random(p.TWO_PI)
      const radius = p.random(80, 250)
      butterflies.push({
        x: treeTopX + p.cos(angle) * radius,
        y: treeTopY + p.sin(angle) * radius,
        size: p.random(12, 18),
        speedX: p.random(-1, 1),
        speedY: p.random(-0.5, 0.5),
        wingAngle: p.random(p.TWO_PI),
        wingSpeed: p.random(0.15, 0.3),
        color: p.random([[255, 100, 150], [255, 150, 50], [150, 100, 255], [255, 200, 50]])
      })
    }
    
    // 更新和绘制蝴蝶
    for (let i = butterflies.length - 1; i >= 0; i--) {
      const b = butterflies[i]
      b.x += b.speedX
      b.y += b.speedY + p.sin(p.frameCount * 0.03 + i) * 0.2
      b.wingAngle += b.wingSpeed
      
      // 绘制蝴蝶
      p.push()
      p.translate(b.x, b.y)
      
      // 翅膀扇动
      const wingScale = p.abs(p.sin(b.wingAngle))
      
      p.fill(b.color[0], b.color[1], b.color[2], 230)
      p.noStroke()
      
      // 左翅膀
      p.push()
      p.scale(wingScale, 1)
      p.ellipse(-b.size * 0.4, -b.size * 0.2, b.size * 0.6, b.size * 0.8)
      p.ellipse(-b.size * 0.3, b.size * 0.3, b.size * 0.4, b.size * 0.5)
      p.pop()
      
      // 右翅膀
      p.push()
      p.scale(wingScale, 1)
      p.ellipse(b.size * 0.4, -b.size * 0.2, b.size * 0.6, b.size * 0.8)
      p.ellipse(b.size * 0.3, b.size * 0.3, b.size * 0.4, b.size * 0.5)
      p.pop()
      
      // 身体
      p.fill(60, 40, 20)
      p.ellipse(0, 0, b.size * 0.15, b.size)
      
      p.pop()
      
      // 移除飞出屏幕的蝴蝶
      if (b.x > p.width + 50 || b.x < -50) {
        butterflies.splice(i, 1)
      }
    }
  }
  
  const drawBees = (p, season) => {
    // 添加新蜜蜂 - 在树冠顶部周围生成
    if (p.frameCount % 80 === 1 && bees.length < 4) {
      const treeTopX = p.width / 2
      const treeTopY = p.height * 0.35
      const angle = p.random(p.TWO_PI)
      const radius = p.random(60, 200)
      bees.push({
        x: treeTopX + p.cos(angle) * radius,
        y: treeTopY + p.sin(angle) * radius,
        size: p.random(8, 12),
        speedX: p.random(-2, 2),
        speedY: p.random(-1, 1),
        wingAngle: 0,
        wingSpeed: p.random(0.8, 1.2)
      })
    }
    
    // 更新和绘制蜜蜂
    for (let i = bees.length - 1; i >= 0; i--) {
      const b = bees[i]
      b.x += b.speedX
      b.y += b.speedY + p.sin(p.frameCount * 0.1 + i * 2) * 0.5
      b.wingAngle += b.wingSpeed
      
      p.push()
      p.translate(b.x, b.y)
      
      // 翅膀
      const wingOffset = p.sin(b.wingAngle) * b.size * 0.3
      p.fill(200, 200, 255, 150)
      p.noStroke()
      p.ellipse(-b.size * 0.3, -b.size * 0.3 + wingOffset, b.size * 0.5, b.size * 0.3)
      p.ellipse(b.size * 0.3, -b.size * 0.3 - wingOffset, b.size * 0.5, b.size * 0.3)
      
      // 身体（黄黑条纹）
      p.fill(255, 200, 0)
      p.ellipse(0, 0, b.size * 0.5, b.size * 0.7)
      p.fill(30, 30, 30)
      p.rect(-b.size * 0.2, -b.size * 0.1, b.size * 0.4, b.size * 0.15)
      p.rect(-b.size * 0.15, b.size * 0.15, b.size * 0.3, b.size * 0.12)
      
      p.pop()
      
      // 移除飞出屏幕的蜜蜂
      if (b.x > p.width + 50) {
        bees.splice(i, 1)
      }
    }
  }
  
  const drawBirds = (p, season) => {
    // 添加新鸟儿 - 绕着树顶飞行
    if (p.frameCount % 100 === 1 && birds.length < 3) {
      birds.push({
        angle: p.random(p.TWO_PI),
        radius: p.random(120, 250),
        speed: p.random(0.01, 0.02),
        yOffset: p.random(-30, 30),
        size: p.random(12, 18),
        wingAngle: 0,
        wingSpeed: p.random(0.15, 0.25),
        color: p.random([[60, 60, 80], [80, 60, 40], [40, 60, 80], [100, 80, 60]])
      })
    }
    
    // 更新和绘制鸟儿 - 绕着树顶飞行
    const treeTopX = p.width / 2
    const treeTopY = p.height * 0.35
    
    for (let i = birds.length - 1; i >= 0; i--) {
      const b = birds[i]
      // 绕树飞行
      b.angle += b.speed
      const x = treeTopX + p.cos(b.angle) * b.radius
      const y = treeTopY + p.sin(b.angle) * b.radius * 0.5 + b.yOffset
      b.wingAngle += b.wingSpeed
      
      // 计算飞行方向（切线方向）
      const flightAngle = b.angle + p.PI / 2
      
      p.push()
      p.translate(x, y)
      p.rotate(flightAngle)
      
      // 翅膀扇动
      const wingY = p.sin(b.wingAngle) * b.size * 0.4
      
      p.fill(b.color[0], b.color[1], b.color[2])
      p.noStroke()
      
      // 身体
      p.ellipse(0, 0, b.size, b.size * 0.4)
      
      // 翅膀
      p.fill(b.color[0] + 20, b.color[1] + 20, b.color[2] + 20)
      p.beginShape()
      p.vertex(-b.size * 0.2, 0)
      p.vertex(-b.size * 0.6, -b.size * 0.3 + wingY)
      p.vertex(-b.size * 0.3, -b.size * 0.1)
      p.endShape(p.CLOSE)
      
      p.beginShape()
      p.vertex(b.size * 0.2, 0)
      p.vertex(b.size * 0.6, -b.size * 0.3 + wingY)
      p.vertex(b.size * 0.3, -b.size * 0.1)
      p.endShape(p.CLOSE)
      
      // 尾巴
      p.fill(b.color[0], b.color[1], b.color[2])
      p.triangle(-b.size * 0.4, 0, -b.size * 0.7, -b.size * 0.1, -b.size * 0.7, b.size * 0.1)
      
      p.pop()
    }
  }
  
  const drawFallingLeaves = (p, season) => {
    // 添加新落叶 - 从树冠区域均匀落下
    if (p.frameCount % 10 === 1 && fallingLeaves.length < 20) {
      const treeTopX = p.width / 2
      const treeTopY = p.height * 0.35
      // 在圆形树冠区域内随机生成
      const angle = p.random(p.TWO_PI)
      const radius = p.random(0, 180) * p.sqrt(p.random(1))  // 均匀分布
      fallingLeaves.push({
        x: treeTopX + p.cos(angle) * radius,
        y: treeTopY + p.sin(angle) * radius * 0.6,  // 稍微压扁的椭圆
        size: p.random(6, 12),
        speed: p.random(0.8, 2),
        rotation: p.random(p.TWO_PI),
        rotSpeed: p.random(-0.05, 0.05),
        color: p.random([[255, 140, 0], [200, 100, 0], [180, 80, 20], [220, 120, 30]])
      })
    }
    
    // 更新和绘制落叶
    for (let i = fallingLeaves.length - 1; i >= 0; i--) {
      const leaf = fallingLeaves[i]
      leaf.y += leaf.speed
      leaf.x += p.sin(p.frameCount * 0.03 + i) * 0.8
      leaf.rotation += leaf.rotSpeed
      
      p.push()
      p.translate(leaf.x, leaf.y)
      p.rotate(leaf.rotation)
      p.noStroke()
      // 使用落叶自带的颜色
      p.fill(leaf.color[0], leaf.color[1], leaf.color[2], 200)
      p.ellipse(0, 0, leaf.size, leaf.size * 0.6)
      // 叶脉
      p.stroke(leaf.color[0] - 30, leaf.color[1] - 30, leaf.color[2] - 30, 150)
      p.strokeWeight(1)
      p.line(-leaf.size * 0.3, 0, leaf.size * 0.3, 0)
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
      // 清空落叶和雪花，但保留蝴蝶、蜜蜂和鸟儿（它们会在屏幕外被自动移除）
      snowflakes = []
      fallingLeaves = []
      // 注意：不清空 butterflies、bees、birds，让它们继续飞
    } else if (p.key >= '1' && p.key <= '4') {
      currentSeason.value = parseInt(p.key)
      seasonName.value = seasons[currentSeason.value].name
      // 切换季节时清空特定季节动画
      snowflakes = []
      fallingLeaves = []
      // 注意：不清空 butterflies、bees、birds，让它们继续飞
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
