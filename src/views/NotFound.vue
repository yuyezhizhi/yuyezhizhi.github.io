<template>
  <div class="not-found-container">
    <div class="three-container" ref="threeContainer"></div>
    <div class="content">
      <h1 class="title">404</h1>
      <h2 class="subtitle">页面未找到</h2>
      <p class="description">您访问的页面不存在或已被移动</p>
      <router-link to="/" class="home-button">返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const threeContainer = ref(null)
let scene, camera, renderer, controls, animationId
let boxes = []
let particles = []

onMounted(() => {
  initThree()
  createScene()
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})

const initThree = () => {
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0d1117)
  
  // 获取正确的视口尺寸，确保不会产生滚动条
  const width = Math.min(window.innerWidth, document.documentElement.clientWidth)
  const height = Math.min(window.innerHeight, document.documentElement.clientHeight)
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    width / height,
    0.1,
    1000
  )
  camera.position.z = 15
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 限制像素比，提高性能
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  
  // 确保画布不会导致溢出 - 加强样式控制
  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.position = 'absolute'
  canvas.style.top = '0px'
  canvas.style.left = '0px'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.maxWidth = '100%'
  canvas.style.maxHeight = '100%'
  canvas.style.overflow = 'hidden'
  canvas.style.objectFit = 'cover'
  canvas.style.padding = '0px'
  canvas.style.margin = '0px'
  canvas.style.border = 'none'
  canvas.style.boxSizing = 'border-box'
  
  if (threeContainer.value) {
    // 清空容器，避免重复添加
    threeContainer.value.innerHTML = ''
    threeContainer.value.appendChild(canvas)
  }
  
  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enableZoom = false
  
  // 监听窗口大小变化
  window.addEventListener('resize', onWindowResize)
}

const onWindowResize = () => {
  // 获取正确的视口尺寸，确保不会产生滚动条
  const width = Math.min(window.innerWidth, document.documentElement.clientWidth)
  const height = Math.min(window.innerHeight, document.documentElement.clientHeight)
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  
  // 确保渲染器画布不会产生滚动条 - 加强样式控制
  const canvas = renderer.domElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.maxWidth = '100%'
  canvas.style.maxHeight = '100%'
}

const createScene = () => {
  // 创建网格地面
  const gridHelper = new THREE.GridHelper(20, 20, 0x333333, 0x111111)
  scene.add(gridHelper)
  
  // 创建404数字
  createNumber4()
  createNumber0()
  createNumber4()
  
  // 创建粒子效果
  createParticles()
  
  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7.5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)
  
  const pointLight = new THREE.PointLight(0x667eea, 1, 50)
  pointLight.position.set(-5, 5, 5)
  scene.add(pointLight)
}

const createNumber4 = () => {
  // 创建4的形状
  const geometry = new THREE.BoxGeometry(1, 4, 1)
  const material = new THREE.MeshStandardMaterial({
    color: 0x667eea,
    metalness: 0.3,
    roughness: 0.2
  })
  
  // 垂直部分
  const verticalPart = new THREE.Mesh(geometry, material)
  verticalPart.position.x = -3
  verticalPart.position.y = 0
  verticalPart.castShadow = true
  verticalPart.receiveShadow = true
  scene.add(verticalPart)
  boxes.push(verticalPart)
  
  // 水平部分
  const horizontalPart = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    material
  )
  horizontalPart.position.x = -4
  horizontalPart.position.y = 1.5
  horizontalPart.scale.x = 2
  horizontalPart.castShadow = true
  horizontalPart.receiveShadow = true
  scene.add(horizontalPart)
  boxes.push(horizontalPart)
  
  // 斜部分
  const diagonalPart = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    material
  )
  diagonalPart.position.x = -4
  diagonalPart.position.y = -0.5
  diagonalPart.scale.x = 2
  diagonalPart.rotation.z = Math.PI / 6
  diagonalPart.castShadow = true
  diagonalPart.receiveShadow = true
  scene.add(diagonalPart)
  boxes.push(diagonalPart)
}

