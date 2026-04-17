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
  let branchEndPoints = []  // 存储树枝末端位置
  let branchSnowIdCounter = 0  // 积雪标识计数器

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
      // 使用半透明覆盖来清除上一帧的动画元素（冬季增加透明度避免雪花轨迹）
      const clearAlpha = currentSeason.value === 4 ? 120 : 80
      p.fill(season.bg[0], season.bg[1], season.bg[2], clearAlpha)
      p.noStroke()
      p.rect(0, 0, p.width, p.height)
    }
    
    windOffset += 0.01
    
    // 绘制树 - 调整初始高度
    // 在秋季和冬季不清空树枝末端位置（秋季需要落叶，冬季需要积雪）
    if (currentSeason.value !== 3 && currentSeason.value !== 4) {
      branchEndPoints = []
    }
    // 重置积雪标识计数器
    branchSnowIdCounter = 0
    // 如果是冬季且未初始化，记录开始时间
    if (currentSeason.value === 4 && !isWinterInitialized) {
      winterStartTime = p.frameCount
      isWinterInitialized = true
    }
    p.randomSeed(treeSeed)
    // 初始枝干稍短，让整体更协调
    drawBranch(p, p.height * 0.18, 0, maxDepth.value, season, p.width / 2, p.height)
    
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

  const drawBranch = (p, len, angle, depth, season, currentX, currentY) => {
    // 微风摇摆效果
    const sway = p.sin(windOffset + depth * 0.5) * 0.015 * (maxDepth.value - depth)
    const finalAngle = angle + sway
    
    // 计算终点
    const endX = currentX + p.sin(finalAngle) * len
    const endY = currentY - p.cos(finalAngle) * len
    
    if (depth === 0) {
      // 记录树枝末端位置（用于落叶）
      branchEndPoints.push({ x: endX, y: endY })
      // 绘制叶片/花朵或积雪
      p.push()
      p.translate(endX, endY)
      if (currentSeason.value !== 4) {
        drawLeaf(p, season)
      } else {
        // 冬季绘制积雪（传入当前索引作为稳定标识）
        drawSnowOnBranch(p, branchSnowIdCounter++)
      }
      p.pop()
      return
    }
    
    // 树枝颜色渐变 - 越往上越细
    const branchColor = season.branch
    const alpha = p.map(depth, maxDepth.value, 0, 220, 80)
    // 枝干更细：底部最大4px，顶部最小0.5px
    const weight = p.map(depth, maxDepth.value, 0, 4, 0.5)
    
    p.stroke(branchColor[0], branchColor[1], branchColor[2], alpha)
    p.strokeWeight(weight)
    p.line(currentX, currentY, endX, endY)
    
    // 调整角度分布：底部角度大（分散），顶部角度小（集中）
    const depthRatio = depth / maxDepth.value
    const baseAngle = p.PI / 4 * (0.6 + 0.4 * depthRatio)
    const angleOffset = baseAngle + p.random(-0.15, 0.15)
    
    // 长度比例也随深度变化
    const lengthRatio = 0.72 + p.random(-0.03, 0.03)
    
    // 递归绘制分支，传递绝对坐标
    drawBranch(p, len * lengthRatio, finalAngle - angleOffset, depth - 1, season, endX, endY)
    drawBranch(p, len * lengthRatio, finalAngle + angleOffset, depth - 1, season, endX, endY)
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

  // 冬季积雪出现控制
  let winterStartTime = 0
  let snowAppearDelay = 300  // 5秒后开始出现 (60fps * 5s)
  let snowAppearDuration = 300  // 5秒内逐渐出现 (60fps * 5s)
  let isWinterInitialized = false  // 标记冬季是否已初始化
  
  // 存储每片积雪的透明度状态
  let branchSnowAlpha = new Map()
  
  const drawSnowOnBranch = (p, branchId) => {
    // 检查是否到了显示积雪的时间
    if (winterStartTime === 0) return
    
    const elapsed = p.frameCount - winterStartTime
    if (elapsed < snowAppearDelay) return
    
    // 计算积雪显示进度（0-1）
    const progress = Math.min((elapsed - snowAppearDelay) / snowAppearDuration, 1)
    
    // 根据进度和随机值决定是否开始显示这片积雪
    const branchRandom = (branchId % 1000) / 1000
    if (branchRandom > progress) return
    
    // 获取或初始化透明度
    if (!branchSnowAlpha.has(branchId)) {
      branchSnowAlpha.set(branchId, 0)
    }
    
    // 逐渐增加透明度
    let alpha = branchSnowAlpha.get(branchId)
    if (alpha < 220) {
      alpha = Math.min(alpha + 2, 220)
      branchSnowAlpha.set(branchId, alpha)
    }
    
    // 在树枝末端绘制积雪（使用branchId生成固定大小）
    const size = 3 + ((branchId * 7) % 30) / 10  // 3-6之间的固定值
    p.noStroke()
    // 白色积雪（使用渐变的透明度）
    p.fill(255, 255, 255, alpha)
    p.circle(0, 0, size)
    // 积雪高光（透明度稍低）
    p.fill(255, 255, 255, alpha * 0.7)
    p.circle(-size * 0.2, -size * 0.2, size * 0.5)
  }

  const drawSnow = (p) => {
    // 飘落雪花立即开始，不等待
    while (snowflakes.length < 600) {
      snowflakes.push({
        x: Math.random() * p.width,
        y: Math.random() * 300 - 300,
        size: Math.random() * 3 + 2,
        speed: Math.random() * 2 + 0.8,
        drift: (Math.random() - 0.5) * 0.3,
        swayFreq: Math.random() * 0.01 + 0.003,
        swayAmp: Math.random() * 0.4 + 0.1,
        swayPhase: Math.random() * Math.PI * 2,
        alpha: 0,  // 初始透明度为0
        targetAlpha: Math.random() * 80 + 120  // 目标透明度120-200
      })
    }
    
    // 更新和绘制雪花
    p.noStroke()
    
    for (let i = snowflakes.length - 1; i >= 0; i--) {
      const flake = snowflakes[i]
      flake.y += flake.speed
      flake.x += Math.sin(p.frameCount * flake.swayFreq + flake.swayPhase) * flake.swayAmp
      
      // 边界处理，左右循环
      if (flake.x > p.width) flake.x = 0
      if (flake.x < 0) flake.x = p.width
      
      // 透明度渐变 - 慢慢出现
      if (flake.alpha < flake.targetAlpha) {
        flake.alpha += 2  // 每帧增加2点透明度
      }
      
      p.fill(255, 255, 255, flake.alpha)
      p.circle(flake.x, flake.y, flake.size)
      
      // 掉出屏幕底部后移除
      if (flake.y > p.height + 20) {
        snowflakes.splice(i, 1)
      }
    }
  }

  const drawButterflies = (p, season) => {
    // 初始化蝴蝶 - 一次性生成10只，不同位置、大小、飞行参数
    if (butterflies.length === 0 && currentSeason.value === 1) {
      const treeTopX = p.width / 2
      const treeTopY = p.height * 0.50  // 蝴蝶高度整体调低
      
      for (let i = 0; i < 10; i++) {
        const angle = (p.TWO_PI / 10) * i + p.random(-0.3, 0.3)
        const radius = p.random(80, 250)
        
        // 每只蝴蝶有独特的飞行参数
        const flyPattern = p.random(['circle', 'wave', 'random', 'hover'])
        let speedRange, turnSpeed, amplitude
        
        switch(flyPattern) {
          case 'circle':
            speedRange = [0.8, 1.5]
            turnSpeed = 0.02
            amplitude = 30
            break
          case 'wave':
            speedRange = [1, 2]
            turnSpeed = 0.05
            amplitude = 50
            break
          case 'random':
            speedRange = [0.5, 1.8]
            turnSpeed = 0.08
            amplitude = 20
            break
          default: // hover
            speedRange = [0.3, 0.8]
            turnSpeed = 0.03
            amplitude = 15
        }
        
        butterflies.push({
          x: treeTopX + p.cos(angle) * radius,
          y: treeTopY + p.sin(angle) * radius,
          baseX: treeTopX + p.cos(angle) * radius,
          baseY: treeTopY + p.sin(angle) * radius,
          vx: p.random(-1, 1),
          vy: p.random(-0.5, 0.5),
          size: p.random(8, 18),  // 不同大小
          wingAngle: p.random(p.TWO_PI),
          wingSpeed: p.random(0.1, 0.4),
          color: p.random([[255, 100, 150], [255, 150, 50], [150, 100, 255], [255, 200, 50], [255, 180, 180]]),
          flyPattern: flyPattern,
          speedRange: speedRange,
          turnSpeed: turnSpeed,
          amplitude: amplitude,
          angle: p.random(p.TWO_PI),
          time: p.random(100)
        })
      }
    }
    
    // 更新和绘制蝴蝶
    // 更新和绘制蝴蝶 - 每只蝴蝶有不同的飞行模式
    for (let i = butterflies.length - 1; i >= 0; i--) {
      const b = butterflies[i]
      b.time++
      b.wingAngle += b.wingSpeed
      
      // 根据飞行模式更新位置
      switch(b.flyPattern) {
        case 'circle':
          // 圆周运动
          b.angle += b.turnSpeed
          b.x = b.baseX + p.cos(b.angle) * b.amplitude
          b.y = b.baseY + p.sin(b.angle) * b.amplitude * 0.6
          break
        case 'wave':
          // 波浪运动
          b.x += b.speedRange[1] * 0.5
          b.y = b.baseY + p.sin(b.time * b.turnSpeed) * b.amplitude
          if (b.x > p.width + 50) b.x = -50
          break
        case 'random':
          // 随机游走
          b.vx += p.random(-b.turnSpeed, b.turnSpeed)
          b.vy += p.random(-b.turnSpeed, b.turnSpeed)
          b.vx = p.constrain(b.vx, -b.speedRange[1], b.speedRange[1])
          b.vy = p.constrain(b.vy, -b.speedRange[1] * 0.5, b.speedRange[1] * 0.5)
          b.x += b.vx
          b.y += b.vy
          const distFromBase = p.dist(b.x, b.y, b.baseX, b.baseY)
          if (distFromBase > 100) {
            const angleToBase = p.atan2(b.baseY - b.y, b.baseX - b.x)
            b.vx += p.cos(angleToBase) * 0.1
            b.vy += p.sin(angleToBase) * 0.1
          }
          break
        default: // hover
          // 悬停抖动
          b.x = b.baseX + p.sin(b.time * b.turnSpeed) * b.amplitude * 0.5 + p.random(-2, 2)
          b.y = b.baseY + p.cos(b.time * b.turnSpeed * 1.3) * b.amplitude * 0.3 + p.random(-2, 2)
      }
      
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
    }
  }
  
  const drawBees = (p, season) => {
    // 初始化蜜蜂 - 一次性生成8只，不同位置、大小、飞行参数
    if (bees.length === 0 && currentSeason.value === 1) {
      const treeTopX = p.width / 2
      const treeTopY = p.height * 0.50  // 蜜蜂高度整体调低
      
      for (let i = 0; i < 8; i++) {
        const angle = (p.TWO_PI / 8) * i + p.random(-0.3, 0.3)
        const radius = p.random(60, 200)
        
        // 每只蜜蜂有独特的飞行参数
        const beeType = p.random(['busy', 'lazy', 'zigzag', 'steady'])
        let speedRange, turnFreq, jitterAmount
        
        switch(beeType) {
          case 'busy':
            speedRange = [2, 4]
            turnFreq = [10, 20]
            jitterAmount = 0.2
            break
          case 'lazy':
            speedRange = [0.5, 1.5]
            turnFreq = [40, 80]
            jitterAmount = 0.05
            break
          case 'zigzag':
            speedRange = [1.5, 3]
            turnFreq = [5, 15]
            jitterAmount = 0.3
            break
          default: // steady
            speedRange = [1, 2.5]
            turnFreq = [20, 40]
            jitterAmount = 0.1
        }
        
        bees.push({
          x: treeTopX + p.cos(angle) * radius,
          y: treeTopY + p.sin(angle) * radius,
          baseX: treeTopX + p.cos(angle) * radius,
          baseY: treeTopY + p.sin(angle) * radius,
          vx: p.random(-1, 1),
          vy: p.random(-0.5, 0.5),
          size: p.random(6, 12),  // 不同大小
          wingAngle: 0,
          wingSpeed: p.random(0.6, 1.5),
          beeType: beeType,
          speedRange: speedRange,
          turnFreq: turnFreq,
          jitterAmount: jitterAmount,
          changeDirTimer: p.random(10, 30),
          time: p.random(100)
        })
      }
    }
    
    // 更新和绘制蜜蜂 - 每只蜜蜂有不同的飞行模式
    for (let i = bees.length - 1; i >= 0; i--) {
      const b = bees[i]
      b.time++
      b.wingAngle += b.wingSpeed
      
      // 根据蜜蜂类型更新位置
      b.changeDirTimer--
      if (b.changeDirTimer <= 0) {
        b.changeDirTimer = p.random(b.turnFreq[0], b.turnFreq[1])
        
        switch(b.beeType) {
          case 'busy':
            // 快速直线飞行，突然转向
            b.vx = p.random(-b.speedRange[1], b.speedRange[1])
            b.vy = p.random(-b.speedRange[1] * 0.5, b.speedRange[1] * 0.5)
            break
          case 'lazy':
            // 缓慢漂移
            b.vx = p.random(-b.speedRange[1] * 0.5, b.speedRange[1] * 0.5)
            b.vy = p.random(-b.speedRange[1] * 0.3, b.speedRange[1] * 0.3)
            break
          case 'zigzag':
            // 之字形飞行
            b.vx = p.random(-b.speedRange[1], b.speedRange[1])
            b.vy = (p.random() > 0.5 ? 1 : -1) * b.speedRange[1] * 0.8
            break
          default: // steady
            // 稳定飞行，小幅度调整
            b.vx += p.random(-0.5, 0.5)
            b.vy += p.random(-0.3, 0.3)
        }
      }
      
      // 添加抖动
      b.vx += p.random(-b.jitterAmount, b.jitterAmount)
      b.vy += p.random(-b.jitterAmount * 0.6, b.jitterAmount * 0.6)
      
      // 限制速度
      b.vx = p.constrain(b.vx, -b.speedRange[1], b.speedRange[1])
      b.vy = p.constrain(b.vy, -b.speedRange[1] * 0.6, b.speedRange[1] * 0.6)
      
      // 更新位置
      b.x += b.vx
      b.y += b.vy
      
      // 保持在树周围
      const distFromBase = p.dist(b.x, b.y, b.baseX, b.baseY)
      if (distFromBase > 150) {
        const angleToBase = p.atan2(b.baseY - b.y, b.baseX - b.x)
        b.vx += p.cos(angleToBase) * 0.2
        b.vy += p.sin(angleToBase) * 0.2
      }
      
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
    }
  }
  
  const drawBirds = (p, season) => {
    // 初始化鸟儿 - 一次性生成10只，不同位置、大小、飞行参数
    if (birds.length === 0 && currentSeason.value === 2) {
      const treeTopX = p.width / 2
      const treeTopY = p.height * 0.5
      
      for (let i = 0; i < 10; i++) {
        const angle = (p.TWO_PI / 10) * i + p.random(-0.3, 0.3)
        const radius = p.random(80, 200)
        
        // 每只鸟有独特的飞行参数
        const birdType = p.random(['fast', 'slow', 'wandering', 'steady'])
        let speedRange, changeFreq, wanderAmount
        
        switch(birdType) {
          case 'fast':
            speedRange = [6, 10]  // 加快5倍
            changeFreq = [40, 70]
            wanderAmount = 0.03
            break
          case 'slow':
            speedRange = [1.5, 4]  // 加快5倍
            changeFreq = [80, 150]
            wanderAmount = 0.02
            break
          case 'wandering':
            speedRange = [3, 6]  // 加快5倍
            changeFreq = [25, 45]
            wanderAmount = 0.1
            break
          default: // steady
            speedRange = [4, 7.5]  // 加快5倍
            changeFreq = [60, 100]
            wanderAmount = 0.05
        }
        
        birds.push({
          x: treeTopX + p.cos(angle) * radius,
          y: treeTopY + p.sin(angle) * radius * 0.3,
          vx: p.random(-1, 1),
          vy: p.random(-0.8, 0.8),
          size: p.random(10, 18),  // 不同大小
          wingAngle: p.random(p.TWO_PI),
          wingSpeed: p.random(0.1, 0.3),
          color: p.random([[60, 60, 80], [80, 60, 40], [40, 60, 80], [100, 80, 60], [70, 80, 90]]),
          perched: false,
          perchTimer: 0,
          changeDirTimer: p.random(10, 30),
          speedRange: speedRange,
          changeFreq: changeFreq,
          wanderAmount: wanderAmount,
          birdType: birdType
        })
      }
    }
    
    // 更新和绘制鸟儿 - 在大树周围随机飞行，偶尔停留
    const treeTopX = p.width / 2
    const treeTopY = p.height * 0.5  // 降低高度，在树冠中部
    
    for (let i = birds.length - 1; i >= 0; i--) {
      const b = birds[i]
      
      if (b.perched) {
        // 停在树上
        b.perchTimer--
        if (b.perchTimer <= 0) {
          b.perched = false
          // 重新起飞
          b.vx = p.random(-1.5, 1.5)
          b.vy = p.random(-1, 1)
        }
      } else {
        // 随机飞行
        b.x += b.vx
        b.y += b.vy
        
        // 定期改变方向（每只鸟有不同的频率）
        b.changeDirTimer--
        if (b.changeDirTimer <= 0) {
          b.changeDirTimer = p.random(b.changeFreq[0], b.changeFreq[1])
          // 根据鸟的类型改变方向
          const newAngle = p.random(p.TWO_PI)
          const speed = p.random(b.speedRange[0], b.speedRange[1])
          b.vx = p.cos(newAngle) * speed
          b.vy = p.sin(newAngle) * speed * 0.6
        }
        
        // 添加随机扰动（每只鸟有不同的扰动程度）
        b.vx += p.random(-b.wanderAmount, b.wanderAmount)
        b.vy += p.random(-b.wanderAmount * 0.8, b.wanderAmount * 0.8)
        
        // 限制速度（根据鸟的类型）
        b.vx = p.constrain(b.vx, -b.speedRange[1], b.speedRange[1])
        b.vy = p.constrain(b.vy, -b.speedRange[1] * 0.7, b.speedRange[1] * 0.7)
        
        // 保持在树周围
        const distFromTree = p.dist(b.x, b.y, treeTopX, treeTopY)
        if (distFromTree > 250) {
          // 飞回树的方向
          const angleToTree = p.atan2(treeTopY - b.y, treeTopX - b.x)
          b.vx = p.cos(angleToTree) * p.random(0.8, 1.2)
          b.vy = p.sin(angleToTree) * p.random(0.5, 0.8)
          b.changeDirTimer = p.random(30, 50)  // 重置方向计时器
        }
        
        // 偶尔停在树叶上（0.5%概率每帧）
        if (p.random() < 0.005 && distFromTree < 180) {
          b.perched = true
          b.perchTimer = p.random(60, 180)
          b.vx = 0
          b.vy = 0
        }
      }
      
      b.wingAngle += b.wingSpeed
      
      // 计算飞行方向
      let flightAngle = 0
      if (!b.perched) {
        flightAngle = p.atan2(b.vy, b.vx)
      }
      
      p.push()
      p.translate(b.x, b.y)
      if (!b.perched) {
        p.rotate(flightAngle)
      }
      
      // 翅膀扇动（停留时不扇动）
      const wingY = b.perched ? 0 : p.sin(b.wingAngle) * b.size * 0.4
      
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
  
  // 落叶批次控制
  let leafBatchTimer = 0
  let leafBatchInterval = 30  // 每30帧生成一批
  
  const drawFallingLeaves = (p, season) => {
    // 分批生成落叶，从树枝末端位置开始掉落
    leafBatchTimer++
    if (leafBatchTimer >= leafBatchInterval && fallingLeaves.length < 25 && branchEndPoints.length > 0) {
      leafBatchTimer = 0
      // 每批生成3-5片树叶
      const batchSize = Math.floor(Math.random() * 3) + 3
      
      for (let j = 0; j < batchSize; j++) {
        // 从记录的树枝末端位置中随机选择一个
        const randomBranch = branchEndPoints[Math.floor(Math.random() * branchEndPoints.length)]
        // 在树枝位置附近稍微随机偏移
        const x = randomBranch.x + (Math.random() - 0.5) * 30
        const y = randomBranch.y + (Math.random() - 0.5) * 20
        
        fallingLeaves.push({
          x: x,
          y: y,
          size: Math.random() * 10 + 6,
          speed: Math.random() * 1.5 + 1,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          color: [[255, 140, 0], [200, 100, 0], [180, 80, 20], [220, 120, 30], [255, 100, 0], [160, 82, 45]][Math.floor(Math.random() * 6)],
          // 每片树叶完全独立的摇摆参数
          swayFreq: Math.random() * 0.025 + 0.015,
          swayAmp: Math.random() * 1.2 + 0.4,
          swayPhase: Math.random() * Math.PI * 2,
          drift: (Math.random() - 0.5) * 0.5
        })
      }
    }
    
    // 更新和绘制落叶
    for (let i = fallingLeaves.length - 1; i >= 0; i--) {
      const leaf = fallingLeaves[i]
      leaf.y += leaf.speed
      // 每片树叶完全独立的摇摆轨迹
      leaf.x += Math.sin(p.frameCount * leaf.swayFreq + leaf.swayPhase) * leaf.swayAmp + leaf.drift
      leaf.rotation += leaf.rotSpeed
      
      p.push()
      p.translate(leaf.x, leaf.y)
      p.rotate(leaf.rotation)
      p.noStroke()
      // 使用落叶自带的颜色
      p.fill(leaf.color[0], leaf.color[1], leaf.color[2], 230)
      p.ellipse(0, 0, leaf.size, leaf.size * 0.6)
      // 叶脉
      p.stroke(leaf.color[0] - 30, leaf.color[1] - 30, leaf.color[2] - 30, 180)
      p.strokeWeight(1)
      p.line(-leaf.size * 0.3, 0, leaf.size * 0.3, 0)
      p.pop()
      
      // 掉出屏幕底部后移除
      if (leaf.y > p.height + 30) {
        fallingLeaves.splice(i, 1)
      }
    }
  }

  p.keyPressed = () => {
    if (p.key === ' ') {
      treeSeed = p.random(1000)
      p.randomSeed(treeSeed)
      // 清空落叶，但保留雪花（冬季时）和蝴蝶、蜜蜂、鸟儿
      fallingLeaves = []
      // 注意：不清空 snowflakes、butterflies、bees、birds
    } else if (p.key >= '1' && p.key <= '4') {
      currentSeason.value = parseInt(p.key)
      seasonName.value = seasons[currentSeason.value].name
      // 切换季节时清空特定季节动画
      snowflakes = []
      fallingLeaves = []
      // 重置冬季计时器和初始化标记
      winterStartTime = 0
      isWinterInitialized = false
      branchSnowAlpha.clear()
      branchSnowIdCounter = 0
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
