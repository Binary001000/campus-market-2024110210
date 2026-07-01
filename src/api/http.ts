import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3001',  // JSON Server Mock 服务地址
  timeout: 5000,                     // 请求超时（单位 ms）
})

export default http
