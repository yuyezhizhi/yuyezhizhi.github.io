<template>
  <div class="processing2vue-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Processing2Vue</h1>
        <p class="hero-subtitle">让创意编程无缝迁移到 Web</p>
        <div class="hero-buttons">
          <a href="https://github.com/yuyezhizhi/processing2vue" target="_blank" class="btn btn-primary">
            ⭐ GitHub
          </a>
          <a href="https://www.npmjs.com/package/processing2vue" target="_blank" class="btn btn-secondary">
            📦 npm
          </a>
        </div>
      </div>
      <div class="hero-visual">
        <div id="hero-canvas" class="hero-canvas"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2 class="section-title">✨ 核心特性</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section class="demo">
      <h2 class="section-title">🎨 效果演示</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <div class="demo-visual">
            <div id="demo-0" class="demo-canvas"></div>
          </div>
          <div class="demo-info">
            <h3 class="demo-title">粒子系统</h3>
            <p class="demo-desc">50个粒子的随机运动效果</p>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-visual">
            <div id="demo-1" class="demo-canvas"></div>
          </div>
          <div class="demo-info">
            <h3 class="demo-title">几何图案</h3>
            <p class="demo-desc">旋转对称的几何图形</p>
          </div>
        </div>
        <div class="demo-item">
          <div class="demo-visual">
            <div id="demo-2" class="demo-canvas"></div>
          </div>
          <div class="demo-info">
            <h3 class="demo-title">波纹效果</h3>
            <p class="demo-desc">点击画布产生波纹</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code Example Section -->
    <section class="code-example">
      <h2 class="section-title">💻 代码示例</h2>
      <div class="code-container">
        <div class="code-block">
          <h3 class="code-title">Processing 代码</h3>
          <pre><code>void setup() {
  size(400, 400);
}

