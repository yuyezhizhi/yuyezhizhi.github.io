<template>
  <div class="cellular-automata-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <h3>细胞自动机</h3>
      <p class="instruction">点击添加/移除细胞，空格开始/暂停，数字键1-5切换规则，R重置</p>
      <div class="info">
        <p>状态: {{ isRunning ? '运行中' : '已暂停' }}</p>
        <p>代数: {{ generation }}</p>
        <p>活细胞: {{ aliveCount }}</p>
        <p>当前规则: {{ rules[currentRule].name }}</p>
      </div>
      <div class="rule-info">
        <h4>规则说明</h4>
        <p>{{ rules[currentRule].description }}</p>
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
let cellSize = 10
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
  position: relative;
  width: 100%;
  height: 100vh;
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
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    padding: 1.5rem;
    border-radius: 10px;
    color: white;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 350px;

    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
      color: #fd79a8;
    }

    .instruction {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .info {
      p {
        margin: 0.3rem 0;
        font-size: 0.85rem;
        opacity: 0.7;
      }
    }

    .rule-info {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        color: #fdcb6e;
      }

      p {
        margin: 0;
        font-size: 0.8rem;
        opacity: 0.6;
        line-height: 1.5;
      }
    }
  }
}
</style>
