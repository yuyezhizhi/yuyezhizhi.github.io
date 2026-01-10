<template>
  <div ref="container" class="pyramid-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const container = ref(null);

// 核心Three.js对象
let scene, camera, renderer, pyramidGroup, particleSystem;
let animationId = null;
let originalPositions = null; // 存储原始位置

// 初始3D场景
const initScene = () => {
  if (!container.value) return;

  // 创建场景
  scene = new THREE.Scene();
  scene.background = null; // 透明背景

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
    camera.position.set(0, 3, 7);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 启用alpha通道
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.value.appendChild(renderer.domElement);
  
  // 创建金字塔
  createParticlePyramid();
  
  // 开始动画循环
  animate();
};

// 创建粒子金字塔
const createParticlePyramid = () => {
  pyramidGroup = new THREE.Group();
  
  const baseSize = 4;       // 金字塔基底大小
  const height = 8;         // 金字塔高度
  const particleCount = 3000; // 粒子数量

  // 创建粒子几何体
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  // 定义金字塔四个面的顶点
  const apex = new THREE.Vector3(0, height, 0);
  const baseVertices = [
    new THREE.Vector3(-baseSize, 0, -baseSize),
    new THREE.Vector3(baseSize, 0, -baseSize),
    new THREE.Vector3(baseSize, 0, baseSize),
    new THREE.Vector3(-baseSize, 0, baseSize)
  ];

  // 初始化粒子位置和颜色
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // 在金字塔表面随机分布粒子
    const face = Math.floor(Math.random() * 4);
    const basePoint1 = baseVertices[face];
    const basePoint2 = baseVertices[(face + 1) % 4];
    
    const t = Math.random(); // 从顶点到底边的插值因子
    const u = Math.random(); // 在底边上的位置因子
    
    // 计算粒子在金字塔面上的位置
    const x = (1 - t) * ((1 - u) * basePoint1.x + u * basePoint2.x) + t * apex.x;
    const y = (1 - t) * 0 + t * height;
    const z = (1 - t) * ((1 - u) * basePoint1.z + u * basePoint2.z) + t * apex.z;
    
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    
    // 基于高度设置颜色渐变（从蓝色到紫色到金色）
    const colorPos = y / height;
    const baseColor = new THREE.Color();
    
    if (colorPos < 0.33) {
      baseColor.lerpColors(
        new THREE.Color(0x00ffff), 
        new THREE.Color(0x4169e1), 
        colorPos * 3
      );
    } else if (colorPos < 0.66) {
      baseColor.lerpColors(
        new THREE.Color(0x4169e1), 
        new THREE.Color(0x9400d3), 
        (colorPos - 0.33) * 3
      );
    } else {
      baseColor.lerpColors(
        new THREE.Color(0x9400d3), 
        new THREE.Color(0xffd700), 
        (colorPos - 0.66) * 3
      );
    }
    
    colors[i3] = baseColor.r;
    colors[i3 + 1] = baseColor.g;
    colors[i3 + 2] = baseColor.b;
    
    // 随机粒子大小
    sizes[i] = Math.random() * 0.6 + 0.2;
  }

  // 设置几何体属性
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // 创建粒子材质
  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
  });

  // 创建粒子系统
  particleSystem = new THREE.Points(geometry, material);
  pyramidGroup.add(particleSystem);
  scene.add(pyramidGroup);
  
  // 保存原始位置
  originalPositions = positions.slice();
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);
  
  const time = Date.now() * 0.001;
  
  if (pyramidGroup) {
    // 整体缓慢旋转
    pyramidGroup.rotation.y = time * 0.2;
    
    // 粒子动画：螺旋上升效果
    const positions = particleSystem.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3;
      
      // 基于时间偏移创建波浪效果
      const waveFactor1 = Math.sin(time * 2 + i * 0.01) * 0.1;
      const waveFactor2 = Math.cos(time * 1.5 + i * 0.008) * 0.08;
      
      // 计算螺旋运动
      const angle = time + i * 0.005;
      const radius = 0.3 + Math.sin(i * 0.01) * 0.1;
      const spiralX = Math.cos(angle) * radius;
      const spiralZ = Math.sin(angle) * radius;
      
      // 应用动画效果
      positions.array[i3] = originalPositions[i3] + spiralX + waveFactor1;
      positions.array[i3 + 1] = originalPositions[i3 + 1] + Math.sin(time + i * 0.003) * 0.05;
      positions.array[i3 + 2] = originalPositions[i3 + 2] + spiralZ + waveFactor2;
    }
    
    positions.needsUpdate = true;
  }
  
  renderer.render(scene, camera);
};

// 响应窗口大小变化
const handleResize = () => {
  if (!container.value) return;
  
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};

// 处理全屏变化事件
const handleFullscreenChange = () => {
  // 延迟执行resize，确保DOM尺寸已更新
  setTimeout(() => {
    handleResize();
  }, 100);
};

// 组件生命周期
onMounted(() => {
  initScene();
  window.addEventListener('resize', handleResize);
  // 监听全屏变化事件
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', handleResize);
  // 移除全屏变化事件监听
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('msfullscreenchange', handleFullscreenChange);
  
  // 清理Three.js资源
  if (renderer) {
    renderer.dispose();
  }
  
  // 清理原始位置数组
  originalPositions = null;
});
</script>

<style scoped lang="less">
// 变量定义
@container-height: 200px;

.pyramid-container {
  height: @container-height;
  min-height: @container-height;
  max-height: @container-height;
  width: 100%;
  position: relative;
  overflow: hidden;
  
  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
}
</style>