void draw() {
  background(220);
  circle(mouseX, mouseY, 50);
}</code></pre>
        </div>
        <div class="code-arrow">→</div>
        <div class="code-block">
          <h3 class="code-title">Vue 3 组件</h3>
          <pre><code>const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400)
  }
  p.draw = () => {
    p.background(220)
    p.circle(p.mouseX, p.mouseY, 50)
  }
}</code></pre>
        </div>
        <div class="action-buttons">
          <button @click="copyCode" class="btn btn-copy">
            📋 npm install processing2vue p5
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats-grid">
        <div class="stat-item" v-for="(stat, index) in stats" :key="index">
          <div class="stat-number">{{ stat.number }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

const features = [
  { icon: '⚡', title: '一键转换', desc: 'Processing 代码 → Vue 3 组件' },
  { icon: '🎯', title: 'p5.js 驱动', desc: '基于成熟的 p5.js 库' },
  { icon: '📦', title: '零配置', desc: '开箱即用，无需复杂设置' },
  { icon: '🎨', title: '完整支持', desc: '图形、颜色、坐标变换、动画' },
  { icon: '🧩', title: 'TypeScript', desc: '完整的类型定义' },
  { icon: '🧪', title: '测试覆盖', desc: '完善的测试套件' }
]

const stats = [
  { number: '30+', label: '支持函数' },
  { number: '100%', label: '类型覆盖' },
  { number: '1.3.0', label: '当前版本' }
]

let sketches = []

const copyCode = () => {
  navigator.clipboard.writeText('npm install processing2vue p5')
}

onMounted(() => {
  // Hero canvas
  sketches.push(new p5((p) => {
    let particles = []
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-1, 1),
        vy: p.random(-1, 1),
        size: p.random(5, 15)
      })
    }

    p.setup = () => {
      let canvas = p.createCanvas(400, 400)
      canvas.parent('hero-canvas')
      p.noStroke()
    }

    p.draw = () => {
      p.background(30, 40, 60, 30)
      for (let particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy
        if (particle.x < 0 || particle.x > p.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > p.height) particle.vy *= -1

        let d = p.dist(p.mouseX, p.mouseY, particle.x, particle.y)
        let alpha = p.map(d, 0, 200, 255, 50)
        p.fill(100, 200, 255, alpha)
        p.circle(particle.x, particle.y, particle.size)
      }
    }
  }))

  // Demo 1: Particles
  sketches.push(new p5((p) => {
    let particles = []
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-1, 1),
        vy: p.random(-1, 1),
        size: p.random(5, 15)
      })
    }

    p.setup = () => {
      let canvas = p.createCanvas(300, 200)
      canvas.parent('demo-0')
      p.noStroke()
    }

    p.draw = () => {
      p.background(220, 30)
      for (let particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy
        if (particle.x < 0) particle.x = p.width
        if (particle.x > p.width) particle.x = 0
        if (particle.y < 0) particle.y = p.height
        if (particle.y > p.height) particle.y = 0
        p.fill(100, 200, 255, 150)
        p.circle(particle.x, particle.y, particle.size)
      }
    }
  }))

  // Demo 2: Geometric
  sketches.push(new p5((p) => {
    p.setup = () => {
      let canvas = p.createCanvas(300, 200)
      canvas.parent('demo-1')
      p.angleMode(p.RADIANS)
    }
    p.draw = () => {
      p.background(250)
      p.translate(p.width / 2, p.height / 2)
      for (let i = 0; i < 12; i++) {
        p.push()
        p.rotate(p.TWO_PI / 12 * i + p.frameCount * 0.02)
        let hue = (i * 30) % 360
        p.colorMode(p.HSB)
        p.fill(hue, 70, 90)
        p.rect(0, 0, 60, 60, 10)
        p.pop()
      }
      p.colorMode(p.RGB)
    }
  }))

  // Demo 3: Ripples
  sketches.push(new p5((p) => {
    let ripples = []

    p.setup = () => {
      let canvas = p.createCanvas(300, 200)
      canvas.parent('demo-2')
    }
    p.draw = () => {
      p.background(255)
      if (p.mouseIsPressed) {
        ripples.push({ x: p.mouseX, y: p.mouseY, size: 0, alpha: 255 })
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        let ripple = ripples[i]
        ripple.size += 3
        ripple.alpha -= 3
        p.noFill()
        p.stroke(100, 150, 255, ripple.alpha)
        p.circle(ripple.x, ripple.y, ripple.size)
        if (ripple.alpha <= 0) ripples.splice(i, 1)
      }
    }
  }))
})

onUnmounted(() => {
  sketches.forEach(sketch => sketch.remove())
})
</script>

<style scoped lang="less">
.processing2vue-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #fff;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 10%;
  min-height: calc(100vh - 60px);
  flex-wrap: wrap;

  .hero-content {
    flex: 1;
    min-width: 300px;
  }

  .hero-title {
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .hero-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .hero-visual {
    flex: 1;
    min-width: 300px;
    display: flex;
    justify-content: center;
  }

  .hero-canvas {
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    background: rgba(30, 40, 60, 1);
    max-width: 500px;
    width: 100%;
  }
}

.features,
.demo,
.code-example,
.stats {
  padding: 80px 10%;
}

.features {
  background: rgba(255, 255, 255, 0.05);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.4);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-desc {
  opacity: 0.9;
  line-height: 1.6;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-visual {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
}

.demo-canvas {
  width: 100%;
  border-radius: 10px;
}

.demo-info {
  padding: 1.5rem;
}

.demo-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.demo-desc {
  opacity: 0.8;
  font-size: 0.9rem;
}

.code-example {
  background: rgba(0, 0, 0, 0.2);
}

.code-container {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

.code-block {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;

  code {
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    color: #e0e0e0;
  }
}

.code-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #a78bfa;
}

.code-arrow {
  text-align: center;
  font-size: 2rem;
  color: #f093fb;
  margin: 1rem 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.stats {
  background: rgba(255, 255, 255, 0.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #00f260 0%, #0575e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #fff;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.btn-copy {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 60px 5%;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-visual {
    margin-top: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
