<template>
  <div class="dancer-page">
    <div class="fullscreen-canvas" ref="canvasContainer"></div>
    <div class="controls">
      <p class="instruction">点击触发粒子爆发 | 静止时产生烟花</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  // 创建单个舞者状态
  function createDancer(id, hueBase, phaseOffset) {
    return {
      id,
      hueBase,
      phaseOffset,
      x: 0, y: 0,
      baseX: 0, baseY: 0,
      vx: 0, vy: 0,
      angle: 0,
      dancePhase: phaseOffset,
      danceSpeed: 0.022 + Math.random() * 0.006,
      moveX: 0, moveY: 0,
      rotationSpeed: 0.018 + Math.random() * 0.006,
      rotationDirection: Math.random() < 0.5 ? 1 : -1,
      targetDirection: 1,
      currentDirectionSmooth: 1,
      ribbons: [],
      ribbonLights: [],
      particles: [],
    }
  }

  let dancers = []
  let stars = []
  let frame = 0

  // 鼠标交互相关
  let mouseX_pos = 0, mouseY_pos = 0
  let mouseTrail = []
  let mouseParticles = []
  let mouseInfluenceRadius = 150
  let lastMouseX = 0, lastMouseY = 0
  let mouseStillTimer = 0
  let fireworks = []

  // 音乐节奏相关（全局共享）
  let audioContext = null
  let analyser = null
  let dataArray = null
  let musicEnergy = 0
  let beatStrength = 0
  let prevBassEnergy = 0
  let isMusicPlaying = false
  let useSimulatedBeat = false
  let simulatedBeatTimer = 0
  let targetDirection = 1
  let currentDirectionSmooth = 1

  // 3个舞者颜色主题（色相基础）
  const dancerHues = [
    120,  // 舞者1：淡绿色
    260,  // 舞者2：紫色
    30,   // 舞者3：橙金色
  ]

  // 初始化单个舞者的丝带和粒子
  function initDancerData(dancer) {
    dancer.ribbons = []
    dancer.ribbonLights = []
    dancer.particles = []

    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2
      dancer.ribbons.push({
        angle,
        baseAngle: angle,
        length: 115,
        maxLength: 115,
        waveOffset: Math.random() * Math.PI * 2,
        waveSpeed: 0.04 + Math.random() * 0.03,
        waveAmplitude: 25 + Math.random() * 25,
        opacity: 76.5,
        hue: dancer.hueBase + Math.random() * 40,
        saturation: 30 + Math.random() * 20,
        thickness: 6 + Math.random() * 4,
        taperRatio: 0.15,
        layer: Math.floor(Math.random() * 3),
        curveIntensity: 0.3 + Math.random() * 0.4,
        points: []
      })
    }

    for (let i = 0; i < 130; i++) {
      dancer.ribbonLights.push({
        ribbonIndex: Math.floor(Math.random() * 32),
        position: Math.random(),
        size: Math.random() * 2 + 1,
        twinkleSpeed: 0.03 + Math.random() * 0.04,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: dancer.hueBase + Math.random() * 60
      })
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(60)

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

    // 3个舞者分布在屏幕左中右三区域
    const positions = [
      { x: p.width * 0.25, y: p.height * 0.5 },
      { x: p.width * 0.5,  y: p.height * 0.45 },
      { x: p.width * 0.75, y: p.height * 0.5 },
    ]

    dancers = dancerHues.map((hue, i) => {
      const d = createDancer(i, hue, i * Math.PI * 2 / 3)
      d.baseX = positions[i].x
      d.baseY = positions[i].y
      d.x = d.baseX
      d.y = d.baseY
      d.targetDirection = d.rotationDirection
      d.currentDirectionSmooth = d.rotationDirection
      initDancerData(d)
      return d
    })

    mouseX_pos = p.width / 2
    mouseY_pos = p.height / 2

    useSimulatedBeat = true
    isMusicPlaying = true
  }
  
  // 舞者排斥力（防止重叠）
  function applyRepulsion() {
    const minDist = 260  // 最小间距（约等于2倍丝带半径）
    for (let i = 0; i < dancers.length; i++) {
      for (let j = i + 1; j < dancers.length; j++) {
        const a = dancers[i], b = dancers[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < minDist && dist > 0) {
          const force = (minDist - dist) / minDist * 0.8
          const nx = dx / dist, ny = dy / dist
          a.vx -= nx * force
          a.vy -= ny * force
          b.vx += nx * force
          b.vy += ny * force
        }
      }
    }
    // 施加速度并衰减，同时限制在屏幕内
    for (const d of dancers) {
      d.x += d.vx
      d.y += d.vy
      d.vx *= 0.85
      d.vy *= 0.85
      // 边界弹回
      const margin = 130
      if (d.x < margin) { d.x = margin; d.vx = Math.abs(d.vx) }
      if (d.x > p.width - margin) { d.x = p.width - margin; d.vx = -Math.abs(d.vx) }
      if (d.y < margin) { d.y = margin; d.vy = Math.abs(d.vy) }
      if (d.y > p.height - margin) { d.y = p.height - margin; d.vy = -Math.abs(d.vy) }
    }
  }

  // 鼠标移动跟踪
  p.mouseMoved = () => {
    mouseX_pos = p.mouseX
    mouseY_pos = p.mouseY
    mouseStillTimer = 0
    lastMouseX = p.mouseX
    lastMouseY = p.mouseY
  }
  
  // 鼠标点击产生粒子爆发
  p.mousePressed = () => {
    mouseX_pos = p.mouseX
    mouseY_pos = p.mouseY
    
    // 点击发射烟花
    createFirework(p.mouseX, p.mouseY)
  }
  
  // 更新单个舞者的运动状态
  function updateDancerMotion(d) {
    d.dancePhase += d.danceSpeed

    // 随机改变方向（每个舞者独立）
    const now = Date.now()
    if (!d._lastDirChange) d._lastDirChange = now
    if (!d._dirThreshold) d._dirThreshold = 800 + Math.random() * 2200
    if (now - d._lastDirChange > d._dirThreshold) {
      d.targetDirection = -d.targetDirection
      d._lastDirChange = now
      d._dirThreshold = 800 + Math.random() * 2200
    }
    d.currentDirectionSmooth += (d.targetDirection - d.currentDirectionSmooth) * 0.03
    d.angle += (0.01 + beatStrength * 0.02) * d.currentDirectionSmooth

    // 独立的漂移运动（加入相位偏移使三者不同步）
    d.moveX = Math.sin(d.dancePhase * 1.3 + d.phaseOffset) * 85 + Math.cos(d.dancePhase * 0.7) * 50
    d.moveY = Math.cos(d.dancePhase * 1.1 + d.phaseOffset) * 120 + Math.sin(d.dancePhase * 0.9) * 80
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
      // 随机时间改变旋转方向（0.8-3秒之间随机）
      if (!window.lastDirectionChange) window.lastDirectionChange = now
      const timeSinceLastChange = now - window.lastDirectionChange
      
      // 每次重新计算随机阈值，让转向时间更不可预测
      if (!window.directionChangeThreshold) {
        window.directionChangeThreshold = 800 + Math.random() * 2200  // 0.8-3秒
      }
      
      if (timeSinceLastChange > window.directionChangeThreshold) {
        targetDirection = -targetDirection  // 设置新的目标方向
        window.lastDirectionChange = now
        window.directionChangeThreshold = 800 + Math.random() * 2200  // 下次随机新的时间
        // 不再重置 continuousRotation，保持角度连续
      }
      
      // 平滑过渡到目标方向（更慢的缓动效果）
      const smoothSpeed = 0.03
      currentDirectionSmooth += (targetDirection - currentDirectionSmooth) * smoothSpeed
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
  
  // 创建烟花
  function createFirework(x, y) {
    // 限制同时存在的烟花数量，防止性能爆炸
    if (fireworks.length >= 5) return
    const particleCount = 30 + Math.floor(Math.random() * 20)  // 30-50个粒子
    const particles = []
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5
      const speed = 3 + Math.random() * 5
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 40 + Math.random() * 20,
        maxLife: 40 + Math.random() * 20,
        size: 0.5 + Math.random() * 1,  // 更小的粒子
        hue: 0  // 白色
      })
    }
    
    fireworks.push({ particles })
  }
  
  // 绘制单个舞者的丝带
  function drawDancerRibbons(d) {
    const currentX = d.x + d.moveX
    const currentY = d.y + d.moveY
    d.ribbons.sort((a, b) => a.layer - b.layer)

    for (let ribbon of d.ribbons) {
      ribbon.length = ribbon.maxLength
      const wave = Math.sin(frame * ribbon.waveSpeed + ribbon.waveOffset) * ribbon.waveAmplitude
      const danceInfluencedAngle = ribbon.baseAngle + d.angle * 0.5
      const musicWaveBoost = 1 + beatStrength * 0.3 + musicEnergy * 0.2

      const mouseForceX = currentX - mouseX_pos
      const mouseForceY = currentY - mouseY_pos
      const mDist = Math.sqrt(mouseForceX * mouseForceX + mouseForceY * mouseForceY)
      let mouseAngleOffset = 0
      if (mDist < mouseInfluenceRadius && mDist > 0) {
        const influence = (1 - mDist / mouseInfluenceRadius) * 0.05
        mouseAngleOffset = Math.atan2(mouseForceY, mouseForceX) * influence
      }

      ribbon.points = []
      const segments = 28
      if (!ribbon.pointVelocity) {
        ribbon.pointVelocity = new Array(segments + 1).fill(0)
        ribbon.pointAngle = new Array(segments + 1).fill(0)
      }

      const directionFactor = d.currentDirectionSmooth >= 0 ? 1 : -1

      for (let i = 0; i <= segments; i++) {
        const t = i / segments
        const currentLength = ribbon.length * t
        const targetVelocity = (0.01 + beatStrength * 0.02) * d.currentDirectionSmooth * (1.0 - t * 0.8)
        ribbon.pointVelocity[i] += (targetVelocity - ribbon.pointVelocity[i]) * 0.08
        ribbon.pointAngle[i] += ribbon.pointVelocity[i]
        const pointRotation = ribbon.pointAngle[i]

        const wavePhase = frame * ribbon.waveSpeed + ribbon.waveOffset
        const musicInfluenceAtPoint = (1 - t) * beatStrength
        const decayFactor = Math.exp(-t * 1.5)
        const baseWaveEffect = Math.sin(wavePhase + t * 2 * directionFactor) * wave * t * 0.3 * decayFactor
        const baseSecondaryWave = Math.cos(wavePhase * 1.1 + t * 3 * directionFactor) * wave * 0.1 * t * decayFactor
        const musicBoostedWave = Math.sin(wavePhase + t * 1.8 * directionFactor) * wave * t * 0.35 * musicInfluenceAtPoint * decayFactor
        const musicBoostedSecondary = Math.cos(wavePhase * 1.0 + t * 2.5 * directionFactor) * wave * 0.12 * t * musicInfluenceAtPoint * decayFactor
        const waveEffect = (baseWaveEffect + musicBoostedWave) * musicWaveBoost
        const secondaryWave = baseSecondaryWave + musicBoostedSecondary
        const skirtCurveDecay = Math.exp(-t * 2.0)
        const skirtCurve = Math.sin(t * Math.PI * directionFactor) * 15 * ribbon.curveIntensity * (1 + musicInfluenceAtPoint * 0.1) * skirtCurveDecay
        const angleOffset = (waveEffect * 0.0025 + secondaryWave * 0.0015 + skirtCurve * 0.0008 + mouseAngleOffset) * 0.95
        const angle = danceInfluencedAngle + pointRotation + angleOffset
        ribbon.points.push({
          x: currentX + Math.cos(angle) * currentLength,
          y: currentY + Math.sin(angle) * currentLength
        })
      }

      const layerOpacity = ribbon.layer === 0 ? 0.15 : (ribbon.layer === 1 ? 0.25 : 0.35)
      if (ribbon.points.length > 1) {
        p.drawingContext.save()
        p.drawingContext.shadowBlur = 8 + ribbon.layer * 4
        const lightness = 88 + Math.random() * 7
        p.drawingContext.shadowColor = `hsla(${ribbon.hue}, ${ribbon.saturation}%, ${lightness}%, ${layerOpacity * 0.5})`
        p.noFill()
        p.strokeCap(p.ROUND)
        p.strokeJoin(p.ROUND)

        for (let layer = 0; layer < 2; layer++) {
          const layerRatio = layer / 1
          const offset = (layerRatio - 0.5) * ribbon.thickness * 1.2
          const layerAlpha = (0.05 + layerRatio * 0.15) * (layerOpacity / 0.35)
          for (let i = 0; i < ribbon.points.length - 1; i++) {
            const t = i / (ribbon.points.length - 1)
            const taper = 1 - t * (1 - ribbon.taperRatio)
            const pt = ribbon.points[i], npt = ribbon.points[i + 1]
            const dx = npt.x - pt.x, dy = npt.y - pt.y
            const len = Math.sqrt(dx * dx + dy * dy)
            if (len === 0) continue
            const perpX = -dy / len, perpY = dx / len
            p.stroke(`hsla(${ribbon.hue}, ${ribbon.saturation}%, 92%, ${layerAlpha})`)
            p.strokeWeight(ribbon.thickness * taper)
            p.line(pt.x + perpX * offset, pt.y + perpY * offset, npt.x + perpX * offset, npt.y + perpY * offset)
          }
        }
        p.drawingContext.restore()
      }
    }

    // 丝带光点
    for (let light of d.ribbonLights) {
      const ribbon = d.ribbons[light.ribbonIndex]
      if (!ribbon || ribbon.points.length === 0) continue
      const pointIndex = Math.floor(light.position * (ribbon.points.length - 1))
      const point = ribbon.points[pointIndex]
      if (!point) continue
      const twinkle = Math.sin(frame * light.twinkleSpeed + light.twinkleOffset) * 0.5 + 0.5
      const alpha = twinkle * 200 + 55
      p.drawingContext.save()
      p.drawingContext.shadowBlur = 10
      p.drawingContext.shadowColor = `hsla(${light.hue}, 90%, 95%, ${alpha / 255})`
      p.noStroke()
      p.fill(light.hue, 90, 85, alpha)
      p.circle(point.x, point.y, light.size)
      p.drawingContext.restore()
    }

    // 身体 + 头部
    p.push()
    p.translate(currentX, currentY)
    p.rotate(d.angle)
    p.drawingContext.save()
    p.drawingContext.shadowBlur = 15
    p.drawingContext.shadowColor = 'rgba(255,255,255,0.5)'
    p.noStroke()
    p.fill(255, 255, 255, 180)
    p.ellipse(0, 0, 70, 30)
    p.drawingContext.restore()
    p.drawingContext.save()
    p.drawingContext.shadowBlur = 8
    p.drawingContext.shadowColor = 'rgba(0,0,0,0.5)'
    p.fill(0, 0, 0, 255)
    p.circle(0, 0, 25)
    p.drawingContext.restore()
    p.pop()
  }

  p.draw = () => {
    frame++
    analyzeMusic()

    // 鼠标静止检测
    const mdx = mouseX_pos - lastMouseX, mdy = mouseY_pos - lastMouseY
    if (Math.sqrt(mdx * mdx + mdy * mdy) < 2) {
      mouseStillTimer++
      if (mouseStillTimer >= 60) { createFirework(mouseX_pos, mouseY_pos); mouseStillTimer = 0 }
    } else { mouseStillTimer = 0 }
    lastMouseX = mouseX_pos
    lastMouseY = mouseY_pos

    // 背景
    const bgGradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height)
    bgGradient.addColorStop(0, '#2D2438')
    bgGradient.addColorStop(0.4, '#1E2835')
    bgGradient.addColorStop(0.7, '#243442')
    bgGradient.addColorStop(1, '#1A2A3A')
    p.drawingContext.fillStyle = bgGradient
    p.noStroke()
    p.rect(0, 0, p.width, p.height)

    // 星星
    for (let star of stars) {
      const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5
      p.noStroke()
      p.fill(255, 255, 255, twinkle * 200 + 55)
      p.circle(star.x, star.y, star.size)
    }

    // 更新每个舞者运动 + 排斥力
    for (const d of dancers) updateDancerMotion(d)
    applyRepulsion()

    // 绘制每个舞者
    for (const d of dancers) drawDancerRibbons(d)

    // 绘制鼠标粒子
    for (let i = mouseParticles.length - 1; i >= 0; i--) {
      const particle = mouseParticles[i]
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vx *= 0.98
      particle.vy *= 0.98
      particle.life--
      if (particle.life <= 0) { mouseParticles.splice(i, 1); continue }
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

    // 绘制烟花
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const fw = fireworks[i]
      for (let j = fw.particles.length - 1; j >= 0; j--) {
        const ptc = fw.particles[j]
        ptc.x += ptc.vx
        ptc.y += ptc.vy
        ptc.vy += 0.05
        ptc.vx *= 0.99
        ptc.vy *= 0.99
        ptc.life--
        if (ptc.life <= 0) { fw.particles.splice(j, 1); continue }
        const lifeRatio = ptc.life / ptc.maxLife
        const alpha = lifeRatio
        const ctx = p.drawingContext
        ctx.save()
        // 白色外圈光晕（无lighter，避免性能问题）
        ctx.shadowBlur = 20
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(ptc.x, ptc.y, ptc.size * lifeRatio * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()
        ctx.restore()
      }
      if (fw.particles.length === 0) fireworks.splice(i, 1)
    }
    
    // 鼠标粒子
    for (let i = mouseParticles.length - 1; i >= 0; i--) {
      const particle = mouseParticles[i]
      particle.x += particle.vx; particle.y += particle.vy
      particle.vx *= 0.98; particle.vy *= 0.98
      particle.life--
      if (particle.life <= 0) { mouseParticles.splice(i, 1); continue }
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
  }
  
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    // 重新分布3个舞者
    const positions = [
      { x: p.width * 0.25, y: p.height * 0.5 },
      { x: p.width * 0.5,  y: p.height * 0.45 },
      { x: p.width * 0.75, y: p.height * 0.5 },
    ]
    dancers.forEach((d, i) => {
      d.baseX = positions[i].x
      d.baseY = positions[i].y
      d.x = d.baseX
      d.y = d.baseY
    })
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

<style scoped lang="less">
.dancer-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
    color: #ffffff;
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

.fullscreen-canvas {
  position: absolute;
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
