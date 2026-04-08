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
  },
  {
    path: '/fishgroup',
    name: 'FishGroup',
    component: () => import('../views/fishGroup.vue')
  },
  {
    path: '/datavortex',
    name: 'DataVortex',
    component: () => import('../views/DataVortex.vue')
  },
  {
    path: '/butterfly',
    name: 'ButterflyNet',
    component: () => import('../views/ButterflyNet.vue')
  },
  {
    path: '/raintext',
    name: 'RainText',
    component: () => import('../views/RainText.vue')
  },
  {
    path: '/spinningtops',
    name: 'SpinningTops',
    component: () => import('../views/SpinningTops.vue')
  },
  {
    path: '/interactivetnet',
    name: 'InteractiveNet',
    component: () => import('../views/InteractiveNet.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
