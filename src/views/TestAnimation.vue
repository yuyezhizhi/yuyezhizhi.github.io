<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// 极简测试版本
const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  let x = 0

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(60)
    console.log('Setup complete')
  }

  p.draw = () => {
    console.log(`Draw frame: ${p.frameCount}`)
    
    // 清空画布
    p.background(250, 248, 245)
    
    // 移动圆点
    x = (p.frameCount * 3) % (p.width + 100) - 50
    
    // 画圆
    p.noStroke()
    p.fill(200, 100, 255)
    p.circle(x, 200, 50)
    
    // 显示帧数
    p.fill(0)
    p.textSize(20)
    p.text(`Frame: ${p.frameCount}`, 50, 50)
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

onMounted(() => {
  console.log('Component mounted, creating p5...')
  if (canvasContainer.value) {
    sketchInstance = new p5(sketch, canvasContainer.value)
  }
})

onUnmounted(() => {
  console.log('Component unmounted')
  if (sketchInstance) {
    sketchInstance.remove()
    sketchInstance = null
  }
})
</script>

<style scoped>
.fullscreen-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #faf8f5;
  z-index: 1;
}

.fullscreen-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
