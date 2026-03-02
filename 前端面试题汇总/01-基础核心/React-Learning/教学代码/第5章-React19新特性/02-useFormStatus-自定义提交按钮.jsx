/**
 * 示例2: useFormStatus - 自定义提交按钮
 *
 * 本示例展示如何使用 useFormStatus 来获取表单提交状态。
 * useFormStatus 是来自 react-dom 的 Hook，用于获取表单提交时的状态信息。
 *
 * 核心概念:
 * - 必须在 <form> 的子树中使用
 * - 返回 { pending, data, method, action }
 * - 可以在表单任意位置使用
 */

import { useFormStatus } from 'react-dom'

// ============================================
// 1. 自定义提交按钮组件
// ============================================
/**
 * 带加载状态的提交按钮
 * 使用 useFormStatus 获取表单状态
 *
 * @param {React.ReactNode} children - 按钮文字
 */
function SubmitButton({ children }) {
  // 获取表单提交状态
  // useFormStatus 必须在 <form> 组件的子树中调用
  const { pending, data, method } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={pending ? styles.buttonDisabled : styles.button}
    >
      {pending ? (
        <>
          <span style={styles.spinner}></span>
          提交中...
        </>
      ) : (
        <>
          {children}
          {method && <span style={styles.method}> ({method.toUpperCase()})</span>}
        </>
      )}
    </button>
  )
}

// ============================================
// 2. 重置按钮组件
// ============================================
/**
 * 重置按钮 - 不受表单状态影响
 *
 * @param {React.ReactNode} children - 按钮文字
 */
function ResetButton({ children }) {
  return (
    <button type="reset" style={styles.resetButton}>
      {children}
    </button>
  )
}

// ============================================
// 3. 状态显示面板组件
// ============================================
/**
 * 表单状态显示面板
 * 展示表单提交的所有状态信息
 */
function FormStatusPanel() {
  const { pending, data, method, action } = useFormStatus()

  // 没有表单提交时显示空状态
  if (!pending && !data) {
    return (
      <div style={styles.idle}>
        <span>📝</span> 请填写并提交表单
      </div>
    )
  }

  return (
    <div style={styles.panel}>
      {/* 加载状态 */}
      {pending && (
        <div style={styles.pending}>
          <div style={styles.spinnerLarge}></div>
          <span>正在提交...</span>
        </div>
      )}

      {/* 数据预览 */}
      {data && (
        <div style={styles.dataPreview}>
          <h4 style={styles.dataTitle}>提交数据预览:</h4>
          <pre style={styles.pre}>
{JSON.stringify(Object.fromEntries(data), null, 2)}
          </pre>
          <div style={styles.meta}>
            <span>提交方法: {method?.toUpperCase()}</span>
            <span>Action: {action || 'inline'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// 4. 完整表单示例
// ============================================
function FeedbackForm() {
  // 模拟提交处理函数
  async function handleSubmit(formData) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 打印提交数据
    console.log('提交数据:', Object.fromEntries(formData))

    return { success: true }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>反馈表单</h2>

      <form action={handleSubmit}>
        <div style={styles.field}>
          <label htmlFor="username" style={styles.label}>用户名</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="请输入用户名"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="email" style={styles.label}>邮箱</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="example@mail.com"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="feedback" style={styles.label}>反馈内容</label>
          <textarea
            id="feedback"
            name="feedback"
            rows="4"
            required
            placeholder="请输入您的反馈..."
            style={styles.textarea}
          />
        </div>

        <div style={styles.buttonGroup}>
          {/* 使用自定义提交按钮 */}
          <SubmitButton>提交反馈</SubmitButton>
          {/* 使用重置按钮 */}
          <ResetButton>重置</ResetButton>
        </div>
      </form>

      {/* 在表单外部使用 useFormStatus - 展示状态面板 */}
      <FormStatusPanel />
    </div>
  )
}

// ============================================
// 5. 样式对象
// ============================================
const styles = {
  container: {
    maxWidth: '550px',
    margin: '0 auto',
    padding: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333'
  },
  field: {
    marginBottom: '18px',
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
    fontSize: '14px'
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px'
  },
  button: {
    flex: '1',
    padding: '14px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  buttonDisabled: {
    flex: '1',
    padding: '14px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontSize: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  resetButton: {
    flex: '1',
    padding: '14px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600'
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid #fff',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  spinnerLarge: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid #007bff',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  method: {
    fontSize: '12px',
    opacity: 0.8
  },
  idle: {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  panel: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  pending: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#007bff',
    fontWeight: 'bold',
    padding: '10px'
  },
  dataPreview: {
    marginTop: '15px'
  },
  dataTitle: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#555'
  },
  pre: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '12px',
    overflow: 'auto',
    maxHeight: '200px',
    margin: '0'
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    fontSize: '12px',
    color: '#666'
  }
}

export default FeedbackForm
