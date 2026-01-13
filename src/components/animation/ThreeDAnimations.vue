<template>
  <div class="category-section">
    <h2 class="section-title animate__animated animate__slideInLeft">3D动画</h2>
    <div class="examples-container">
      <!-- 3D旋转立方体 -->
      <div class="example-item animate__animated animate__zoomIn">
        <div class="example-header">
          <h3>3D旋转立方体</h3>
          <div class="header-right">
            <span class="example-type">rotate</span>
            <button @click="toggleFullscreen('cube')" class="fullscreen-btn">
              <span v-if="!isFullscreen('cube')">全屏</span>
              <span v-else>退出全屏</span>
            </button>
          </div>
        </div>
        <div class="animation-demo">
          <div ref="cubeContainer" class="cube-container">
            <div class="cube">
              <div class="cube-face front">前</div>
              <div class="cube-face back">后</div>
              <div class="cube-face right">右</div>
              <div class="cube-face left">左</div>
              <div class="cube-face top">上</div>
              <div class="cube-face bottom">下</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D球体旋转 -->
      <div
        class="example-item animate__animated animate__zoomIn"
        style="animation-delay: 0.3s"
      >
        <div class="example-header">
          <h3>3D球体旋转</h3>
          <div class="header-right">
            <span class="example-type">sphere</span>
            <button @click="toggleFullscreen('sphere')" class="fullscreen-btn">
              <span v-if="!isFullscreen('sphere')">全屏</span>
              <span v-else>退出全屏</span>
            </button>
          </div>
        </div>
        <div class="animation-demo">
          <div ref="sphereContainer" class="sphere-container">
            <div class="sphere">
              <div class="sphere-layer"></div>
              <div class="sphere-layer layer2"></div>
              <div class="sphere-layer layer3"></div>
              <div class="sphere-layer layer4"></div>
              <div class="sphere-layer layer5"></div>
              <div class="sphere-layer layer6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D翻转卡片 -->
      <div
        class="example-item animate__animated animate__zoomIn"
        style="animation-delay: 0.6s"
      >
        <div class="example-header">
          <h3>3D翻转卡片</h3>
          <div class="header-right">
            <span class="example-type">flip</span>
            <button @click="toggleFullscreen('card')" class="fullscreen-btn">
              <span v-if="!isFullscreen('card')">全屏</span>
              <span v-else>退出全屏</span>
            </button>
          </div>
        </div>
        <div class="animation-demo">
          <div ref="cardContainer" class="card-container" @click="flipCard">
            <div class="card" :class="{ flipped: cardFlipped }">
              <div class="card-front">
                <h4>卡片正面</h4>
                <p>点击翻转</p>
              </div>
              <div class="card-back">
                <h4>卡片背面</h4>
                <p>3D翻转效果</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D金字塔 -->
      <div
        class="example-item animate__animated animate__zoomIn"
        style="animation-delay: 0.9s"
      >
        <div class="example-header">
          <h3>3D金字塔粒子</h3>
          <div class="header-right">
            <span class="example-type">pyramid</span>
            <button @click="toggleFullscreen('pyramid')" class="fullscreen-btn">
              <span v-if="!isFullscreen('pyramid')">全屏</span>
              <span v-else>退出全屏</span>
            </button>
          </div>
        </div>
        <div class="animation-demo">
          <div ref="pyramidContainer" class="pyramid-container">
            <GoldTempAnimation ref="pyramid" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoldTempAnimation from "./GoldTempAnimation.vue";
import * as THREE from 'three';

