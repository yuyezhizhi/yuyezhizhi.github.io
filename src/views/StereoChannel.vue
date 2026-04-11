<template>
  <div class="stereo-channel-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">拖拽音频文件播放 | 左右声道分离显示</p>
      <div class="info">
        <p>{{ hasAudio ? (isPlaying ? '播放中' : '已暂停') : '等待音频' }} | 左:紫色 右:青色</p>
      </div>
    </div>
    <div class="audio-panel">
      <AudioUploader @audio-ready="onAudioReady" @audio-play="onPlay" @audio-pause="onPause" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'
import AudioUploader from '../components/AudioUploader.vue'

const hasAudio = ref(false)
const isPlaying = ref(false)

let p5Instance = null
let audioContext = null
let leftAnalyser = null
let rightAnalyser = null

// 音频数据数组
let leftDataArray = null
let rightDataArray = null

// 粒子系统
let particles = []

class SpectrumParticle {
  constructor(x, y, hue, isLeft) {
    this.x = x
    this.y = y
    this.vx = isLeft ? p5Instance.random(-3, -1) : p5Instance.random(1, 3)
    this.vy = p5Instance.random(-2, 2)
    this.life = 255
    this.hue = hue
    this.size = p5Instance.random(2, 5)
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.05 // 轻微重力
    this.life -= 3
  }
  
  draw(p) {
    p.noStroke()
    p.fill(this.hue, 80, 90, this.life / 255 * 100)
    p.circle(this.x, this.y, this.size)
  }
  
  isDead() {
    return this.life <= 0
  }
}

const onAudioReady = ({ audioContext: ctx, source }) => {
  audioContext = ctx
  hasAudio.value = true
  
  // 创建声道分离器
  const splitter = audioContext.createChannelSplitter(2)
  
  // 断开原连接，重新路由
  source.disconnect()
  source.connect(splitter)
  
  // 创建左右声道分析器
  leftAnalyser = audioContext.createAnalyser()
  rightAnalyser = audioContext.createAnalyser()
  leftAnalyser.fftSize = 256
  rightAnalyser.fftSize = 256
  
  // 连接分离器到分析器
  splitter.connect(leftAnalyser, 0)
  splitter.connect(rightAnalyser, 1)
  
  // 分析器连接到输出（让用户能听到声音）
  leftAnalyser.connect(audioContext.destination)
  
  // 初始化数据数组
  leftDataArray = new Uint8Array(leftAnalyser.frequencyBinCount)
  rightDataArray = new Uint8Array(rightAnalyser.frequencyBinCount)
}

const onPlay = () => {
  isPlaying.value = true
}

const onPause = () => {
  isPlaying.value = false
}

