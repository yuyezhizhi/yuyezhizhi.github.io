<template>
  <div class="digital-rain-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <h3>数字雨</h3>
      <p class="instruction">鼠标悬停暂停，点击改变颜色，键盘输入自定义字符</p>
      <div class="info">
        <p>雨滴数: {{ dropCount }}</p>
        <p>字符集: {{ charSet }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const dropCount = ref(0)
const charSet = ref('默认')
let customChars = '01'
let currentColorMode = 0

const colorModes = [
  { name: '经典绿', r: 0, g: 255, b: 0 },
  { name: '赛博蓝', r: 0, g: 200, b: 255 },
  { name: '霓虹紫', r: 200, g: 0, b: 255 },
  { name: '火焰红', r: 255, g: 100, b: 0 },
  { name: '随机', r: -1, g: -1, b: -1 }
]

let p5Instance = null
let drops = []
let fontSize = 16
let columns
let mouseXPos = -1
let isPaused = false

class Drop {
  constructor(x) {
    this.x = x
    this.y = 0
    this.speed = Math.random() * 3 + 2
    this.chars = []
    this.length = Math.floor(Math.random() * 20) + 10
    this.opacity = 255
    this.isPaused = false

    // 初始化字符
    for (let i = 0; i < this.length; i++) {
      this.chars.push(randomChar())
    }
  }

  update() {
    if (this.isPaused) return

    this.y += this.speed

    // 如果超出屏幕，重置
    if (this.y > p5Instance.height + this.length * fontSize) {
      this.y = -this.length * fontSize
      this.x = Math.floor(Math.random() * columns) * fontSize
      this.chars = []
      for (let i = 0; i < this.length; i++) {
        this.chars.push(randomChar())
      }
    }
  }

  draw() {
    const colorMode = colorModes[currentColorMode]

    for (let i = 0; i < this.chars.length; i++) {
      const y = this.y - i * fontSize

      if (y < 0 || y > p5Instance.height) continue

      // 渐变透明度
      const alpha = p5Instance.map(i, 0, this.chars.length, 255, 0)

      if (colorMode.r === -1) {
        // 随机颜色
        p5Instance.fill(
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255),
          alpha
        )
      } else {
        p5Instance.fill(colorMode.r, colorMode.g, colorMode.b, alpha)
      }

      // 头部字符高亮
      if (i === 0) {
        p5Instance.fill(255, 255, 255, alpha)
      }

      p5Instance.textSize(fontSize)
      p5Instance.text(this.chars[i], this.x, y)
    }
  }

  checkMouseInteraction() {
    const dist = Math.abs(this.x - mouseXPos)
    if (dist < fontSize * 2) {
      this.isPaused = true
    } else {
      this.isPaused = false
    }
  }

  changeColor() {
    // 随机改变字符
    for (let i = 0; i < this.chars.length; i++) {
      if (Math.random() > 0.7) {
        this.chars[i] = randomChar()
      }
    }
  }
}

const randomChar = () => {
  const chars = customChars
  return chars[Math.floor(Math.random() * chars.length)]
}

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-canvas')
    p.background(0)

    // 设置字体
    p.textFont('Courier New')
    p.textAlign(p.LEFT, p.TOP)

    // 计算列数
    columns = Math.floor(p.width / fontSize)

    // 创建雨滴
    for (let i = 0; i < columns; i++) {
      drops.push(new Drop(i * fontSize))
    }

    dropCount.value = drops.length
  }

  p.draw = () => {
    p.background(0, 0, 0, 50) // 半透明黑色背景实现拖尾

    // 更新和绘制雨滴
    for (let drop of drops) {
      drop.checkMouseInteraction()
      drop.update()
      drop.draw()
    }
  }

  p.mouseMoved = () => {
    mouseXPos = p.mouseX
  }

  p.mouseClicked = () => {
    // 改变颜色模式
    currentColorMode = (currentColorMode + 1) % colorModes.length

    // 改变所有雨滴的字符
    for (let drop of drops) {
      drop.changeColor()
    }
  }

  p.keyPressed = () => {
    // 如果是可打印字符，更新字符集
    if (p.key.length === 1) {
      customChars += p.key
      if (customChars.length > 20) {
        customChars = customChars.slice(-20)
      }
      charSet.value = customChars
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
    columns = Math.floor(p.width / fontSize)

    // 重新创建雨滴
    drops = []
    for (let i = 0; i < columns; i++) {
      drops.push(new Drop(i * fontSize))
    }

    dropCount.value = drops.length
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
.digital-rain-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: black;

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
    background: rgba(0, 0, 0, 0.8);
    padding: 1.5rem;
    border-radius: 10px;
    color: #0f0;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 0, 0.3);
    font-family: 'Courier New', monospace;

    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
      text-shadow: 0 0 10px #0f0;
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
  }
}
</style>
