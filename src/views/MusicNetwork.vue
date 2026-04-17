<template>
  <div class="music-network-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">上传音频后开始可视化 | 鼠标吸引节点</p>
      <p class="subtitle">音乐网络 - 节拍脉冲效果</p>
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

// 节点类
class NetworkNode {
  constructor(p, x, y) {
    this.p = p
    this.x = x
    this.y = y
    this.vx = p.random(-0.5, 0.5)
    this.vy = p.random(-0.5, 0.5)
    this.baseSize = p.random(4, 8)
    this.size = this.baseSize
    this.pulseSize = 0
    this.brightness = 70
    this.hue = p.random(200, 320)
  }
  
  update(lowFreq, midFreq, highFreq, mouseX, mouseY, isBeat) {
    // 布朗运动
    this.vx += this.p.random(-0.1, 0.1)
    this.vy += this.p.random(-0.1, 0.1)
    
    // 限制速度
    this.vx = this.p.constrain(this.vx, -3, 3)
    this.vy = this.p.constrain(this.vy, -3, 3)
    
    // 鼠标吸引 - 增强吸引力和范围
    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const dist = this.p.sqrt(dx * dx + dy * dy)
    if (dist < 300 && dist > 5) {
      // 距离越近吸引力越强
      const force = this.p.map(dist, 0, 300, 0.3, 0.02)
      this.vx += dx / dist * force
      this.vy += dy / dist * force
    }
    
    // 更新位置
    this.x += this.vx
    this.y += this.vy
    
    // 边界反弹
    if (this.x < 0 || this.x > this.p.width) this.vx *= -1
    if (this.y < 0 || this.y > this.p.height) this.vy *= -1
    
    // 低频影响节点大小（脉冲效果）- 增强效果
    const targetSize = this.baseSize + this.p.map(lowFreq, 0, 255, 0, 25)
    this.size = this.p.lerp(this.size, targetSize, 0.15)
    
    // 节拍检测脉冲 - 增强脉冲效果
    if (isBeat) {
      this.pulseSize = 35
      // 节拍时速度爆发
      this.vx *= 1.5
      this.vy *= 1.5
    }
    this.pulseSize = this.p.lerp(this.pulseSize, 0, 0.08)
    
    // 高频影响亮度 - 增强变化
    this.brightness = this.p.map(highFreq, 0, 255, 40, 100)
  }
  
