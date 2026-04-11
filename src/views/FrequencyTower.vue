<template>
  <div class="frequency-tower-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">上传音频后开始可视化</p>
      <p class="subtitle">频谱塔林 - 城市天际线效果</p>
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

// 星星数组
let stars = []

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
  const numTowers = 64
  let towerData = new Array(numTowers).fill(0)
  let smoothedData = new Array(numTowers).fill(0)
  
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-canvas')
    
    // 初始化星星
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: p.random(p.width),
        y: p.random(p.height * 0.6),
        size: p.random(1, 3),
        twinkleSpeed: p.random(0.02, 0.08),
        alpha: p.random(100, 255)
      })
    }
  }

  p.draw = () => {
    // 黑色背景
    p.background(5, 5, 10)
    
    // 绘制星星
    drawStars(p)
    
    // 获取频谱数据
    if (analyserNode) {
      const bufferLength = analyserNode.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyserNode.getByteFrequencyData(dataArray)
      
      // 聚合1024个bin到64个频段
      const binsPerTower = Math.floor(bufferLength / numTowers)
      for (let i = 0; i < numTowers; i++) {
        let sum = 0
        for (let j = 0; j < binsPerTower; j++) {
          sum += dataArray[i * binsPerTower + j]
        }
        towerData[i] = sum / binsPerTower
      }
    } else {
      // 没有音频时显示静态低高度
      for (let i = 0; i < numTowers; i++) {
        towerData[i] = 20 + p.sin(p.frameCount * 0.02 + i * 0.1) * 15
      }
    }
    
    // 平滑数据
    for (let i = 0; i < numTowers; i++) {
      smoothedData[i] = p.lerp(smoothedData[i], towerData[i], 0.15)
    }
    
    // 绘制城市地面
    drawGround(p)
    
    // 绘制塔楼
    drawTowers(p)
    
    // 绘制塔楼连线
    drawTowerConnections(p)
  }
  
  const drawStars = (p) => {
    p.noStroke()
    for (let star of stars) {
      const twinkle = p.sin(p.frameCount * star.twinkleSpeed) * 50
      const alpha = p.constrain(star.alpha + twinkle, 50, 255)
      p.fill(255, 255, 255, alpha)
      p.circle(star.x, star.y, star.size)
    }
  }
  
  const drawGround = (p) => {
    p.fill(20, 20, 25)
    p.noStroke()
    p.rect(0, p.height - 50, p.width, 50)
  }
  
  const drawTowers = (p) => {
    const towerWidth = p.width / numTowers
    const maxHeight = p.height * 0.75
    
    p.colorMode(p.HSB, 360, 100, 100, 100)
    
    for (let i = 0; i < numTowers; i++) {
      const value = smoothedData[i]
      const towerHeight = p.map(value, 0, 255, 10, maxHeight)
      const x = i * towerWidth
      const y = p.height - 50 - towerHeight
      
      // 色相从左到右渐变：红色(0°) → 蓝色(240°)
      const hue = p.map(i, 0, numTowers, 0, 240)
      // 明度根据高度从60%到100%
      const brightness = p.map(value, 0, 255, 60, 100)
      
      // 绘制塔楼主体
      p.fill(hue, 80, brightness, 90)
      p.noStroke()
      p.rect(x + 1, y, towerWidth - 2, towerHeight)
      
      // 绘制发光效果（顶部光晕）
      const glowAlpha = p.map(value, 0, 255, 20, 50)
      p.fill(hue, 80, 100, glowAlpha)
      p.rect(x + 1, y - 10, towerWidth - 2, 10)
      
      // 塔楼顶部亮点
      p.fill(hue, 40, 100, 80)
      p.rect(x + towerWidth * 0.3, y + towerHeight * 0.1, towerWidth * 0.4, 3)
    }
    
    p.colorMode(p.RGB, 255)
  }
  
  const drawTowerConnections = (p) => {
    const towerWidth = p.width / numTowers
    const maxHeight = p.height * 0.75
    
    p.strokeWeight(1)
    
    for (let i = 0; i < numTowers - 1; i++) {
      const value1 = smoothedData[i]
      const value2 = smoothedData[i + 1]
      const h1 = p.map(value1, 0, 255, 10, maxHeight)
      const h2 = p.map(value2, 0, 255, 10, maxHeight)
      
      const x1 = i * towerWidth + towerWidth / 2
      const y1 = p.height - 50 - h1
      const x2 = (i + 1) * towerWidth + towerWidth / 2
      const y2 = p.height - 50 - h2
      
      // 相邻塔楼顶部连线，半透明
      const avgValue = (value1 + value2) / 2
      const alpha = p.map(avgValue, 0, 255, 10, 40)
      p.stroke(100, 150, 255, alpha)
      p.line(x1, y1, x2, y2)
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
    // 重新初始化星星位置
    stars = []
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: p.random(p.width),
        y: p.random(p.height * 0.6),
        size: p.random(1, 3),
        twinkleSpeed: p.random(0.02, 0.08),
        alpha: p.random(100, 255)
      })
    }
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
.frequency-tower-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #05050a;

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
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    padding: 1rem 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fc466b;
    text-align: right;

    .instruction {
      margin: 0 0 0.3rem 0;
      font-size: 0.9rem;
      font-weight: 500;
      text-shadow: 0 0 10px rgba(252, 70, 107, 0.5);
    }

    .subtitle {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.8;
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
