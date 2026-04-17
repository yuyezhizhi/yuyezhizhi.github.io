<template>
  <div class="audio-wheel-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">上传音频后开始可视化 | 鼠标控制中心</p>
      <p class="subtitle">空间音频轮盘 - 旋转同心圆</p>
    </div>
    <div class="audio-panel">
      <AudioUploader 
        @audio-ready="onAudioReady" 
        @audio-play="onPlay" 
        @audio-pause="onPause" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'
import AudioUploader from '../components/AudioUploader.vue'

let p5Instance = null
let analyserNode = null
let isAudioPlaying = ref(false)

// 历史频谱数据（多层效果）
const historyFrames = 5
let spectrumHistory = []
let rotationAngle = 0

const onAudioReady = ({ audioContext, analyser, source, audioElement }) => {
  analyserNode = analyser
}

const onPlay = () => {
  isAudioPlaying.value = true
}

const onPause = () => {
  isAudioPlaying.value = false
}

const sketch = (p) => {
  const numSegments = 128
  let currentSpectrum = new Array(numSegments).fill(0)
  let smoothedSpectrum = new Array(numSegments).fill(0)
  let centerPulse = 0
  
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-canvas')
    
    // 初始化历史帧
    for (let i = 0; i < historyFrames; i++) {
      spectrumHistory.push(new Array(numSegments).fill(0))
    }
  }

  p.draw = () => {
    // 明亮渐变背景
    const bgGradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height)
    bgGradient.addColorStop(0, '#E8EAF6')
    bgGradient.addColorStop(0.5, '#F3E5F5')
    bgGradient.addColorStop(1, '#FFF3E0')
    p.drawingContext.fillStyle = bgGradient
    p.noStroke()
    p.rect(0, 0, p.width, p.height)
    
    // 获取频谱数据
    let totalVolume = 0
    if (analyserNode) {
      const bufferLength = analyserNode.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyserNode.getByteFrequencyData(dataArray)
      
      // 聚合到128段
      const binsPerSegment = Math.floor(bufferLength / numSegments)
      for (let i = 0; i < numSegments; i++) {
        let sum = 0
        for (let j = 0; j < binsPerSegment; j++) {
          sum += dataArray[i * binsPerSegment + j]
        }
        currentSpectrum[i] = sum / binsPerSegment
        totalVolume += currentSpectrum[i]
      }
      totalVolume /= numSegments
    } else {
      // 没有音频时显示静态淡色圆环
      for (let i = 0; i < numSegments; i++) {
        currentSpectrum[i] = 30 + p.sin(p.frameCount * 0.03 + i * 0.1) * 20
      }
      totalVolume = 30
    }
    
    // 平滑数据
    for (let i = 0; i < numSegments; i++) {
      smoothedSpectrum[i] = p.lerp(smoothedSpectrum[i], currentSpectrum[i], 0.2)
    }
    
    // 更新历史帧
    spectrumHistory.unshift([...smoothedSpectrum])
    if (spectrumHistory.length > historyFrames) {
      spectrumHistory.pop()
    }
    
    // 计算中心脉冲
    centerPulse = p.lerp(centerPulse, totalVolume, 0.1)
    
    // 更新旋转角度
    rotationAngle += 0.5
    
    // 鼠标控制旋转中心偏移
    const centerX = p.width / 2 + (p.mouseX - p.width / 2) * 0.1
    const centerY = p.height / 2 + (p.mouseY - p.height / 2) * 0.1
    
    p.colorMode(p.HSB, 360, 100, 100, 100)
    
    // 绘制多层历史帧（扩散效果）
    for (let h = historyFrames - 1; h >= 0; h--) {
      const historyData = spectrumHistory[h] || smoothedSpectrum
      const radiusOffset = h * 15
      const alpha = p.map(h, 0, historyFrames - 1, 80, 20)
      drawCircularSpectrum(p, centerX, centerY, historyData, radiusOffset, alpha, rotationAngle)
    }
    
    // 绘制中心脉冲圆点
    drawCenterPulse(p, centerX, centerY, centerPulse)
    
    p.colorMode(p.RGB, 255)
  }
  
  const drawCircularSpectrum = (p, cx, cy, data, radiusOffset, alpha, rotation) => {
    const baseRadius = p.min(p.width, p.height) * 0.15 + radiusOffset
    const maxBarLength = p.min(p.width, p.height) * 0.25
    
    for (let i = 0; i < numSegments; i++) {
      const angle = p.map(i, 0, numSegments, 0, p.TWO_PI) + p.radians(rotation)
      const value = data[i]
      const barLength = p.map(value, 0, 255, 5, maxBarLength)
      
      const x1 = cx + p.cos(angle) * baseRadius
      const y1 = cy + p.sin(angle) * baseRadius
      const x2 = cx + p.cos(angle) * (baseRadius + barLength)
      const y2 = cy + p.sin(angle) * (baseRadius + barLength)
      
      // 色相=角度，产生彩虹圆环效果
      const hue = p.map(i, 0, numSegments, 0, 360)
      
      p.stroke(hue, 80, 90, alpha)
      p.strokeWeight(3)
      p.line(x1, y1, x2, y2)
      
      // 端点发光
      p.noStroke()
      p.fill(hue, 60, 100, alpha * 0.5)
      p.circle(x2, y2, 4)
    }
  }
  
  const drawCenterPulse = (p, cx, cy, volume) => {
    const baseSize = 20
    const pulseSize = p.map(volume, 0, 255, 0, 80)
    const size = baseSize + pulseSize
    
    // 外发光
    for (let i = 3; i >= 0; i--) {
      const glowSize = size + i * 15
      const alpha = p.map(i, 0, 3, 60, 10)
      p.fill(280, 70, 100, alpha)
      p.noStroke()
      p.circle(cx, cy, glowSize)
    }
    
    // 中心圆
    p.fill(280, 80, 100, 90)
    p.circle(cx, cy, size)
    
    // 内核
    p.fill(300, 40, 100, 100)
    p.circle(cx, cy, size * 0.4)
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
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
.audio-wheel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;

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
    backdrop-filter: blur(10px);
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    text-align: right;

    .instruction {
      margin: 0 0 0.3rem 0;
      font-size: 0.85rem;
      font-weight: 500;
      opacity: 1;
    }

    .subtitle {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.9;
    }
  }

  .audio-panel {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    max-width: 700px;
    min-width: 300px;
    z-index: 10;
  }
}
</style>
