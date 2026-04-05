<template>
  <div class="home">
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style lang="less" scoped>
// 优化后的Less样式代码 - 保持视觉效果不变

// 颜色变量 - 提取所有使用的颜色
@primary-color: #f87884;
@primary-hover: #f55668;
@white: white;
@light-gray: #f0f0f0;
@dark-gray: #333;
@medium-gray: #555;
@light-text: #666;
@very-light-text: #999;
@gradient-start: #667eea;
@gradient-end: #764ba2;
@progress-start: #ffd93d;
@progress-end: #ff6b6b;
@star-color: #f1c40f;
@fork-color: #3498db;

// 尺寸变量
@border-radius: 12px;
@border-radius-sm: 10px;
@border-radius-xs: 8px;
@border-radius-circle: 50%;
@container-width: 1200px;
@padding-sm: 1rem;
@padding-md: 2rem;
@padding-lg: 2.5rem;
@margin-sm: 1rem;
@margin-md: 1.5rem;
@margin-lg: 2rem;
@margin-xl: 3rem;
@margin-xxl: 4rem;
@icon-size: 60px;
@avatar-size: 48px;

// 阴影和过渡
@box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
@box-shadow-hover: 0 8px 25px rgba(248, 120, 132, 0.15);
@box-shadow-card: 0 2px 10px rgba(0, 0, 0, 0.1);
@transition: all 0.3s ease;
@transition-transform: transform 0.3s;

// 字体大小
@font-size-xs: 0.9rem;
@font-size-sm: 1rem;
@font-size-md: 1.1rem;
@font-size-lg: 1.3rem;
@font-size-xl: 1.5rem;
@font-size-xxl: 2.5rem;
@font-size-xxxl: 3rem;

// 可复用的mixin
.container-mixin {
  max-width: @container-width;
  margin: 0 auto;
  padding: 0 2rem;
}

.card-base {
  background: @white;
  padding: @padding-md;
  border-radius: @border-radius;
  box-shadow: @box-shadow;
  transition: @transition;
  border: 1px solid @light-gray;
}

.card-hover {
  &:hover {
    transform: translateY(-5px);
    box-shadow: @box-shadow-hover;
    border-color: rgba(@primary-color, 0.3);
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  will-change: opacity, transform;
}

.fade-in-active {
  opacity: 1;
  transform: translateY(0);
}

.text-center {
  text-align: center;
}

.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: @margin-lg;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.grid-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: @margin-lg;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

// 主样式
.home {
  min-height: 100vh;
}

/* 实时状态展示样式 - 进一步缩小视觉占比 */
.status-section {
  padding: 0.2rem 0; /* 进一步减小上下内边距 */
  color: @white;
  
  .container {
    .container-mixin;
    padding: 0;
  }
  
  .status-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .status-card {
    background: linear-gradient(135deg, @gradient-start 0%, @gradient-end 100%);
    padding: 0.4rem 0.5rem; /* 进一步减小内边距 */
    border-radius: @border-radius-xs; /* 使用最小边框半径 */
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: @transition;
    min-height: auto;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    width: auto;
    
    &:hover {
      transform: scale(1.2); 
      background: linear-gradient(135deg, @gradient-start 0%, @gradient-end 100%);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03); 
    }
    
    .status-icon {
      width: 20px; 
      height: 20px;
      border-radius: @border-radius-circle;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      &::before {
        font-size: 0.7rem; 
      }
      
      &.study {
        background: rgba(255, 206, 86, 0.3);
        
        &::before {
          content: "📚";
        }
      }
      
      &.weather {
        background: rgba(54, 162, 235, 0.3);
        
        &::before {
          content: "🌤️";
        }
      }
    }
    
    .status-content {
      flex: 0 0 auto;
      min-width: 0;
      
      h3 {
        margin: 0 0 0.2rem 0; /* 进一步减小间距 */
        font-size: 0.75rem; /* 进一步减小标题字体 */
        font-weight: 500; /* 降低字重 */
        color: @white;
      }
      
      p {
        font-size: 0.65rem; /* 进一步减小文本大小 */
        margin: 0;
        opacity: 0.9;
      }
      
      .progress-bar {
        width: 70px; /* 减小进度条宽度 */
        height: 3px; /* 进一步减小进度条高度 */
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.2rem; /* 进一步减小间距 */
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, @progress-start, @progress-end);
          border-radius: 2px;
          transition: width 0.5s ease;
        }
      }
      
      .weather-temp {
        font-size: 0.7rem; /* 进一步减小温度字体 */
        font-weight: 600; /* 降低字重 */
        line-height: 1;
        margin-bottom: 0.1rem;
      }
      
      .weather-desc {
        font-size: 0.6rem; /* 进一步减小描述字体 */
        text-transform: capitalize;
      }
    }
  }
}

