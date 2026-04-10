<template>
  <div class="audio-visualizer-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <h3>音乐可视化</h3>
      <p class="instruction">点击播放/暂停，数字键1-5切换模式</p>
      <div class="info">
        <p>状态: {{ isPlaying ? '播放中' : '已暂停' }}</p>
        <p>当前模式: {{ modes[currentMode] }}</p>
        <p>频率范围: {{ freqRange }}</p>
      </div>
      <button class="play-btn" @click="togglePlay">
        {{ isPlaying ? '暂停' : '播放' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

const isPlaying = ref(false)
const currentMode = ref(0)
const freqRange = ref('0-22050Hz')
const modes = [
  '波形图',
  '频谱柱状图',
  '圆形频谱',
  '波形粒子',
  '彩虹频谱'
]

let p5Instance = null
let fft
let audioContext
let oscillator
let gainNode
let analyser
let dataArray
let audioStarted = false
let particles = []

class WaveParticle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = 5
    this.alpha = 255
  }

  update(amplitude) {
    this.size = 5 + amplitude * 0.1
    this.alpha -= 2
  }

  draw(p) {
    p.noStroke()
    p.fill(100, 200, 255, this.alpha)
    p.circle(this.x, this.y, this.size)
  }

  isDead() {
    return this.alpha <= 0
  }
}

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-canvas')
    p.background(20, 20, 40)

    // 初始化音频系统（虚拟音频）
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)

    // 创建增益节点（用于控制音量）
    gainNode = audioContext.createGain()
    gainNode.gain.value = 0

    // 创建振荡器（虚拟音频源）
    oscillator = audioContext.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime)

    // 连接节点
    oscillator.connect(gainNode)
    gainNode.connect(analyser)
    analyser.connect(audioContext.destination)

    oscillator.start()
  }

  p.draw = () => {
    p.background(20, 20, 40, 100) // 半透明背景

    if (!audioStarted || !isPlaying.value) {
      p.fill(255)
      p.textSize(16)
      p.textAlign(p.CENTER, p.CENTER)
      p.text('点击播放按钮开始', p.width / 2, p.height / 2)
      return
    }

    // 获取频谱数据
    analyser.getByteFrequencyData(dataArray)

    // 更新虚拟音频（模拟音乐）
    updateVirtualAudio()

    // 根据模式绘制
    if (currentMode.value === 0) {
      drawWaveform(p)
    } else if (currentMode.value === 1) {
      drawBars(p)
    } else if (currentMode.value === 2) {
      drawCircular(p)
    } else if (currentMode.value === 3) {
      drawWaveParticles(p)
    } else if (currentMode.value === 4) {
      drawRainbow(p)
    }

    // 更新频率范围显示
    freqRange.value = `0-${audioContext.sampleRate / 2}Hz`
  }

  const updateVirtualAudio = () => {
    // 模拟音乐：改变振荡器频率
    const time = audioContext.currentTime
    const freq = 220 + 440 * p.sin(time * 2) + 220 * p.sin(time * 5)
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)

    // 添加谐波
    const harmonic1 = freq * 2
    const harmonic2 = freq * 3
    const harmonic3 = freq * 0.5

    // 混合谐波
    oscillator.frequency.setValueAtTime(
      freq * 0.5 + harmonic1 * 0.2 + harmonic2 * 0.1 + harmonic3 * 0.2,
      audioContext.currentTime
    )
  }

  const drawWaveform = (p) => {
    analyser.getByteTimeDomainData(dataArray)

    p.stroke(100, 200, 255)
    p.strokeWeight(2)
    p.noFill()

    p.beginShape()
    for (let i = 0; i < dataArray.length; i++) {
      const x = p.map(i, 0, dataArray.length, 0, p.width)
      const y = p.map(dataArray[i], 0, 255, p.height, 0)
      p.vertex(x, y)
    }
    p.endShape()
  }

  const drawBars = (p) => {
    const barWidth = p.width / dataArray.length

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = p.map(dataArray[i], 0, 255, 0, p.height * 0.8)
      const x = i * barWidth
      const y = p.height - barHeight

      // 颜色渐变
      const hue = p.map(i, 0, dataArray.length, 0, 360)
      p.colorMode(p.HSB)
      p.fill(hue, 80, 90)
      p.noStroke()

      p.rect(x, y, barWidth - 1, barHeight)
    }

    p.colorMode(p.RGB)
  }

  const drawCircular = (p) => {
    const centerX = p.width / 2
    const centerY = p.height / 2
    const radius = Math.min(p.width, p.height) * 0.3

    for (let i = 0; i < dataArray.length; i++) {
      const angle = p.map(i, 0, dataArray.length, 0, p.TWO_PI)
      const value = dataArray[i]
      const barHeight = p.map(value, 0, 255, 0, radius)

      const x1 = centerX + p.cos(angle) * radius
      const y1 = centerY + p.sin(angle) * radius
      const x2 = centerX + p.cos(angle) * (radius + barHeight)
      const y2 = centerY + p.sin(angle) * (radius + barHeight)

      const hue = p.map(i, 0, dataArray.length, 0, 360)
      p.colorMode(p.HSB)
      p.stroke(hue, 80, 90)
      p.strokeWeight(2)

      p.line(x1, y1, x2, y2)
    }

    p.colorMode(p.RGB)
  }

  const drawWaveParticles = (p) => {
    analyser.getByteTimeDomainData(dataArray)

    // 生成粒子
    for (let i = 0; i < dataArray.length; i += 5) {
      const x = p.map(i, 0, dataArray.length, 0, p.width)
      const y = p.map(dataArray[i], 0, 255, p.height, 0)
      const amplitude = Math.abs(dataArray[i] - 128)

      if (amplitude > 10 && p.random() > 0.7) {
        particles.push(new WaveParticle(x, y))
      }
    }

    // 更新和绘制粒子
    particles = particles.filter(particle => {
      particle.update(amplitude)
      particle.draw(p)
      return !particle.isDead()
    })

    // 限制粒子数量
    if (particles.length > 500) {
      particles.splice(0, particles.length - 500)
    }
  }

  const drawRainbow = (p) => {
    const barWidth = p.width / dataArray.length

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = p.map(dataArray[i], 0, 255, 0, p.height)
      const x = i * barWidth
      const y = (p.height - barHeight) / 2

      // 彩虹渐变
      const hue = p.map(i, 0, dataArray.length, 0, 360)
      p.colorMode(p.HSB)
      p.fill(hue, 70, 100, 0.8)
      p.noStroke()

      p.rect(x, y, barWidth - 1, barHeight)
    }

    p.colorMode(p.RGB)
  }

  p.mousePressed = () => {
    togglePlay()
  }

  p.keyPressed = () => {
    const key = parseInt(p.key)
    if (key >= 1 && key <= 5) {
      currentMode.value = key - 1
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
  }
}

const togglePlay = () => {
  if (!audioStarted) {
    audioContext.resume()
    audioStarted = true
  }

  isPlaying.value = !isPlaying.value
  gainNode.gain.setValueAtTime(
    isPlaying.value ? 0.3 : 0,
    audioContext.currentTime
  )
}

onMounted(() => {
  p5Instance = new p5(sketch)
})

onBeforeUnmount(() => {
  if (p5Instance) {
    p5Instance.remove()
  }
  if (audioContext) {
    audioContext.close()
  }
})
</script>

<style scoped lang="less">
.audio-visualizer-container {
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

    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
      color: #ff6b6b;
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

    .play-btn {
      margin-top: 1rem;
      padding: 0.6rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>
