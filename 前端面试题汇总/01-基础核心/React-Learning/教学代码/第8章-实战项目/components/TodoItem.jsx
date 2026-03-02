/**
 * TodoItem 组件 - 单个待办事项项
 * 显示待办内容，支持编辑、删除、标记完成等操作
 */
import React, { useState } from 'react'
import useTodoStore from '../stores/todoStore'

const CATEGORY_COLORS = {
  工作: '#e74c3c',
  生活: '#3498db',
  学习: '#2ecc71',
  健康: '#f39c12',
  娱乐: '#9b59b6'
}

const TodoItem = ({ todo }) => {
  // 本地状态：编辑模式
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  // 从 store 获取操作方法
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const deleteTodo = useTodoStore((state) => state.deleteTodo)
  const editTodo = useTodoStore((state) => state.editTodo)

  // 处理完成状态切换
  const handleToggle = () => {
    toggleTodo(todo.id)
  }

  // 处理删除
  const handleDelete = () => {
    if (window.confirm('确定要删除这个待办事项吗？')) {
      deleteTodo(todo.id)
    }
  }

  // 开始编辑
  const handleEditStart = () => {
    setEditText(todo.text)
    setIsEditing(true)
  }

  // 取消编辑
  const handleEditCancel = () => {
    setIsEditing(false)
    setEditText(todo.text)
  }

  // 保存编辑
  const handleEditSave = () => {
    const trimmedText = editText.trim()
    if (!trimmedText) {
      alert('待办事项内容不能为空')
      return
    }
    editTodo(todo.id, trimmedText)
    setIsEditing(false)
  }

  // 处理键盘事件（Enter 保存，Escape 取消）
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave()
    } else if (e.key === 'Escape') {
      handleEditCancel()
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={styles.item}>
      {/* 复选框 - 标记完成状态 */}
      <label style={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          style={styles.checkbox}
        />
        <span
          style={{
            ...styles.checkmark,
            background: todo.completed ? '#2ecc71' : 'transparent',
            borderColor: todo.completed ? '#2ecc71' : '#cbd5e0'
          }}
        >
          {todo.completed && <span style={styles.checkIcon}>&#10003;</span>}
        </span>
      </label>

      {/* 待办内容区域 */}
      <div style={styles.content}>
        {isEditing ? (
          // 编辑模式：显示输入框
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEditSave}
            autoFocus
            style={styles.editInput}
          />
        ) : (
          // 显示模式
          <>
            <span
              style={{
                ...styles.text,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#a0aec0' : '#2d3748'
              }}
            >
              {todo.text}
            </span>

            {/* 分类标签 */}
            <span
              style={{
                ...styles.category,
                background: CATEGORY_COLORS[todo.category] || '#cbd5e0'
              }}
            >
              {todo.category}
            </span>
          </>
        )}
      </div>

      {/* 操作按钮区域 */}
      <div style={styles.actions}>
        {/* 创建时间 */}
        <span style={styles.date}>{formatDate(todo.createdAt)}</span>

        {/* 编辑按钮 */}
        {!isEditing && !todo.completed && (
          <button
            onClick={handleEditStart}
            style={{ ...styles.actionButton, ...styles.editButton }}
            title="编辑"
          >
            &#9998;
          </button>
        )}

        {/* 删除按钮 */}
        <button
          onClick={handleDelete}
          style={{ ...styles.actionButton, ...styles.deleteButton }}
          title="删除"
        >
          &#10005;
        </button>
      </div>
    </div>
  )
}

// 样式对象
const styles = {
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'white',
    borderBottom: '1px solid #e9ecef',
    transition: 'background 0.2s'
  },
  checkboxLabel: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginRight: '16px'
  },
  checkbox: {
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer'
  },
  checkmark: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    border: '2px solid',
    borderRadius: '50%',
    transition: 'all 0.2s'
  },
  checkIcon: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  text: {
    fontSize: '16px',
    transition: 'all 0.2s'
  },
  category: {
    padding: '4px 12px',
    fontSize: '12px',
    color: 'white',
    borderRadius: '12px',
    fontWeight: '500'
  },
  editInput: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '16px',
    border: '2px solid #667eea',
    borderRadius: '6px',
    outline: 'none'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  date: {
    fontSize: '12px',
    color: '#a0aec0',
    marginRight: '8px'
  },
  actionButton: {
    padding: '6px 10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  editButton: {
    background: '#edf2f7',
    color: '#4a5568'
  },
  deleteButton: {
    background: '#fed7d7',
    color: '#e53e3e'
  }
}

export default TodoItem