  draw(p, midFreq) {
    p.colorMode(p.HSB, 360, 100, 100, 100)
    
    // 中频影响连线颜色（这里只更新色相）
    const hue = this.p.map(midFreq, 0, 255, 200, 320)
    this.hue = this.p.lerp(this.hue, hue, 0.05)
    
    // 脉冲光环
    if (this.pulseSize > 1) {
      p.noFill()
      p.stroke(this.hue, 80, 100, this.pulseSize * 2)
      p.strokeWeight(2)
      p.circle(this.x, this.y, this.size + this.pulseSize * 2)
    }
    
    // 外发光
    for (let i = 3; i >= 0; i--) {
      const glowSize = this.size + i * 6
      const alpha = this.p.map(i, 0, 3, 40, 10)
      p.noStroke()
      p.fill(this.hue, 70, this.brightness, alpha)
      p.circle(this.x, this.y, glowSize)
    }
    
    // 节点主体
    p.fill(this.hue, 80, this.brightness, 90)
    p.circle(this.x, this.y, this.size)
    
    // 内核高光
    p.fill(this.hue, 40, 100, 100)
    p.circle(this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.3)
    
    p.colorMode(p.RGB, 255)
  }
}

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
  const numNodes = 30
  const connectionThreshold = 200
  let nodes = []
  let prevLowFreq = 0
  let isBeat = false
  let beatCooldown = 0
  
  // 频段数据
  let lowFreq = 0
  let midFreq = 0
  let highFreq = 0
  
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-canvas')
    
    // 初始化节点
    for (let i = 0; i < numNodes; i++) {
      nodes.push(new NetworkNode(p, p.random(p.width), p.random(p.height)))
    }
  }

  p.draw = () => {
    // 深蓝黑色背景，半透明覆盖
    p.background(5, 5, 32, 40)
    
    // 获取频谱数据
    if (analyserNode) {
      const bufferLength = analyserNode.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyserNode.getByteFrequencyData(dataArray)
      
      // 计算三个频段
      // 低频: 0-100Hz (约前10% bins)
      const lowBins = Math.floor(bufferLength * 0.1)
      let lowSum = 0
      for (let i = 0; i < lowBins; i++) {
        lowSum += dataArray[i]
      }
      lowFreq = lowSum / lowBins
      
      // 中频: 100-2000Hz (约10%-50% bins)
      const midStart = lowBins
      const midEnd = Math.floor(bufferLength * 0.5)
      let midSum = 0
      for (let i = midStart; i < midEnd; i++) {
        midSum += dataArray[i]
      }
      midFreq = midSum / (midEnd - midStart)
      
      // 高频: 2000Hz+ (约50%-100% bins)
      let highSum = 0
      for (let i = midEnd; i < bufferLength; i++) {
        highSum += dataArray[i]
      }
      highFreq = highSum / (bufferLength - midEnd)
    } else {
      // 没有音频时的默认值
      lowFreq = 30 + p.sin(p.frameCount * 0.05) * 20
      midFreq = 40 + p.sin(p.frameCount * 0.03 + 1) * 15
      highFreq = 25 + p.sin(p.frameCount * 0.07 + 2) * 10
    }
    
    // 节拍检测：低频突然增大（比前一帧大50%以上）
    if (beatCooldown > 0) beatCooldown--
    if (lowFreq > prevLowFreq * 1.5 && lowFreq > 80 && beatCooldown === 0) {
      isBeat = true
      beatCooldown = 15 // 冷却帧数
    } else {
      isBeat = false
    }
    prevLowFreq = lowFreq
    
    // 更新和绘制节点
    for (let node of nodes) {
      node.update(lowFreq, midFreq, highFreq, p.mouseX, p.mouseY, isBeat)
    }
    
    // 绘制鼠标影响范围
    drawMouseInfluence(p, lowFreq)
    
    // 绘制连线
    drawConnections(p, midFreq, lowFreq)
    
    // 绘制节点
    for (let node of nodes) {
      node.draw(p, midFreq)
    }
  }
  
  // 绘制鼠标影响范围可视化
  const drawMouseInfluence = (p, lowFreq) => {
    const mouseX = p.mouseX
    const mouseY = p.mouseY
    
    // 只有在画布内才绘制
    if (mouseX < 0 || mouseX > p.width || mouseY < 0 || mouseY > p.height) return
    
    p.colorMode(p.HSB, 360, 100, 100, 100)
    
    // 外圈 - 最大影响范围
    p.noFill()
    p.stroke(320, 60, 80, 15)
    p.strokeWeight(1)
    p.circle(mouseX, mouseY, 600)
    
    // 中圈 - 强影响范围
    p.stroke(300, 70, 90, 25)
    p.circle(mouseX, mouseY, 400)
    
    // 内圈 - 核心影响范围，随低频脉冲
    const pulseRadius = 100 + lowFreq * 0.3
    p.stroke(280, 80, 100, 40)
    p.strokeWeight(2)
    p.circle(mouseX, mouseY, pulseRadius * 2)
    
    // 中心点
    p.fill(280, 90, 100, 80)
    p.noStroke()
    p.circle(mouseX, mouseY, 8)
    
    // 中心点外发光
    for (let i = 3; i >= 0; i--) {
      const glowSize = 8 + i * 15
      const alpha = p.map(i, 0, 3, 60, 10)
      p.fill(280, 70, 100, alpha)
      p.circle(mouseX, mouseY, glowSize)
    }
    
    p.colorMode(p.RGB, 255)
  }
  
  const drawConnections = (p, midFreq, lowFreq) => {
    const lineHue = p.map(midFreq, 0, 255, 180, 340)
    // 低频越强线条越粗
    const lineThickness = p.map(lowFreq, 0, 255, 0.5, 5)
    // 音频强度影响最大连接距离
    const dynamicThreshold = connectionThreshold + lowFreq * 0.5
    
    p.colorMode(p.HSB, 360, 100, 100, 100)
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = p.sqrt(dx * dx + dy * dy)
        
        if (dist < dynamicThreshold) {
          // 距离越近越亮，音频越强越亮
          const baseAlpha = p.map(dist, 0, dynamicThreshold, 70, 5)
          const audioBoost = p.map(lowFreq, 0, 255, 1, 1.5)
          const alpha = baseAlpha * audioBoost
          
          // 渐变线，根据距离调整色相
          const distHue = (lineHue + p.map(dist, 0, dynamicThreshold, 0, 40)) % 360
          p.stroke(distHue, 70, 90, alpha)
          p.strokeWeight(lineThickness)
          p.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
        }
      }
    }
    
    p.colorMode(p.RGB, 255)
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
.music-network-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #050520;

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
