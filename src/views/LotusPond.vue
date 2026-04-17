<template>
  <div class="lotus-pond-container">
    <div id="p5-canvas"></div>
    <div class="controls">
      <p class="instruction">点击水面制造波浪 | 观赏小船自动巡游</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import p5 from 'p5'

let p5Instance = null

onMounted(() => {
  const sketch = (p) => {
    let lotusLeaves = []
    let lotusFlowers = []
    let boat = null
    let waterRipples = []

    class LotusLeaf {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.originX = x  // 记录原始位置
        this.originY = y
        this.size = p.random(18, 35)
        this.rotation = p.random(p.TWO_PI)
        this.rotationSpeed = p.random(-0.002, 0.002)
        this.hue = p.random(90, 150)
        this.saturation = p.random(40, 70)
        this.brightness = p.random(60, 85)
        this.wobble = p.random(p.TWO_PI)
        this.wobbleSpeed = p.random(0.005, 0.015)
        this.driftX = p.random(-0.01, 0.01)
        this.driftY = p.random(-0.01, 0.01)
        this.offsetX = 0
        this.offsetY = 0
        this.targetOffsetX = 0
        this.targetOffsetY = 0
      }

      update() {
        this.wobble += this.wobbleSpeed
        this.rotation += this.rotationSpeed
        this.originX += p.sin(this.wobble) * this.driftX
        this.originY += p.cos(this.wobble) * this.driftY

        // 快速响应波浪，缓慢恢复原位
        this.offsetX += (this.targetOffsetX - this.offsetX) * 0.15  // 加快响应速度
        this.offsetY += (this.targetOffsetY - this.offsetY) * 0.15
        this.targetOffsetX *= 0.975  // 加快衰减，减少重叠
        this.targetOffsetY *= 0.98

        this.x = this.originX + this.offsetX
        this.y = this.originY + this.offsetY

        // 边界检查
        const actualX = this.originX + this.offsetX
        const actualY = this.originY + this.offsetY
        if (actualX < -this.size) this.originX = p.width + this.size
        if (actualX > p.width + this.size) this.originX = -this.size
        if (actualY < -this.size) this.originY = p.height + this.size
        if (actualY > p.height + this.size) this.originY = -this.size
      }

      display() {
        p.push()
        p.translate(this.x, this.y)
        p.rotate(this.rotation)
        p.colorMode(p.HSB, 360, 100, 100, 255)
        p.noStroke()

        p.fill(this.hue, this.saturation, this.brightness, 220)
        p.ellipse(0, 0, this.size * 2, this.size * 2)

        p.stroke(this.hue, this.saturation + 10, this.brightness - 10, 80)
        p.strokeWeight(1)
        for (let i = 0; i < 8; i++) {
          const angle = (p.TWO_PI / 8) * i
          const len = this.size * 0.8
          p.line(0, 0, p.cos(angle) * len, p.sin(angle) * len)
        }

        p.fill(this.hue + 10, this.saturation - 10, this.brightness + 10, 180)
        p.noStroke()
        p.ellipse(0, 0, this.size * 0.25, this.size * 0.25)
        p.pop()
      }

      avoidBoat(boatX, boatY, boatSize) {
        // 碰撞范围和船体一样大
        const d = p.dist(this.originX, this.originY, boatX, boatY)
        const avoidRadius = boatSize * 0.9  // 和船体大小一致
        
        if (d < avoidRadius) {
          const forceX = this.originX - boatX
          const forceY = this.originY - boatY
          const mag = p.sqrt(forceX * forceX + forceY * forceY)
          if (mag > 0) {
            // 限制推开距离最大为荷叶直径
            let strength = (1 - d / avoidRadius) * 30
            const maxOffset = this.size * 2  // 最多移动荷叶直径的距离
            // 先计算当前偏移量
            const currentOffset = p.sqrt(this.targetOffsetX * this.targetOffsetX + this.targetOffsetY * this.targetOffsetY)
            if (currentOffset + strength > maxOffset) {
              strength = Math.max(0, maxOffset - currentOffset)
            }
            this.targetOffsetX += (forceX / mag) * strength
            this.targetOffsetY += (forceY / mag) * strength
          }
        }
      }

      affectedByWave(waveX, waveY, waveRadius, waveStrength) {
        if (waveRadius <= 0) return
        // 使用实际位置检测波浪接触
        const actualX = this.originX + this.offsetX
        const actualY = this.originY + this.offsetY
        const d = p.dist(actualX, actualY, waveX, waveY)
        
        // 波纹刚接触到荷叶边缘就产生影响
        if (d < waveRadius + this.size && d > 0) {
          const forceX = actualX - waveX
          const forceY = actualY - waveY
          const mag = p.sqrt(forceX * forceX + forceY * forceY)
          if (mag > 0) {
            // 增强波浪影响力度
            const strength = (1 - d / (waveRadius + this.size)) * waveStrength * 2
            this.targetOffsetX += (forceX / mag) * strength
            this.targetOffsetY += (forceY / mag) * strength
          }
        }
      }
    }

    class LotusFlower {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.originX = x
        this.originY = y
        this.size = p.random(8, 15)
        this.petals = Math.floor(p.random(5, 8))
        this.hue = p.random(320, 350)
        this.rotation = p.random(p.TWO_PI)
        this.rotationSpeed = p.random(-0.003, 0.003)
        this.wobble = p.random(p.TWO_PI)
        this.wobbleSpeed = p.random(0.008, 0.02)
        this.bloomProgress = p.random(0.5, 1)
        this.offsetX = 0
        this.offsetY = 0
        this.targetOffsetX = 0
        this.targetOffsetY = 0
      }

      update() {
        this.wobble += this.wobbleSpeed
        this.rotation += this.rotationSpeed
        this.originX += p.sin(this.wobble) * 0.1
        this.originY += p.cos(this.wobble) * 0.1
        this.offsetX += (this.targetOffsetX - this.offsetX) * 0.02
        this.offsetY += (this.targetOffsetY - this.offsetY) * 0.02
        this.targetOffsetX *= 0.98
        this.targetOffsetY *= 0.98
        this.x = this.originX + this.offsetX
        this.y = this.originY + this.offsetY
      }

      display() {
        p.push()
        p.translate(this.x, this.y)
        p.rotate(this.rotation)
        p.colorMode(p.HSB, 360, 100, 100, 255)

        const petalSize = this.size * this.bloomProgress

        // 绘制外层花瓣（较大，颜色较浅）
        for (let i = 0; i < this.petals; i++) {
          const angle = (p.TWO_PI / this.petals) * i
          p.push()
          p.rotate(angle)
          
          // 使用椭圆组合模拟花瓣形状
          p.noStroke()
          p.fill(this.hue, 50, 95, 180)
          
          // 主花瓣 - 拉长椭圆
          p.ellipse(petalSize * 0.5, 0, petalSize, petalSize * 0.35)
          
          // 花瓣尖端 - 小椭圆
          p.fill(this.hue, 45, 97, 160)
          p.ellipse(petalSize * 0.85, 0, petalSize * 0.4, petalSize * 0.25)
          
          p.pop()
        }

        // 绘制内层花瓣（较小，颜色较深）
        for (let i = 0; i < this.petals; i++) {
          const angle = (p.TWO_PI / this.petals) * i + p.PI / this.petals
          p.push()
          p.rotate(angle)
          
          p.noStroke()
          p.fill(this.hue + 10, 65, 85, 200)
          
          // 内层花瓣
          p.ellipse(petalSize * 0.35, 0, petalSize * 0.7, petalSize * 0.25)
          
          p.pop()
        }

        // 花蕊 - 黄色
        p.noStroke()
        p.fill(50, 90, 95, 230)
        p.ellipse(0, 0, petalSize * 0.25, petalSize * 0.25)
        
        // 花蕊细节
        p.fill(45, 85, 90, 200)
        for (let i = 0; i < 5; i++) {
          const angle = (p.TWO_PI / 5) * i
          const dotSize = petalSize * 0.04
          p.ellipse(
            p.cos(angle) * petalSize * 0.08,
            p.sin(angle) * petalSize * 0.08,
            dotSize, dotSize
          )
        }

        p.pop()
      }

      affectedByWave(waveX, waveY, waveRadius, waveStrength) {
        if (waveRadius <= 0) return
        // 使用实际位置检测波浪接触
        const actualX = this.originX + this.offsetX
        const actualY = this.originY + this.offsetY
        const d = p.dist(actualX, actualY, waveX, waveY)
        
        // 波纹刚接触到荷花边缘就产生影响
        if (d < waveRadius + this.size && d > 0) {
          const forceX = actualX - waveX
          const forceY = actualY - waveY
          const mag = p.sqrt(forceX * forceX + forceY * forceY)
          if (mag > 0) {
            // 增强波浪影响力度
            const strength = (1 - d / (waveRadius + this.size)) * waveStrength * 2
            this.targetOffsetX += (forceX / mag) * strength
            this.targetOffsetY += (forceY / mag) * strength
          }
        }
      }
    }

    class Boat {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.angle = 0
        this.size = 120
        this.speed = 1.2
        this.waypoints = []
        this.currentWaypoint = 0
        this.straightTime = 0  // 直线运动时间（帧数）
        this.minStraightFrames = 180  // 至少3秒（60fps * 3 = 180帧）
        this.generateWaypoints()
      }

      generateWaypoints() {
        this.waypoints = []
        const numPoints = 12  // 增加路径点数量
        const margin = 100  // 扩大运动范围
        
        for (let i = 0; i < numPoints; i++) {
          this.waypoints.push({
            x: p.random(margin, p.width - margin),
            y: p.random(margin, p.height - margin)
          })
        }
      }

      update() {
        if (this.waypoints.length === 0) return

        const target = this.waypoints[this.currentWaypoint]
        const dx = target.x - this.x
        const dy = target.y - this.y
        const dist = p.sqrt(dx * dx + dy * dy)

        // 到达目标点且已经直线运动了足够时间才转向
        if (dist < 20 && this.straightTime >= this.minStraightFrames) {
          this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length
          this.straightTime = 0  // 重置计时
          if (this.currentWaypoint === 0) {
            this.generateWaypoints()
          }
        } else {
          this.straightTime++  // 增加直线运动时间
          const targetAngle = p.atan2(dy, dx)
          let angleDiff = targetAngle - this.angle
          while (angleDiff > p.PI) angleDiff -= p.TWO_PI
          while (angleDiff < -p.PI) angleDiff += p.TWO_PI
          this.angle += angleDiff * 0.03

          this.x += (dx / dist) * this.speed
          this.y += (dy / dist) * this.speed
        }
      }

      display() {
        p.push()
        p.translate(this.x, this.y)
        p.rotate(this.angle)
        p.colorMode(p.HSB, 360, 100, 100, 255)

        const s = this.size

        // 船身
        p.fill(35, 35, 65, 240)
        p.stroke(25, 40, 45, 200)
        p.strokeWeight(2)
        p.ellipse(0, 0, s * 1.8, s * 0.45)

        // 船头
        p.fill(35, 35, 65, 240)
        p.noStroke()
        p.arc(s * 0.85, 0, s * 0.5, s * 0.45, -p.HALF_PI, p.HALF_PI, p.PIE)

        // 船篷
        p.fill(40, 45, 80, 230)
        p.noStroke()
        p.ellipse(-s * 0.1, 0, s * 0.5, s * 0.35)

        // 遮阳伞
        p.fill(45, 75, 95, 240)
        p.noStroke()
        p.ellipse(-s * 0.1, 0, s * 0.35, s * 0.35)

        // 伞的纹理
        p.stroke(45, 60, 85, 150)
        p.strokeWeight(1)
        for (let i = 0; i < 6; i++) {
          const angle = (p.TWO_PI / 6) * i
          p.line(-s * 0.1, 0, -s * 0.1 + p.cos(angle) * s * 0.17, p.sin(angle) * s * 0.17)
        }

        // 船上的物品
        p.fill(50, 60, 85, 200)
        p.noStroke()
        p.ellipse(s * 0.3, -s * 0.08, s * 0.15, s * 0.12)
        p.ellipse(s * 0.3, s * 0.08, s * 0.12, s * 0.1)

        p.pop()
      }
    }

    class WaterRipple {
      constructor(x, y, isClick = false) {
        this.x = x
        this.y = y
        this.radius = isClick ? 0 : p.random(10, 20)
        this.maxRadius = isClick ? 150 : p.random(60, 120)  // 点击波浪最大半径减半
        this.alpha = isClick ? 255 : 200
        this.speed = isClick ? 3 : p.random(0.8, 1.5)
        this.isClick = isClick
      }

      update() {
        this.radius += this.speed
        this.alpha -= this.isClick ? 3 : 2
      }

      display() {
        if (this.alpha <= 0) return
        p.push()
        p.colorMode(p.HSB, 360, 100, 100, 255)
        p.noFill()
        p.stroke(200, 25, 85, this.alpha)
        p.strokeWeight(this.isClick ? 2.5 : 1.5)
        p.ellipse(this.x, this.y, this.radius * 2, this.radius * 2)
        p.pop()
      }

      isDead() {
        return this.alpha <= 0 || this.radius >= this.maxRadius
      }
    }

    // 防止荷叶重叠的辅助函数
    function checkOverlap(x, y, size, existingLeaves) {
      for (let leaf of existingLeaves) {
        const d = p.dist(x, y, leaf.originX || leaf.x, leaf.originY || leaf.y)
        const minDist = (size + leaf.size) * 0.7  // 减少重叠，保持更大间距
        if (d < minDist) {
          return true
        }
      }
      return false
    }

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
      canvas.parent('p5-canvas')

      // 生成荷叶 - 数量增加1.5倍（从160增加到240），并防止重叠
      let attempts = 0
      const maxAttempts = 800
      while (lotusLeaves.length < 240 && attempts < maxAttempts) {
        const x = p.random(p.width)
        const y = p.random(p.height)
        const size = p.random(18, 35)
        
        // 检查是否重叠过多
        if (!checkOverlap(x, y, size, lotusLeaves)) {
          lotusLeaves.push(new LotusLeaf(x, y))
        }
        attempts++
      }

      // 生成荷花 - 增加1.5倍（从25增加到38）
      for (let i = 0; i < 38; i++) {
        lotusFlowers.push(new LotusFlower(p.random(p.width), p.random(p.height)))
      }

      boat = new Boat(p.width / 2, p.height / 2)
    }

    p.draw = () => {
      p.colorMode(p.HSB, 360, 100, 100, 255)
      p.background(195, 25, 95)

      p.noStroke()
      for (let i = 0; i < 50; i++) {
        const x = (p.sin(p.frameCount * 0.01 + i * 0.5) + 1) * p.width * 0.5
        const y = (p.cos(p.frameCount * 0.008 + i * 0.3) + 1) * p.height * 0.5
        p.fill(195, 20, 90, 15)
        p.ellipse(x, y, p.random(50, 150), p.random(20, 50))
      }

      lotusLeaves.forEach(leaf => {
        leaf.update()
        if (boat) {
          leaf.avoidBoat(boat.x, boat.y, boat.size)
        }
        waterRipples.forEach(ripple => {
          if (ripple.isClick) {
            leaf.affectedByWave(ripple.x, ripple.y, ripple.radius, 5)
          }
        })
        leaf.display()
      })

      lotusFlowers.forEach(flower => {
        flower.update()
        waterRipples.forEach(ripple => {
          if (ripple.isClick) {
            flower.affectedByWave(ripple.x, ripple.y, ripple.radius, 3)
          }
        })
        flower.display()
      })

      for (let i = waterRipples.length - 1; i >= 0; i--) {
        waterRipples[i].update()
        waterRipples[i].display()
        if (waterRipples[i].isDead()) {
          waterRipples.splice(i, 1)
        }
      }

      if (boat) {
        boat.update()
        boat.display()
        if (p.frameCount % 25 === 0) {
          // 波浪中心在船头位置
          const bowX = boat.x + p.cos(boat.angle) * boat.size * 0.9
          const bowY = boat.y + p.sin(boat.angle) * boat.size * 0.9
          waterRipples.push(new WaterRipple(bowX, bowY))
        }
      }
    }

    p.mouseClicked = () => {
      waterRipples.push(new WaterRipple(p.mouseX, p.mouseY, true))
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
      if (boat) {
        boat.generateWaypoints()
      }
    }
  }

  p5Instance = new p5(sketch)
})

onBeforeUnmount(() => {
  if (p5Instance) {
    p5Instance.remove()
  }
})
</script>

<style scoped lang="less">
.lotus-pond-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='stick' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23DAA520;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23B8860B;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='14' y='4' width='4' height='24' fill='url(%23stick)' rx='2'/%3E%3Cellipse cx='16' cy='6' rx='5' ry='4' fill='%239ACD32' stroke='%236B8E23' stroke-width='1'/%3E%3Ccircle cx='14' cy='5' r='1' fill='%23556B2F'/%3E%3Ccircle cx='18' cy='5' r='1' fill='%23556B2F'/%3E%3Ccircle cx='16' cy='7' r='1' fill='%23556B2F'/%3E%3Ccircle cx='14' cy='8' r='0.8' fill='%23556B2F'/%3E%3Ccircle cx='18' cy='8' r='0.8' fill='%23556B2F'/%3E%3C/svg%3E") 16 16, auto;

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
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    color: rgb(1, 108, 62);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);

    .instruction {
      margin: 0;
      font-size: 0.85rem;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
