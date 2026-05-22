import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
}

// 全局属性
app.config.globalProperties.$appName = '晓点滴'

app.use(router)
app.mount('#app')
