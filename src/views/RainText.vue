<template>
  <div class="rain-text-container">
    <div id="rain-text-canvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const p5Instance = ref(null);
const p5 = ref(null);
let isMounted = true;

onMounted(() => {
  // 动态导入p5.js，减少首屏加载时间
  import('p5')
    .then((module) => {
      if (!isMounted) return;
      p5.value = module.default;
      initP5();
    })
    .catch((err) => {
      console.error('Failed to load p5:', err);
    });
});

onBeforeUnmount(() => {
  isMounted = false;
  if (p5Instance.value) {
    p5Instance.value.remove();
    p5Instance.value = null;
  }
});

function initP5() {
  p5Instance.value = new p5.value((p) => {
    let rainDrops = [];
    let splashes = []; // 水花效果数组
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
    
    // 雨伞属性（跟随鼠标）
    let umbrella = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 150,
      handleLength: 80,  // 伞柄长度
      visible: true  // 显示雨伞
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
          bounceTime: 0,
          bounceDir: 0
        });
      }
    };
    
    // 绘制雨伞
    function drawUmbrella() {
      if (!umbrella.visible) return;
      
      p.push();
      p.translate(umbrella.x, umbrella.y);
      
      // 绘制伞面（半圆形）
      p.noFill();
      p.stroke(100, 100, 100, 200);
      p.strokeWeight(3);
      p.arc(0, 0, umbrella.radius * 2, umbrella.radius * 2, p.PI, 0);
      
      // 绘制伞骨线条（增加细节）
      p.strokeWeight(1.5);
      for (let angle = p.PI; angle <= 0; angle += p.PI / 8) {
        let x = umbrella.radius * Math.cos(angle);
        let y = umbrella.radius * Math.sin(angle);
        p.line(0, 0, x, y);
      }
      
      // 绘制伞柄
      p.stroke(80, 80, 80, 220);
      p.strokeWeight(4);
      p.line(0, 0, 0, umbrella.handleLength);
      
      // 绘制伞柄弯钩
      p.noFill();
      p.strokeWeight(3);
      p.arc(-15, umbrella.handleLength, 30, 30, 0, p.PI);
      
      p.pop();
    }
    
    // 创建水花效果
    function createSplash(x, y, color) {
      for (let i = 0; i < 5; i++) {
        splashes.push({
          x: x,
          y: y,
          vx: p.random(-2, 2),
          vy: p.random(-3, -1),
          life: 30,
          maxLife: 30,
          color: color,
          size: p.random(2, 5)
        });
      }
    }
    
    // 更新和绘制水花
    function updateSplashes() {
      for (let i = splashes.length - 1; i >= 0; i--) {
        let s = splashes[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.15; // 重力
        s.life--;
        
        let alpha = (s.life / s.maxLife) * 255;
        p.fill(s.color[0], s.color[1], s.color[2], alpha);
        p.noStroke();
        p.ellipse(s.x, s.y, s.size, s.size);
        
        if (s.life <= 0) {
          splashes.splice(i, 1);
        }
      }
    }
    
    p.draw = () => {
      p.background(245, 245, 245);

      // 隐藏鼠标
      p.noCursor();

      // 雨伞跟随鼠标
      umbrella.x = p.mouseX;
      umbrella.y = p.mouseY;
      
      // 先绘制雨伞
      drawUmbrella();
      
      rainDrops.forEach(drop => {
        if (!drop.onBar) {
          // 计算雨滴下一个位置
          let nextY = drop.y + drop.speed;

          // 检查下一个位置是否会碰到雨伞（半圆弧线）
          let dx = drop.x - umbrella.x;
          let dy = nextY - umbrella.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          // 检查是否在半圆内（只考虑上半部分）
          let willCollide = distance <= umbrella.radius && dy <= 0;

          if (willCollide) {
            // 碰到雨伞，弹开后继续下落
            drop.onBar = true;
            drop.bounceTime = 40;

            // 计算反弹方向（向左或向右弹开）
            if (dx !== 0) {
              drop.bounceDir = dx > 0 ? 1 : -1;
            } else {
              drop.bounceDir = Math.random() > 0.5 ? 1 : -1;
            }

            // 计算落点在伞面的位置
            let angle = Math.atan2(dy, dx);
            drop.x = umbrella.x + umbrella.radius * Math.cos(angle);
            drop.y = umbrella.y + umbrella.radius * Math.sin(angle);
            
            // 创建水花效果
            createSplash(drop.x, drop.y, drop.color);
          } else {
            // 如果不会碰到雨伞，就正常下落
            drop.y = nextY;
          }
        } else {
          // 处理弹开效果
          if (drop.bounceTime > 0) {
            drop.bounceTime--;
            // 向外弹开，横向移动，竖向保持原速度
            drop.x += drop.bounceDir * (drop.bounceTime * 0.08);
            drop.y += drop.speed;
          } else {
            // 弹开后继续下落
            drop.onBar = false;
            drop.bounceTime = 0;
            drop.bounceDir = 0;
          }
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
          drop.bounceTime = 0;
          drop.bounceDir = 0;
        }
      });
      
      // 更新和绘制水花
      updateSplashes();
    };
    
    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  });
}
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

/* 响应式设计 */
@media (max-width: 768px) {
  .rain-text-container {
    #rain-text-canvas {
      width: 100%;
      height: 100%;
    }
  }
}

@media (max-width: 480px) {
  .rain-text-container {
    #rain-text-canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>