export default {
  name: "ThreeDAnimations",
  components: {
    GoldTempAnimation,
  },
  data() {
    return {
      cardFlipped: false,
      fullscreenElements: {},
      originalStyles: {}, // 保存原始样式
      threeJsScenes: {}, // 保存three.js场景对象
      handleFullscreenChangeHandler: null // 事件处理函数引用
    };
  },

  mounted() {
    // 创建事件处理函数引用，确保this指向Vue组件实例
    this.handleFullscreenChangeHandler = () => this.handleFullscreenChange();

    // 监听所有全屏变化事件
    document.addEventListener("fullscreenchange", this.handleFullscreenChangeHandler);
    document.addEventListener("webkitfullscreenchange", this.handleFullscreenChangeHandler);
    document.addEventListener("mozfullscreenchange", this.handleFullscreenChangeHandler);
    document.addEventListener("msfullscreenchange", this.handleFullscreenChangeHandler);
  },

  beforeUnmount() {
    // 清理所有全屏事件监听
    document.removeEventListener("fullscreenchange", this.handleFullscreenChangeHandler);
    document.removeEventListener("webkitfullscreenchange", this.handleFullscreenChangeHandler);
    document.removeEventListener("mozfullscreenchange", this.handleFullscreenChangeHandler);
    document.removeEventListener("msfullscreenchange", this.handleFullscreenChangeHandler);

    // 确保退出所有全屏
    this.exitAllFullscreen();
    
    // 清理所有Three.js场景
    Object.keys(this.threeJsScenes).forEach(type => {
      this.cleanup3DScene(type);
    });
  },

  methods: {
    flipCard() {
      this.cardFlipped = !this.cardFlipped;
    },

    // 检查是否处于全屏状态
    isFullscreen(type) {
      return !!this.fullscreenElements[type];
    },

    // 切换全屏
    async toggleFullscreen(type) {
      if (this.isFullscreen(type)) {
        await this.exitFullscreen(type);
      } else {
        await this.enterFullscreen(type);
      }
    },

    // 进入全屏
    async enterFullscreen(type) {
      // 1. 验证输入和状态
      if (this.isFullscreen(type)) return;
      
      const containerRef = this.$refs[`${type}Container`];
      if (!containerRef) {
        console.error(`找不到容器: ${type}Container`);
        return;
      }

      try {
        // 2. 先退出所有其他全屏
        await this.exitAllFullscreen();

        // 3. 保存原始状态
        this.saveOriginalState(type, containerRef);

        // 4. 尝试进入浏览器全屏
        await this.requestBrowserFullscreen(containerRef);

        // 5. 根据类型初始化全屏内容
        if (type === 'cube' || type === 'sphere') {
          this.initThreeJsFullscreen(type, containerRef);
        } else {
          this.initDefaultFullscreen(containerRef);
        }

      } catch (error) {
        console.error("进入全屏失败:", error);
        // 出错时恢复原始状态
        this.cleanupAndRestore(type);
      }
    },

    // 退出全屏
    async exitFullscreen(type) {
      // 1. 验证输入和状态
      if (!this.isFullscreen(type)) return;

      const containerRef = this.fullscreenElements[type];
      if (!containerRef) {
        console.error(`找不到全屏元素: ${type}`);
        this.clearFullscreenRecords(type);
        return;
      }

      try {
        // 2. 检查并退出浏览器全屏
        await this.exitBrowserFullscreenIfActive();
      } catch (error) {
        console.error("退出浏览器全屏失败:", error);
        // 即使退出浏览器全屏失败，也要继续执行清理操作
      } finally {
        // 3. 无论如何都要清理和恢复
        this.cleanupAndRestore(type);
      }
    },

    // 保存原始状态
    saveOriginalState(type, containerRef) {
      // 记录全屏元素
      this.fullscreenElements[type] = containerRef;
      
      // 保存原始状态
      this.originalStyles[type] = {
        content: containerRef.innerHTML,
        className: containerRef.className,
        style: containerRef.style.cssText
      };
    },

    // 请求浏览器全屏
    async requestBrowserFullscreen(element) {
      const requestMethods = [
        'requestFullscreen',
        'webkitRequestFullscreen',
        'mozRequestFullScreen',
        'msRequestFullscreen'
      ];

      for (const method of requestMethods) {
        if (typeof element[method] === 'function') {
          await element[method]();
          return;
        }
      }

      throw new Error('浏览器不支持全屏API');
    },

    // 退出浏览器全屏（如果当前处于全屏状态）
    async exitBrowserFullscreenIfActive() {
      if (!this.isAnyElementFullscreen()) return;

      const exitMethods = [
        'exitFullscreen',
        'webkitExitFullscreen',
        'mozCancelFullScreen',
        'msExitFullscreen'
      ];

      for (const method of exitMethods) {
        if (typeof document[method] === 'function') {
          await document[method]();
          return;
        }
      }

      throw new Error('浏览器不支持退出全屏API');
    },

    // 检查是否有任何元素处于全屏状态
    isAnyElementFullscreen() {
      return !!(document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement);
    },

    // 初始化Three.js全屏内容
    initThreeJsFullscreen(type, containerRef) {
      // 清空容器
      containerRef.innerHTML = '';
      
      // 初始化Three.js场景
      const sceneData = this.init3DScene(type);
      if (sceneData) {
        // 将canvas添加到容器
        containerRef.appendChild(sceneData.renderer.domElement);
        
        // 保存场景数据
        this.threeJsScenes[type] = sceneData;
      }
    },

    // 初始化默认全屏内容
    initDefaultFullscreen(containerRef) {
      containerRef.classList.add('fullscreen-active');
    },

    // 清理和恢复原始状态
    cleanupAndRestore(type) {
      // 清理Three.js场景
      this.cleanup3DScene(type);
      
      // 恢复原始状态
      this.restoreOriginalState(type);
      
      // 清除记录
      this.clearFullscreenRecords(type);
    },

    // 恢复原始状态
    restoreOriginalState(type) {
      if (!this.originalStyles[type]) return;

      const containerRef = this.fullscreenElements[type];
      if (!containerRef) return;

      const originalState = this.originalStyles[type];
      
      // 恢复原始内容、类名和样式
      containerRef.innerHTML = originalState.content;
      containerRef.className = originalState.className;
      containerRef.style.cssText = originalState.style;
      
      // 确保非全屏动画能够正确重新应用
      // 使用更可靠的方法强制浏览器重新触发动画
      const animations = Array.from(containerRef.querySelectorAll('*')).filter(el => 
        el.style.animation || window.getComputedStyle(el).animationName !== 'none'
      );
      
      // 重置动画
      animations.forEach(el => {
        const style = window.getComputedStyle(el);
        const animation = style.animation;
        
        el.style.animation = 'none';
        void el.offsetWidth; // 强制重排
        
        // 恢复动画
        el.style.animation = animation;
      });
    },

    // 清除全屏记录
    clearFullscreenRecords(type) {
      delete this.fullscreenElements[type];
      delete this.originalStyles[type];
    },

    // 退出所有全屏
    async exitAllFullscreen() {
      const types = Object.keys(this.fullscreenElements);
      for (const type of types) {
        await this.exitFullscreen(type);
      }
    },

    // 初始化3D场景
    init3DScene(type) {
      if (this.threeJsScenes[type]) {
        this.cleanup3DScene(type);
      }
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0.9);
      
      // 创建几何体
      let geometry, material, mesh;
      let animationId = null;
      
      if (type === 'cube') {
        geometry = new THREE.BoxGeometry(2, 2, 2);
        
        // 创建带文字的材质
        const createTextMaterial = (color, text) => {
          // 创建canvas
          const canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 256;
          const context = canvas.getContext('2d');
          
          // 填充背景色
          context.fillStyle = color;
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          // 设置文字样式
          context.font = 'bold 60px Arial';
          context.fillStyle = '#000';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          
          // 绘制文字
          context.fillText(text, canvas.width / 2, canvas.height / 2);
          
          // 创建纹理
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          
          // 返回材质
          return new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
        };
        
        const materials = [
          createTextMaterial('#ff6b6b', '前'), // 前
          createTextMaterial('#4ecdc4', '后'), // 后
          createTextMaterial('#45b7d1', '右'), // 右
          createTextMaterial('#ffe66d', '左'), // 左
          createTextMaterial('#96ceb4', '上'), // 上
          createTextMaterial('#feca57', '下')  // 下
        ];
        mesh = new THREE.Mesh(geometry, materials);
      } else if (type === 'sphere') {
        geometry = new THREE.SphereGeometry(1.5, 32, 32);
        material = new THREE.MeshBasicMaterial({ color: 0x3498db, wireframe: true, transparent: true, opacity: 0.7 });
        mesh = new THREE.Mesh(geometry, material);
      } else {
        return null;
      }
      
      scene.add(mesh);
      camera.position.z = 5;
      
      // 动画循环
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        mesh.rotation.x += 0.03;
        mesh.rotation.y += 0.03;
        renderer.render(scene, camera);
      };
      
      animate();
      
      return { scene, camera, renderer, mesh, animationId };
    },
    
    // 清理3D场景
    cleanup3DScene(type) {
      const sceneData = this.threeJsScenes[type];
      if (!sceneData) return;
      
      // 停止动画循环
      if (sceneData.animationId) {
        cancelAnimationFrame(sceneData.animationId);
      }
      
      // 安全地清理资源，确保对象存在
      if (sceneData.renderer) {
        sceneData.renderer.dispose();
        // 移除canvas元素
        if (sceneData.renderer.domElement && sceneData.renderer.domElement.parentNode) {
          sceneData.renderer.domElement.parentNode.removeChild(sceneData.renderer.domElement);
        }
      }
      
      if (sceneData.geometry) {
        sceneData.geometry.dispose();
      }
      
      // 清理材质和纹理
      if (sceneData.material) {
        // 先清理纹理
        if (sceneData.material.map) {
          sceneData.material.map.dispose();
        }
        // 再清理材质
        sceneData.material.dispose();
      } else if (sceneData.mesh && Array.isArray(sceneData.mesh.material)) {
        sceneData.mesh.material.forEach(material => {
          // 先清理每个材质的纹理
          if (material.map) {
            material.map.dispose();
          }
          // 再清理材质
          material.dispose();
        });
      }
      
      delete this.threeJsScenes[type];
    },
    
    // 处理全屏变化事件
    handleFullscreenChange() {
      // 如果没有任何元素处于全屏状态，清除所有记录并恢复样式
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        // 恢复所有原始样式
    Object.keys(this.originalStyles).forEach((type) => {
      this.restoreOriginalState(type);
    });

        // 清除所有记录
        this.fullscreenElements = {};
        this.originalStyles = {};
      }
    },
  },
};
</script>

