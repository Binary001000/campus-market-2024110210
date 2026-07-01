import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())    // 注册 Pinia 状态管理
app.use(router)           // 注册 Vue Router
app.use(ElementPlus)      // 注册 Element Plus UI 库

app.mount('#app')         // 挂载到 index.html 的 #app 容器
