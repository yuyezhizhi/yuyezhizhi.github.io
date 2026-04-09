<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  let ribbons = []
  let particles = []
  let stars = []
  let ribbonLights = []  // 丝带上的光点
  let frame = 0
  
  // 鼠标交互相关
  let mouseX_pos = 0, mouseY_pos = 0
  let mouseTrail = []  // 鼠标拖尾
  let mouseParticles = []  // 鼠标粒子
  let mouseInfluenceRadius = 150  // 鼠标影响半径
  
  // 音乐节奏相关
  let audioContext = null
  let analyser = null
  let dataArray = null
  let musicEnergy = 0  // 音乐能量值
  let beatStrength = 0  // 节拍强度（现在用于控制旋转速度）
  let prevBassEnergy = 0  // 上一帧的低音能量
  let isMusicPlaying = false  // 音乐是否播放
  let useSimulatedBeat = false  // 使用模拟节拍（测试用）
  let simulatedBeatTimer = 0  // 模拟节拍计时器
  let continuousRotation = 0  // 连续旋转角度
  let rotationDirection = 1  // 旋转方向：1=顺时针，-1=逆时针
  let lastDirectionChange = 0  // 上次改变方向的时间
  
  // 舞者舞蹈相关变量
  let dancerX, dancerY
  let dancerAngle = 0
  let dancePhase = 0
  let danceSpeed = 0.025  // 适中的舞蹈速度
  let dancerMoveX = 0
  let dancerMoveY = 0
  let rotationSpeed = 0.02  // 稳定的旋转速度

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(60)
    
    dancerX = p.width / 2
    dancerY = p.height / 2
    
    // 初始化星星背景
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * p.width,
        y: Math.random() * p.height,
        size: Math.random() * 2 + 0.5,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        twinkleOffset: Math.random() * Math.PI * 2
      })
    }
    
    // 初始化丝带（从中心向外扩散的光带）- 增加数量，减小粗细
    for (let i = 0; i < 32; i++) {  // 增加到32条
      const angle = (i / 32) * Math.PI * 2
      ribbons.push({
        angle: angle,
        baseAngle: angle,
        length: 250,  // 稍长一点
        maxLength: 250,
        waveOffset: Math.random() * Math.PI * 2,
        waveSpeed: 0.04 + Math.random() * 0.03,
        waveAmplitude: 25 + Math.random() * 25,
        opacity: 76.5,
        hue: 0,
        saturation: 40 + Math.random() * 30,  // 更淡的颜色
        thickness: 6 + Math.random() * 4,  // 减小粗细，更飘逸
        taperRatio: 0.15,  // 尾部更细（15%）
        layer: Math.floor(Math.random() * 3),  // 分层：0=后层，1=中层，2=前层
        curveIntensity: 0.3 + Math.random() * 0.4,  // 弯曲强度随机
        points: []
      })
    }
    
    // 初始化光粒子
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: dancerX + (Math.random() - 0.5) * 500,
        y: dancerY + (Math.random() - 0.5) * 500,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.3 ? (220 + Math.random() * 80) : 0,  // 30%概率是蓝紫色，70%是白色
        opacity: Math.random() * 100 + 50,
        orbitRadius: Math.random() * 300 + 100,
        orbitSpeed: (Math.random() - 0.5) * 0.02,
        orbitAngle: Math.random() * Math.PI * 2
      })
    }
    
    // 初始化丝带上的闪烁光点
    for (let i = 0; i < 400; i++) {
      ribbonLights.push({
        ribbonIndex: Math.floor(Math.random() * 32),
        position: Math.random(),
        size: Math.random() * 2 + 1,
        twinkleSpeed: 0.03 + Math.random() * 0.04,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.2 ? (220 + Math.random() * 80) : 0
      })
    }
    
    mouseX_pos = p.width / 2
    mouseY_pos = p.height / 2
    
    // 直接启用模拟节拍模式（无需麦克风权限）
    useSimulatedBeat = true
    isMusicPlaying = true
    console.log('🎵 音乐节奏模式已启动！')
  }
  
  // 鼠标移动跟踪
  p.mouseMoved = () => {
    mouseX_pos = p.mouseX
    mouseY_pos = p.mouseY
    
    // 添加拖尾
    mouseTrail.push({
      x: p.mouseX,
      y: p.mouseY,
      life: 30,
      maxLife: 30
    })
    
    // 移动时释放粒子
    if (frame % 3 === 0) {
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2 + 1
        mouseParticles.push({
          x: p.mouseX,
          y: p.mouseY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 40 + Math.random() * 20,
          maxLife: 40 + Math.random() * 20,
          size: Math.random() * 3 + 1,
          hue: Math.random() < 0.3 ? (220 + Math.random() * 80) : 0
        })
      }
    }
  }
  
  // 鼠标点击产生粒子爆发
  p.mousePressed = () => {
    mouseX_pos = p.mouseX
    mouseY_pos = p.mouseY
    
    // 切换模拟节拍的快慢
    if (frame % 30 === 0) {  // 每30帧点击才响应一次，避免太快
      simulatedBeatTimer = 0  // 重置计时器，立即产生节拍
      console.log('🥁 手动触发节拍!')
    }
    
    // 爆发更多粒子
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2
      const speed = 3 + Math.random() * 4
      mouseParticles.push({
        x: p.mouseX,
        y: p.mouseY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 50 + Math.random() * 30,
        maxLife: 50 + Math.random() * 30,
        size: Math.random() * 4 + 2,
        hue: Math.random() < 0.4 ? (220 + Math.random() * 80) : 0
      })
    }
  }
  
  // 启动音乐分析（使用麦克风或系统音频）
  function startMusicAnalysis() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      
      // 尝试获取麦克风输入
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const source = audioContext.createMediaStreamSource(stream)
          source.connect(analyser)
          dataArray = new Uint8Array(analyser.frequencyBinCount)
          isMusicPlaying = true
          console.log('✅ 音频分析已启动 - 请播放音乐')
        })
        .catch(err => {
          console.log('⚠️ 无法获取麦克风，启用模拟节拍模式')
          // 启用模拟节拍进行测试
          useSimulatedBeat = true
          isMusicPlaying = true
        })
    } catch (e) {
      console.log('❌ 音频分析初始化失败:', e)
      useSimulatedBeat = true
      isMusicPlaying = true
    }
  }
  
  // 分析音乐节奏
  function analyzeMusic() {
    if (!isMusicPlaying) {
      // 每60帧打印一次状态
      if (frame % 60 === 0) {
        console.log('⏸️ 音乐未播放, isMusicPlaying:', isMusicPlaying)
      }
      return
    }
    
    // 如果使用模拟节拍 - 改为连续旋转模式
    if (useSimulatedBeat) {
      simulatedBeatTimer++
      
      // 每2000毫秒更新一次旋转速度
      const now = Date.now()
      if (!window.lastBeatTime) window.lastBeatTime = now
      
      const timeSinceLastBeat = now - window.lastBeatTime
      
      if (timeSinceLastBeat >= 2000) {
        // 随机设置新的旋转速度
        beatStrength = 0.5 + Math.random() * 0.5  // 0.5-1.0
        musicEnergy = 0.3 + Math.random() * 0.3
        window.lastBeatTime = now
      } else {
        beatStrength *= 0.98  // 非常缓慢的衰减
        musicEnergy *= 0.99
      }
      
      // 连续旋转（不受节拍影响，始终在转）
      // 每3-6秒随机改变一次旋转方向
      if (!window.lastDirectionChange) window.lastDirectionChange = now
      const timeSinceLastChange = now - window.lastDirectionChange
      
      if (timeSinceLastChange > 3000 + Math.random() * 3000) {  // 3-6秒
        rotationDirection = -rotationDirection  // 反转方向
        window.lastDirectionChange = now
        console.log('🔄 旋转方向改变:', rotationDirection === 1 ? '顺时针' : '逆时针')
      }
      
      continuousRotation += (0.01 + beatStrength * 0.02) * rotationDirection  // 基础速度 + 音乐增强
      return
    }
    
    // 真实音频分析
    if (!analyser || !dataArray) return
    
    analyser.getByteFrequencyData(dataArray)
    
    // 计算低音能量（前几个频段）
    let bassEnergy = 0
    const bassBins = Math.floor(dataArray.length * 0.1)  // 前10%为低音
    for (let i = 0; i < bassBins; i++) {
      bassEnergy += dataArray[i]
    }
    bassEnergy /= bassBins
    
    // 检测节拍（低音突然增强）
    if (bassEnergy > prevBassEnergy * 1.2 && bassEnergy > 100) {
      beatStrength = Math.min(1, (bassEnergy - prevBassEnergy) / 150)
      if (beatStrength > 0.3) {
        console.log('🎵 检测到节拍! strength:', beatStrength.toFixed(2))
      }
    } else {
      beatStrength *= 0.9  // 快速衰减
    }
    
    // 整体音乐能量
    musicEnergy = bassEnergy / 255
    
    prevBassEnergy = bassEnergy
  }
  
  p.draw = () => {
    frame++
    
    // 分析音乐节奏
    analyzeMusic()
    
    p.background(0, 40)  // 加快残影消失速度（从20增加到40）
    
    // 绘制星星
    for (let star of stars) {
      const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5
      const alpha = twinkle * 200 + 55
      
      p.noStroke()
      p.fill(255, alpha)
      p.circle(star.x, star.y, star.size)
    }
    
    // 更新舞蹈状态 - 平滑连续旋转
    dancePhase += danceSpeed
    
    // 每5秒随机改变旋转方向
    if (frame % 300 === 0) {
      rotationDirection = -rotationDirection  // 反转方向
    }
    
    // 持续稳定旋转
    dancerAngle += rotationSpeed * rotationDirection
    
    // 舞者在屏幕上优雅移动
    dancerMoveX = Math.sin(dancePhase * 1.3) * 100 + Math.cos(dancePhase * 0.7) * 60
    dancerMoveY = Math.cos(dancePhase * 1.1) * 80 + Math.sin(dancePhase * 0.9) * 50
    
    const currentDancerX = dancerX + dancerMoveX
    const currentDancerY = dancerY + dancerMoveY
    
    // 按层级排序绘制：后层->中层->前层
    ribbons.sort((a, b) => a.layer - b.layer)
    
    // 绘制丝带光带
    for (let ribbon of ribbons) {
      // 更新丝带长度（保持最大，不再增长）
      ribbon.length = ribbon.maxLength
      
      // 丝带基础波动
      const wave = Math.sin(frame * ribbon.waveSpeed + ribbon.waveOffset) * ribbon.waveAmplitude
      
      // 丝带受舞蹈影响 - 使用连续旋转
      const danceInfluencedAngle = ribbon.baseAngle + dancerAngle * 0.5
      
      // 音乐节拍影响：轻微调整波动幅度（不再大幅跳动）
      const musicWaveBoost = 1 + beatStrength * 0.3 + musicEnergy * 0.2
      
      // 计算鼠标对丝带的影响
      const mouseForceX = currentDancerX - mouseX_pos
      const mouseForceY = currentDancerY - mouseY_pos
      const mouseDist = Math.sqrt(mouseForceX * mouseForceX + mouseForceY * mouseForceY)
      let mouseAngleOffset = 0
      
      if (mouseDist < mouseInfluenceRadius && mouseDist > 0) {
        const influence = (1 - mouseDist / mouseInfluenceRadius) * 0.05
        mouseAngleOffset = Math.atan2(mouseForceY, mouseForceX) * influence
      }
      
      // 计算丝带上的点 - 减少分段数提升性能
      ribbon.points = []
      const segments = 30  // 从40降低到30，大幅提升性能
      for (let i = 0; i <= segments; i++) {
        const t = i / segments
        const currentLength = ribbon.length * t
        
        // 关键：每个点的旋转角度不同，越往外旋转越慢
        // t=0（根部）: 100%旋转速度
        // t=1（尾部）: 20%旋转速度
        const rotationSpeedAtPoint = 1.0 - t * 0.8  // 从1.0递减到0.2
        const pointRotation = continuousRotation * rotationSpeedAtPoint
        
        // 计算波浪效果 - 中国舞风格：根部跟随节奏，尾部极慢跟随
        const wavePhase = frame * ribbon.waveSpeed + ribbon.waveOffset
        
        // 音乐影响只在根部（t接近0时最强，向尾部递减）
        const musicInfluenceAtPoint = (1 - t) * beatStrength  // 根部100%影响，尾部0%
        
        // 基础波动（整体都有，但较弱）- 尾部非常慢
        const baseWaveEffect = Math.sin(wavePhase + t * 2) * wave * t * 0.3
        const baseSecondaryWave = Math.cos(wavePhase * 1.1 + t * 3) * wave * 0.1 * t
        
        // 音乐增强的波动（主要在根部）
        const musicBoostedWave = Math.sin(wavePhase + t * 1.8) * wave * t * 0.35 * musicInfluenceAtPoint
        const musicBoostedSecondary = Math.cos(wavePhase * 1.0 + t * 2.5) * wave * 0.12 * t * musicInfluenceAtPoint
        
        // 合并两种波动
        const waveEffect = (baseWaveEffect + musicBoostedWave) * musicWaveBoost
        const secondaryWave = baseSecondaryWave + musicBoostedSecondary
        
        // 裙摆曲线：根部固定，中间弯曲，尾部极慢跟随（极度优雅的延迟）
        const skirtCurve = Math.sin(t * Math.PI) * 15 * ribbon.curveIntensity * (1 + musicInfluenceAtPoint * 0.1)
        
        // 计算角度偏移（加入鼠标影响和点位旋转）
        const angleOffset = waveEffect * 0.0025 + secondaryWave * 0.0015 + skirtCurve * 0.0008 + mouseAngleOffset
        const angle = danceInfluencedAngle + pointRotation + angleOffset
        
        const x = currentDancerX + Math.cos(angle) * currentLength
        const y = currentDancerY + Math.sin(angle) * currentLength
        
        ribbon.points.push({ x, y })
      }
      
      // 根据层级设置不同的透明度
      const layerOpacity = ribbon.layer === 0 ? 0.15 : (ribbon.layer === 1 ? 0.25 : 0.35)
      
      // 设置模糊效果
      if (ribbon.points.length > 1) {
        p.drawingContext.save()
        p.drawingContext.shadowBlur = 8 + ribbon.layer * 4  // 前层模糊更大
        const lightness = 88 + Math.random() * 7
        p.drawingContext.shadowColor = `hsla(${ribbon.hue}, ${ribbon.saturation}%, ${lightness}%, ${layerOpacity * 0.5})`
        
        p.noFill()
        p.strokeCap(p.ROUND)
        p.strokeJoin(p.ROUND)
        
        // 绘制2层线条（减少层数提升性能）
        const layers = 2
        for (let layer = 0; layer < layers; layer++) {
          const layerRatio = layer / (layers - 1)
          const offset = (layerRatio - 0.5) * ribbon.thickness * 1.2
          const layerAlpha = (0.05 + layerRatio * 0.15) * (layerOpacity / 0.35)
          
          for (let i = 0; i < ribbon.points.length - 1; i++) {
            const t = i / (ribbon.points.length - 1)
            const taper = 1 - t * (1 - ribbon.taperRatio)
            const point = ribbon.points[i]
            const nextPoint = ribbon.points[i + 1]
            
            const dx = nextPoint.x - point.x
            const dy = nextPoint.y - point.y
            const len = Math.sqrt(dx * dx + dy * dy)
            if (len === 0) continue
            
            const perpX = -dy / len
            const perpY = dx / len
            
            const offsetX1 = point.x + perpX * offset
            const offsetY1 = point.y + perpY * offset
            const offsetX2 = nextPoint.x + perpX * offset
            const offsetY2 = nextPoint.y + perpY * offset
            
            p.stroke(`hsla(${ribbon.hue}, ${ribbon.saturation}%, 92%, ${layerAlpha})`)
            p.strokeWeight(ribbon.thickness * taper)
            p.line(offsetX1, offsetY1, offsetX2, offsetY2)
          }
        }
        
        p.drawingContext.restore()
      }
      
      // 绘制丝带上的闪烁光点
    }
    
    // 绘制丝带上的光点
    for (let light of ribbonLights) {
      const ribbon = ribbons[light.ribbonIndex]
      if (!ribbon || ribbon.points.length === 0) continue
      
      // 计算光点在丝带上的位置
      const pointIndex = Math.floor(light.position * (ribbon.points.length - 1))
      const point = ribbon.points[pointIndex]
      if (!point) continue
      
      // 闪烁效果
      const twinkle = Math.sin(frame * light.twinkleSpeed + light.twinkleOffset) * 0.5 + 0.5
      const alpha = twinkle * 200 + 55
      
      p.drawingContext.save()
      p.drawingContext.shadowBlur = 10
      p.drawingContext.shadowColor = `hsla(${light.hue}, 90%, 95%, ${alpha / 255})`
      
      p.noStroke()
      // 白色光点为主，偶尔有蓝紫色
      const lightness = light.hue === 0 ? 95 : 85
      p.fill(light.hue, 90, lightness, alpha)
      p.circle(point.x, point.y, light.size)
      
      p.drawingContext.restore()
    }
    
    // 绘制鼠标拖尾光晕
    for (let i = mouseTrail.length - 1; i >= 0; i--) {
      const trail = mouseTrail[i]
      const lifeRatio = trail.life / trail.maxLife
      const alpha = lifeRatio * 100
      
      p.drawingContext.save()
      p.drawingContext.shadowBlur = 20
      p.drawingContext.shadowColor = `hsla(0, 50%, 95%, ${alpha / 255})`
      
      const gradient = p.drawingContext.createRadialGradient(
        trail.x, trail.y, 0,
        trail.x, trail.y, 30 * lifeRatio
      )
      gradient.addColorStop(0, `hsla(0, 50%, 95%, ${alpha / 255})`)
      gradient.addColorStop(1, `hsla(0, 50%, 95%, 0)`)
      
      p.drawingContext.fillStyle = gradient
      p.noStroke()
      p.circle(trail.x, trail.y, 60 * lifeRatio)
      p.drawingContext.restore()
      
      trail.life--
      if (trail.life <= 0) {
        mouseTrail.splice(i, 1)
      }
    }
    
    // 绘制鼠标粒子
    for (let i = mouseParticles.length - 1; i >= 0; i--) {
      const particle = mouseParticles[i]
      
      // 更新位置
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vx *= 0.98
      particle.vy *= 0.98
      particle.life--
      
      if (particle.life <= 0) {
        mouseParticles.splice(i, 1)
        continue
      }
      
      const lifeRatio = particle.life / particle.maxLife
      const alpha = lifeRatio * 200
      
      p.drawingContext.save()
      p.drawingContext.shadowBlur = 8
      p.drawingContext.shadowColor = `hsla(${particle.hue}, 80%, 90%, ${alpha / 255})`
      
      p.noStroke()
      p.fill(particle.hue, 80, 95, alpha)
      p.circle(particle.x, particle.y, particle.size * lifeRatio)
      
      p.drawingContext.restore()
    }

    
    // 显示提示文字（右上角）
    p.push()
    p.noStroke()
    p.fill(200, 220, 255, 180)
    p.textSize(14)
    p.textAlign(p.RIGHT, p.TOP)
    p.text('✨ 光之舞者', p.width - 20, 20)
    p.fill(180, 200, 240, 130)
    p.textSize(12)
    p.text('静静观赏，如水般流动 🎵', p.width - 20, 42)
    p.pop()
  }
  
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    dancerX = p.width / 2
    dancerY = p.height / 2
  }
}

onMounted(() => {
  if (canvasContainer.value) {
    sketchInstance = new p5(sketch, canvasContainer.value)
  }
})

onUnmounted(() => {
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
  background: #000;
  z-index: 1;
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M16 28 L16 8' stroke='%23FFD700' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='6' r='3' fill='%23FF69B4'/%3E%3Ccircle cx='10' cy='4' r='1.5' fill='%23FFD700'/%3E%3Ccircle cx='22' cy='4' r='1.5' fill='%2387CEEB'/%3E%3Ccircle cx='14' cy='2' r='1' fill='%2398FB98'/%3E%3Ccircle cx='18' cy='2' r='1' fill='%23FFA500'/%3E%3C/svg%3E") 16 6, pointer;
}

.fullscreen-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
