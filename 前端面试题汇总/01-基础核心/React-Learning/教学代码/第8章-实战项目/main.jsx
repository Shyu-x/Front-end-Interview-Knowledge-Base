/**
 * main.jsx - 应用入口文件
 * 负责渲染 React 应用到 DOM
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

/**
 * React 18 的渲染方式
 * 使用 createRoot API 进行并发渲染
 */
const root = ReactDOM.createRoot(document.getElementById('root'))

// 渲染应用
root.render(
  // 严格模式有助于发现潜在问题
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
