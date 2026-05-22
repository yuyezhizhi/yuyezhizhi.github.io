<template>
  <div class="morphing-sphere-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">拖拽旋转球体 | 拖拽音频文件播放</p>
      <div class="info">
        <p>{{ hasAudio ? '音频驱动中' : '纯噪声模式' }} | 变形幅度: {{ deformationLevel }}</p>
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
const deformationLevel = ref('低')

let p5Instance = null
let analyserNode = null
let leftAnalyser = null
let rightAnalyser = null
let isPlaying = false

// 音频数据
let leftDataArray = null
let rightDataArray = null

const onAudioReady = ({ audioContext, analyser, source }) => {
  analyserNode = analyser
  hasAudio.value = true
  
  // 创建声道分离器
  const splitter = audioContext.createChannelSplitter(2)
  
  // 重新连接：source -> splitter
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
  
  // 分析器连接到输出
  leftAnalyser.connect(audioContext.destination)
  rightAnalyser.connect(audioContext.destination)
  
  // 初始化数据数组
  leftDataArray = new Uint8Array(leftAnalyser.frequencyBinCount)
  rightDataArray = new Uint8Array(rightAnalyser.frequencyBinCount)
}

const onPlay = () => {
  isPlaying = true
}

const onPause = () => {
  isPlaying = false
}

