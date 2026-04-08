<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// 蝴蝶网 - 优化版本
const canvasContainer = ref(null)
let sketchInstance = null

const sketch = (p) => {
  let butterflies = []
  let leaves = []
  let flowers = []
  let willowBranches = []
  let frame = 0
  let netX = 0
  let netY = 0
  let netTargetX = 0
  let netTargetY = 0
  let netVelX = 0
  let netVelY = 0
  let netRadius = 100
  let caughtCount = 0
  let netWobble = []
  let sparkleParticles = []
  let gravity = 0.3 // 重力加速度
  let friction = 0.95 // 摩擦力

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(60)
    netX = p.width / 2
    netY = p.height / 2
    netTargetX = netX
    netTargetY = netY

    // 初始化网的波动点
    for (let i = 0; i < 32; i++) {
      netWobble.push({
        angle: (i / 32) * Math.PI * 2,
        offset: 0,
        speed: 0.02 + Math.random() * 0.03,
        amplitude: 2 + Math.random() * 3
      })
    }

    // 蝴蝶
    for (let i = 0; i < 20; i++) {
      const hue = Math.random() * 360
      butterflies.push({
        x: Math.random() * p.width,
        y: Math.random() * p.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        targetVx: (Math.random() - 0.5) * 3,
        targetVy: (Math.random() - 0.5) * 3,
        size: 25 + Math.random() * 15,
        baseHue: hue,
        color: `hsla(${hue}, 75%, 65%, 0.85)`,
        wingAngle: 0,
        wingSpeed: 0.15 + Math.random() * 0.1,
        caught: false,
        caughtOffset: (i / 20) * Math.PI * 2,
        trail: []
      })
    }

    // 柳条和叶子
    willowBranches = []
    for (let branchIndex = 0; branchIndex < 8; branchIndex++) {
      const branchX = p.width / 2 + (Math.random() - 0.5) * 400
      const branchY = p.height / 2 - 150 - Math.random() * 100
      const leafCount = 8 + Math.floor(Math.random() * 6)
      
      for (let i = 0; i < leafCount; i++) {
        const leafY = branchY + i * 30 + Math.random() * 10
        leaves.push({
          x: branchX,
          y: leafY,
          length: 30 + Math.random() * 20,
          width: 12 + Math.random() * 8,
          angle: (Math.random() - 0.5) * 0.6,
          swayOffset: Math.random() * Math.PI * 2 + branchIndex * 1.5,
          swaySpeed: 0.03 + Math.random() * 0.02,
          greeness: 60 + Math.random() * 30,
          branchX: branchX,
          branchY: branchY,
          branchIndex: branchIndex,  // 直接存储柳条索引
          leafIndex: i,
          leafCount: leafCount
        })
      }
      
      // 保存柳条信息，添加独立的摆动参数
      willowBranches.push({
        x: branchX,
        y: branchY,
        length: leafCount * 30,
        swayOffset: Math.random() * Math.PI * 2,  // 独立的摆动偏移
        swaySpeed: 0.02 + Math.random() * 0.01,  // 独立的摆动速度
        swayAmplitude: 15 + Math.random() * 10   // 独立的摆动幅度
      })
    }

    // 花朵
    for (let i = 0; i < 50; i++) {
      flowers.push({
        x: Math.random() * p.width * 0.8 + p.width * 0.1,
        y: Math.random() * p.height * 0.8 + p.height * 0.1,
        size: 8 + Math.random() * 8,
        color: `hsla(${Math.random() * 360}, 75%, 65%, 0.9)`,
        petals: 5 + Math.floor(Math.random() * 3),
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        rotation: Math.random() * Math.PI * 2
      })
    }
  }

  p.draw = () => {
    frame++
    
    // 渐变背景
    const gradient = p.drawingContext.createLinearGradient(0, 0, 0, p.height)
    gradient.addColorStop(0, '#f5f7fa')
    gradient.addColorStop(0.5, '#faf8f5')
    gradient.addColorStop(1, '#fff9f0')
    p.drawingContext.fillStyle = gradient
    p.rect(0, 0, p.width, p.height)

    // 网圈跟随鼠标 (带惯性和重力感应)
    netTargetX = p.mouseX
    netTargetY = p.mouseY
    
    // 计算到目标的距离
    const dx = netTargetX - netX
    const dy = netTargetY - netY
    
    // 添加指向鼠标的力（弹性）
    netVelX += dx * 0.02
    netVelY += dy * 0.02
    
    // 添加重力
    netVelY += gravity
    
    // 应用摩擦力
    netVelX *= friction
    netVelY *= friction
    
    // 更新位置
    netX += netVelX
    netY += netVelY
    
    // 边界约束（防止网飞出屏幕）
    const margin = netRadius + 50
    if (netX < margin) {
      netX = margin
      netVelX *= -0.5 // 反弹并减速
    }
    if (netX > p.width - margin) {
      netX = p.width - margin
      netVelX *= -0.5
    }
    if (netY < margin) {
      netY = margin
      netVelY *= -0.5
    }
    if (netY > p.height - margin) {
      netY = p.height - margin
      netVelY *= -0.5
    }

    // 更新网的波动
    for (let i = 0; i < netWobble.length; i++) {
      const w = netWobble[i]
      w.offset = Math.sin(frame * w.speed + w.angle) * w.amplitude
    }

    // 绘制柳条 (在叶子后面)
    for (let branch of willowBranches) {
      p.push()
      p.stroke(107, 69, 38, 180)
      p.strokeWeight(3)
      // 简化的柳条绘制，使用独立的摆动参数
      for (let i = 0; i < 30; i++) {
        const t = i / 30
        const tNext = (i + 1) / 30
        // 使用每个柳条的独立摆动参数 - 顶部固定，底部摆动
        const sway = Math.sin(frame * branch.swaySpeed + branch.swayOffset) * branch.swayAmplitude * t
        const swayNext = Math.sin(frame * branch.swaySpeed + branch.swayOffset) * branch.swayAmplitude * tNext
        const x1 = branch.x + sway
        const y1 = branch.y + t * branch.length
        const x2 = branch.x + swayNext
        const y2 = branch.y + tNext * branch.length
        p.line(x1, y1, x2, y2)
      }
      p.pop()
    }

    // 绘制叶子 (在网后面)
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i]
      const sway = Math.sin(frame * leaf.swaySpeed + leaf.swayOffset) * 0.3
      
      // 使用柳条索引获取对应的柳条
      const branch = willowBranches[leaf.branchIndex]
      let branchSway = 0
      if (branch) {
        // 计算叶子位置对应的摆动 - 顶部固定，底部摆动
        const leafT = leaf.leafIndex / leaf.leafCount
        branchSway = Math.sin(frame * branch.swaySpeed + branch.swayOffset) * branch.swayAmplitude * leafT
      }
      
      p.push()
      p.translate(leaf.branchX + branchSway, leaf.y)
      p.rotate(leaf.angle + sway)
      p.noStroke()
      
      // 叶子渐变
      const leafGrad = p.drawingContext.createLinearGradient(0, -leaf.length/2, 0, leaf.length/2)
      leafGrad.addColorStop(0, `hsla(90, 40%, ${leaf.greeness}%, 0.7)`)
      leafGrad.addColorStop(1, `hsla(90, 50%, ${leaf.greeness - 10}%, 0.8)`)
      p.drawingContext.fillStyle = leafGrad
      
      // 使用椭圆绘制叶子
      p.ellipse(0, 0, leaf.width, leaf.length)
      
      // 叶脉
      p.stroke(`hsla(90, 30%, ${leaf.greeness - 20}%, 0.4)`)
      p.strokeWeight(1)
      p.line(0, -leaf.length/3, 0, leaf.length/3)
      p.pop()
    }

    // 绘制花朵
    for (let i = 0; i < flowers.length; i++) {
      const flower = flowers[i]
      flower.rotation += flower.rotationSpeed
      
      p.push()
      p.translate(flower.x, flower.y)
      p.rotate(flower.rotation)
      p.noStroke()
      
      // 花瓣光晕
      p.drawingContext.save()
      const flowerGlow = p.drawingContext.createRadialGradient(0, 0, 0, 0, 0, flower.size * 1.5)
      flowerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
      flowerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
      p.drawingContext.fillStyle = flowerGlow
      p.ellipse(0, 0, flower.size * 3, flower.size * 3)
      p.drawingContext.restore()
      
      // 花瓣
      for (let j = 0; j < flower.petals; j++) {
        p.push()
        p.rotate((j / flower.petals) * Math.PI * 2)
        p.fill(flower.color)
        p.ellipse(0, flower.size * 0.6, flower.size * 0.4, flower.size * 1.2)
        p.pop()
      }
      
      // 花蕊
      const centerGrad = p.drawingContext.createRadialGradient(0, 0, 0, 0, 0, flower.size/2)
      centerGrad.addColorStop(0, '#fff7cc')
      centerGrad.addColorStop(1, '#ffd700')
      p.drawingContext.fillStyle = centerGrad
      p.circle(0, 0, flower.size * 0.5)
      p.pop()
    }

    // 绘制蝴蝶
    for (let i = butterflies.length - 1; i >= 0; i--) {
      const b = butterflies[i]
      
      // 更新蝴蝶轨迹
      if (frame % 3 === 0 && !b.caught) {
        b.trail.push({ x: b.x, y: b.y, age: 0 })
        if (b.trail.length > 8) b.trail.shift()
      }
      
      // 绘制轨迹
      for (let t = b.trail.length - 1; t >= 0; t--) {
        const point = b.trail[t]
        point.age++
        const alpha = 1 - point.age / 20
        if (alpha <= 0) {
          b.trail.splice(t, 1)
          continue
        }
        p.noStroke()
        p.fill(b.baseHue, 70, 60, alpha * 0.3)
        p.circle(point.x, point.y, b.size * 0.3 * alpha)
      }
      
      if (b.caught) {
        // 已捕捉的蝴蝶，围绕网圈优雅旋转
        const angle = b.caughtOffset + frame * 0.03
        const spiralRadius = netRadius * (0.4 + 0.15 * Math.sin(frame * 0.05 + i))
        b.x = netX + Math.cos(angle) * spiralRadius
        b.y = netY + Math.sin(angle) * spiralRadius
        b.wingAngle = Math.sin(frame * b.wingSpeed) * 0.6
      } else {
        // 自由飞行的蝴蝶 - 更平滑的移动
        b.vx += (b.targetVx - b.vx) * 0.02
        b.vy += (b.targetVy - b.vy) * 0.02
        
        // 偶尔改变目标速度
        if (frame % 120 === 0 && Math.random() < 0.3) {
          b.targetVx = (Math.random() - 0.5) * 4
          b.targetVy = (Math.random() - 0.5) * 4
        }
        
        b.x += b.vx
        b.y += b.vy
        
        // 边界反弹 (更柔和)
        const margin = 80
        if (b.x < margin) { b.x = margin; b.vx = Math.abs(b.vx) * 0.8; b.targetVx = Math.abs(b.targetVx); }
        if (b.x > p.width - margin) { b.x = p.width - margin; b.vx = -Math.abs(b.vx) * 0.8; b.targetVx = -Math.abs(b.targetVx); }
        if (b.y < margin) { b.y = margin; b.vy = Math.abs(b.vy) * 0.8; b.targetVy = Math.abs(b.targetVy); }
        if (b.y > p.height - margin) { b.y = p.height - margin; b.vy = -Math.abs(b.vy) * 0.8; b.targetVy = -Math.abs(b.targetVy); }

        b.wingAngle = Math.sin(frame * b.wingSpeed + i) * 0.5

        // 检测是否被网捕捉
        const dist = Math.hypot(b.x - netX, b.y - netY)
        if (dist < netRadius * 0.8) {
          b.caught = true
          caughtCount++
          
          // 捕捉特效：产生闪光粒子
          for (let s = 0; s < 8; s++) {
            sparkleParticles.push({
              x: b.x,
              y: b.y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              life: 30 + Math.random() * 20,
              hue: b.baseHue
            })
          }
        }
      }

      p.push()
      p.translate(b.x, b.y)
      p.rotate(b.caught ? frame * 0.05 : Math.atan2(b.vy, b.vx))
      
      // 翅膀 - 添加渐变和透明度
      p.push()
      p.rotate(b.wingAngle)
      
      p.fill(b.color)
      p.ellipse(-b.size/3, 0, b.size * 0.6, b.size * 0.8)
      p.pop()

      // 右翅膀
      p.push()
      p.scale(-1, 1)
      p.rotate(b.wingAngle)
      p.fill(b.color)
      p.ellipse(-b.size/3, 0, b.size * 0.6, b.size * 0.8)
      p.pop()

      // 身体
      p.fill(60, 50, 40)
      p.ellipse(0, 0, b.size / 6, b.size * 0.9)
      
      // 触角 - 简单直线加顶部圆点
      p.stroke('#3a3a3a')
      p.strokeWeight(1.5)
      
      // 左触角
      const antennaLen = b.size * 0.5
      const startX = 0
      const startY = -b.size / 2
      const endX = -antennaLen * 0.7
      const endY = -b.size * 0.75
      p.line(startX, startY, endX, endY)
      // 左触角顶部圆点
      p.fill('#3a3a3a')
      p.noStroke()
      p.circle(endX, endY, b.size * 0.1)
      
      // 右触角
      p.stroke('#3a3a3a')
      p.strokeWeight(1.5)
      const r_endX = antennaLen * 0.7
      const r_endY = -b.size * 0.75
      p.line(startX, startY, r_endX, r_endY)
      // 右触角顶部圆点
      p.fill('#3a3a3a')
      p.noStroke()
      p.circle(r_endX, r_endY, b.size * 0.1)
      
      p.pop()
    }

    // 绘制闪光粒子
    for (let i = sparkleParticles.length - 1; i >= 0; i--) {
      const s = sparkleParticles[i]
      s.x += s.vx
      s.y += s.vy
      s.vy += 0.1 // 重力
      s.life--
      
      if (s.life <= 0) {
        sparkleParticles.splice(i, 1)
        continue
      }
      
      p.noStroke()
      const alpha = s.life / 50
      p.fill(s.hue, 80, 70, alpha)
      const size = (s.life / 50) * 6
      p.circle(s.x, s.y, size)
    }

    // 绘制手柄 (更优雅的设计)
    p.push()
    p.translate(netX, netY + netRadius * 3)
    
    // 手柄渐变
    const handleGrad = p.drawingContext.createLinearGradient(0, -200, 0, 0)
    handleGrad.addColorStop(0, '#228b22')
    handleGrad.addColorStop(1, '#006400')
    p.drawingContext.fillStyle = handleGrad
    p.noStroke()
    p.rect(-4, -200, 8, 200, 4)
    
    // 手柄装饰环
    for (let i = 0; i < 5; i++) {
      p.fill('rgba(255, 215, 0, 0.6)')
      p.ellipse(0, -40 - i * 35, 10, 3)
    }
    p.pop()

    // 绘制网圈 (更自然的织网效果)
    p.push()
    p.translate(netX, netY)
    
    // 外框 - 带波动效果 (使用椭圆简化)
    p.noFill()
    p.strokeWeight(3.5)
    p.strokeCap(p.ROUND)
    p.stroke(34, 139, 34, 200)
    
    // 计算平均波动半径
    let avgRadius = netRadius
    for (let i = 0; i < netWobble.length; i++) {
      avgRadius += netWobble[i].offset / netWobble.length
    }
    
    p.ellipse(0, 0, avgRadius * 2, avgRadius * 2)
    
    // 外框光晕
    p.noStroke()
    const rimGlowGradient = p.drawingContext.createRadialGradient(0, 0, avgRadius * 0.9, 0, 0, avgRadius * 1.1)
    rimGlowGradient.addColorStop(0, 'rgba(34, 139, 34, 0)')
    rimGlowGradient.addColorStop(0.5, 'rgba(34, 139, 34, 0.15)')
    rimGlowGradient.addColorStop(1, 'rgba(34, 139, 34, 0)')
    p.drawingContext.fillStyle = rimGlowGradient
    p.ellipse(0, 0, avgRadius * 2.2, avgRadius * 2.2)
    
    // 网格线 - 径向线 (带透明度渐变)
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2
      const r = netRadius
      
      const lineGrad = p.drawingContext.createLinearGradient(0, 0, Math.cos(angle) * r, Math.sin(angle) * r)
      lineGrad.addColorStop(0, 'rgba(34, 139, 34, 0.1)')
      lineGrad.addColorStop(1, 'rgba(34, 139, 34, 0.4)')
      p.drawingContext.strokeStyle = lineGrad
      p.strokeWeight(1.2)
      p.line(0, 0, Math.cos(angle) * r, Math.sin(angle) * r)
    }
    
    // 网格线 - 同心圆 (更细腻)
    for (let r = 0.2; r <= 1; r += 0.2) {
      p.noFill()
      p.stroke(`rgba(34, 139, 34, ${0.15 + r * 0.2})`)
      p.strokeWeight(1.2)
      p.circle(0, 0, netRadius * 2 * r)
    }
    
    // 织网纹理 - 更精细的菱形网格
    p.strokeWeight(0.8)
    for (let ring = 0; ring < 5; ring++) {
      const ringRadius = (ring + 1) * (netRadius / 5)
      const segments = 12 + ring * 6
      
      for (let i = 0; i < segments; i++) {
        const angle1 = (i / segments) * Math.PI * 2
        const angle2 = ((i + 1) / segments) * Math.PI * 2
        
        const x1 = Math.cos(angle1) * ringRadius
        const y1 = Math.sin(angle1) * ringRadius
        const x2 = Math.cos(angle2) * ringRadius
        const y2 = Math.sin(angle2) * ringRadius
        p.stroke(`rgba(34, 139, 34, ${0.2 + ring * 0.1})`)
        p.line(x1, y1, x2, y2)
        
        // 跨圈连接
        if (ring < 4) {
          const nextRingRadius = (ring + 2) * (netRadius / 5)
          const midAngle = (angle1 + angle2) / 2
          const mx = Math.cos(midAngle) * nextRingRadius
          const my = Math.sin(midAngle) * nextRingRadius
          p.stroke(`rgba(34, 139, 34, ${0.15 + ring * 0.08})`)
          p.line(x1, y1, mx, my)
          p.line(x2, y2, mx, my)
        }
      }
    }
    
    // 中心点 - 脉冲效果
    const pulse = Math.sin(frame * 0.1) * 0.3 + 0.7
    if (caughtCount > 0) {
      const centerGlow = p.drawingContext.createRadialGradient(0, 0, 0, 0, 0, 15)
      centerGlow.addColorStop(0, `rgba(255, 215, 0, ${0.6 * pulse})`)
      centerGlow.addColorStop(1, 'rgba(255, 215, 0, 0)')
      p.drawingContext.fillStyle = centerGlow
      p.circle(0, 0, 30)
    }
    p.fill(34, 139, 34)
    p.circle(0, 0, 6)
    p.pop()

    // 显示信息 (更美观的 UI)
    p.push()
    p.noStroke()
    
    p.fill(34, 139, 34)
    p.textSize(15)
    p.textAlign(p.RIGHT, p.TOP)
    p.text(`✨ 已捕捉：${caughtCount}/${butterflies.length}`, p.width - 20, 20)
    p.fill(85, 107, 47)
    p.textSize(12)
    p.text(`移动鼠标来捕捉蝴蝶`, p.width - 20, 42)
    p.pop()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
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
  background: #faf8f5;
  z-index: 1;
  cursor: crosshair;
}

.fullscreen-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
