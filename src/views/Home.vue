<template>
  <div class="home">
    <div class="home-content">
      <div class="menu-container">
        <router-link to="/fish" class="effect-link fish-effect">鱼群效果</router-link>
        <router-link to="/leaves" class="effect-link leaves-effect">树叶效果</router-link>
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
      background: #112233; /* 鱼群效果页面的背景色 */
    }
    
    .leaves-effect {
      background: #4ecdc4; /* 树叶效果页面的主题色 */
    }
  }
}
</style>