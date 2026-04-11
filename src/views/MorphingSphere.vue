<template>
  <div class="morphing-sphere-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">拖拽音频文件播放 | 鼠标移动控制视角</p>
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
  let targetRotationX = 0
  let targetRotationY = 0
  
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    canvas.parent('p5-canvas')
    p.colorMode(p.HSB, 360, 100, 100, 100)
  }
  
  p.draw = () => {
    // 纯黑背景
    p.background(0)
    
    // 计算音频驱动的参数
    let audioAmplitude = 0
    let lowFreq = 0
    let midFreq = 0
    let highFreq = 0
    let rotationSpeed = 0.003
    
    if (hasAudio.value && isPlaying && leftAnalyser && rightAnalyser) {
      leftAnalyser.getByteFrequencyData(leftDataArray)
      rightAnalyser.getByteFrequencyData(rightDataArray)
      
      // 计算平均音量
      let leftSum = 0
      let rightSum = 0
      let leftLow = 0, leftMid = 0, leftHigh = 0
      let rightLow = 0, rightMid = 0, rightHigh = 0
      
      const binCount = leftDataArray.length
      const lowEnd = Math.floor(binCount * 0.1)
      const midEnd = Math.floor(binCount * 0.5)
      
      for (let i = 0; i < binCount; i++) {
        leftSum += leftDataArray[i]
        rightSum += rightDataArray[i]
        
        if (i < lowEnd) {
          leftLow += leftDataArray[i]
          rightLow += rightDataArray[i]
        } else if (i < midEnd) {
          leftMid += leftDataArray[i]
          rightMid += rightDataArray[i]
        } else {
          leftHigh += leftDataArray[i]
          rightHigh += rightDataArray[i]
        }
      }
      
      const avgVolume = (leftSum + rightSum) / (binCount * 2 * 255)
      lowFreq = (leftLow + rightLow) / (lowEnd * 2 * 255)
      midFreq = (leftMid + rightMid) / ((midEnd - lowEnd) * 2 * 255)
      highFreq = (leftHigh + rightHigh) / ((binCount - midEnd) * 2 * 255)
      
      audioAmplitude = avgVolume
      rotationSpeed = 0.003 + midFreq * 0.02
      
      // 更新变形级别显示
      if (lowFreq > 0.6) deformationLevel.value = '高'
      else if (lowFreq > 0.3) deformationLevel.value = '中'
      else deformationLevel.value = '低'
    } else {
      // 无音频时的默认动画
      lowFreq = 0.3 + 0.2 * p.sin(time * 0.5)
      midFreq = 0.2 + 0.15 * p.sin(time * 0.7 + 1)
      highFreq = 0.1 + 0.1 * p.sin(time * 0.9 + 2)
    }
    
    // 设置光照
    p.ambientLight(50)
    p.pointLight(255, 255, 255, 200, -200, 200)
    p.directionalLight(200, 200, 255, -1, 0.5, -1)
    
    // 鼠标控制视角
    targetRotationY = p.map(p.mouseX, 0, p.width, -p.PI, p.PI)
    targetRotationX = p.map(p.mouseY, 0, p.height, -p.PI / 2, p.PI / 2)
    
    rotationX += (targetRotationX - rotationX) * 0.05
    rotationY += (targetRotationY - rotationY) * 0.05
    
    p.rotateX(rotationX)
    p.rotateY(rotationY + time * rotationSpeed)
    
    // 绘制变形球体
    const detail = 24 // 球体细分级别
    const amplitude = hasAudio.value ? 30 + lowFreq * 80 : 25 + 15 * p.sin(time * 0.3)
    
    p.noStroke()
    
    for (let i = 0; i < detail; i++) {
      const theta1 = p.map(i, 0, detail, 0, p.PI)
      const theta2 = p.map(i + 1, 0, detail, 0, p.PI)
      
      p.beginShape(p.TRIANGLE_STRIP)
      
      for (let j = 0; j <= detail; j++) {
        const phi = p.map(j, 0, detail, 0, p.TWO_PI)
        
        // 计算两个纬度的顶点
        for (let t of [theta1, theta2]) {
          // 球坐标转笛卡尔坐标
          const x = p.sin(t) * p.cos(phi)
          const y = p.sin(t) * p.sin(phi)
          const z = p.cos(t)
          
          // 3D Perlin噪声计算半径偏移
          const noiseVal = p.noise(
            x * noiseScale + time * 0.3,
            y * noiseScale + time * 0.3,
            z * noiseScale + time * 0.2
          )
          
          // 音频驱动：低频控制变形幅度
          const r = baseRadius + noiseVal * amplitude * (1 + lowFreq)
          
          const px = x * r
          const py = y * r
          const pz = z * r
          
          // 根据变形程度计算颜色
          // 小偏移 = 深蓝/紫, 大偏移 = 亮青/白
          const displacement = noiseVal * amplitude / 100
          let hue = p.map(displacement, 0, 1, 220, 180) // 蓝到青
          let sat = p.map(displacement, 0, 1, 80, 30)
          let bri = p.map(displacement, 0, 1, 60, 100)
          
          // 高频影响亮度
          bri += highFreq * 30
          
          // 镜面材质效果
          p.specularMaterial(hue, sat, bri)
          p.shininess(50)
          
          p.vertex(px, py, pz)
        }
      }
      
      p.endShape()
    }
    
    // 添加内部发光效果
    if (highFreq > 0.3 || (!hasAudio.value && p.sin(time) > 0.5)) {
      p.push()
      p.noLights()
      p.fill(180, 50, 100, 10)
      p.sphere(baseRadius * 0.8)
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
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      color: #0082c8;
    }

    .info p {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.75;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      color: #0082c8;
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
