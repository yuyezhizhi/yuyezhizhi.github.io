<template>
  <div class="home">
    <div class="home-content">
      <div class="menu-container">
        <!-- 原有链接 -->
        <router-link to="/fish" class="effect-link fish-effect">鱼群效果</router-link>
        <router-link to="/leaves" class="effect-link leaves-effect">树叶效果</router-link>
        <router-link to="/fishgroup" class="effect-link fishgroup-effect">鱼群效果2</router-link>
        <router-link to="/datavortex" class="effect-link data-effect">螺旋数据</router-link>
        <router-link to="/butterfly" class="effect-link butterfly-effect">蝴蝶网</router-link>
        <router-link to="/raintext" class="effect-link rain-effect">文字雨滴</router-link>
        <router-link to="/spinningtops" class="effect-link spinning-effect">陀螺碰撞</router-link>
        <router-link to="/interactivetnet" class="effect-link net-effect">交互网</router-link>
        <router-link to="/dancer" class="effect-link dancer-effect">光之舞者</router-link>

        <!-- 新增 p5.js 创意交互页面 -->
        <router-link to="/gravity-particles" class="effect-link gravity-effect">重力粒子</router-link>
        <router-link to="/audio-visualizer" class="effect-link audio-effect">音乐可视化</router-link>
        <router-link to="/meteor-shower" class="effect-link meteor-effect">流星雨</router-link>
        <router-link to="/fluid-simulation" class="effect-link fluid-effect">流体模拟</router-link>
        <router-link to="/cellular-automata" class="effect-link cellular-effect">细胞自动机</router-link>

        <!-- 新增治愈系动画页面 -->
        <router-link to="/bubble-pop" class="effect-link bubble-effect">彩色泡泡</router-link>
        <router-link to="/flower-garden" class="effect-link flower-effect">花朵花园</router-link>
        <router-link to="/rainbow-wave" class="effect-link rainbow-effect">彩虹波浪</router-link>
        <router-link to="/starlight-dance" class="effect-link starlight-effect">星光舞蹈</router-link>
        <router-link to="/candy-rain" class="effect-link candy-effect">糖果雨</router-link>
        <router-link to="/lotus-pond" class="effect-link lotus-effect">荷塘小舟</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style scoped lang="less">
.home {
  background: #fff5f5;
  padding: 2rem;
  
  .home-content {
    padding: 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    
    .menu-container {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .effect-link {
      display: inline-block;
      padding: 0.8rem 2rem;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: transform 0.3s, box-shadow 0.3s;
      color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
      }
    }
    
    .fish-effect {
      background: #112233;
    }
    
    .leaves-effect {
      background: #4ecdc4;
    }
    
    .fishgroup-effect {
      background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    }
    
    .data-effect {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .butterfly-effect {
      background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    }
    
    .rain-effect {
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    }
    
    .spinning-effect {
      background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    }
    
    .net-effect {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .dancer-effect {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }
    
    /* 新增 p5.js 创意交互页面样式 */
    .gravity-effect {
      background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    }

    .audio-effect {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .meteor-effect {
      background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
    }

    .fluid-effect {
      background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
    }

    .cellular-effect {
      background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
    }

    /* 新增治愈系动画页面样式 */
    .bubble-effect {
      background: linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%);
    }

    .flower-effect {
      background: linear-gradient(135deg, #ffcccc 0%, #ffb3ba 50%, #ffdfba 100%);
    }

    .rainbow-effect {
      background: linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #48dbfb 50%, #ff9ff3 75%, #54a0ff 100%);
    }

    .starlight-effect {
      background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #fff9c4 100%);
    }

    .candy-effect {
      background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a8edea 100%);
    }

    .lotus-effect {
      background: linear-gradient(135deg, #a8e063 0%, #56ab2f 100%);
    }
  }
}
</style>
