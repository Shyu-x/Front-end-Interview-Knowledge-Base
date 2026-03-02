/**
 * App 组件 - 待办事项管理应用入口
 * 整个应用的根组件
 */
import React from 'react'
import TodoPage from './pages/TodoPage'

/**
 * App 根组件
 * 使用函数式组件 + Hooks
 * 负责整个应用的布局和结构
 */
const App = () => {
  return (
    <div>
      {/* 渲染待办事项页面 */}
      <TodoPage />
    </div>
  )
}

export default App
