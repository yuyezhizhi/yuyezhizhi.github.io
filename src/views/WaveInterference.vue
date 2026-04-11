<template>
  <div class="wave-interference-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击添加波源 | ↑↓调节频率 | 空格重置</p>
      <div class="info">
        <p>波源数: {{ waveSourceCount }}</p>
        <p>频率: {{ frequency.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const waveSourceCount = ref(0)
const frequency = ref(0.1)
let p5Instance = null
let waveSources = []
let gridPoints = []
const GRID_SPACING = 4

onMounted(() => {
  const sketch = (p) => {
    class WaveSource {
      constructor(x, y) {
        this.pos = p.createVector(x, y)
        this.phase = 0
        this.pulsePhase = p.random(p.TWO_PI)
      }

      update() {
        this.phase += frequency.value
        this.pulsePhase += 0.05
      }

      getAmplitudeAt(x, y, time) {
        const d = p.dist(x, y, this.pos.x, this.pos.y)
        if (d < 5) return 0 // 波源中心不计算
        const k = 0.05 // 波数
        const amplitude = 30 / p.sqrt(d + 10) // 振幅随距离衰减
        return amplitude * p.sin(k * d - frequency.value * time * 10)
      }

      display() {
        const pulse = p.sin(this.pulsePhase) * 0.3 + 0.7
        
        p.push()
        p.colorMode(p.HSB)
        
        // 发光圆环
        for (let r = 20 * pulse; r > 5; r -= 3) {
          const alpha = p.map(r, 5, 20, 200, 50) * pulse
          p.noStroke()
          p.fill(180, 80, 100, alpha)
          p.ellipse(this.pos.x, this.pos.y, r)
        }
        
        // 核心
        p.fill(180, 60, 100, 255)
        p.ellipse(this.pos.x, this.pos.y, 8)
        
        p.pop()
      }
    }

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')
      
      // 创建初始波源
      waveSources.push(new WaveSource(p.width * 0.35, p.height * 0.5))
      waveSources.push(new WaveSource(p.width * 0.65, p.height * 0.5))
    }

    p.draw = () => {
      // 深蓝背景
      p.background(10, 20, 40)
      
      const cols = p.ceil(p.width / GRID_SPACING)
      const rows = p.ceil(p.height / GRID_SPACING)
      const time = p.frameCount
      
      // 更新波源
      for (let source of waveSources) {
        source.update()
      }
      
      // 使用像素操作绘制波纹
      p.push()
      p.noStroke()
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * GRID_SPACING
          const py = y * GRID_SPACING
          
          // 叠加所有波源的振幅
          let totalAmplitude = 0
          for (let source of waveSources) {
            totalAmplitude += source.getAmplitudeAt(px, py, time)
          }
          
          // 限制振幅范围
          totalAmplitude = p.constrain(totalAmplitude, -50, 50)
          
          // 振幅映射到颜色
          p.colorMode(p.HSB)
          let hue, brightness, saturation, alpha
          
          if (totalAmplitude < -10) {
            // 波谷 - 深蓝
            hue = p.map(totalAmplitude, -50, -10, 240, 220)
            brightness = p.map(totalAmplitude, -50, -10, 30, 50)
            saturation = 80
            alpha = p.map(totalAmplitude, -50, -10, 200, 150)
          } else if (totalAmplitude > 10) {
            // 波峰 - 白色/亮黄
            hue = p.map(totalAmplitude, 10, 50, 180, 60)
            brightness = p.map(totalAmplitude, 10, 50, 80, 100)
            saturation = p.map(totalAmplitude, 10, 50, 60, 20)
            alpha = p.map(totalAmplitude, 10, 50, 180, 255)
          } else {
            // 零点附近 - 青色
            hue = 190
            brightness = 60
            saturation = 70
            alpha = 120
          }
          
          // 根据振幅调整大小
          const size = GRID_SPACING * 0.9
          p.fill(hue, saturation, brightness, alpha)
          p.rect(px - GRID_SPACING/2, py - GRID_SPACING/2, size, size)
        }
      }
      
      p.pop()
      
      // 绘制波源
      for (let source of waveSources) {
        source.display()
      }

      waveSourceCount.value = waveSources.length
    }

    p.mouseClicked = () => {
      // 添加新波源（最多8个）
      if (waveSources.length < 8) {
        waveSources.push(new WaveSource(p.mouseX, p.mouseY))
      }
    }

    p.keyPressed = () => {
      // 上箭头增加频率
      if (p.keyCode === p.UP_ARROW) {
        frequency.value = p.min(frequency.value + 0.02, 0.5)
      }
      // 下箭头减少频率
      if (p.keyCode === p.DOWN_ARROW) {
        frequency.value = p.max(frequency.value - 0.02, 0.02)
      }
      // 空格重置
      if (p.key === ' ') {
        waveSources = []
        waveSources.push(new WaveSource(p.width * 0.35, p.height * 0.5))
        waveSources.push(new WaveSource(p.width * 0.65, p.height * 0.5))
        frequency.value = 0.1
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  p5Instance = new p5(sketch)
})

onBeforeUnmount(() => {
  if (p5Instance) {
    p5Instance.remove()
  }
})
</script>

<style scoped lang="less">
.wave-interference-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0a1428;

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
    color: #00b4db;
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
        margin: 0 0 0.3rem 0;
        font-size: 0.75rem;
        opacity: 0.75;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