// Hero 部分
.hero {
  padding: @margin-xxl 0;
  text-align: center;
  
  .hero-content {
    h1 {
      font-size: @font-size-xxxl;
      margin-bottom: @margin-sm;
      color: @dark-gray;
      
      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
    
    p {
      font-size: @font-size-md;
      margin-bottom: @margin-lg;
      opacity: 0.9;
      color: @medium-gray;
    }
    
    .cta-button {
      display: inline-block;
      background: @white;
      color: @primary-color;
      padding: 0.8rem 2rem;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 2px 10px rgba(@primary-color, 0.3);
      
      &:hover {
        transform: translateY(-2px);
      }
    }
  }
}



// 最新文章部分
.recent-articles {
  padding: @margin-xxl 0;
  
  .container {
    .container-mixin;
  }
  
  h2 {
    .text-center;
    font-size: @font-size-xxl;
    margin-bottom: @margin-xl;
    color: @dark-gray;
  }
  
  .articles-grid {
    .grid-responsive;
  }
  
  .article-card {
    background: @white;
    padding: @padding-md;
    border-radius: @border-radius-sm;
    box-shadow: @box-shadow-card;
    
    h3 {
      color: @dark-gray;
      margin-bottom: @margin-sm;
    }
    
    p {
      color: @light-text;
      margin-bottom: @margin-sm;
    }
    
    .date {
      color: @very-light-text;
      font-size: @font-size-xs;
    }
    
    .read-more {
      display: inline-block;
      color: @primary-color;
      text-decoration: none;
      font-weight: bold;
      margin-top: @margin-sm;
      transition: color 0.3s;
      
      &:hover {
        color: @primary-hover;
      }
    }
    
    &:nth-child(2) { transition-delay: 0.2s; }
    &:nth-child(3) { transition-delay: 0.4s; }
  }
}

// GitHub 热门趋势部分
.github-trending {
  padding: @margin-xxl 0;
  
  .container {
    .container-mixin;
  }
  
  h2 {
    .text-center;
    font-size: @font-size-xxl;
    margin-bottom: @margin-xl;
    color: @dark-gray;
  }
  
  .github-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: @margin-lg;
  }
  
  .github-card {
    .card-base;
    .card-hover;
    
    .github-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: @margin-sm;
      
      .github-avatar {
        width: @avatar-size;
        height: @avatar-size;
        border-radius: @border-radius-circle;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @white;
        font-weight: bold;
        font-size: 1.5rem;
        position: relative;
        overflow: hidden;
        
        &::before {
          content: "G";
        }
      }
      
      .github-info {
        h3 {
          margin: 0;
          font-size: @font-size-lg;
          color: @dark-gray;
        }
        
        .github-owner {
          margin: 0;
          font-size: @font-size-xs;
          color: @light-text;
        }
      }
    }
    
    .github-description {
      color: @medium-gray;
      margin-bottom: @margin-md;
      line-height: 1.6;
      font-size: 0.95rem;
      overflow: hidden;
      display: -webkit-box;
      line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    
    .github-stats {
      display: flex;
      gap: 1.5rem;
      margin-bottom: @margin-md;
      flex-wrap: wrap;
      
      .stat-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: @light-text;
        font-size: @font-size-xs;
        
        &::before {
          font-size: 1.1rem;
        }
        
        &:nth-child(1)::before {
          content: "★";
          color: @star-color;
        }
        
        &:nth-child(2)::before {
          content: "⑂";
          color: @fork-color;
        }
        
        &:nth-child(3)::before {
          content: "●";
          font-size: 0.7rem;
        }
      }
    }
    
    .github-link {
      display: inline-block;
      background: rgba(@primary-color, 0.1);
      color: @primary-color;
      text-decoration: none;
      padding: 0.6rem 1.2rem;
      border-radius: @border-radius-xs;
      font-weight: 500;
      transition: @transition;
      border: 1px solid rgba(@primary-color, 0.3);
      
      &:hover {
        background: @primary-color;
        color: @white;
        transform: translateY(-2px);
      }
    }
  }
}

// 推荐资源部分
.resources {
  padding: @margin-xxl 0;
  background-color: #fff5f5;
  margin-top: @margin-xxl;
  
  .container {
    .container-mixin;
  }
  
  h2 {
    .text-center;
    font-size: @font-size-xxl;
    margin-bottom: @margin-xl;
    color: @dark-gray;
  }
  
  .resources-grid {
    .grid-responsive;
  }
  
  .resource-card {
    .card-base;
    padding: @padding-lg;
    .card-hover;
    
    h3 {
      margin-top: 0;
      margin-bottom: @margin-md;
      font-size: @font-size-xl;
      color: @primary-color;
      font-weight: 600;
      border-bottom: 2px solid @primary-color;
      padding-bottom: 0.8rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: @margin-sm;
        padding-left: 1.5rem;
        position: relative;
        
        &::before {
          content: "→";
          position: absolute;
          left: 0;
          color: @primary-color;
          font-weight: bold;
        }
        
        a {
          color: @dark-gray;
          text-decoration: none;
          transition: @transition;
          display: inline-block;
          
          &:hover {
            color: @primary-color;
            transform: translateX(5px);
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  // 移动端减少动画延迟
  .article-card,
  .github-card {
    &:nth-child(2), &:nth-child(3), &:nth-child(4) {
      transition-delay: 0.1s;
    }
  }
  
  // GitHub 热门趋势移动端样式
  .github-grid {
    .grid-responsive;
  }
  
  // 推荐资源移动端样式
  .resources {
    padding: @margin-xxl 0;
    
    .resource-card {
      padding: @padding-md;
      border-radius: @border-radius-sm;
      box-shadow: @box-shadow-card;
      
      h3 {
        color: @gradient-start;
        margin-bottom: @margin-md;
      }
      
      li::before {
        color: @gradient-start;
      }
      
      a {
        transition: color 0.3s;
        
        &:hover {
          color: @gradient-start;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>