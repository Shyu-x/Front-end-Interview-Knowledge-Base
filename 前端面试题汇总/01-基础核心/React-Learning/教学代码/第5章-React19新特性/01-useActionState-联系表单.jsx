/**
 * 示例1: useActionState - 联系表单
 *
 * 本示例展示如何使用 useActionState 来管理联系表单的状态。
 * useActionState 是 React 19 引入的核心 Hook，用于处理表单提交的状态管理。
 *
 * 核心概念:
 * - actionFunction: 异步函数，接收 (previousState, formData) 作为参数
 * - 返回 [state, formAction, isPending]
 * - 自动管理 pending 状态
 */

import { useActionState } from 'react'

// ============================================
// 1. 模拟后端 API
// ============================================
const mockAPI = {
  /**
   * 提交联系表单
   * @param {FormData} data - 表单数据
   * @returns {Promise<Object>} - 提交结果
   */
  async submitContact(data) {
    // 模拟网络延迟 (1秒)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟验证：不允许使用 admin 邮箱
    const email = data.get('email')
    if (email?.includes('admin')) {
      throw new Error('不允许使用 admin 邮箱')
    }

    return { success: true, message: '提交成功！我们会尽快联系您。' }
  }
}

// ============================================
// 2. Action 函数 - 处理表单提交
// ============================================
/**
 * 联系表单的 action 函数
 * @param {Object} previousState - 上一次表单状态
 * @param {FormData} formData - 表单数据
 * @returns {Object} - 新状态
 */
async function contactFormAction(previousState, formData) {
  // 步骤1: 获取表单数据
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  // 步骤2: 表单验证
  const errors = {}

  // 验证姓名
  if (!name || name.trim().length < 2) {
    errors.name = '姓名至少需要2个字符'
  }

  // 验证邮箱
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    errors.email = '请输入有效的邮箱地址'
  }

  // 验证留言
  if (!message || message.trim().length < 10) {
    errors.message = '留言至少需要10个字符'
  }

  // 如果有验证错误，返回错误状态
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      values: { name, email, message }
    }
  }

  // 步骤3: 提交到服务器
  try {
    const result = await mockAPI.submitContact(formData)
    return {
      success: true,
      message: result.message,
      errors: {},
      values: {}
    }
  } catch (error) {
    // 处理服务器错误
    return {
      success: false,
      errors: { form: error.message },
      values: { name, email, message }
    }
  }
}

// ============================================
// 3. 联系表单组件
// ============================================
function ContactForm() {
  // 使用 useActionState 管理表单状态
  // 参数: action函数, 初始状态
  const [formState, formAction, isPending] = useActionState(contactFormAction, {
    success: false,
    errors: {},
    values: {},
    message: ''
  })

  // 成功时显示成功消息
  if (formState.success) {
    return (
      <div style={styles.successBox}>
        <h2 style={styles.successIcon}>🎉</h2>
        <h2>提交成功！</h2>
        <p>{formState.message}</p>
        <button
          onClick={() => window.location.reload()}
          style={styles.reloadButton}
        >
          提交另一个
        </button>
      </div>
    )
  }

  // 渲染表单
  return (
    <form action={formAction} style={styles.form}>
      <h2 style={styles.title}>联系我们</h2>

      {/* 全局错误提示 */}
      {formState.errors?.form && (
        <div style={styles.globalError}>
          {formState.errors.form}
        </div>
      )}

      {/* 姓名字段 */}
      <div style={styles.field}>
        <label htmlFor="name" style={styles.label}>姓名</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="请输入您的姓名"
          defaultValue={formState.values?.name}
          style={styles.input}
        />
        {formState.errors?.name && (
          <span style={styles.error}>{formState.errors.name}</span>
        )}
      </div>

      {/* 邮箱字段 */}
      <div style={styles.field}>
        <label htmlFor="email" style={styles.label}>邮箱</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="example@mail.com"
          defaultValue={formState.values?.email}
          style={styles.input}
        />
        {formState.errors?.email && (
          <span style={styles.error}>{formState.errors.email}</span>
        )}
      </div>

      {/* 留言字段 */}
      <div style={styles.field}>
        <label htmlFor="message" style={styles.label}>留言</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder="请输入留言内容（至少10个字符）..."
          defaultValue={formState.values?.message}
          style={styles.textarea}
        />
        {formState.errors?.message && (
          <span style={styles.error}>{formState.errors.message}</span>
        )}
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={isPending}
        style={isPending ? styles.submitBtnDisabled : styles.submitBtn}
      >
        {isPending ? '提交中...' : '提交'}
      </button>
    </form>
  )
}

// ============================================
// 4. 样式对象
// ============================================
const styles = {
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333'
  },
  field: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#555'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s'
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  error: {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '6px'
  },
  globalError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s'
  },
  submitBtnDisabled: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontSize: '16px',
    fontWeight: '600'
  },
  successBox: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#d4edda',
    borderRadius: '12px',
    border: '1px solid #c3e6cb'
  },
  successIcon: {
    fontSize: '48px',
    margin: '0 0 10px 0'
  },
  reloadButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  }
}

export default ContactForm
