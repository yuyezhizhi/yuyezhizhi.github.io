import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/fish',
    name: 'Fish',
    component: () => import('../views/FishPage.vue')
  },
  {
    path: '/leaves',
    name: 'Leaves',
    component: () => import('../views/LeavesPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  // 配置路由滚动行为，切换路由时滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（如使用浏览器前进/后退按钮），则恢复到该位置
    if (savedPosition) {
      return savedPosition
    } else {
      // 否则滚动到顶部
      return { top: 0 }
    }
  }
})

export default router