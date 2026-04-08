<template>
  <div class="rain-text-container">
    <div id="rain-text-canvas"></div>
  </div>
</template>

<script>
import p5 from 'p5';

export default {
  name: "RainText",
  data() {
    return {
      p5Instance: null
    };
  },
  mounted() {
    this.initP5();
  },
  beforeUnmount() {
    if (this.p5Instance) {
      this.p5Instance.remove();
    }
  },
  methods: {
    initP5() {
      this.p5Instance = new p5((p) => {
        let rainDrops = [];
        const textArray = "生活是一场旅程，每一步都值得珍惜。阳光总在风雨后，相信未来会更好。慢慢来，一切都会好起来的。生活中的小确幸，是最珍贵的财富。保持初心，热爱生活。".split('');
        const fontSizes = [16, 18, 20, 24, 28];
        const colors = [
          [255, 99, 132],   // 红色
          [54, 162, 235],   // 蓝色
          [255, 206, 86],   // 黄色
          [75, 192, 192],   // 青色
          [153, 102, 255],  // 紫色
          [255, 159, 64],   // 橙色
          [199, 199, 199],  // 灰色
          [83, 102, 255],   // 蓝紫色
          [255, 99, 255],   // 粉红色
          [99, 255, 132]    // 绿色
        ];
        
        // 横条属性
        let bar = {
          x: 0,
          y: 0,
          width: 300,
          height: 10,
          visible: false
        };
        
        // 鼠标位置
        let mousePos = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        };
        
        p.setup = () => {
          const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
          canvas.parent('rain-text-canvas');
          p.textAlign(p.CENTER, p.CENTER);
          
          // 初始化雨滴
          for (let i = 0; i < 100; i++) {
            const color = colors[Math.floor(p.random(colors.length))];
            rainDrops.push({
              x: p.random(p.width),
              y: p.random(-1000, -100),
              speed: p.random(2, 8),
              size: p.random(...fontSizes),
              char: textArray[Math.floor(p.random(textArray.length))],
              color: color,
              opacity: p.random(0.5, 1),
              onBar: false,
              slideDirection: 0, // -1 向左，1 向右
              slideSpeed: 0
            });
          }
        };
        
        p.draw = () => {
          p.background(245, 245, 245);
          
          // 更新横条位置，跟随鼠标
          bar.x = mousePos.x - bar.width / 2;
          bar.y = mousePos.y;
          
          // 绘制横条（可选）
          if (bar.visible) {
            p.fill(0, 100);
            p.rect(bar.x, bar.y, bar.width, bar.height);
          }
          
          rainDrops.forEach(drop => {
            // 检查是否在横条上
            if (!drop.onBar && drop.y + drop.size / 2 >= bar.y && drop.y - drop.size / 2 <= bar.y + bar.height && drop.x >= bar.x && drop.x <= bar.x + bar.width) {
              // 碰到横条，开始滑落
              drop.onBar = true;
              drop.y = bar.y;
              // 随机决定滑落方向
              drop.slideDirection = Math.random() > 0.5 ? 1 : -1;
              drop.slideSpeed = p.random(1, 3);
            }
            
            if (drop.onBar) {
              // 沿横条滑落
              drop.x += drop.slideDirection * drop.slideSpeed;
              
              // 滑落出横条后，继续下落
              if (drop.x < bar.x || drop.x > bar.x + bar.width) {
                drop.onBar = false;
                drop.slideDirection = 0;
                drop.slideSpeed = 0;
              }
            } else {
              // 正常下落
              drop.y += drop.speed;
            }
            
            // 绘制文字
            p.fill(drop.color[0], drop.color[1], drop.color[2], drop.opacity * 255);
            p.textSize(drop.size);
            p.text(drop.char, drop.x, drop.y);
            
            // 重置雨滴
            if (drop.y > p.height) {
              drop.y = p.random(-100, -50);
              drop.x = p.random(p.width);
              drop.speed = p.random(2, 8);
              drop.size = p.random(...fontSizes);
              drop.char = textArray[Math.floor(p.random(textArray.length))];
              drop.color = colors[Math.floor(p.random(colors.length))];
              drop.opacity = p.random(0.5, 1);
              drop.onBar = false;
              drop.slideDirection = 0;
              drop.slideSpeed = 0;
            }
          });
        };
        
        p.windowResized = () => {
          p.resizeCanvas(window.innerWidth, window.innerHeight);
        };
        
        // 鼠标移动事件
        p.mouseMoved = () => {
          mousePos.x = p.mouseX;
          mousePos.y = p.mouseY;
        };
      });
    }
  }
};
</script>

<style scoped>
.rain-text-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  
  #rain-text-canvas {
    width: 100%;
    height: 100%;
  }
}
</style>