<template>
  <div class="rainbow-wave-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">移动鼠标改变波形 | 点击切换色彩 | 色彩模式: {{ colorModeName }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const colorModeName = ref('彩虹')
let p5Instance = null
let time = 0
let currentColorMode = 0
const colorModes = ['彩虹', '糖果', '日落', '海洋']

onMounted(() => {
  const sketch = (p) => {
    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')
      p.colorMode(p.HSB)
    }

    p.draw = () => {
      // 柔和的背景渐变
      const bgGradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height)
      if (currentColorMode === 0) {
        bgGradient.addColorStop(0, '#FFF5F7')
        bgGradient.addColorStop(1, '#F0F8FF')
      } else if (currentColorMode === 1) {
        bgGradient.addColorStop(0, '#FFE5F0')
        bgGradient.addColorStop(1, '#E8F5E9')
      } else if (currentColorMode === 2) {
        bgGradient.addColorStop(0, '#FFF3E0')
        bgGradient.addColorStop(1, '#FFEBEE')
      } else {
        bgGradient.addColorStop(0, '#E3F2FD')
        bgGradient.addColorStop(1, '#E0F7FA')
      }
      p.drawingContext.fillStyle = bgGradient
      p.rect(0, 0, p.width, p.height)

      time += 0.02
      
      const waves = 8
      const baseAmplitude = 100
      const mouseYRatio = p.mouseY / p.height
      const mouseXRatio = p.mouseX / p.width
      
      // 鼠标影响波的频率和相位
      const freqMultiplier = 0.003 + mouseXRatio * 0.008 // 频率范围: 0.003 ~ 0.011
      const phaseShift = mouseYRatio * p.PI // 相位偏移范围: 0 ~ PI
      
      for (let i = 0; i < waves; i++) {
        p.noFill()
        
        let hue, saturation, brightness, alpha
        const waveRatio = i / waves
        
        if (currentColorMode === 0) {
          // 彩虹模式
          hue = (time * 30 + i * 45) % 360
          saturation = 70
          brightness = 85
          alpha = 180
        } else if (currentColorMode === 1) {
          // 糖果模式
          hue = (i * 60 + 300) % 360
          saturation = 60
          brightness = 90
          alpha = 200
        } else if (currentColorMode === 2) {
          // 日落模式
          hue = (i * 30 + 10) % 60
          saturation = 75
          brightness = 80
          alpha = 190
        } else {
          // 海洋模式
          hue = (i * 20 + 180) % 60 + 160
          saturation = 65
          brightness = 85
          alpha = 185
        }
        
        p.stroke(hue, saturation, brightness, alpha)
        p.strokeWeight(3)
        
        p.beginShape()
        for (let x = 0; x <= p.width; x += 10) {
          // 鼠标X控制频率（波形疏密），鼠标Y控制相位偏移
          const wavePhase = x * freqMultiplier + time + i * 0.5 + phaseShift * (i + 1)
          const secondaryPhase = x * (freqMultiplier * 2) + time * 1.5 + i
          const y = p.height / 2 + 
                   p.sin(wavePhase) * baseAmplitude +
                   p.sin(secondaryPhase) * 30 +
                   (i - waves / 2) * 30
          p.vertex(x, y)
        }
        p.endShape()
        
        // 添加光晕效果
        p.stroke(hue, saturation - 10, brightness + 5, alpha * 0.3)
        p.strokeWeight(8)
        
        p.beginShape()
        for (let x = 0; x <= p.width; x += 10) {
          const wavePhase = x * freqMultiplier + time + i * 0.5 + phaseShift * (i + 1)
          const secondaryPhase = x * (freqMultiplier * 2) + time * 1.5 + i
          const y = p.height / 2 + 
                   p.sin(wavePhase) * baseAmplitude +
                   p.sin(secondaryPhase) * 30 +
                   (i - waves / 2) * 30
          p.vertex(x, y)
        }
        p.endShape()
      }
      
      // 添加漂浮的光点
      p.noStroke()
      for (let i = 0; i < 20; i++) {
        const x = (p.sin(time * 0.5 + i * 0.7) * 0.5 + 0.5) * p.width
        const y = (p.cos(time * 0.3 + i * 0.5) * 0.5 + 0.5) * p.height
        const size = p.sin(time + i) * 3 + 5
        
        let sparkleHue
        if (currentColorMode === 0) {
          sparkleHue = (time * 50 + i * 30) % 360
        } else if (currentColorMode === 1) {
          sparkleHue = (i * 45 + 320) % 360
        } else if (currentColorMode === 2) {
          sparkleHue = (i * 25 + 15) % 50
        } else {
          sparkleHue = (i * 18 + 180) % 50 + 160
        }
        
        p.fill(sparkleHue, 40, 95, 150)
        p.ellipse(x, y, size * 2)
      }
      
      // 绘制自定义鼠标 - 彩虹圆环
      p.push()
      p.colorMode(p.HSB)
      p.noFill()
      
      for (let i = 0; i < 6; i++) {
        const hue = (p.frameCount * 2 + i * 60) % 360
        p.stroke(hue, 70, 90, 180)
        p.strokeWeight(2)
        const radius = 10 + i * 3
        p.ellipse(p.mouseX, p.mouseY, radius * 2)
      }
      
      // 中心点
      p.noStroke()
      p.fill((p.frameCount * 3) % 360, 60, 95)
      p.ellipse(p.mouseX, p.mouseY, 8)
      
      p.pop()
    }

    p.mouseClicked = () => {
      currentColorMode = (currentColorMode + 1) % colorModes.length
      colorModeName.value = colorModes[currentColorMode]
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
.rainbow-wave-container {
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
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 0 0 0 8px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: none;
    border-right: none;
    color: #ff6b9d;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    .instruction {
      margin: 0;
      font-size: 0.75rem;
      opacity: 1;
      line-height: 1.3;
      white-space: nowrap;
    }
  }
}
</style>
