import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Articles from '../views/Articles.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import About from '../views/About.vue'
import Animation from '../views/Animation.vue'
import FilePreview from '../views/FilePreview.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail
  },
  {
    path: '/animation',
    name: 'Animation',
    component: Animation
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/file/:fileName?',
    name: 'FilePreview',
    component: FilePreview
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router