const sketch = (p) => {
  let centerPulse = 0
  let targetPulse = 0
  
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    canvas.parent('p5-canvas')
    p.colorMode(p.HSB, 360, 100, 100, 100)
    p5Instance = p
  }
  
  p.draw = () => {
    // 深蓝黑色背景，半透明覆盖产生拖尾
    p.background(240, 80, 8, 15)
    
    const centerX = p.width / 2
    const centerY = p.height / 2
    const maxBarHeight = p.height * 0.4
    
    // 获取音频数据
    let leftData = []
    let rightData = []
    let totalVolume = 0
    
    if (hasAudio.value && isPlaying.value && leftAnalyser && rightAnalyser) {
      leftAnalyser.getByteFrequencyData(leftDataArray)
      rightAnalyser.getByteFrequencyData(rightDataArray)
      
      leftData = Array.from(leftDataArray)
      rightData = Array.from(rightDataArray)
      
      // 计算总音量
      let sum = 0
      for (let i = 0; i < leftData.length; i++) {
        sum += leftData[i] + rightData[i]
      }
      totalVolume = sum / (leftData.length * 2 * 255)
    } else {
      // 无音频时显示静态图案
      const time = p.millis() * 0.001
      for (let i = 0; i < 64; i++) {
        const t = i / 64
        const leftVal = 100 + 80 * p.sin(t * p.PI * 4 + time) * p.sin(t * p.PI * 2)
        const rightVal = 100 + 80 * p.sin(t * p.PI * 4 + time + 0.5) * p.sin(t * p.PI * 2 + 0.3)
        leftData.push(Math.max(0, leftVal))
        rightData.push(Math.max(0, rightVal))
      }
      totalVolume = 0.3 + 0.2 * p.sin(time * 2)
    }
    
    // 更新中心脉冲
    targetPulse = totalVolume * 50
    centerPulse += (targetPulse - centerPulse) * 0.1
    
    // 绘制中心发光线
    p.push()
    p.translate(centerX, centerY)
    p.noStroke()
    for (let i = 3; i > 0; i--) {
      const alpha = (30 - i * 8) * totalVolume
      p.fill(0, 0, 100, alpha)
      p.rect(-i * 2, -p.height / 2, i * 4, p.height)
    }
    p.pop()
    
    // 绘制频谱山脉
    const barCount = leftData.length
    const barWidth = (p.width / 2) / barCount * 0.8
    const spacing = (p.width / 2) / barCount * 0.2
    
    // 绘制左声道（左侧，从中心向左延伸）
    for (let i = 0; i < barCount; i++) {
      const value = leftData[i]
      const normalizedValue = value / 255
      const barHeight = normalizedValue * maxBarHeight
      
      // 计算位置：从中心向左
      const x = centerX - (i + 1) * (barWidth + spacing)
      const yBottom = centerY + barHeight / 2
      const yTop = centerY - barHeight / 2
      
      // 颜色：紫色系 HSB 270-300°
      const hue = p.map(i, 0, barCount, 270, 300)
      const sat = 80 + normalizedValue * 20
      const bri = 60 + normalizedValue * 40
      
      // 绘制频谱柱
      p.noStroke()
      p.fill(hue, sat, bri, 90)
      p.rect(x, yTop, barWidth, barHeight)
      
      // 顶部高光
      p.fill(hue, sat * 0.5, 100, 60)
      p.rect(x, yTop, barWidth, 3)
      
      // 生成粒子（高频部分更容易产生粒子）
      if (normalizedValue > 0.6 && i > barCount * 0.3 && p.random() > 0.7) {
        particles.push(new SpectrumParticle(x, yTop, hue, true))
      }
      if (normalizedValue > 0.6 && i > barCount * 0.3 && p.random() > 0.7) {
        particles.push(new SpectrumParticle(x + barWidth, yTop, hue, true))
      }
    }
    
    // 绘制右声道（右侧，从中心向右延伸）
    for (let i = 0; i < barCount; i++) {
      const value = rightData[i]
      const normalizedValue = value / 255
      const barHeight = normalizedValue * maxBarHeight
      
      // 计算位置：从中心向右
      const x = centerX + i * (barWidth + spacing)
      const yBottom = centerY + barHeight / 2
      const yTop = centerY - barHeight / 2
      
      // 颜色：青色系 HSB 180-210°
      const hue = p.map(i, 0, barCount, 180, 210)
      const sat = 80 + normalizedValue * 20
      const bri = 60 + normalizedValue * 40
      
      // 绘制频谱柱
      p.noStroke()
      p.fill(hue, sat, bri, 90)
      p.rect(x, yTop, barWidth, barHeight)
      
      // 顶部高光
      p.fill(hue, sat * 0.5, 100, 60)
      p.rect(x, yTop, barWidth, 3)
      
      // 生成粒子
      if (normalizedValue > 0.6 && i > barCount * 0.3 && p.random() > 0.7) {
        particles.push(new SpectrumParticle(x + barWidth, yTop, hue, false))
      }
      if (normalizedValue > 0.6 && i > barCount * 0.3 && p.random() > 0.7) {
        particles.push(new SpectrumParticle(x, yTop, hue, false))
      }
    }
    
    // 更新和绘制粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      particle.update()
      particle.draw(p)
      if (particle.isDead()) {
        particles.splice(i, 1)
      }
    }
    
    // 限制粒子数量
    if (particles.length > 200) {
      particles.splice(0, particles.length - 200)
    }
    
    // 绘制中心脉冲光圈
    p.push()
    p.translate(centerX, centerY)
    p.noFill()
    for (let i = 0; i < 3; i++) {
      const radius = 20 + i * 15 + centerPulse * 0.5
      const alpha = (50 - i * 15) * totalVolume
      p.stroke(0, 0, 100, alpha)
      p.strokeWeight(2)
      p.circle(0, 0, radius * 2)
    }
    p.pop()
    
    // 绘制音量指示器
    p.noStroke()
    p.fill(270, 80, 80, 80)
    const leftIndicatorHeight = 100 * (hasAudio.value ? leftData.reduce((a, b) => a + b, 0) / leftData.length / 255 : 0.3)
    p.rect(20, p.height - 120, 8, 100)
    p.fill(270, 80, 90, 100)
    p.rect(20, p.height - 20 - leftIndicatorHeight, 8, leftIndicatorHeight)
    
    p.fill(195, 80, 80, 80)
    const rightIndicatorHeight = 100 * (hasAudio.value ? rightData.reduce((a, b) => a + b, 0) / rightData.length / 255 : 0.3)
    p.rect(p.width - 28, p.height - 120, 8, 100)
    p.fill(195, 80, 90, 100)
    p.rect(p.width - 28, p.height - 20 - rightIndicatorHeight, 8, rightIndicatorHeight)
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
.stereo-channel-container {
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

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 0.9;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      color: #a855f7;
    }

    .info p {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.75;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      color: #a855f7;
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
