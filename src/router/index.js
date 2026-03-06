import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../views/Articles.vue')
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail.vue')
  },
  {
    path: '/animation',
    name: 'Animation',
    component: () => import('../views/Animation.vue')
  },
  {
    path: '/interview',
    name: 'Interview',
    component: () => import('../views/Interview.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/file/:fileName?',
    name: 'FilePreview',
    component: () => import('../views/FilePreview.vue')
  },
  {
    path: '/ai',
    name: 'AI',
    component: () => import('../views/AI.vue')
  },
  {
    path: '/wechat-publish',
    name: 'WechatPublish',
    component: () => import('../views/WechatPublish.vue')
  },
  // 404 路由，必须放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
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