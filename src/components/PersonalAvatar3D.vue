<template>
  <div ref="container" class="personal-avatar-3d"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const container = ref(null);

// 核心Three.js对象
let scene, camera, renderer, controls, avatarGroup;
let animationId = null;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

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
  camera.position.set(0, 2, 8);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 启用alpha通道
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.value.appendChild(renderer.domElement);
  
  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  
  // 创建头像
  createAvatar();
  
  // 添加光源
  addLights();
  
  // 添加鼠标交互
  addMouseInteraction();
  
  // 开始动画循环
  animate();
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
};

// 创建史蒂夫形象
const createAvatar = () => {
  avatarGroup = new THREE.Group();
  
  // 史蒂夫各部分颜色
  const skinColor = 0xffdbac;
  const hairColor = 0x3c2f2f;
  const eyeWhiteColor = 0xffffff;
  const eyePupilColor = 0x47378F;
  const shirtColor = 0x1180c7;
  const pantsColor = 0x462066;
  const shoeColor = 0x333333;
  
  // 1. 创建头部
  const headGeometry = new THREE.BoxGeometry(3, 2, 2);
  const headMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  avatarGroup.add(head);
  
  // 2. 创建头发
  const hairGeometry = new THREE.BoxGeometry(3, 0.8, 2);
  const hairMaterial = new THREE.MeshStandardMaterial({ color: hairColor });
  const hair = new THREE.Mesh(hairGeometry, hairMaterial);
  hair.position.set(0, 1.4, 0);
  avatarGroup.add(hair);
  
  // 添加侧边头发
  const sideHairGeometry = new THREE.BoxGeometry(0.1, 1, 1.6);
  
  // 左侧头发
  const leftSideHair = new THREE.Mesh(sideHairGeometry, hairMaterial);
  leftSideHair.position.set(-1.55, 1.0, 0);
  avatarGroup.add(leftSideHair);
  
  // 右侧头发
  const rightSideHair = new THREE.Mesh(sideHairGeometry, hairMaterial);
  rightSideHair.position.set(1.55, 1.0, 0);
  avatarGroup.add(rightSideHair);
  
  // 前面头发
  const frontHairGeometry = new THREE.BoxGeometry(1.8, 0.2, 0.8);
  const frontHair = new THREE.Mesh(frontHairGeometry, hairMaterial);
  frontHair.position.set(0, 1.3, -0.6);
  avatarGroup.add(frontHair);
  
  // 3. 创建面部特征
  // 眼睛
  const eyeWhiteGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({ color: eyeWhiteColor });
  
  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
  leftEyeWhite.position.set(-0.8, 0.5, 1.1);
  avatarGroup.add(leftEyeWhite);
  
  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
  rightEyeWhite.position.set(0.8, 0.5, 1.1);
  avatarGroup.add(rightEyeWhite);
  
  // 瞳孔
  const pupilGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: eyePupilColor });
  
  const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  leftPupil.position.set(-0.5, 0.5, 1.1);
  avatarGroup.add(leftPupil);
  
  const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  rightPupil.position.set(0.5, 0.5, 1.1);
  avatarGroup.add(rightPupil);
  
  // 添加鼻子
  const noseGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.1);
  const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xcc8855 });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(0, 0.1, 1.1);
  avatarGroup.add(nose);
  
  // 嘴巴
  const mouthGeometry = new THREE.BoxGeometry(1, 0.4, 0.1);
  const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
  mouth.position.set(0, -0.3, 1.1);
  avatarGroup.add(mouth);
  
  // 4. 创建身体
  const bodyGeometry = new THREE.BoxGeometry(2.4, 2.8, 1.2);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: shirtColor });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.set(0, -3.2, 0);
  avatarGroup.add(body);
  
  // 5. 创建手臂
  const armGeometry = new THREE.BoxGeometry(0.8, 2.8, 0.8);
  const armMaterial = new THREE.MeshStandardMaterial({ color: skinColor });
  
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(-1.9, -3.2, 0);
  avatarGroup.add(leftArm);
  
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(1.9, -3.2, 0);
  avatarGroup.add(rightArm);
  
  // 6. 创建裤子
  const pantsGeometry = new THREE.BoxGeometry(2.4, 2.4, 1.2);
  const pantsMaterial = new THREE.MeshStandardMaterial({ color: pantsColor });
  const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
  pants.position.set(0, -5.0, 0);
  avatarGroup.add(pants);
  
  // 7. 创建腿部
  const legGeometry = new THREE.BoxGeometry(0.8, 2.4, 0.8);
  const legMaterial = new THREE.MeshStandardMaterial({ color: pantsColor });
  
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-0.8, -5.2, 0);
  avatarGroup.add(leftLeg);
  
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(0.8, -5.2, 0);
  avatarGroup.add(rightLeg);
  
  // 8. 创建鞋子
  const shoeGeometry = new THREE.BoxGeometry(0.9, 0.6, 0.9);
  const shoeMaterial = new THREE.MeshStandardMaterial({ color: shoeColor });
  
  const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
  leftShoe.position.set(-0.8, -6.5, 0);
  avatarGroup.add(leftShoe);
  
  const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
  rightShoe.position.set(0.8, -6.5, 0);
  avatarGroup.add(rightShoe);
  
  // 9. 创建旋转光环
  const ringGeometry = new THREE.TorusGeometry(6, 0.2, 16, 100);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x4ecdc4,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  avatarGroup.add(ring);
  
  scene.add(avatarGroup);
};

// 添加光源
const addLights = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // 方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);
  
  // 点光源
  const pointLight = new THREE.PointLight(0x4ecdc4, 1, 100);
  pointLight.position.set(0, 0, 10);
  scene.add(pointLight);
};

// 添加鼠标交互
const addMouseInteraction = () => {
  container.value.addEventListener('mousemove', (event) => {
    const rect = container.value.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // 计算目标旋转角度
    targetRotationX = mouseY * 0.5;
    targetRotationY = mouseX * 0.5;
  });
  
  container.value.addEventListener('mouseleave', () => {
    // 鼠标离开时恢复初始旋转
    targetRotationX = 0;
    targetRotationY = 0;
  });
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);
  
  // 平滑过渡旋转
  avatarGroup.rotation.x += (targetRotationX - avatarGroup.rotation.x) * 0.1;
  avatarGroup.rotation.y += (targetRotationY - avatarGroup.rotation.y) * 0.1;
  
  // 光环旋转
  avatarGroup.children[avatarGroup.children.length - 1].rotation.z += 0.02;
  
  // 更新控制器
  if (controls) {
    controls.update();
  }
  
  // 渲染场景
  renderer.render(scene, camera);
};

// 处理窗口大小变化
const handleResize = () => {
  if (!container.value || !camera || !renderer) return;
  
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
};

// 组件挂载时初始化
onMounted(() => {
  initScene();
});

// 组件卸载时清理
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  if (controls) {
    controls.dispose();
  }
  
  if (renderer) {
    renderer.dispose();
    if (container.value && renderer.domElement) {
      container.value.removeChild(renderer.domElement);
    }
  }
  
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.personal-avatar-3d {
  width: 100%;
  height: 400px;
  cursor: grab;
}

.personal-avatar-3d:active {
  cursor: grabbing;
}
</style>