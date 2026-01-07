import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 全局注册hljs
app.config.globalProperties.$hljs = hljs