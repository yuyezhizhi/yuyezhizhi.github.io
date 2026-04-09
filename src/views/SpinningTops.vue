<template>
  <div class="spinning-tops-container">
    <div id="spinning-tops-canvas"></div>
  </div>
</template>

<script>
import p5 from 'p5';

export default {
  name: "SpinningTops",
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
        let top1, top2, sparks = [];
        let mouseTrail = []; // 鼠标拖尾
        const maxTrailLength = 20; // 最大拖尾长度
        
        class Spark {
          constructor(x, y, vx, vy, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.color = color;
            this.life = 255;
            this.size = 10; // 增大火花大小
            this.brightness = 1; // 初始亮度
            this.trail = []; // 拖尾效果
          }
          
          update() {
            // 记录轨迹点
            this.trail.push({x: this.x, y: this.y, life: this.life});
            if (this.trail.length > 15) { // 增加拖尾长度
              this.trail.shift();
            }
            
            // 直线运动，不向下掉
            this.x += this.vx;
            this.y += this.vy;
            
            // 逐渐减速
            this.vx *= 0.98;
            this.vy *= 0.98;
            
            this.life -= 2; // 减慢生命周期减少速度，让火花持续时间更长
            this.size *= 0.97; // 减慢大小减小速度
            this.brightness = this.life / 255; // 亮度随生命值减少
          }
          
          display() {
            // 绘制拖尾效果
            for (let i = 0; i < this.trail.length; i++) {
              const point = this.trail[i];
              const trailBrightness = point.life / 255;
              const r = Math.min(255, this.color[0] + 100 * trailBrightness);
              const g = Math.min(255, this.color[1] + 100 * trailBrightness);
              const b = Math.min(255, this.color[2] + 100 * trailBrightness);
              p.fill(r, g, b, point.life);
              p.noStroke();
              const trailSize = this.size * (i / this.trail.length);
              p.ellipse(point.x, point.y, trailSize);
            }
            
            // 绘制火花主体
            const r = Math.min(255, this.color[0] + 100 * this.brightness);
            const g = Math.min(255, this.color[1] + 100 * this.brightness);
            const b = Math.min(255, this.color[2] + 100 * this.brightness);
            p.fill(r, g, b, this.life);
            p.noStroke();
            p.ellipse(this.x, this.y, this.size);
          }
          
          isDead() {
            return this.life <= 0;
          }
        }
        
        class Top {
          constructor(x, y, radius, color, speed) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.angle = 0;
            this.speed = speed;
            this.vx = 0;
            this.vy = 0;
            this.isSpinning = true;
            this.lights = []; // 边缘亮点
            this.lightTrails = []; // 亮点拖尾
            
            // 初始化边缘亮点，使用亮色，调大一倍
            const colors = [
              [255, 100, 100], [100, 255, 100], [100, 100, 255], [255, 255, 100], [255, 100, 255], [100, 255, 255],
              [255, 200, 100], [200, 100, 200], [100, 200, 200], [200, 200, 100]
            ];
            
            for (let i = 0; i < 20; i++) {
              const angle = (i / 20) * Math.PI * 2;
              const x = Math.cos(angle) * this.radius;
              const y = Math.sin(angle) * this.radius;
              const color = colors[i % colors.length]; // 使用彩色
              this.lights.push({x, y, angle, opacity: 1, size: 6, color}); // 调大一倍
            }
          }
          
          update() {
            // 即使停止旋转，也要更新位置和处理边界碰撞
            this.x += this.vx;
            this.y += this.vy;
            
            // 边界碰撞
            if (this.x - this.radius < 0) {
              this.x = this.radius;
              this.vx *= -0.8;
            }
            if (this.x + this.radius > p.width) {
              this.x = p.width - this.radius;
              this.vx *= -0.8;
            }
            if (this.y - this.radius < 0) {
              this.y = this.radius;
              this.vy *= -0.8;
            }
            if (this.y + this.radius > p.height) {
              this.y = p.height - this.radius;
              this.vy *= -0.8;
            }
            
            if (this.isSpinning) {
              this.angle += this.speed;
              
              // 减速（减慢减速速度，使陀螺能转更长时间）
              this.speed *= 0.9999;
              this.vx *= 0.995;
              this.vy *= 0.995;
              
              if (Math.abs(this.speed) < 0.001) {
                this.isSpinning = false;
              }
              
              // 更新边缘亮点
              this.lights.forEach(light => {
                // 亮点直接跟随陀螺的速度，而不是自己旋转
                // 保持稳定的亮度，不闪动
                light.opacity = 0.8; // 更亮
                light.size = 6; // 调大一倍，保持稳定大小
                
                // 添加拖尾效果，增强残影效果
                this.lightTrails.push({
                  x: light.x,
                  y: light.y,
                  opacity: light.opacity * 0.6,
                  size: light.size * 0.8,
                  life: 30, // 延长生命周期，增强残影效果
                  color: light.color // 拖尾也使用彩色
                });
              });
              
              // 更新亮点拖尾
              for (let i = this.lightTrails.length - 1; i >= 0; i--) {
                const trail = this.lightTrails[i];
                trail.opacity *= 0.85; // 减慢透明度降低速度，增强残影效果
                trail.size *= 0.98; // 减慢大小减小速度
                trail.life--;
                
                if (trail.life <= 0) {
                  this.lightTrails.splice(i, 1);
                }
              }
            } else {
              // 即使停止旋转，也要逐渐减速
              this.vx *= 0.995;
              this.vy *= 0.995;
            }
          }
          
          display() {
            p.push();
            p.translate(this.x, this.y);
            p.rotate(this.angle);
                      
            // 绘制陀螺主体
            // 立体浮雕效果:使用渐变填充(半透明)
            const gradient = p.drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.radius);
            const highlightR = Math.min(255, this.color[0] + 50);
            const highlightG = Math.min(255, this.color[1] + 50);
            const highlightB = Math.min(255, this.color[2] + 50);
            const shadowR = Math.max(0, this.color[0] - 30);
            const shadowG = Math.max(0, this.color[1] - 30);
            const shadowB = Math.max(0, this.color[2] - 30);
                        
            gradient.addColorStop(0, `rgba(${highlightR}, ${highlightG}, ${highlightB}, 0.6)`);
            gradient.addColorStop(0.7, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0.5)`);
            gradient.addColorStop(1, `rgba(${shadowR}, ${shadowG}, ${shadowB}, 0.4)`);
            p.drawingContext.fillStyle = gradient;
            p.ellipse(0, 0, this.radius * 2);
            
            // 绘制同心圆环
            p.noFill();
            p.stroke(255, 50);
            p.strokeWeight(1);
            for (let i = 1; i < 5; i++) {
              p.ellipse(0, 0, this.radius * 2 * i / 5);
            }
            
            // 绘制旋转的条纹（增加数量）
            p.stroke(255, 80);
            p.strokeWeight(2);
            for (let i = 0; i < 16; i++) { // 增加到16条
              p.rotate(p.PI / 8);
              p.line(0, 0, this.radius, 0);
            }
            
            // 为黄色陀螺添加旋转扩散效果
            if (this.color[0] === 255 && this.color[1] === 200 && this.color[2] === 0) { // 黄色陀螺
              p.push();
              p.rotate(this.angle * 2); // 旋转速度是陀螺的2倍
              
              // 绘制扩散的旋转效果
              for (let i = 0; i < 8; i++) {
                p.rotate(p.PI / 4);
                p.strokeWeight(1);
                
                // 从中心向外渐变透明度
                for (let j = 0; j < this.radius * 1.5; j += 5) {
                  const opacity = 1 - (j / (this.radius * 1.5));
                  if (opacity > 0) {
                    p.stroke(255, 200, 0, opacity * 150);
                    p.line(j, 0, j + 5, 0);
                  }
                }
              }
              
              p.pop();
            }
            
            // 绘制螺旋花纹
            p.stroke(255, 60);
            p.strokeWeight(1);
            p.noFill();
            p.beginShape();
            for (let i = 0; i < Math.PI * 8; i += 0.1) {
              const r = this.radius * i / (Math.PI * 8);
              const x = r * Math.cos(i);
              const y = r * Math.sin(i);
              p.vertex(x, y);
            }
            p.endShape();
            
            // 绘制陀螺顶部
            p.fill(255, 200);
            p.noStroke();
            p.ellipse(0, 0, this.radius * 0.6);
            
            // 绘制陀螺中心
            p.fill(0);
            p.ellipse(0, 0, this.radius * 0.2);
            
            // 绘制亮点拖尾
            this.lightTrails.forEach(trail => {
              p.noStroke();
              p.fill(trail.color[0], trail.color[1], trail.color[2], trail.opacity * 255);
              p.ellipse(trail.x, trail.y, trail.size);
            });
            
            // 绘制边缘亮点
            if (this.isSpinning && Math.abs(this.speed) > 0.001) {
              this.lights.forEach(light => {
                p.noStroke();
                p.fill(light.color[0], light.color[1], light.color[2], light.opacity * 255);
                p.ellipse(light.x, light.y, light.size);
              });
            }
            
            p.pop();
          }
          
          checkCollision(other) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.radius + other.radius) {
              // 碰撞检测
              const collisionAngle = Math.atan2(dy, dx);
              
              // 分离两个陀螺
              const overlap = (this.radius + other.radius) - distance;
              this.x += Math.cos(collisionAngle) * overlap * 0.5;
              this.y += Math.sin(collisionAngle) * overlap * 0.5;
              other.x -= Math.cos(collisionAngle) * overlap * 0.5;
              other.y -= Math.sin(collisionAngle) * overlap * 0.5;
              
              // 计算碰撞后的速度，考虑旋转角度
              const thisSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
              const otherSpeed = Math.sqrt(other.vx * other.vx + other.vy * other.vy);
              
              const thisDirection = Math.atan2(this.vy, this.vx);
              const otherDirection = Math.atan2(other.vy, other.vx);
              
              // 基于碰撞角度和旋转状态计算新速度
              const newThisVx = otherSpeed * Math.cos(otherDirection - collisionAngle) * Math.cos(collisionAngle) + thisSpeed * Math.sin(thisDirection - collisionAngle) * Math.sin(collisionAngle);
              const newThisVy = otherSpeed * Math.cos(otherDirection - collisionAngle) * Math.sin(collisionAngle) - thisSpeed * Math.sin(thisDirection - collisionAngle) * Math.cos(collisionAngle);
              
              const newOtherVx = thisSpeed * Math.cos(thisDirection - collisionAngle) * Math.cos(collisionAngle) + otherSpeed * Math.sin(otherDirection - collisionAngle) * Math.sin(collisionAngle);
              const newOtherVy = thisSpeed * Math.cos(thisDirection - collisionAngle) * Math.sin(collisionAngle) - otherSpeed * Math.sin(otherDirection - collisionAngle) * Math.cos(collisionAngle);
              
              // 应用新速度并增加50%
              this.vx = newThisVx * 1.5;
              this.vy = newThisVy * 1.5;
              other.vx = newOtherVx * 1.5;
              other.vy = newOtherVy * 1.5;
              
              // 碰撞后旋转方向和速度可能改变
              // 基于碰撞速度差调整旋转速度，但旋转速度会变慢
              const speedDiff = Math.abs(thisSpeed - otherSpeed);
              
              // 计算旋转速度因子，旋转速度越慢，加速度也越慢
              const thisSpeedFactor = Math.abs(this.speed) * 0.5 + 0.1; // 确保至少有一个小的加速度
              const otherSpeedFactor = Math.abs(other.speed) * 0.5 + 0.1;
              
              // 应用加速度，旋转速度会变慢
              this.speed += speedDiff * 0.005 * thisSpeedFactor * (Math.random() > 0.5 ? 1 : -1);
              other.speed += speedDiff * 0.005 * otherSpeedFactor * (Math.random() > 0.5 ? 1 : -1);
              
              // 碰撞后旋转速度会变慢，幅度加大5倍
              this.speed *= 0.5;
              other.speed *= 0.5;
              
              // 随机改变旋转方向
              if (Math.random() > 0.7) {
                this.speed *= -1;
              }
              if (Math.random() > 0.7) {
                other.speed *= -1;
              }
              
              // 计算碰撞点坐标
              const collisionX = (this.x + other.x) / 2;
              const collisionY = (this.y + other.y) / 2;
              
              // 只在碰撞点生成一次火花
              createSparks(collisionX, collisionY, this.color, 20);
            }
          }
          
          checkMousePress(x, y) {
            // 鼠标按下时开始检测碰撞
            return true;
          }
          
          checkMouseRelease() {
            // 鼠标释放时结束检测
          }
          
          checkMouseDrag(x, y) {
            // 以鼠标为圆心，小陀螺半径的1/2为半径（50）检测碰撞
            const collisionRadius = 50;
            
            const dx = this.x - x;
            const dy = this.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 计算鼠标到陀螺边缘的距离
            const distanceToEdge = distance - this.radius;
            
            // 如果鼠标在碰撞范围内（距离陀螺边缘小于碰撞半径）
            if (distanceToEdge < collisionRadius) {
              // 计算碰撞方向（从鼠标指向陀螺边缘）
              const collisionAngle = Math.atan2(dy, dx);
              
              // 计算碰撞力度（距离越近力度越大）
              const force = (collisionRadius - distanceToEdge) * 0.2;
              
              // 应用力到陀螺
              this.vx += Math.cos(collisionAngle) * force;
              this.vy += Math.sin(collisionAngle) * force;
              
              // 增加旋转速度
              this.speed += force * 0.01 * (Math.random() > 0.5 ? 1 : -1);
              
              // 如果陀螺停止旋转，重新启动旋转
              if (!this.isSpinning) {
                this.isSpinning = true;
              }
            }
          }
        }
        
        p.setup = () => {
          const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
          canvas.parent('spinning-tops-canvas');
          
          // 初始化两个陀螺（放大一倍）
          top1 = new Top(p.width * 0.3, p.height / 2, 120, [255, 165, 0], 0.2); // 转速增加2倍
          top2 = new Top(p.width * 0.7, p.height / 2, 100, [255, 99, 71], -0.3); // 转速增加2倍
          
          // 给陀螺一个初始速度（增加10倍），并添加垂直方向的速度
          top1.vx = 20;
          top1.vy = (Math.random() - 0.5) * 10; // 随机垂直速度
          top2.vx = -20;
          top2.vy = (Math.random() - 0.5) * 10; // 随机垂直速度
        };
        
        p.draw = () => {
          p.background(20, 30, 60); // 深蓝色背景
          
          // 更新和显示陀螺
          top1.update();
          top2.update();
          
          // 检测碰撞
          top1.checkCollision(top2);
          
          // 更新和显示火花
          for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            sparks[i].display();
            if (sparks[i].isDead()) {
              sparks.splice(i, 1);
            }
          }
          
          top1.display();
          top2.display();
          
          // 绘制鼠标效果
          drawMouseEffect();
        };
        
        // 鼠标移动时直接碰撞陀螺，不需要按住
        p.mouseMoved = function() {
          top1.checkMouseDrag(p.mouseX, p.mouseY);
          top2.checkMouseDrag(p.mouseX, p.mouseY);
          
          // 记录鼠标位置到拖尾数组
          mouseTrail.push({
            x: p.mouseX,
            y: p.mouseY,
            life: 255
          });
          
          // 限制拖尾长度
          if (mouseTrail.length > maxTrailLength) {
            mouseTrail.shift();
          }
        };
        
        // 绘制鼠标效果
        function drawMouseEffect() {
          // 隐藏默认鼠标
          p.noCursor();
          
          // 绘制拖尾
          for (let i = 0; i < mouseTrail.length; i++) {
            const point = mouseTrail[i];
            const alpha = point.life * (i / mouseTrail.length);
            const size = 8 + (i / mouseTrail.length) * 12;
            
            // 渐变色彩：从白色到蓝色
            const r = 100 + (155 * (i / mouseTrail.length));
            const g = 150 + (105 * (i / mouseTrail.length));
            const b = 255;
            
            p.fill(r, g, b, alpha * 0.6);
            p.noStroke();
            p.ellipse(point.x, point.y, size);
            
            // 更新生命周期
            point.life -= 10;
          }
          
          // 清理死亡的拖尾点
          mouseTrail = mouseTrail.filter(point => point.life > 0);
          
          // 绘制鼠标光晕
          if (mouseTrail.length > 0) {
            const lastPoint = mouseTrail[mouseTrail.length - 1];
            
            // 外层光晕
            for (let i = 3; i >= 1; i--) {
              const glowSize = 30 + i * 10;
              const glowAlpha = 30 / i;
              p.fill(100, 150, 255, glowAlpha);
              p.noStroke();
              p.ellipse(lastPoint.x, lastPoint.y, glowSize);
            }
            
            // 中心亮点
            p.fill(255, 255, 255, 200);
            p.ellipse(lastPoint.x, lastPoint.y, 8);
            
            // 内层光环
            p.noFill();
            p.stroke(150, 200, 255, 150);
            p.strokeWeight(2);
            p.ellipse(lastPoint.x, lastPoint.y, 20);
          }
        }
        
        // 创建火花效果的函数
        function createSparks(x, y, color, count) {
          // 生成100个火花，有大有小，使用黄色、橙色和红色
          const sparkColors = [[255, 255, 0], [255, 165, 0], [255, 0, 0]]; // 黄色、橙色和红色
          
          for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 10 + 5; // 速度有差异
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const sparkColor = sparkColors[Math.floor(Math.random() * sparkColors.length)]; // 随机使用黄色或橙色
            const spark = new Spark(x, y, vx, vy, sparkColor);
            // 火花大小有差异
            spark.size = Math.random() * 10 + 5;
            sparks.push(spark);
          }
        }
        
        p.windowResized = () => {
          p.resizeCanvas(window.innerWidth, window.innerHeight);
        };
      });
    }
  }
};
</script>

<style scoped>
.spinning-tops-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  
  #spinning-tops-canvas {
    width: 100%;
    height: 100%;
  }
}
</style>