<style scoped lang="less">
// 变量定义
@text-color: #333;
@bg-color: #ffffff;
@border-radius: 8px;
@transition: all 0.3s ease;
@cube-size: 120px;
@sphere-size: 120px;
@card-width: 150px;
@card-height: 100px;

/* 3D动画容器 */
.category-section {
  width: 100%;

  .section-title {
    color: @text-color;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
  }
}

.examples-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

/* 动画示例项 */
.example-item {
  background: @bg-color;
  border-radius: @border-radius;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: @transition;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  .example-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      color: @text-color;
      font-size: 1.2rem;
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;

      .example-type {
        background-color: #f0f0f0;
        color: #666;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
      }

      /* 全屏按钮 */
      .fullscreen-btn {
        padding: 6px 12px;
        background-color: #42b883;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: @transition;
        font-size: 0.8rem;

        &:hover {
          background-color: #35495e;
        }
      }
    }
  }

  /* 动画演示区域 */
  .animation-demo {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px;
    perspective-origin: center;
  }
}

/* 立方体样式 */
.cube-container {
  width: @cube-size;
  height: @cube-size;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate3D 10s infinite linear;

  .cube {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;

    .cube-face {
      position: absolute;
      width: @cube-size;
      height: @cube-size;
      border: 2px solid @text-color;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      font-weight: bold;
      opacity: 0.8;

      &.front {
        background-color: #ff6b6b;
        transform: translateZ((@cube-size / 2));
      }

      &.back {
        background-color: #4ecdc4;
        transform: translateZ((-@cube-size / 2)) rotateY(180deg);
      }

      &.right {
        background-color: #45b7d1;
        transform: translateX((@cube-size / 2)) rotateY(90deg);
      }

      &.left {
        background-color: #ffe66d;
        transform: translateX((-@cube-size / 2)) rotateY(-90deg);
      }

      &.top {
        background-color: #96ceb4;
        transform: translateY((-@cube-size / 2)) rotateX(90deg);
      }

      &.bottom {
        background-color: #feca57;
        transform: translateY((@cube-size / 2)) rotateX(-90deg);
      }
    }
  }
}

