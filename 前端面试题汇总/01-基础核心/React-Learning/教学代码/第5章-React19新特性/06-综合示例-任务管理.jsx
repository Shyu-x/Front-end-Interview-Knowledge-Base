/**
 * 示例6: 综合示例 - 任务管理应用
 *
 * 本示例展示如何组合使用 React 19 的多个新 Hooks:
 * - useActionState: 管理添加任务的状态
 * - useOptimistic: 乐观更新任务列表
 * - useFormStatus: 显示提交状态
 *
 * 这是一个完整的 CRUD 应用示例。
 */

import { useState, useOptimistic, useActionState } from 'react'
import { useFormStatus } from 'react-dom'

// ============================================
// 1. 模拟后端 API
// ============================================
const api = {
  /**
   * 获取所有任务
   */
  async fetchTasks() {
    await new Promise(r => setTimeout(r, 500))
    return [
      { id: 1, text: '学习 React 19', done: true },
      { id: 2, text: '掌握 useActionState', done: false },
      { id: 3, text: '实践乐观更新', done: false },
      { id: 4, text: '理解 use() Hook', done: false }
    ]
  },

  /**
   * 添加任务
   * @param {string} text - 任务文本
   */
  async addTask(text) {
    await new Promise(r => setTimeout(r, 500))
    return { id: Date.now(), text, done: false }
  },

  /**
   * 切换任务状态
   * @param {number} id - 任务ID
   */
  async toggleTask(id) {
    await new Promise(r => setTimeout(r, 300))
    return { success: true }
  },

  /**
   * 删除任务
   * @param {number} id - 任务ID
   */
  async deleteTask(id) {
    await new Promise(r => setTimeout(r, 300))
    return { success: true }
  }
}

// ============================================
// 2. Action 函数 - 添加任务
// ============================================
/**
 * 添加任务的 action 函数
 * @param {Object} previousState - 上一次状态
 * @param {FormData} formData - 表单数据
 */
async function addTaskAction(previousState, formData) {
  const text = formData.get('task')

  // 验证
  if (!text || text.trim().length === 0) {
    return { error: '任务不能为空' }
  }

  if (text.trim().length < 2) {
    return { error: '任务至少需要2个字符' }
  }

  try {
    await api.addTask(text)
    return { error: null, success: true }
  } catch (error) {
    return { error: '添加失败，请重试', success: false }
  }
}

// ============================================
// 3. 自定义提交按钮 (使用 useFormStatus)
// ============================================
function SubmitButton({ children }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={pending ? styles.submitBtnDisabled : styles.submitBtn}
    >
      {pending ? '添加中...' : children}
    </button>
  )
}

// ============================================
// 4. 任务列表项组件
// ============================================
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li style={{
      ...styles.taskItem,
      opacity: task.done ? 0.7 : 1,
      backgroundColor: task.done ? '#f5f5f5' : '#fff'
    }}>
      <label style={styles.taskLabel}>
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task)}
          style={styles.checkbox}
        />
        <span style={{
          ...styles.taskText,
          textDecoration: task.done ? 'line-through' : 'none',
          color: task.done ? '#999' : '#333'
        }}>
          {task.text}
        </span>
      </label>
      <button
        onClick={() => onDelete(task.id)}
        style={styles.deleteBtn}
      >
        删除
      </button>
    </li>
  )
}

