<template>
  <div class="leaves-page">
    <canvas id="leavesCanvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'LeavesPage',
  mounted() {
    // 获取Canvas元素和2D上下文
    const canvas = document.getElementById('leavesCanvas');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('2D context not supported');
      return;
    }
    
    // 初始化画布尺寸
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // 添加抗锯齿设置
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 树叶粒子系统
    class Leaf {
      constructor() {
        this.treePosition = null; // 树叶在树上的位置
        this.settledOnBranch = false;
        this.reset(true);
        this.initialX = this.x; // 保存初始位置
        this.initialY = this.y; // 保存初始位置
        this.size = 5 + Math.random() * 5; // 减小树叶大小，使其更清晰
        this.speed = 0.3 + Math.random() * 0.7;
        // 随机黄或绿的颜色，并有随机的明暗变化
        const hue = Math.random() > 0.5 ? 60 : 120; // 60 是黄色，120 是绿色
        const lightness = 40 + Math.random() * 40; // 随机明暗，范围 40%-80%
        this.baseColor = `hsl(${hue}, 80%, ${lightness}%)`;
        this.color = this.baseColor;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.025; // 旋转速度减半
        // 状态标记
        this.onTree = true; // 是否在树上
        this.onGround = false; // 是否在地面
        this.isFalling = false; // 是否正在掉落
        this.isExploding = false; // 是否正在爆开
        // 圆盘旋转相关
        this.circleAngle = Math.random() * Math.PI * 2; // 在圆盘上的角度
        // 计算最大环绕范围：从鼠标到目前最宽处的1倍位置（缩小一倍）
        const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.5 * 1;
        // 初始化圆盘半径，使树叶均匀分布在范围内
        this.circleRadius = Math.random() * maxRadius; // 圆盘半径（0到最大范围）
        // 掉落相关
        this.fallStartTime = 0;
        this.fallDuration = 12000 + Math.random() * 8000; // 掉落动画持续时间再增加一倍，使掉落速度再减慢一倍
        this.fallProgress = 0;
        this.fallStartX = 0;
        this.fallStartY = 0;
        this.groundY = 0;
        // 爆开相关
        this.explodeX = 0;
        this.explodeY = 0;
        this.explodeGravity = 0.3;
      }
      
      reset(init) {
        // 随机分布在屏幕各处
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = this.x;
        this.targetY = this.y;
        this.angle = Math.random() * Math.PI * 2;
      }
      
      // 设置树叶在自然树上的位置
      setTreePosition(treeGrowth) {
        const fixedTrunkHeight = (200 + 400) / 2; // 与 drawTree 中树干高度一致
        const trunkHeight = fixedTrunkHeight * treeGrowth;
        const trunkBottomY = canvas.height; // 树干底部在页面底部
        const maxWidth = canvas.width * 0.67; // 屏幕的2/3
        
        function leafTierLevels() {
          return 3 + Math.floor(Math.random() * 3);
        }
        const branchPositions = [
          { yRatio: 0.12, length: maxWidth * 0.29 * treeGrowth * 0.67, width: 12 * treeGrowth, levels: leafTierLevels() },
          { yRatio: 0.38, length: maxWidth * 0.26 * treeGrowth * 0.67, width: 10.5 * treeGrowth, levels: leafTierLevels() },
          { yRatio: 0.58, length: maxWidth * 0.23 * treeGrowth * 0.67, width: 9 * treeGrowth, levels: leafTierLevels() },
          { yRatio: 0.76, length: maxWidth * 0.2 * treeGrowth * 0.67, width: 7.5 * treeGrowth, levels: leafTierLevels() }
        ];
        
        // 随机选择一个树枝位置
        let posIndex = Math.floor(Math.random() * branchPositions.length);
        let pos = branchPositions[posIndex];
        
        // 确保选择的位置在当前生长状态下可见
        if (treeGrowth <= pos.yRatio) {
          // 如果选择的位置不可见，选择一个较低的位置
          for (let i = branchPositions.length - 1; i >= 0; i--) {
            if (treeGrowth > branchPositions[i].yRatio) {
              pos = branchPositions[i];
              break;
            }
          }
        }
        
        // 随机选择左或右树枝
        const isLeft = Math.random() > 0.5;
        const baseAngle = isLeft ? (Math.PI/6 + Math.random() * Math.PI/6) : (5 * Math.PI/6 + Math.random() * Math.PI/6);
        
        // 计算树枝起点
        const branchStartX = canvas.width/2;
        const branchStartY = trunkBottomY - trunkHeight * pos.yRatio; // 随当前树干高度附着
        
        // 模拟树枝生长，找到树叶的位置
        let x = branchStartX;
        let y = branchStartY;
        let angle = baseAngle;
        let currentLength = pos.length;
        let currentLevel = 0;
        
        // 随机决定树枝的层级数
        const maxLevel = pos.levels;
        
        // 模拟树枝生长过程，确保树叶只吸附在三级及以上树枝上
        while (currentLevel < maxLevel && currentLength > 5) {
          // 计算当前树枝的长度
          const branchLength = currentLength * (0.7 + Math.random() * 0.2);
          
          // 计算树枝终点
          x += Math.cos(angle) * branchLength;
          y += Math.sin(angle) * branchLength;
          
          // 随机决定下一个角度
          angle += (Math.random() - 0.5) * Math.PI/2;
          
          // 更新长度和层级
          currentLength = branchLength * 0.8;
          currentLevel++;
        }
        
        // 确保树叶只吸附在三级及以上树枝上
        if (currentLevel < 3) {
          // 如果当前层级小于3，重新选择树枝位置
          this.setTreePosition(treeGrowth);
          return;
        }
        
        // 计算树叶在最后一级树枝上的位置
        const leafPosition = Math.random();
        const finalBranchLength = currentLength;
        const branchX = x + Math.cos(angle) * finalBranchLength * leafPosition;
        const branchY = y + Math.sin(angle) * finalBranchLength * leafPosition;
        
        // 添加一些随机偏移，使树叶分布更自然
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;
        
        this.treePosition = {
          x: branchX + offsetX,
          y: branchY + offsetY
        };
      }
      
      update(mouseX, mouseY, isMouseActive, treeGrowth, branchSegments, treeOpacity) {
        const attractRadius = 180; // 吸附距离翻倍
        const settleDist = 14;
        const groundY = canvas.height; // 地面位置

        // 爆开状态优先处理
        if (this.isExploding) {
          this.explodeY += this.explodeGravity; // 应用重力
          this.x += this.explodeX;
          this.y += this.explodeY;
          this.rotation += this.rotationSpeed * 2; // 爆开时旋转加速
          
          // 落到地面后停止爆开
          if (this.y >= groundY) {
            this.y = groundY;
            this.isExploding = false;
            this.onGround = true;
            this.onTree = false;
            this.explodeX = 0;
            this.explodeY = 0;
            this.color = `hsl(60, 70%, 35%)`; // 恢复暗黄色
          }
          return;
        }

        // 掉落状态
        if (this.isFalling) {
          const now = Date.now();
          const elapsed = now - this.fallStartTime;
          this.fallProgress = Math.min(1, elapsed / this.fallDuration);
          
          // 变黄变暗：保持黄色调，亮度稍微降低
          const baseHue = 60; // 黄色
          const currentHue = baseHue;
          const currentLightness = 35 + 25 * (1 - this.fallProgress); // 从 60% 降到 35%，保持暗黄色
          this.color = `hsl(${currentHue}, 70%, ${currentLightness}%)`;
          
          // 掉落动画：从起始位置自然下落，使用二次缓动模拟重力
          if (this.fallProgress < 1) {
            const easeInQuad = this.fallProgress * this.fallProgress;
            const fallDistance = groundY - this.fallStartY;
            this.y = this.fallStartY + fallDistance * easeInQuad;
            
            // 左右轻微摆动，模拟飘落效果
            const sway = Math.sin(this.fallProgress * Math.PI * 4) * 20 * this.fallProgress;
            this.x = this.fallStartX + sway;
          }
          
          // 旋转加速
          this.rotation += this.rotationSpeed * (1 + this.fallProgress * 3);
          
          // 到达地面
          if (this.fallProgress >= 1) {
            this.onGround = true;
            this.onTree = false;
            this.isFalling = false;
            this.y = groundY;
          }
          return;
        }

        // 在地面上，保持不动
        if (this.onGround) {
          return;
        }

        // 在树上时的逻辑
        if (this.onTree) {
          // 鼠标移入时，脱离大树，进入圆盘旋转模式（只有当大树生长完成后）
          if (isMouseActive && treeOpacity < 1 && treeGrowth >= 1) {
            this.onTree = false;
            // 初始化圆盘旋转参数
            this.circleAngle = Math.atan2(this.y - mouseY, this.x - mouseX);
            // 计算最大环绕范围：从鼠标到目前最宽处的1倍位置（缩小一倍）
            const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.5 * 1;
            // 初始化圆盘半径，使树叶均匀分布在范围内
            this.circleRadius = Math.random() * maxRadius;
          } else if (branchSegments && branchSegments.length > 0 && treeOpacity >= 0.5) {
            // 吸附在树枝上
            let bestD2 = Infinity;
            let best = null;
            for (let s = 0; s < branchSegments.length; s++) {
              const seg = branchSegments[s];
              const dx = seg.x2 - seg.x1;
              const dy = seg.y2 - seg.y1;
              const len2 = dx * dx + dy * dy;
              let t = 0;
              if (len2 > 1e-6) {
                t = ((this.x - seg.x1) * dx + (this.y - seg.y1) * dy) / len2;
                t = Math.max(0, Math.min(1, t));
              }
              const px = seg.x1 + t * dx;
              const py = seg.y1 + t * dy;
              const ddx = this.x - px;
              const ddy = this.y - py;
              const d2 = ddx * ddx + ddy * ddy;
              if (d2 < bestD2) {
                bestD2 = d2;
                best = { x: px, y: py };
              }
            }

            const dist = Math.sqrt(bestD2);
            if (best && dist < attractRadius) {
              const pull = (1 - dist / attractRadius) * (0.035 + 0.0175 * this.speed); // 吸附速度减慢4倍
              this.targetX = best.x;
              this.targetY = best.y;
              this.settledOnBranch = dist < settleDist;
              this.x += (this.targetX - this.x) * pull;
              this.y += (this.targetY - this.y) * pull;
              if (!this.settledOnBranch) {
                this.y += 0.07 * this.speed; // 下落速度减慢4倍
              }
            } else {
              this.settledOnBranch = false;
              this.targetX = this.initialX;
              this.targetY = this.initialY;
              this.x += (this.targetX - this.x) * 0.0125 * this.speed; // 回到初始位置的速度减慢4倍
              this.y += (this.targetY - this.y) * 0.0125 * this.speed; // 回到初始位置的速度减慢4倍
              this.x += Math.sin(Date.now() * 0.001 + this.initialX) * 0.1;
              this.y += Math.cos(Date.now() * 0.001 + this.initialY) * 0.1;
            }
          }
          this.rotation += this.rotationSpeed;
          return;
        }

        // 不在树上也不在地面，说明在圆盘旋转模式
        // 围绕鼠标形成大圆盘旋转
        if (isMouseActive) {
          // 计算环绕范围：从鼠标到目前最宽处的1倍位置（缩小一倍）
          const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.5 * 1;
          // 确保circleRadius在合理范围内
          this.circleRadius = Math.min(maxRadius, this.circleRadius);
          
          // 更新圆盘角度
          this.circleAngle += 0.02 * this.speed;
          
          // 计算目标位置：以鼠标为圆心，circleRadius 为半径的圆
          const targetX = mouseX + Math.cos(this.circleAngle) * this.circleRadius;
          const targetY = mouseY + Math.sin(this.circleAngle) * this.circleRadius;
          
          // 平滑移动到目标位置
          this.x += (targetX - this.x) * 0.05;
          this.y += (targetY - this.y) * 0.05;
          this.rotation += this.rotationSpeed;
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // 绘制树叶形状（移除纹路）
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // 树叶主体
        ctx.ellipse(0, 0, this.size, this.size * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // 创建树叶群（优化数量，根据屏幕尺寸动态调整）
    const leaves = [];
    const leafCount = Math.min(600, Math.floor((window.innerWidth * window.innerHeight) / 2500));
    for (let i = 0; i < leafCount; i++) {
      leaves.push(new Leaf());
    }

    let userHasMovedMouse = false;

    // 鼠标交互状态
    const mouseState = {
      x: canvas.width/2,
      y: canvas.height/2,
      isActive: false,
      leaveTime: 0 // 初始为 0，只有鼠标真正离开时才设置时间戳
    };

    // 树生长状态（growth 连续 0→1，不再按离散 stage 跳层）
    const treeState = {
      growth: 0,
      opacity: 1, // 树的透明度，用于渐隐效果
      isVisible: true,
      branchesGrown: false,
      leavesVisible: false,
      structure: null,
      maxBranchLevel: 5,
      growthStage: 0,
      isGrowing: false,
      growthAnimStart: 0,
      growthAnimDuration: 40000, // 生长动画持续时间再增加一倍，使生长速度再减慢一倍
      fadeOutStartTime: 0 // 渐隐开始时间
    };
    
    // 首次生长标记
    let initialTreeStarted = false;
    
    // 鼠标移动事件
    canvas.addEventListener('mousemove', (e) => {
      // 大树生长过程中不响应鼠标事件
      if (treeState.isGrowing) return;
      
      userHasMovedMouse = true;
      mouseState.x = e.clientX;
      mouseState.y = e.clientY;
      mouseState.isActive = true;
      mouseState.leaveTime = 0;
      
      // 如果树还没有开始渐隐，开始渐隐过程
      if (treeState.opacity >= 1 && treeState.fadeOutStartTime === 0) {
        treeState.fadeOutStartTime = Date.now();
      }
    });
    
    canvas.addEventListener('mouseout', () => {
      mouseState.isActive = false;
      mouseState.leaveTime = Date.now();
      // 鼠标移出画布后，大树消失
      treeState.isVisible = false;
      treeState.opacity = 0;
      treeState.structure = null;
      treeState.growth = 0;
      // 重置首次生长标记，允许鼠标移出后重新生长
      initialTreeStarted = false;
      // 重置所有树叶状态，初始化分散在屏幕各处
      leaves.forEach(leaf => {
        leaf.onTree = true;
        leaf.onGround = false;
        leaf.isFalling = false;
        leaf.isExploding = false;
        leaf.fallProgress = 0;
        leaf.fallStartX = 0;
        leaf.fallStartY = 0;
        leaf.color = leaf.baseColor;
        // 初始化树叶位置，分散在屏幕各处
        leaf.reset(true);
        // 保存初始位置
        leaf.initialX = leaf.x;
        leaf.initialY = leaf.y;
      });
    });
    
    // 鼠标点击事件 - 爆开树叶并让大树消失
    canvas.addEventListener('mousedown', (e) => {
      // 大树生长过程中不响应鼠标事件
      if (treeState.isGrowing) return;
      
      if (e.button === 0) { // 左键点击
        // 所有不在树上的树叶爆开并掉落
        leaves.forEach(leaf => {
          if (!leaf.onTree && !leaf.onGround && !leaf.isFalling && !leaf.isExploding) {
            // 爆开效果
            leaf.isExploding = true;
            leaf.explodeY = -5 - Math.random() * 5; // 随机向上速度
            leaf.explodeX = (Math.random() - 0.5) * 10; // 随机水平速度
            leaf.fallStartX = leaf.x;
            leaf.fallStartY = leaf.y;
          }
        });
        
        // 大树快速消失
        treeState.opacity = 0;
        treeState.isVisible = false;
        treeState.structure = null;
        treeState.growth = 0;
      }
    });

    function easeOutCubic(t) {
      return 1 - (1 - t) ** 3;
    }

    function branchSegmentFraction(branchLevel, maxLevel, growth01) {
      const g = Math.max(0, Math.min(1, growth01));
      const u = g * maxLevel;
      const k = maxLevel - branchLevel;
      const soft = 0.62;
      const t = (u - k + soft * 0.5) / (1 + soft);
      const x = Math.max(0, Math.min(1, t));
      return x * x * (3 - 2 * x);
    }

    // 开始生长树：单段连续时间轴，避免分层卡顿
    function startGrowingTree() {
      if (treeState.isGrowing) return;
      treeState.growth = 0;
      treeState.isGrowing = true;
      treeState.branchesGrown = false;
      treeState.leavesVisible = false;
      treeState.growthAnimStart = Date.now();
    }

    // 绘制自然树
    function drawTree(growth) {
      if (!treeState.isVisible) return;
      
      ctx.save();
      
      // 树干 - 高度调整为原来的1.2倍
      const fixedTrunkHeight = (200 + 400) / 2 * 1.2; // 固定树干高度
      const trunkHeight = fixedTrunkHeight * growth;
      const trunkBottomY = canvas.height; // 树干底部在页面底部
      
      // 树干颜色：棕色到黑色渐变
      const trunkColor = `rgb(${139 - growth * 80}, ${69 - growth * 40}, ${19 - growth * 10})`;
      
      // 绘制树干（中间粗，上下细）- 宽度放大两倍，顶部宽度调整为原来的1/4
      ctx.fillStyle = trunkColor;
      ctx.beginPath();
      const baseWidth = (20 + 40) * growth; // 放大两倍
      const topWidth = (10 + 20) * growth / 4; // 顶部宽度调整为原来的1/4
      ctx.moveTo(canvas.width/2 - baseWidth/2, trunkBottomY);
      ctx.lineTo(canvas.width/2 + baseWidth/2, trunkBottomY);
      ctx.lineTo(canvas.width/2 + topWidth/2, trunkBottomY - trunkHeight);
      ctx.lineTo(canvas.width/2 - topWidth/2, trunkBottomY - trunkHeight);
      ctx.closePath();
      ctx.fill();
      
      // 定义树的参数
      const maxWidth = canvas.width * 0.67; // 屏幕的2/3
      
      if (treeState.isVisible && !treeState.structure) {
        treeState.structure = generateTreeStructure(maxWidth, fixedTrunkHeight, trunkBottomY);
        treeState.maxBranchLevel = Math.max(1, ...treeState.structure.map(b => b.level));
      }
      
      if (treeState.structure) {
        drawBranches(treeState.structure, growth, trunkColor);
      }
      
      ctx.restore();
    }

    // 生成树结构
    function generateTreeStructure(maxWidth, fixedTrunkHeight, trunkBottomY) {
      const structure = [];
      const fixedGrowth = 1;
      const centerX = canvas.width / 2;
      
      // 递归生成树枝结构
      function generateBranch(x, y, length, angle, width, level) {
        if (level === 0 || length < 10) return;
        
        // 计算树枝终点
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        
        // 保存树枝信息，预计算角度和长度以提高绘制性能
        const dx = endX - x;
        const dy = endY - y;
        const branchLength = Math.sqrt(dx * dx + dy * dy);
        const branchAngle = Math.atan2(dy, dx);
        
        structure.push({
          startX: x,
          startY: y,
          endX: endX,
          endY: endY,
          width: width,
          level: level, // 记录树枝的层级，从1开始
          length: branchLength,
          angle: branchAngle
        });
        
        const nextLength = length * (0.72 + Math.random() * 0.12);
        const nextWidth = width * 0.7;
        
        const branchCount = 2;
        
        const spread = 0.26 + Math.random() * 0.14;
        for (let i = 0; i < branchCount; i++) {
          const sign = i === 0 ? -1 : 1;
          let nextAngle = angle + sign * spread + (Math.random() - 0.5) * 0.12;
          if (nextAngle < Math.PI) nextAngle = Math.PI;
          if (nextAngle > 2 * Math.PI) nextAngle = 2 * Math.PI;

          const branchPosition = 0.42 + Math.random() * 0.48;
          const branchStartX = x + Math.cos(angle) * length * branchPosition;
          const branchStartY = y + Math.sin(angle) * length * branchPosition;
          
          // 递归生成分支
          generateBranch(branchStartX, branchStartY, nextLength, nextAngle, nextWidth, level - 1);
        }
      }
      
      // 在树干不同高度添加树枝；中段 yRatio 加密，避免树冠与下段之间过稀
      function randomLevels() {
        return 3 + Math.floor(Math.random() * 3);
      }

      const branchPositions = [
        { yRatio: 0.12, length: maxWidth * 0.29 * fixedGrowth * 0.67 * 1.5, width: 12 * fixedGrowth, levels: randomLevels() },
        { yRatio: 0.38, length: maxWidth * 0.26 * fixedGrowth * 0.67 * 1.5, width: 10.5 * fixedGrowth, levels: randomLevels() },
        { yRatio: 0.58, length: maxWidth * 0.23 * fixedGrowth * 0.67 * 1.5, width: 9 * fixedGrowth, levels: randomLevels() },
        { yRatio: 0.76, length: maxWidth * 0.2 * fixedGrowth * 0.67 * 1.5, width: 7.5 * fixedGrowth, levels: randomLevels() }
      ];

      function emitLateralBranches(pos) {
        const baseBranchY = trunkBottomY - fixedTrunkHeight * pos.yRatio;
        const spread = 0.42 + Math.random() * 0.1;
        const up = 3 * Math.PI / 2;
        const angleLeft = up - spread;
        const angleRight = up + spread;
        
        // 第一级树枝（从树干长出的主树枝）起点错开，避免完全对称
        // 左右树枝在树干上的起点高度不同
        const offsetRatio = 0.3 + Math.random() * 0.4; // 30%-70% 的错开程度
        const heightOffset = pos.length * 0.15 * offsetRatio; // 错开距离为树枝长度的 15%
        
        const leftBranchY = baseBranchY - heightOffset; // 左边树枝起点稍高
        const rightBranchY = baseBranchY + heightOffset; // 右边树枝起点稍低
        
        generateBranch(centerX, leftBranchY, pos.length, angleLeft, pos.width, pos.levels);
        generateBranch(centerX, rightBranchY, pos.length, angleRight, pos.width, pos.levels);
      }

      branchPositions.forEach(emitLateralBranches);
      
      return structure;
    }

    // 将「成树」坐标按 growth 从树干底部中心缩放，与正在长高的树干一致
    function scaleTreePoint(x, y, growth) {
      const cx = canvas.width / 2;
      const by = canvas.height;
      return {
        x: cx + (x - cx) * growth,
        y: by + (y - by) * growth
      };
    }

    function drawBranches(branches, growth, trunkColor) {
      ctx.strokeStyle = trunkColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const maxLevel = Math.max(1, ...branches.map(b => b.level));
      const M = treeState.maxBranchLevel || maxLevel;
      const sortedBranches = [...branches].sort((a, b) => b.level - a.level);

      sortedBranches.forEach(branch => {
        const frac = branchSegmentFraction(branch.level, M, growth);
        if (frac <= 0) return;

        const sx = scaleTreePoint(branch.startX, branch.startY, growth);
        const ex = scaleTreePoint(branch.endX, branch.endY, growth);
        const lineW = Math.max(1, branch.width * growth);

        ctx.lineWidth = lineW;
        ctx.beginPath();
        ctx.moveTo(sx.x, sx.y);
        ctx.lineTo(sx.x + (ex.x - sx.x) * frac, sx.y + (ex.y - sx.y) * frac);
        ctx.stroke();
      });
    }

    function getVisibleBranchSegments(structure, growth) {
      if (!structure || !structure.length) return [];
      const maxLevel = Math.max(1, ...structure.map(b => b.level));
      const M = treeState.maxBranchLevel || maxLevel;
      const segments = [];
      for (let i = 0; i < structure.length; i++) {
        const branch = structure[i];
        // 只返回较小level的树枝分段，较大level的树枝（主干和一级树枝）不吸附树叶
        // level越大表示越靠近主干，level越小表示越靠近末端
        if (branch.level >= 3) continue; // 主干和一级树枝不吸附树叶
        const frac = branchSegmentFraction(branch.level, M, growth);
        if (frac <= 0) continue;
        const sx = scaleTreePoint(branch.startX, branch.startY, growth);
        const ex = scaleTreePoint(branch.endX, branch.endY, growth);
        segments.push({
          x1: sx.x,
          y1: sx.y,
          x2: sx.x + (ex.x - sx.x) * frac,
          y2: sx.y + (ex.y - sx.y) * frac
        });
      }
      return segments;
    }

    // 更新和绘制树叶
    function updateAndDrawLeaves() {
      let branchSegments = null;
      if (treeState.isVisible && treeState.structure && !mouseState.isActive) {
        branchSegments = getVisibleBranchSegments(treeState.structure, treeState.growth);
      }
      leaves.forEach(leaf => {
        leaf.update(mouseState.x, mouseState.y, mouseState.isActive, treeState.growth, branchSegments, treeState.opacity);
        leaf.draw();
      });
    }

    // 初始化树叶位置
    leaves.forEach(leaf => {
      leaf.setTreePosition(1); // 初始化为大树状态的位置
    });
    
    // 动画循环
    function animate() {
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 更新鼠标离开时间
      if (!mouseState.isActive && mouseState.leaveTime > 0) {
        const elapsed = (Date.now() - mouseState.leaveTime) / 1000;
        if (elapsed > 5 && !treeState.isGrowing) { // 显示树苗时间调整为 5 秒
          treeState.isVisible = true;
          treeState.opacity = 1; // 重置透明度为1，确保大树可见
          treeState.branchesGrown = false; // 重置树生长状态
          treeState.growth = 0; // 重置生长进度
          treeState.fadeOutStartTime = 0; // 重置渐隐状态
          
          // 确保在树开始生长时就生成并缓存树枝结构
          if (!treeState.structure) {
            drawTree(0.001);
          }
          // 重置树叶状态，让它们重新吸附到树上
          leaves.forEach(leaf => {
            leaf.onTree = true;
            leaf.onGround = false;
            leaf.isFalling = false;
            leaf.isExploding = false;
            leaf.fallProgress = 0;
            leaf.fallStartX = 0;
            leaf.fallStartY = 0;
            leaf.color = leaf.baseColor;
            // 为树叶设置新的树上位置
            leaf.setTreePosition(1);
          });
          // 无论 treeState.structure 是否存在，都开始生长树
          startGrowingTree();
          // 重置 leaveTime 防止重复触发
          mouseState.leaveTime = 0;
        }
      }

      // 树生长逻辑
      if (treeState.isGrowing && treeState.growthAnimStart > 0) {
        const raw = (Date.now() - treeState.growthAnimStart) / treeState.growthAnimDuration;
        const t = Math.min(1, raw);
        treeState.growth = easeOutCubic(t);
        const M = Math.max(1, treeState.maxBranchLevel || 1);
        treeState.growthStage = Math.min(M - 1, Math.floor(treeState.growth * M));
        if (t >= 1) {
          treeState.growth = 1;
          treeState.isGrowing = false;
          treeState.branchesGrown = true;
          treeState.leavesVisible = true;
          treeState.growthAnimStart = 0;
        }
      }
      
      // 树渐隐逻辑（鼠标移入时）
      if (mouseState.isActive && treeState.fadeOutStartTime > 0) {
        const fadeElapsed = (Date.now() - treeState.fadeOutStartTime) / 3000; // 3 秒渐隐
        treeState.opacity = Math.max(0, 1 - fadeElapsed);
        
        // 当树完全消失后，删除树枝干对象
        if (treeState.opacity <= 0) {
          treeState.opacity = 0;
          treeState.isVisible = false;
          treeState.structure = null; // 删除树枝干对象
          treeState.growth = 0; // 重置生长状态
        }
      }
      
      // 绘制树
      if (treeState.isVisible) {
        ctx.save();
        ctx.globalAlpha = treeState.opacity;
        drawTree(treeState.growth);
        ctx.restore();
      }
      
      // 更新和绘制树叶
      updateAndDrawLeaves();
      
      // 继续动画循环
      requestAnimationFrame(animate);
    }
    
    // 启动动画
    animate();

    // 首次进入页面：立即开始生长大树，只生长一次
    function tryStartInitialTree() {
      if (initialTreeStarted) return;
      if (treeState.isGrowing) return;
      if (treeState.branchesGrown && treeState.growth >= 1) return;
      if (!treeState.isVisible || userHasMovedMouse) return;
      if (!treeState.structure) {
        drawTree(0.001);
      }
      initialTreeStarted = true;
      startGrowingTree();
    }
    // 只调用一次，首次进入页面时大树生长一次后不再消失
    setTimeout(tryStartInitialTree, 80);
  }
}
</script>

<style scoped lang="less">
.leaves-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: #ffffff;
  z-index: 1;
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: none;
  }
  
  .instructions {
    position: absolute;
    color: white;
    font-family: Arial;
    padding: 20px;
    z-index: 10;
  }
}
</style>