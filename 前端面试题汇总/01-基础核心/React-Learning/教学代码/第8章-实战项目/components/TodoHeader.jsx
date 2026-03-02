/**
 * TodoHeader 组件 - 待办事项应用头部
 * 显示应用标题和统计信息
 */
import React from 'react'
import useTodoStore from '../stores/todoStore'

const TodoHeader = () => {
  // 从 store 中获取统计数据
  const { total, completed, active } = useTodoStore((state) => state.getStats())

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>待办事项管理器</h1>
      <div style={styles.stats}>
        <span style={styles.statItem}>
          全部: <strong>{total}</strong>
        </span>
        <span style={styles.statItem}>
          已完成: <strong>{completed}</strong>
        </span>
        <span style={styles.statItem}>
          待完成: <strong>{active}</strong>
        </span>
      </div>
    </header>
  )
}

// 样式对象
const styles = {
  header: {
    textAlign: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '12px 12px 0 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '28px',
    fontWeight: '600'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    fontSize: '14px'
  },
  statItem: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    backdropFilter: 'blur(4px)'
  }
}

export default TodoHeader
