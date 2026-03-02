/**
 * TodoList 组件 - 待办事项列表
 * 显示所有待办事项，支持空状态展示
 */
import React from 'react'
import useTodoStore from '../stores/todoStore'
import TodoItem from './TodoItem'

const TodoList = () => {
  // 从 store 获取筛选后的待办列表
  const getFilteredTodos = useTodoStore((state) => state.getFilteredTodos)
  const todos = getFilteredTodos()

  return (
    <div style={styles.list}>
      {todos.length === 0 ? (
        // 空状态：没有任何待办事项
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>&#128203;</div>
          <p style={styles.emptyText}>暂无待办事项</p>
          <p style={styles.emptyHint}>在上方添加你的第一个待办事项吧！</p>
        </div>
      ) : (
        // 渲染待办事项列表
        todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
      )}
    </div>
  )
}

// 样式对象
const styles = {
  list: {
    flex: 1,
    overflowY: 'auto',
    background: 'white',
    minHeight: '300px'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: '#a0aec0'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5
  },
  emptyText: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 8px 0'
  },
  emptyHint: {
    fontSize: '14px',
    margin: 0
  }
}

export default TodoList