// ============================================
// 5. 任务管理主组件
// ============================================
function TaskManager() {
  // 实际任务列表状态
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // 初始加载
  useState(() => {
    api.fetchTasks().then(t => {
      setTasks(t)
      setLoading(false)
    })
  }, [])

  // 乐观状态管理
  // 使用 useOptimistic 管理任务列表的乐观更新
  const [displayedTasks, updateTasks] = useOptimistic(
    tasks,
    // 更新函数: 处理不同类型的操作
    (state, action) => {
      switch (action.type) {
        case 'add':
          // 添加任务
          return [...state, action.task]
        case 'toggle':
          // 切换完成状态
          return state.map(t =>
            t.id === action.task.id ? { ...t, done: !t.done } : t
          )
        case 'delete':
          // 删除任务
          return state.filter(t => t.id !== action.taskId)
        default:
          return state
      }
    }
  )

  // 使用 useActionState 管理添加任务表单状态
  const [addState, addAction, isAdding] = useActionState(addTaskAction, {
    error: null,
    success: false
  })

  // 添加任务处理
  async function handleAdd(formData) {
    const text = formData.get('task')

    // 乐观添加 - 立即显示新任务
    updateTasks({
      type: 'add',
      task: { id: `temp-${Date.now()}`, text, done: false }
    })

    // 执行 action
    await addAction(formData)

    // 刷新实际状态
    setTasks(await api.fetchTasks())
  }

  // 切换任务状态
  async function handleToggle(task) {
    // 乐观更新
    updateTasks({ type: 'toggle', task })

    try {
      await api.toggleTask(task.id)
      setTasks(await api.fetchTasks())
    } catch (error) {
      console.error('切换失败:', error)
    }
  }

  // 删除任务
  async function handleDelete(taskId) {
    // 乐观删除
    updateTasks({ type: 'delete', taskId })

    try {
      await api.deleteTask(taskId)
      setTasks(await api.fetchTasks())
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  // 加载状态
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>加载中...</p>
      </div>
    )
  }

  // 统计数据
  const totalCount = displayedTasks.length
  const completedCount = displayedTasks.filter(t => t.done).length
  const pendingCount = totalCount - completedCount

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 任务管理器</h1>

      {/* 添加任务表单 - 使用 useActionState */}
      <form action={handleAdd} style={styles.form}>
        <input
          name="task"
          placeholder="添加新任务..."
          style={styles.input}
        />
        <SubmitButton>添加</SubmitButton>
      </form>

      {/* 错误提示 */}
      {addState.error && (
        <div style={styles.error}>{addState.error}</div>
      )}

      {/* 任务列表 - 使用 useOptimistic */}
      <div style={styles.listContainer}>
        <h3 style={styles.listTitle}>
          任务列表 {totalCount > 0 && `(${totalCount})`}
        </h3>

        {totalCount === 0 ? (
          <div style={styles.empty}>暂无任务</div>
        ) : (
          <ul style={styles.list}>
            {displayedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </div>

      {/* 统计信息 */}
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{totalCount}</span>
          <span style={styles.statLabel}>总计</span>
        </div>
        <div style={{ ...styles.statItem, backgroundColor: '#d4edda' }}>
          <span style={{ ...styles.statValue, color: '#155724' }}>{completedCount}</span>
          <span style={{ ...styles.statLabel, color: '#155724' }}>已完成</span>
        </div>
        <div style={{ ...styles.statItem, backgroundColor: '#fff3cd' }}>
          <span style={{ ...styles.statValue, color: '#856404' }}>{pendingCount}</span>
          <span style={{ ...styles.statLabel, color: '#856404' }}>待完成</span>
        </div>
      </div>

      {/* 说明 */}
      <div style={styles.explanation}>
        <h4>本示例使用的 React 19 新特性:</h4>
        <ul>
          <li><strong>useActionState</strong>: 管理添加任务的表单状态，自动处理 pending 状态</li>
          <li><strong>useOptimistic</strong>: 实现任务的乐观更新，添加、删除、切换状态时立即反映</li>
          <li><strong>useFormStatus</strong>: 在提交按钮中显示加载状态</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================
// 6. 样式对象
// ============================================
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#666'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #007bff',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 1s linear infinite'
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '14px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'border-color 0.3s'
  },
  submitBtn: {
    padding: '14px 28px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'background-color 0.3s'
  },
  submitBtnDisabled: {
    padding: '14px 28px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontSize: '15px',
    fontWeight: '600'
  },
  error: {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  listContainer: {
    marginBottom: '25px'
  },
  listTitle: {
    marginBottom: '15px',
    color: '#333'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s'
  },
  taskLabel: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: '12px',
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  taskText: {
    fontSize: '15px',
    transition: 'all 0.3s'
  },
  deleteBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background-color 0.3s'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    marginBottom: '30px'
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#e3f2fd',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1976d2'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666'
  },
  explanation: {
    padding: '20px',
    backgroundColor: '#e8f5e9',
    borderRadius: '12px',
    fontSize: '14px'
  }
}

export default TaskManager
