/**
 * TodoStats 组件 - 统计信息展示
 * 以更详细的方式展示待办事项的统计信息
 */
import React from 'react'
import useTodoStore from '../stores/todoStore'

const TodoStats = () => {
  // 从 store 获取所有数据
  const todos = useTodoStore((state) => state.todos)

  // 计算各项统计数据
  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const active = total - completed

  // 计算完成百分比
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  // 按分类统计
  const categoryStats = todos.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1
    return acc
  }, {})

  // 按完成状态统计每个分类
  const categoryCompleted = todos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = { total: 0, completed: 0 }
    }
    acc[todo.category].total++
    if (todo.completed) {
      acc[todo.category].completed++
    }
    return acc
  }, {})

  // 获取所有分类
  const categories = ['工作', '生活', '学习', '健康', '娱乐']

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>统计面板</h3>

      {/* 总体统计 */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{total}</span>
          <span style={styles.statLabel}>总待办</span>
        </div>
        <div style={{ ...styles.statCard, ...styles.activeCard }}>
          <span style={styles.statNumber}>{active}</span>
          <span style={styles.statLabel}>待完成</span>
        </div>
        <div style={{ ...styles.statCard, ...styles.completedCard }}>
          <span style={styles.statNumber}>{completed}</span>
          <span style={styles.statLabel}>已完成</span>
        </div>
        <div style={{ ...styles.statCard, ...styles.rateCard }}>
          <span style={styles.statNumber}>{completionRate}%</span>
          <span style={styles.statLabel}>完成率</span>
        </div>
      </div>

      {/* 进度条 */}
      <div style={styles.progressContainer}>
        <div style={styles.progressLabel}>
          <span>完成进度</span>
          <span>{completed}/{total}</span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${completionRate}%`
            }}
          />
        </div>
      </div>

      {/* 分类统计 */}
      <div style={styles.categorySection}>
        <h4 style={styles.categoryTitle}>分类统计</h4>
        {categories.map((cat) => {
          const stat = categoryCompleted[cat]
          const count = stat ? stat.total : 0
          const catCompleted = stat ? stat.completed : 0

          if (count === 0) return null

          return (
            <div key={cat} style={styles.categoryItem}>
              <div style={styles.categoryInfo}>
                <span style={styles.categoryName}>{cat}</span>
                <span style={styles.categoryCount}>
                  {catCompleted}/{count}
                </span>
              </div>
              <div style={styles.categoryProgress}>
                <div
                  style={{
                    ...styles.categoryFill,
                    width: `${count > 0 ? (catCompleted / count) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 样式对象
const styles = {
  container: {
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    color: '#2d3748'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '20px'
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    background: '#f7fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  activeCard: {
    background: '#ebf8ff',
    borderColor: '#90cdf4'
  },
  completedCard: {
    background: '#f0fff4',
    borderColor: '#9ae6b4'
  },
  rateCard: {
    background: '#fffaf0',
    borderColor: '#fbd38d'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748'
  },
  statLabel: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '4px'
  },
  progressContainer: {
    marginBottom: '20px'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#4a5568'
  },
  progressBar: {
    height: '12px',
    background: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '6px',
    transition: 'width 0.3s ease'
  },
  categorySection: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px'
  },
  categoryTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#4a5568'
  },
  categoryItem: {
    marginBottom: '12px'
  },
  categoryInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: '13px'
  },
  categoryName: {
    color: '#4a5568'
  },
  categoryCount: {
    color: '#718096'
  },
  categoryProgress: {
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  categoryFill: {
    height: '100%',
    background: '#667eea',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  }
}

export default TodoStats