const sketch = (p) => {
  let time = 0
  let baseRadius = 150
  let noiseScale = 0.02
  let rotationX = 0
  let rotationY = 0
  let isDragging = false
  let lastMouseX = 0
  let lastMouseY = 0
  // 环绕粒子
  let orbitParticles = []

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    canvas.parent('p5-canvas')
    p.colorMode(p.HSB, 360, 100, 100, 100)

    // 拖拽交互
    canvas.mousePressed(() => {
      isDragging = true
      lastMouseX = p.mouseX
      lastMouseY = p.mouseY
    })
    canvas.mouseReleased(() => {
      isDragging = false
    })

    // 生成环绕粒子
    for (let i = 0; i < 80; i++) {
      orbitParticles.push({
        angle: p.random(p.TWO_PI),
        tilt: p.random(-p.PI / 3, p.PI / 3),
        radius: baseRadius * p.random(1.3, 2.2),
        speed: p.random(0.002, 0.008) * (p.random() > 0.5 ? 1 : -1),
        size: p.random(1.5, 4),
        hue: p.random(180, 320),
        alpha: p.random(40, 80)
      })
    }
  }

  p.draw = () => {
    // 深色背景，突出3D球体
    p.background(240, 30, 8)

    // 计算音频驱动的参数
    let lowFreq = 0
    let midFreq = 0
    let highFreq = 0
    let rotationSpeed = 0.003

    if (hasAudio.value && isPlaying && leftAnalyser && rightAnalyser) {
      leftAnalyser.getByteFrequencyData(leftDataArray)
      rightAnalyser.getByteFrequencyData(rightDataArray)

      let leftSum = 0, rightSum = 0
      let leftLow = 0, leftMid = 0, leftHigh = 0
      let rightLow = 0, rightMid = 0, rightHigh = 0

      const binCount = leftDataArray.length
      const lowEnd = Math.floor(binCount * 0.1)
      const midEnd = Math.floor(binCount * 0.5)

      for (let i = 0; i < binCount; i++) {
        leftSum += leftDataArray[i]
        rightSum += rightDataArray[i]
        if (i < lowEnd) { leftLow += leftDataArray[i]; rightLow += rightDataArray[i] }
        else if (i < midEnd) { leftMid += leftDataArray[i]; rightMid += rightDataArray[i] }
        else { leftHigh += leftDataArray[i]; rightHigh += rightDataArray[i] }
      }

      lowFreq = (leftLow + rightLow) / (lowEnd * 2 * 255)
      midFreq = (leftMid + rightMid) / ((midEnd - lowEnd) * 2 * 255)
      highFreq = (leftHigh + rightHigh) / ((binCount - midEnd) * 2 * 255)
      rotationSpeed = 0.003 + midFreq * 0.02

      if (lowFreq > 0.6) deformationLevel.value = '高'
      else if (lowFreq > 0.3) deformationLevel.value = '中'
      else deformationLevel.value = '低'
    } else {
      lowFreq = 0.3 + 0.2 * p.sin(time * 0.5)
      midFreq = 0.2 + 0.15 * p.sin(time * 0.7 + 1)
      highFreq = 0.1 + 0.1 * p.sin(time * 0.9 + 2)
    }

    // 鼠标拖拽控制视角
    if (isDragging) {
      const dx = p.mouseX - lastMouseX
      const dy = p.mouseY - lastMouseY
      rotationY += dx * 0.01
      rotationX -= dy * 0.01
      rotationX = p.constrain(rotationX, -p.PI / 2, p.PI / 2)
      lastMouseX = p.mouseX
      lastMouseY = p.mouseY
    }

    // ========== 外层大气光晕 ==========
    p.push()
    p.rotateX(rotationX)
    p.rotateY(rotationY + time * rotationSpeed)
    p.noStroke()
    p.noLights()
    // 多层半透明球体营造光晕
    for (let g = 3; g >= 1; g--) {
      const glowR = baseRadius * (1.15 + g * 0.12)
      const glowAlpha = hasAudio.value && isPlaying ? 4 + highFreq * 25 : 4
      p.fill(260, 60, 80, glowAlpha)
      p.sphere(glowR, 16, 16)
    }
    p.pop()

    // ========== 绘制主球体 ==========
    // 完全不用p5灯光系统，手动计算光照烘焙到fill()亮度中
    // 这样fill()颜色直接作为顶点颜色，不受任何光照干扰
    p.noLights()

    p.rotateX(rotationX)
    p.rotateY(rotationY + time * rotationSpeed)

    const detail = 32
    const amplitude = hasAudio.value && isPlaying ? 20 + lowFreq * 80 : 20 + 12 * p.sin(time * 0.3)

    p.noStroke()

    // 光照方向（归一化）
    const lightX = 0.4, lightY = -0.7, lightZ = 0.6
    const lightLen = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ)

    // 音频驱动的色相偏移
    const audioHueShift = hasAudio.value && isPlaying ? lowFreq * 60 : 0

    for (let i = 0; i < detail; i++) {
      const theta1 = p.map(i, 0, detail, 0, p.PI)
      const theta2 = p.map(i + 1, 0, detail, 0, p.PI)

      p.beginShape(p.TRIANGLE_STRIP)

      for (let j = 0; j <= detail; j++) {
        const phi = p.map(j, 0, detail, 0, p.TWO_PI)

        for (let t of [theta1, theta2]) {
          const x = p.sin(t) * p.cos(phi)
          const y = p.sin(t) * p.sin(phi)
          const z = p.cos(t)

          const noiseVal = p.noise(
            x * noiseScale + time * 0.3,
            y * noiseScale + time * 0.3,
            z * noiseScale + time * 0.2
          )

          // 半径：基础 + 噪声变形 + 音频驱动膨胀
          const audioR = hasAudio.value && isPlaying ? (1 + lowFreq * 0.8 + midFreq * 0.3) : 1
          const r = baseRadius + noiseVal * amplitude * audioR
          const px = x * r
          const py = y * r
          const pz = z * r

          // 手动计算漫反射光照：法线方向与光照方向的点积
          const dot = (x * lightX + y * lightY + z * lightZ) / lightLen
          const diffuse = p.constrain(dot, 0, 1)
          // 漫反射 0.3~1.0 范围，暗部更深
          const lightFactor = 0.3 + diffuse * 0.7

          // 用独立的高频噪声驱动色相，使色块小而分散
          // hueScale 比变形 noiseScale 高 15 倍，色块更小更碎
          const hueScale = noiseScale * 15
          const colorNoise = p.noise(
            x * hueScale + 100 + time * 0.15,
            y * hueScale + 100 + time * 0.12,
            z * hueScale + 100 + time * 0.10
          )
          // 音频时色相范围扩大，带来更丰富的色彩对比
          const hueRange = hasAudio.value && isPlaying ? 200 : 140
          const hueBase = hasAudio.value && isPlaying ? 160 : 190
          const hue = (hueBase + colorNoise * hueRange + audioHueShift + time * 8) % 360
          // 饱和度：音频驱动更鲜艳
          const sat = hasAudio.value && isPlaying
            ? p.map(colorNoise, 0, 1, 60, 95)
            : p.map(colorNoise, 0, 1, 50, 80)
          // 亮度 = 基础亮度 × 手动光照系数 + 高频脉动
          const baseBri = p.map(noiseVal, 0, 1, 50, 95) * lightFactor
          const audioBri = hasAudio.value && isPlaying ? highFreq * 35 : 0
          const bri = baseBri + audioBri

          p.fill(hue, sat, p.constrain(bri, 0, 100), 95)
          p.vertex(px, py, pz)
        }
      }

      p.endShape()
    }

    // ========== 环绕粒子 ==========
    p.noLights()
    for (const pt of orbitParticles) {
      pt.angle += pt.speed + midFreq * pt.speed * 5
      const orbitR = pt.radius + lowFreq * 50
      const ox = orbitR * p.cos(pt.angle) * p.cos(pt.tilt)
      const oy = orbitR * p.sin(pt.angle) * p.cos(pt.tilt)
      const oz = orbitR * p.sin(pt.tilt)

      const pulseAlpha = pt.alpha + highFreq * 50
      const pulseSize = pt.size + highFreq * 5
      p.push()
      p.translate(ox, oy, oz)
      // 面向相机（billboard效果）
      p.rotateY(-(rotationY + time * rotationSpeed))
      p.rotateX(-rotationX)
      p.noStroke()
      p.fill(pt.hue + audioHueShift * 0.5, 70, 100, pulseAlpha)
      p.circle(0, 0, pulseSize)
      p.pop()
    }

    time += 0.005
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
.morphing-sphere-container {
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
    background: transparent;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    backdrop-filter: none;
    border: none;

    .instruction {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      opacity: 0.9;
      color: rgba(200, 180, 255, 0.85);
    }

    .info p {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.75;
      color: rgba(180, 160, 240, 0.8);
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
