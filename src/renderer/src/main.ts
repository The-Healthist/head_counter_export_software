import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/router' // Import the router instance

// 创建 Pinia 实例
const pinia = createPinia()
const app = createApp(App)

// 使用 Pinia
app.use(pinia)
// 使用 Vue Router
app.use(router) // Use the router instance

app.mount('#app')