/* 球体样式 */
.sphere-container {
  width: @sphere-size;
  height: @sphere-size;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate3D 8s infinite linear;

  .sphere {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;

    .sphere-layer {
      position: absolute;
      width: @sphere-size;
      height: @sphere-size;
      border: 3px solid #3498db;
      border-radius: 50%;
      opacity: 0.7;

      &.layer2 {
        transform: rotateY(30deg);
      }
      &.layer3 {
        transform: rotateY(60deg);
      }
      &.layer4 {
        transform: rotateY(90deg);
      }
      &.layer5 {
        transform: rotateY(120deg);
      }
      &.layer6 {
        transform: rotateY(150deg);
      }
    }
  }
}

/* 翻转卡片样式 */
.card-container {
  width: @card-width;
  height: @card-height;
  position: relative;
  perspective: 1000px;
  cursor: pointer;

  .card {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    transition: transform 0.6s ease;

    &.flipped {
      transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: @border-radius;
      color: white;
      font-weight: bold;

      h4 {
        margin: 0 0 5px 0;
        font-size: 1rem;
      }

      p {
        margin: 0;
        font-size: 0.8rem;
        opacity: 0.9;
      }
    }

    .card-front {
      background-color: #2ecc71;
    }

    .card-back {
      background-color: #e74c3c;
      transform: rotateY(180deg);
    }
  }
}

/* 金字塔容器样式 */
.pyramid-container {
  width: 100%;
  height: 100%;
  position: relative;
}


/* 通用3D旋转动画 */
@keyframes rotate3D {
  from {
    transform: rotateX(0deg) rotateY(0deg);
  }
  to {
    transform: rotateX(360deg) rotateY(360deg);
  }
}
</style>