const createNumber0 = () => {
  // 创建0的形状
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({
    color: 0x764ba2,
    metalness: 0.3,
    roughness: 0.2
  })
  
  // 顶部
  const top = new THREE.Mesh(geometry, material)
  top.position.x = 0
  top.position.y = 2
  top.scale.x = 3
  top.castShadow = true
  top.receiveShadow = true
  scene.add(top)
  boxes.push(top)
  
  // 右侧
  const right = new THREE.Mesh(geometry, material)
  right.position.x = 1.5
  right.position.y = 0
  right.scale.y = 4
  right.castShadow = true
  right.receiveShadow = true
  scene.add(right)
  boxes.push(right)
  
  // 底部
  const bottom = new THREE.Mesh(geometry, material)
  bottom.position.x = 0
  bottom.position.y = -2
  bottom.scale.x = 3
  bottom.castShadow = true
  bottom.receiveShadow = true
  scene.add(bottom)
  boxes.push(bottom)
  
  // 左侧
  const left = new THREE.Mesh(geometry, material)
  left.position.x = -1.5
  left.position.y = 0
  left.scale.y = 4
  left.castShadow = true
  left.receiveShadow = true
  scene.add(left)
  boxes.push(left)
}

const createParticles = () => {
  const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8)
  const particleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.5,
    roughness: 0.1
  })
  
  for (let i = 0; i < 100; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial)
    
    // 随机位置
    particle.position.x = (Math.random() - 0.5) * 30
    particle.position.y = (Math.random() - 0.5) * 30
    particle.position.z = (Math.random() - 0.5) * 30
    
    // 随机速度
    particle.velocity = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    }
    
    scene.add(particle)
    particles.push(particle)
  }
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  controls.update()
  
  // 旋转404数字的每个部分
  boxes.forEach((box, index) => {
    box.rotation.x += 0.005 * (index % 2 === 0 ? 1 : -1)
    box.rotation.y += 0.005 * (index % 3 === 0 ? 1 : -1)
  })
  
  // 更新粒子位置
  particles.forEach(particle => {
    particle.position.x += particle.velocity.x
    particle.position.y += particle.velocity.y
    particle.position.z += particle.velocity.z
    
    // 边界检查
    if (Math.abs(particle.position.x) > 15) particle.velocity.x *= -1
    if (Math.abs(particle.position.y) > 15) particle.velocity.y *= -1
    if (Math.abs(particle.position.z) > 15) particle.velocity.z *= -1
    
    // 轻微旋转
    particle.rotation.x += 0.01
    particle.rotation.y += 0.01
  })
  
  renderer.render(scene, camera)
}
</script>

<style scoped>
/* 全局样式重置，防止横向和竖向滚动 - 最高优先级 */
:deep(html),
:deep(body) {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
  margin: 0px !important;
  padding: 0px !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  box-sizing: border-box !important;
  position: fixed !important;
  top: 0px !important;
  left: 0px !important;
}

/* 确保所有元素都不会导致滚动 */
:deep(*) {
  box-sizing: border-box !important;
}

.not-found-container {
  position: relative !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 100vh !important;
  max-height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  box-sizing: border-box !important;
  padding: 0px !important;
  margin: 0px !important;
  min-width: 0px !important;
  position: fixed !important;
  top: 0px !important;
  left: 0px !important;
}

.three-container {
  position: absolute !important;
  top: 0px !important;
  left: 0px !important;
  width: 100% !important;
  height: 100% !important;
  max-height: 100% !important;
  z-index: 0 !important;
  overflow: hidden !important;
  padding: 0px !important;
  margin: 0px !important;
  min-width: 0px !important;
  box-sizing: border-box !important;
}

/* 确保Three.js画布不会溢出 - 最强样式控制 */
.three-container canvas {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: cover !important;
  position: absolute !important;
  top: 0px !important;
  left: 0px !important;
  padding: 0px !important;
  margin: 0px !important;
  border: none !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

.content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: 2rem;
  background: rgba(13, 17, 23, 0.7);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  max-width: 500px;
}

.title {
  font-size: 8rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  animation: float 3s ease-in-out infinite;
}

.subtitle {
  font-size: 2rem;
  font-weight: 700;
  margin: 1rem 0;
  color: #e6edf3;
}

.description {
  font-size: 1.1rem;
  color: #8b949e;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.home-button {
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 5rem;
  }
  
  .subtitle {
    font-size: 1.5rem;
  }
  
  .description {
    font-size: 1rem;
  }
  
  .home-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>