/**
 * TodoFilter 组件 - 筛选和操作栏
 * 提供状态筛选、分类筛选、清除已完成等功能
 */
import React from 'react'
import useTodoStore from '../stores/todoStore'

// 状态筛选选项
const FILTER_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '待完成' },
  { value: 'completed', label: '已完成' }
]

// 分类选项
const CATEGORY_OPTIONS = [
  { value: 'all', label: '全部分类' },
  { value: '工作', label: '工作' },
  { value: '生活', label: '生活' },
  { value: '学习', label: '学习' },
  { value: '健康', label: '健康' },
  { value: '娱乐', label: '娱乐' }
]

const TodoFilter = () => {
  // 从 store 获取状态和方法
  const filter = useTodoStore((state) => state.filter)
  const category = useTodoStore((state) => state.category)
  const setFilter = useTodoStore((state) => state.setFilter)
  const setCategory = useTodoStore((state) => state.setCategory)
  const clearCompleted = useTodoStore((state) => state.clearCompleted)
  const todos = useTodoStore((state) => state.todos)

  // 计算已完成数量
  const completedCount = todos.filter((t) => t.completed).length

  // 处理清除已完成
  const handleClearCompleted = () => {
    if (completedCount === 0) {
      alert('没有已完成的待办事项')
      return
    }
    if (window.confirm(`确定要清除所有已完成的待办事项吗？（共 ${completedCount} 项）`)) {
      clearCompleted()
    }
  }

  return (
    <div style={styles.filterBar}>
      {/* 左侧：状态筛选 */}
      <div style={styles.filterGroup}>
        <span style={styles.label}>状态:</span>
        <div style={styles.buttonGroup}>
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              style={{
                ...styles.filterButton,
                ...(filter === option.value ? styles.activeButton : {})
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 中间：分类筛选 */}
      <div style={styles.filterGroup}>
        <span style={styles.label}>分类:</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 右侧：清除已完成 */}
      <div style={styles.filterGroup}>
        <button
          onClick={handleClearCompleted}
          style={styles.clearButton}
          disabled={completedCount === 0}
        >
          清除已完成 ({completedCount})
        </button>
      </div>
    </div>
  )
}

// 样式对象
const styles = {
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: '#f8f9fa',
    borderTop: '1px solid #e9ecef',
    flexWrap: 'wrap',
    gap: '12px'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    color: '#4a5568',
    fontWeight: '500'
  },
  buttonGroup: {
    display: 'flex',
    gap: '4px'
  },
  filterButton: {
    padding: '6px 14px',
    fontSize: '14px',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    background: 'white',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  activeButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderColor: 'transparent'
  },
  select: {
    padding: '6px 12px',
    fontSize: '14px',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
    outline: 'none'
  },
  clearButton: {
    padding: '8px 16px',
    fontSize: '14px',
    border: '1px solid #fc8181',
    borderRadius: '6px',
    background: 'white',
    color: '#e53e3e',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
}

export default TodoFilter
