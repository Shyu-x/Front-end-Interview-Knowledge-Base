/**
 * TodoForm 组件 - 添加待办事项表单
 * 支持输入待办内容和选择分类
 */
import React, { useState } from 'react'
import useTodoStore from '../stores/todoStore'

const CATEGORIES = ['工作', '生活', '学习', '健康', '娱乐']

const TodoForm = () => {
  // 本地状态：输入的文本和选中的分类
  const [text, setText] = useState('')
  const [category, setCategory] = useState('工作')

  // 从 store 中获取 addTodo 方法
  const addTodo = useTodoStore((state) => state.addTodo)

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault() // 阻止表单默认提交行为

    // 验证输入
    const trimmedText = text.trim()
    if (!trimmedText) {
      alert('请输入待办事项内容')
      return
    }

    // 调用 store 方法添加待办
    addTodo(trimmedText, category)

    // 重置表单
    setText('')
    setCategory('工作')
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        {/* 文本输入框 */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="添加新的待办事项..."
          style={styles.input}
        />

        {/* 分类选择下拉框 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 提交按钮 */}
        <button type="submit" style={styles.button}>
          添加
        </button>
      </div>
    </form>
  )
}

// 样式对象
const styles = {
  form: {
    padding: '20px',
    background: '#f8f9fa',
    borderBottom: '1px solid #e9ecef'
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  select: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    outline: 'none'
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  }
}

export default TodoForm
