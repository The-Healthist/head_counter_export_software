import axios from 'axios'

// 创建 Axios 实例
const instance = axios.create({
  baseURL: '/', // 相对路径
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器（可选）
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加认证头
    // config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器（可选）
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default instance
