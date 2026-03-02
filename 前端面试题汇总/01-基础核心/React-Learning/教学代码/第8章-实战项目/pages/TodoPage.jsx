/**
 * TodoPage 组件 - 待办事项主页
 * 整合所有组件，形成完整的页面布局
 */
import React, { useState } from 'react'
import TodoHeader from '../components/TodoHeader'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import TodoFilter from '../components/TodoFilter'
import TodoStats from '../components/TodoStats'

const TodoPage = () => {
  // 本地状态：控制统计面板的显示/隐藏
  const [showStats, setShowStats] = useState(false)

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* 左侧：主功能区 */}
        <div style={styles.main}>
          {/* 头部 */}
          <TodoHeader />

          {/* 添加表单 */}
          <TodoForm />

          {/* 待办列表 */}
          <TodoList />

          {/* 筛选和操作栏 */}
          <TodoFilter />
        </div>

        {/* 右侧：统计面板（可折叠） */}
        <div style={styles.sidebar}>
          {/* 切换统计面板显示 */}
          <button
            onClick={() => setShowStats(!showStats)}
            style={styles.toggleButton}
          >
            {showStats ? '隐藏统计' : '显示统计'}
          </button>

          {/* 统计面板 */}
          {showStats && <TodoStats />}
        </div>
      </div>
    </div>
  )
}

// 样式对象
const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f2f5',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  container: {
    display: 'flex',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap'
  },
  main: {
    flex: '1 1 600px',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minHeight: '500px',
    overflow: 'hidden'
  },
  sidebar: {
    flex: '0 0 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  toggleButton: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
}

export default TodoPage
