<template>
  <div class="cellular-automata-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击添加细胞 | 空格开始/暂停 | 1-5切换规则 | R重置</p>
      <div class="info">
        <p>{{ isRunning ? '运行中' : '已暂停' }} | 代数: {{ generation }} | 活细胞: {{ aliveCount }}</p>
        <p>规则: {{ rules[currentRule].name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const isRunning = ref(false)
const generation = ref(0)
const aliveCount = ref(0)
const currentRule = ref(0)

const rules = [
  {
    name: '康威生命游戏',
    description: '经典规则：孤单死亡，拥挤死亡，适中生存，繁殖新生',
    born: [3],
    survive: [2, 3]
  },
  {
    name: 'HighLife',
    description: '类似生命游戏，但6个邻居也会繁殖',
    born: [3, 6],
    survive: [2, 3]
  },
  {
    name: 'Day & Night',
    description: '死亡细胞有3,6,7,8个邻居时复活，活细胞有3,4,6,7,8个邻居时存活',
    born: [3, 6, 7, 8],
    survive: [3, 4, 6, 7, 8]
  },
  {
    name: '2x2',
    description: '更简单的规则，只有1,2,5个邻居时存活，3,6个邻居时繁殖',
    born: [3, 6],
    survive: [1, 2, 5]
  },
  {
    name: '迷宫生成',
    description: '特殊规则，能生成迷宫图案',
    born: [3],
    survive: [1, 2, 3, 4, 5]
  }
]

let p5Instance = null
let grid = []
let nextGrid = []
let cellSize = 5 // 细胞大小缩小一倍，从10改为5
let cols, rows
let updateInterval = 100
let lastUpdateTime = 0

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-canvas')
    p.background(20, 20, 30)

    // 计算网格大小
    cols = Math.floor(p.width / cellSize)
    rows = Math.floor(p.height / cellSize)

    // 初始化网格
    initGrid()

    // 随机初始化一些细胞
    randomizeGrid(0.2)
  }

  p.draw = () => {
    p.background(20, 20, 30)

    // 更新网格
    if (isRunning.value && p.millis() - lastUpdateTime > updateInterval) {
      updateGrid()
      lastUpdateTime = p.millis()
      generation.value++
    }

    // 绘制网格
    drawGrid()

    // 绘制放大镜效果
    drawMagnifier()

    // 统计活细胞数
    aliveCount.value = countAliveCells()
  }

  const initGrid = () => {
    grid = []
    nextGrid = []
    for (let i = 0; i < cols; i++) {
      grid[i] = []
      nextGrid[i] = []
      for (let j = 0; j < rows; j++) {
        grid[i][j] = 0
        nextGrid[i][j] = 0
      }
    }
  }

  const randomizeGrid = (density) => {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = Math.random() < density ? 1 : 0
      }
    }
  }

  const updateGrid = () => {
    const rule = rules[currentRule.value]

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const neighbors = countNeighbors(i, j)
        const state = grid[i][j]

        if (state === 1) {
          // 活细胞
          if (rule.survive.includes(neighbors)) {
            nextGrid[i][j] = 1
          } else {
            nextGrid[i][j] = 0
          }
        } else {
          // 死细胞
          if (rule.born.includes(neighbors)) {
            nextGrid[i][j] = 1
          } else {
            nextGrid[i][j] = 0
          }
        }
      }
    }

    // 交换网格
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = nextGrid[i][j]
      }
    }
  }

  const countNeighbors = (x, y) => {
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue

        const col = (x + i + cols) % cols
        const row = (y + j + rows) % rows

        count += grid[col][row]
      }
    }
    return count
  }

  const drawGrid = () => {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j] === 1) {
          const x = i * cellSize
          const y = j * cellSize

          // 根据规则使用不同颜色
          const hue = (currentRule.value * 60) % 360
          p.colorMode(p.HSB)
          p.fill(hue, 70, 90)
          p.noStroke()

          p.rect(x, y, cellSize - 1, cellSize - 1)
        }
      }
    }
    p.colorMode(p.RGB)
  }

  const countAliveCells = () => {
    let count = 0
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        count += grid[i][j]
      }
    }
    return count
  }

  const drawMagnifier = () => {
    const magRadius = 100 // 放大镜半径
    const zoomLevel = 4 // 放大倍数改为4倍
    
    // 获取鼠标位置的网格坐标
    const mouseCol = Math.floor(p.mouseX / cellSize)
    const mouseRow = Math.floor(p.mouseY / cellSize)
    
    // 检查是否在画布范围内
    if (mouseCol < 0 || mouseCol >= cols || mouseRow < 0 || mouseRow >= rows) {
      return
    }
    
    p.push()
    
    // 创建圆形裁剪区域
    p.drawingContext.save()
    p.drawingContext.beginPath()
    p.drawingContext.arc(p.mouseX, p.mouseY, magRadius, 0, p.TWO_PI)
    p.drawingContext.clip()
    
    // 计算需要放大的区域（以鼠标为中心）
    const cellsInView = Math.ceil(magRadius * 2 / (cellSize * zoomLevel))
    const halfCells = Math.floor(cellsInView / 2)
    
    // 绘制放大的内容
    p.noStroke()
    for (let i = 0; i < cellsInView; i++) {
      for (let j = 0; j < cellsInView; j++) {
        const col = mouseCol - halfCells + i
        const row = mouseRow - halfCells + j
        
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          // 计算放大后的位置和大小
          const x = p.mouseX - magRadius + i * (magRadius * 2 / cellsInView)
          const y = p.mouseY - magRadius + j * (magRadius * 2 / cellsInView)
          const size = magRadius * 2 / cellsInView
          
          if (grid[col][row] === 1) {
            const hue = (currentRule.value * 60) % 360
            p.colorMode(p.HSB)
            p.fill(hue, 70, 90)
            p.rect(x, y, size, size) // 移除 -1，使用完整尺寸
            p.colorMode(p.RGB)
          } else {
            p.fill(20, 20, 30)
            p.rect(x, y, size, size) // 移除 -1，使用完整尺寸
          }
        }
      }
    }
    
    p.drawingContext.restore()
    
    // 绘制放大镜边框
    p.noFill()
    p.stroke(100, 180, 255, 220)
    p.strokeWeight(4)
    p.circle(p.mouseX, p.mouseY, magRadius * 2)
    
    // 绘制鼠标位置的透明方块（与放大后的细胞大小一致）
    if (mouseCol >= 0 && mouseCol < cols && mouseRow >= 0 && mouseRow < rows) {
      // 计算这个细胞在放大镜中的位置和大小
      const cellsInView = Math.ceil(magRadius * 2 / (cellSize * zoomLevel))
      const halfCells = Math.floor(cellsInView / 2)
      
      // 找到鼠标位置对应的细胞在放大镜中的索引
      const indexI = mouseCol - (mouseCol - halfCells)
      const indexJ = mouseRow - (mouseRow - halfCells)
      
      if (indexI >= 0 && indexI < cellsInView && indexJ >= 0 && indexJ < cellsInView) {
        const x = p.mouseX - magRadius + indexI * (magRadius * 2 / cellsInView)
        const y = p.mouseY - magRadius + indexJ * (magRadius * 2 / cellsInView)
        const size = magRadius * 2 / cellsInView
        
        // 绘制半透明的选中框
        p.noStroke()
        p.fill(255, 255, 255, 80) // 白色半透明
        p.rect(x, y, size, size)
        
        // 绘制边框
        p.noFill()
        p.stroke(255, 255, 255, 200)
        p.strokeWeight(2)
        p.rect(x, y, size, size)
      }
    }
    
    p.pop()
  }

  p.mousePressed = () => {
    const col = Math.floor(p.mouseX / cellSize)
    const row = Math.floor(p.mouseY / cellSize)

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      // 切换细胞状态
      grid[col][row] = grid[col][row] === 1 ? 0 : 1
    }
  }

  p.mouseDragged = () => {
    const col = Math.floor(p.mouseX / cellSize)
    const row = Math.floor(p.mouseY / cellSize)

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col][row] = 1
    }
  }

  p.keyPressed = () => {
    // 空格键开始/暂停
    if (p.key === ' ') {
      isRunning.value = !isRunning.value
    }

    // 数字键切换规则
    const key = parseInt(p.key)
    if (key >= 1 && key <= 5) {
      currentRule.value = key - 1
      generation.value = 0
    }

    // R 键重置
    if (p.key === 'r' || p.key === 'R') {
      randomizeGrid(0.2)
      generation.value = 0
    }

    // C 键清空
    if (p.key === 'c' || p.key === 'C') {
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          grid[i][j] = 0
        }
      }
      generation.value = 0
      isRunning.value = false
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
    cols = Math.floor(p.width / cellSize)
    rows = Math.floor(p.height / cellSize)
    initGrid()
    randomizeGrid(0.2)
    generation.value = 0
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
.cellular-automata-container {
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
    cursor: none; /* 隐藏默认鼠标 */
  }

  .controls {
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    color: white;
    backdrop-filter: none;
    border: none;

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 0.9;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .info {
      p {
        margin: 0.2rem 0;
        font-size: 0.75rem;
        opacity: 0.75;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
