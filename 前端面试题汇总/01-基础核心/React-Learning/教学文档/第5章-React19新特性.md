# 第5章：React 19 新特性

> 本章将详细介绍 React 19 引入的新特性和新 Hooks，通过大量图解和示例，帮助你深入理解这些新特性。
>
> **前置知识**：本章假设你已掌握 React 基础，包括函数组件、useState、useEffect 等基础 Hooks。

---

## 5.1 React 19 概述

### 5.1.1 为什么需要 React 19？

React 19 是 React 框架的重大版本更新，它解决了现代 Web 开发中的多个痛点：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         React 19 解决的问题                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │
│  │   表单处理复杂   │   │   数据获取繁琐   │   │   用户体验延迟   │           │
│  │                 │   │                 │   │                 │           │
│  │  传统表单需要    │   │  需要 useEffect │   │  等待服务器响应  │           │
│  │  大量状态管理    │   │  + useState     │   │  导致 UI 卡顿    │           │
│  │                 │   │  + useReducer   │   │                 │           │
│  └────────┬────────┘   └────────┬────────┘   └────────┬────────┘           │
│           │                      │                      │                      │
│           └──────────────────────┼──────────────────────┘                      │
│                                  │                                             │
│                                  ▼                                             │
│                     ┌─────────────────────┐                                   │
│                     │   React 19 解决方案  │                                   │
│                     │                     │                                   │
│                     │  - useActionState   │                                   │
│                     │  - useFormStatus    │                                   │
│                     │  - useOptimistic    │                                   │
│                     │  - use()            │                                   │
│                     └─────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.1.2 React 19 新特性一览

| 特性 | 引入版本 | 描述 | 解决的问题 |
|------|----------|------|-----------|
| **useActionState** | React 19 RC | 表单 action 状态管理 | 表单状态管理复杂 |
| **useFormStatus** | React 19 RC | 获取表单提交状态 | 无法获取表单提交状态 |
| **useOptimistic** | React 19 RC | 乐观更新 | 用户体验延迟 |
| **use()** | React 19 RC | 通用数据获取 | 数据获取繁琐 |
| **Actions** | React 19 RC | 表单 action 支持异步 | 表单提交逻辑复杂 |
| **useFormStatus** | React 19.2 | 改进的 ref 清理 | ref 内存泄漏 |
| **Document Metadata** | React 19 | 文档元数据支持 | SEO 问题 |
| **PPR (部分预渲染)** | React 19.2 | 部分预渲染 | 首屏加载慢 |

### 5.1.3 安装 React 19

```bash
# 方法1: 使用 Vite 创建 React 19 项目
npm create vite@latest my-react19-app -- --template react

# 方法2: 在现有项目中升级
npm install react@latest react-dom@latest

# 验证版本
npm list react react-dom
```

---

## 5.2 useActionState - 表单状态管理

### 5.2.1 什么是 useActionState？

`useActionState` 是 React 19 引入的核心 Hook，专门用于处理表单提交的状态管理。它将表单提交逻辑、状态管理和加载状态集成到一个 Hook 中。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        useActionState 工作流程                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    用户点击提交                                                             │
│         │                                                                  │
│         ▼                                                                  │
│  ┌──────────────┐                                                         │
│  │ formAction   │ ◄── 由 useActionState 返回                              │
│  └──────┬───────┘                                                         │
│         │                                                                  │
│         ▼                                                                  │
│  ┌──────────────────────────────────────┐                                 │
│  │       actionFunction                 │                                 │
│  │  (异步函数，接收 FormData)           │                                 │
│  └──────┬───────────────────────────────┘                                 │
│         │                                                                  │
│         ▼                                                                  │
│  ┌──────────────────────────────────────┐                                 │
│  │   返回新状态                          │                                 │
│  │   state = { success, errors, ... }   │                                 │
│  └──────────────────────────────────────┘                                 │
│         │                                                                  │
│         ▼                                                                  │
│    组件重新渲染，显示结果                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2.2 基本语法

```jsx
import { useActionState } from 'react'

const [state, formAction, isPending] = useActionState(actionFunction, initialState)
```

**参数详解：**

| 参数 | 类型 | 描述 |
|------|------|------|
| `actionFunction` | `Function` | 异步函数，接收 `(previousState, formData)` 作为参数 |
| `initialState` | `any` | 初始状态，任何可序列化的值 |

**返回值：**

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `state` | `any` | 当前状态，action 函数返回的最新值 |
| `formAction` | `Function` | 可以传递给表单 `action` 属性的函数 |
| `isPending` | `boolean` | 表示 action 是否正在执行 |

### 5.2.3 基础示例：简单计数器

```jsx
import { useActionState } from 'react'

// ============================================
// 1. 定义 action 函数
// ============================================
/**
 * 递增计数器
 * @param {number} previousState - 上一次的状态值
 * @param {FormData} formData - 表单数据（可选）
 * @returns {number} - 新的状态值
 */
async function incrementAction(previousState, formData) {
  // 模拟异步操作（如 API 调用）
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 返回新状态
  return previousState + 1
}

// ============================================
// 2. 组件中使用
// ============================================
function Counter() {
  const [count, formAction, isPending] = useActionState(incrementAction, 0)

  return (
    <form action={formAction}>
      <p>当前计数: {count}</p>
      <button type="submit" disabled={isPending}>
        {isPending ? '计算中...' : '加 1'}
      </button>
    </form>
  )
}
```

### 5.2.4 进阶示例：带验证的表单

```jsx
import { useActionState } from 'react'

// ============================================
// 模拟后端 API
// ============================================
const mockAPI = {
  async submitContact(data) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟用户验证
    if (data.get('email')?.includes('admin')) {
      throw new Error('不允许使用 admin 邮箱')
    }

    return { success: true, message: '提交成功！' }
  }
}

// ============================================
// Action 函数：处理表单提交
// ============================================
/**
 * 处理联系表单提交
 * @param {Object} previousState - 上一次表单状态
 * @param {FormData} formData - 表单数据
 * @returns {Object} - 新状态
 */
async function contactFormAction(previousState, formData) {
  // 1. 获取表单数据
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  // 2. 表单验证
  const errors = {}

  if (!name || name.trim().length < 2) {
    errors.name = '姓名至少需要2个字符'
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = '请输入有效的邮箱地址'
  }

  if (!message || message.trim().length < 10) {
    errors.message = '留言至少需要10个字符'
  }

  // 3. 如果有验证错误，返回错误状态
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      values: { name, email, message }
    }
  }

  // 4. 提交到服务器
  try {
    const result = await mockAPI.submitContact(formData)
    return {
      success: true,
      message: result.message,
      errors: {}
    }
  } catch (error) {
    return {
      success: false,
      errors: { form: error.message },
      values: { name, email, message }
    }
  }
}

// ============================================
// 表单组件
// ============================================
function ContactForm() {
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
        <h2>🎉 {formState.message}</h2>
        <button onClick={() => window.location.reload()}>
          提交另一个
        </button>
      </div>
    )
  }

  return (
    <form action={formAction} style={styles.form}>
      <h2>联系我们</h2>

      {/* 全局错误提示 */}
      {formState.errors?.form && (
        <div style={styles.globalError}>
          {formState.errors.form}
        </div>
      )}

      {/* 姓名字段 */}
      <div style={styles.field}>
        <label htmlFor="name">姓名</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="请输入姓名"
          defaultValue={formState.values?.name}
        />
        {formState.errors?.name && (
          <span style={styles.error}>{formState.errors.name}</span>
        )}
      </div>

      {/* 邮箱字段 */}
      <div style={styles.field}>
        <label htmlFor="email">邮箱</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="example@mail.com"
          defaultValue={formState.values?.email}
        />
        {formState.errors?.email && (
          <span style={styles.error}>{formState.errors.email}</span>
        )}
      </div>

      {/* 留言字段 */}
      <div style={styles.field}>
        <label htmlFor="message">留言</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          placeholder="请输入留言内容..."
          defaultValue={formState.values?.message}
        />
        {formState.errors?.message && (
          <span style={styles.error}>{formState.errors.message}</span>
        )}
      </div>

      {/* 提交按钮 */}
      <button type="submit" disabled={isPending} style={styles.submitBtn}>
        {isPending ? '提交中...' : '提交'}
      </button>
    </form>
  )
}

// ============================================
// 样式
// ============================================
const styles = {
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, sans-serif'
  },
  field: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  error: {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '5px'
  },
  globalError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  },
  successBox: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#d4edda',
    borderRadius: '8px'
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
}
```

### 5.2.5 useActionState 的优势

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    useActionState vs 传统方式对比                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  传统方式 (React 18)                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ function Form() {                                                    │   │
│  │   const [state, setState] = useState({...})                         │   │
│  │   const [pending, setPending] = useState(false)                    │   │
│  │                                                                       │   │
│  │   const handleSubmit = async (e) => {                               │   │
│  │     setPending(true)                                                 │   │
│  │     try {                                                            │   │
│  │       const result = await submit(data)                             │   │
│  │       setState(result)                                              │   │
│  │     } finally {                                                      │   │
│  │       setPending(false)                                              │   │
│  │     }                                                                │   │
│  │   }                                                                  │   │
│  │ }                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  React 19 方式                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ function Form() {                                                    │   │
│  │   const [state, action, pending] = useActionState(submit, {...})   │   │
│  │                                                                       │   │
│  │   return <form action={action}>...</form>                           │   │
│  │ }                                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  优势:                                                                     │
│  ✓ 代码量减少 50%                                                          │
│  ✓ 自动管理 pending 状态                                                   │
│  ✓ 支持渐进式增强 (JavaScript 加载前也能工作)                               │
│  ✓ 状态管理与 UI 分离                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.3 useFormStatus - 表单状态获取

### 5.3.1 什么是 useFormStatus？

`useFormStatus` 是来自 `react-dom` 的 Hook，用于获取表单提交时的状态信息。它的独特之处在于：**可以在表单组件树的任何位置使用**，而不仅仅是表单内部。

### 5.3.2 基本语法

```jsx
import { useFormStatus } from 'react-dom'

const { pending, data, method, action } = useFormStatus()
```

**返回值详解：**

| 属性 | 类型 | 描述 |
|------|------|------|
| `pending` | `boolean` | 表单是否正在提交 |
| `data` | `FormData` | 提交的表单数据 |
| `method` | `string` | 表单提交方法 ('get' 或 'post') |
| `action` | `string` | 表单的 action 属性值 |

### 5.3.3 使用示例：自定义提交按钮

```jsx
import { useFormStatus } from 'react-dom'

// ============================================
// 自定义提交按钮组件
// ============================================
/**
 * 带加载状态的提交按钮
 * 使用 useFormStatus 获取表单状态
 */
function SubmitButton({ children }) {
  // 获取表单提交状态
  const { pending, data, method } = useFormStatus()

  return (
    <button type="submit" disabled={pending} style={styles.button}>
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
// 重置按钮（不受表单状态影响）
// ============================================
function ResetButton({ children }) {
  // 重置按钮不受表单状态影响
  return (
    <button type="reset" style={styles.resetButton}>
      {children}
    </button>
  )
}

// ============================================
// 完整表单示例
// ============================================
function FeedbackForm() {
  // 模拟提交处理
  async function handleSubmit(formData) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('提交数据:', Object.fromEntries(formData))
    return { success: true }
  }

  return (
    <form action={handleSubmit} style={styles.form}>
      <h2>反馈表单</h2>

      <div style={styles.field}>
        <label htmlFor="username">用户名</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          placeholder="请输入用户名"
        />
      </div>

      <div style={styles.field}>
        <label htmlFor="feedback">反馈内容</label>
        <textarea
          id="feedback"
          name="feedback"
          rows="4"
          required
          placeholder="请输入您的反馈..."
        />
      </div>

      <div style={styles.buttonGroup}>
        <SubmitButton>提交反馈</SubmitButton>
        <ResetButton>重置</ResetButton>
      </div>
    </form>
  )
}

const styles = {
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px'
  },
  field: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  resetButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #fff',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  method: {
    fontSize: '12px',
    opacity: 0.8
  }
}
```

### 5.3.4 高级示例：表单状态面板

```jsx
import { useFormStatus } from 'react-dom'

// ============================================
// 状态显示组件
// ============================================
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
          <div style={styles.spinner}></div>
          <span>正在提交...</span>
        </div>
      )}

      {/* 数据预览 */}
      {data && (
        <div style={styles.dataPreview}>
          <h4>提交数据:</h4>
          <pre style={styles.pre}>
            {JSON.stringify(Object.fromEntries(data), null, 2)}
          </pre>
          <div style={styles.meta}>
            <span>方法: {method?.toUpperCase()}</span>
            <span>Action: {action || 'inline'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// 表单组件
// ============================================
function DemoForm() {
  async function handleAction(formData) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return { success: true }
  }

  return (
    <div style={styles.container}>
      <form action={handleAction}>
        <div style={styles.field}>
          <label>用户名</label>
          <input type="text" name="username" placeholder="请输入用户名" />
        </div>

        <div style={styles.field}>
          <label>邮箱</label>
          <input type="email" name="email" placeholder="example@mail.com" />
        </div>

        <button type="submit">提交</button>
      </form>

      {/* 在表单外部使用 useFormStatus */}
      <FormStatusPanel />
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto'
  },
  field: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  idle: {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginTop: '20px'
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
    fontWeight: 'bold'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid #007bff',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  dataPreview: {
    marginTop: '15px'
  },
  pre: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '12px',
    overflow: 'auto'
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    fontSize: '12px',
    color: '#666'
  }
}
```

### 5.3.5 useFormStatus vs useActionState

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    useFormStatus vs useActionState                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  useFormStatus (react-dom)                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • 用途: 获取表单提交状态                                            │   │
│  │ • 位置: 必须在 <form> 的子树中使用                                  │   │
│  │ • 返回: { pending, data, method, action }                          │   │
│  │ • 场景: 自定义提交按钮、状态显示面板                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  useActionState (react)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • 用途: 管理表单提交的状态和结果                                     │   │
│  │ • 位置: 组件级别使用                                                │   │
│  │ • 返回: [state, formAction, isPending]                             │   │
│  │ • 场景: 表单验证、结果显示、状态管理                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  组合使用:                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ <form action={formAction}>                                          │   │
│  │   <SubmitButton />  {/* useFormStatus */}                          │   │
│  │ </form>                                                              │   │
│  │ {formState.success && <Success />}  {/* useActionState */}         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.4 useOptimistic - 乐观更新

### 5.4.1 什么是乐观更新？

乐观更新（Optimistic Update）是一种提升用户体验的技术：当用户执行某个操作时，**立即更新 UI 显示预期的结果**，而不是等待服务器响应完成。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        乐观更新 vs 悲观更新                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  悲观更新 (传统方式):                                                        │
│  ┌─────────┐    点击      ┌─────────┐   等待API   ┌─────────┐              │
│  │  点赞   │ ─────────► │ 加载中   │ ─────────► │ 显示结果 │              │
│  │  0赞   │            │          │            │  1赞   │              │
│  └─────────┘            └─────────┘            └─────────┘              │
│       │                                                           │       │
│       │            用户感受到延迟 (1-2秒)                          │       │
│       └───────────────────────────────────────────────────────────┘       │
│                                                                             │
│  乐观更新:                                                                  │
│  ┌─────────┐    点击      ┌─────────┐              ┌─────────┐              │
│  │  点赞   │ ─────────► │ 立即更新 │   后台API    │ 显示结果 │              │
│  │  0赞   │            │  1赞    │ ─────────► │  1赞   │              │
│  └─────────┘            └─────────┘              └─────────┘              │
│       │                                                                   │
│       │            用户感受: 即时响应                                      │
│       └────────────────────────────────────────────────────────────────   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.4.2 useOptimistic 基本语法

```jsx
import { useOptimistic } from 'react'

const [optimisticState, addOptimistic] = useOptimistic(state, updateFn)
```

**参数详解：**

| 参数 | 类型 | 描述 |
|------|------|------|
| `state` | `any` | 当前实际状态（服务器返回的真实数据） |
| `updateFn` | `Function` | 乐观更新函数，签名: `(currentState, updateArg) => newState` |

**返回值：**

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `optimisticState` | `any` | 当前显示的状态（实际状态或乐观状态） |
| `addOptimistic` | `Function` | 触发乐观更新的函数 |

### 5.4.3 场景1：点赞功能

```jsx
import { useState, useOptimistic } from 'react'

// ============================================
// 模拟 API
// ============================================
const api = {
  async likePost(postId) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { likes: 1 }
  },
  async unlikePost(postId) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { likes: -1 }
  }
}

// ============================================
// 点赞按钮组件
// ============================================
/**
 * 点赞按钮 - 展示乐观更新
 */
function LikeButton({ initialLikes, postId }) {
  // 实际状态
  const [likes, setLikes] = useState(initialLikes)

  // 乐观状态
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    // 更新函数: 接收当前状态和增量，返回新状态
    (currentLikes, delta) => currentLikes + delta
  )

  // 处理点赞
  async function handleLike() {
    // 1. 立即触发乐观更新 (+1)
    addOptimisticLike(1)

    // 2. 发送请求到服务器
    try {
      const result = await api.likePost(postId)
      // 3. 服务器响应后更新实际状态
      setLikes(prev => prev + result.likes)
    } catch (error) {
      // 失败时，React 会自动回滚到实际状态
      console.error('点赞失败:', error)
    }
  }

  // 处理取消点赞
  async function handleUnlike() {
    // 立即乐观更新 (-1)
    addOptimisticLike(-1)

    try {
      const result = await api.unlikePost(postId)
      setLikes(prev => prev + result.likes)
    } catch (error) {
      console.error('取消点赞失败:', error)
    }
  }

  return (
    <div style={styles.container}>
      <button onClick={handleLike} style={styles.button}>
        👍 点赞
      </button>
      <button onClick={handleUnlike} style={styles.button}>
        👎 取消
      </button>
      <span style={styles.count}>
        点赞数: {optimisticLikes}
      </span>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  button: {
    padding: '8px 16px',
    cursor: 'pointer'
  },
  count: {
    fontSize: '18px',
    fontWeight: 'bold'
  }
}
```

### 5.4.4 场景2：评论功能

```jsx
import { useState, useOptimistic } from 'react'

// ============================================
// 评论组件 - 带乐观更新
// ============================================
function CommentSection({ postId, initialComments }) {
  // 实际评论列表
  const [comments, setComments] = useState(initialComments)

  // 乐观评论列表
  const [displayedComments, addOptimisticComment] = useOptimistic(
    comments,
    // 更新函数: 添加新评论
    (state, newComment) => [...state, newComment]
  )

  // 提交评论
  async function handleSubmit(formData) {
    const author = formData.get('author')
    const text = formData.get('comment')

    // 创建临时评论
    const tempComment = {
      id: `temp-${Date.now()}`, // 临时 ID
      author,
      text,
      timestamp: new Date().toISOString(),
      status: 'pending' // 标记为待确认
    }

    // 立即显示新评论（乐观更新）
    addOptimisticComment(tempComment)

    try {
      // 发送到服务器
      const savedComment = await submitCommentToServer(postId, {
        ...tempComment,
        status: 'confirmed'
      })

      // 服务器响应后更新实际列表
      setComments(prev => [...prev, savedComment])
    } catch (error) {
      // 失败时，评论会自动消失
      console.error('评论失败:', error)
    }
  }

  // 模拟提交到服务器
  async function submitCommentToServer(postId, comment) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { ...comment, id: `real-${Date.now()}` }
  }

  return (
    <div style={styles.container}>
      <h3>评论 ({displayedComments.length})</h3>

      {/* 评论列表 */}
      <div style={styles.commentList}>
        {displayedComments.map(comment => (
          <div
            key={comment.id}
            style={{
              ...styles.comment,
              opacity: comment.status === 'pending' ? 0.6 : 1
            }}
          >
            <div style={styles.commentHeader}>
              <strong>{comment.author}</strong>
              {comment.status === 'pending' && (
                <span style={styles.pending}>发送中...</span>
              )}
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>

      {/* 评论表单 */}
      <form action={handleSubmit} style={styles.form}>
        <input
          name="author"
          placeholder="你的名字"
          required
          style={styles.input}
        />
        <textarea
          name="comment"
          placeholder="写下你的评论..."
          required
          style={styles.textarea}
        />
        <button type="submit" style={styles.submitBtn}>
          发表评论
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  commentList: {
    marginBottom: '20px'
  },
  comment: {
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px'
  },
  pending: {
    color: '#007bff',
    fontSize: '12px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minHeight: '80px'
  },
  submitBtn: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
}
```

### 5.4.5 场景3：购物车操作

```jsx
import { useState, useOptimistic } from 'react'

// ============================================
// 商品类型
// ============================================
const AVAILABLE_PRODUCTS = [
  { id: 1, name: 'iPhone 15', price: 6999, emoji: '📱' },
  { id: 2, name: 'MacBook Pro', price: 14999, emoji: '💻' },
  { id: 3, name: 'AirPods', price: 1899, emoji: '🎧' }
]

// ============================================
// 购物车组件 - 展示多种乐观更新操作
// ============================================
function ShoppingCart({ initialItems = [] }) {
  // 实际购物车状态
  const [items, setItems] = useState(initialItems)

  // 乐观购物车状态
  const [displayedItems, updateCart] = useOptimistic(
    items,
    // 统一的更新函数
    (state, action) => {
      switch (action.type) {
        case 'add':
          return [...state, action.item]
        case 'remove':
          return state.filter(item => item.id !== action.item.id)
        case 'update':
          return state.map(item =>
            item.id === action.item.id
              ? { ...item, quantity: action.item.quantity }
              : item
          )
        case 'clear':
          return []
        default:
          return state
      }
    }
  )

  // 添加商品
  async function addToCart(product) {
    const newItem = { ...product, quantity: 1 }

    // 立即乐观更新
    updateCart({ type: 'add', item: newItem })

    try {
      // 模拟 API 调用
      await mockApi.addToCart(product.id)
      // 实际更新
      setItems(prev => [...prev, { ...newItem, id: `real-${Date.now()}` }])
    } catch (error) {
      console.error('添加失败')
    }
  }

  // 移除商品
  async function removeFromCart(itemId) {
    // 立即乐观更新
    updateCart({ type: 'remove', item: { id: itemId } })

    try {
      await mockApi.removeFromCart(itemId)
      setItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('移除失败')
    }
  }

  // 更新数量
  async function updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    const item = displayedItems.find(i => i.id === itemId)
    if (!item) return

    // 立即乐观更新
    updateCart({ type: 'update', item: { ...item, quantity } })

    try {
      await mockApi.updateQuantity(itemId, quantity)
      setItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, quantity } : i))
      )
    } catch (error) {
      console.error('更新失败')
    }
  }

  // 计算总价
  const total = displayedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div style={styles.container}>
      <h2>🛒 购物车 (乐观更新)</h2>

      {/* 商品列表 */}
      <div style={styles.section}>
        <h3>商品列表</h3>
        <div style={styles.productGrid}>
          {AVAILABLE_PRODUCTS.map(product => (
            <div key={product.id} style={styles.productCard}>
              <span style={styles.emoji}>{product.emoji}</span>
              <h4>{product.name}</h4>
              <p>¥{product.price}</p>
              <button onClick={() => addToCart(product)}>
                加入购物车
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 购物车列表 */}
      <div style={styles.section}>
        <h3>购物车 ({displayedItems.length})</h3>
        {displayedItems.length === 0 ? (
          <p style={styles.empty}>购物车是空的</p>
        ) : (
          <ul style={styles.cartList}>
            {displayedItems.map(item => (
              <li key={item.id} style={styles.cartItem}>
                <span>{item.emoji} {item.name}</span>
                <div style={styles.quantity}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <span>¥{item.price * item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)}>
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 总计 */}
        <div style={styles.total}>
          <strong>总计: ¥{total.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  )
}

// 模拟 API
const mockApi = {
  async addToCart(productId) {
    await new Promise(r => setTimeout(r, 500))
  },
  async removeFromCart(itemId) {
    await new Promise(r => setTimeout(r, 500))
  },
  async updateQuantity(itemId, quantity) {
    await new Promise(r => setTimeout(r, 500))
  }
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  section: {
    marginBottom: '30px'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px'
  },
  productCard: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center'
  },
  emoji: {
    fontSize: '40px'
  },
  cartList: {
    listStyle: 'none',
    padding: 0
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #eee'
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  total: {
    textAlign: 'right',
    fontSize: '20px',
    padding: '15px 0'
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '40px'
  }
}
```

---

## 5.5 use() - 通用数据获取

### 5.5.1 什么是 use()？

`use()` 是 React 19 引入的全新 Hook，它允许直接使用 Promise 和 Context。它的设计目的是简化数据获取，让异步操作更加直观。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            use() 的特性                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. 直接接受 Promise                                                        │
│     ┌────────────────────────────────────────────────────────────────┐    │
│     │ const user = use(fetch('/api/user'))                           │    │
│     └────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  2. 自动 Suspense 集成                                                      │
│     ┌────────────────────────────────────────────────────────────────┐    │
│     │ Promise pending → 显示 <Suspense fallback>                     │    │
│     │ Promise resolved → 显示组件内容                                │    │
│     │ Promise rejected → 显示 Error Boundary                       │    │
│     └────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  3. 支持条件调用 (useContext 不支持)                                        │
│     ┌────────────────────────────────────────────────────────────────┐    │
│     │ const data = condition ? use(promise) : null                  │    │
│     └────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  4. 可替代 useContext                                                       │
│     ┌────────────────────────────────────────────────────────────────┐    │
│     │ const theme = use(ThemeContext)  // 等同于 useContext()        │    │
│     └────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.5.2 基本语法

```jsx
import { use } from 'react'

const value = use(resource)
```

**参数：**

- `resource`：Promise 或其他可订阅的值

**行为：**

1. 如果 Promise 未 resolved，组件会 Suspense（挂起）
2. 如果 Promise rejected，会抛出错误
3. 可以在条件语句中使用

### 5.5.3 对比：传统方式 vs use()

```jsx
// ============================================
// 方式1: 传统方式 (React 18)
// ============================================
function TraditionalFetch({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <p>加载中...</p>
  if (error) return <p>错误: {error.message}</p>
  return <p>{user.name}</p>
}

// ============================================
// 方式2: React 19 use()
// ============================================
function ModernFetch({ userId }) {
  const user = use(fetch(`/api/users/${userId}`).then(r => r.json()))
  return <p>{user.name}</p>
}
```

### 5.5.4 示例1：基础数据获取

```jsx
import { use, Suspense } from 'react'

// ============================================
// 模拟数据获取
// ============================================
function fetchUser(userId) {
  // 返回一个 Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: '张三',
        email: 'zhangsan@example.com',
        avatar: '👤'
      })
    }, 1000)
  })
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'React 19 新特性' },
        { id: 2, title: 'use() Hook 详解' },
        { id: 3, title: '乐观更新实战' }
      ])
    }, 1500)
  })
}

// ============================================
// 用户资料组件
// ============================================
function UserProfile({ userId }) {
  // use() 会等待 Promise resolved
  const user = use(fetchUser(userId))

  return (
    <div style={styles.profile}>
      <span style={styles.avatar}>{user.avatar}</span>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

// ============================================
// 用户文章列表
// ============================================
function UserPosts({ userId }) {
  const posts = use(fetchPosts(userId))

  return (
    <div style={styles.posts}>
      <h4>文章列表</h4>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}

// ============================================
// 主组件 - 组合使用
// ============================================
function UserDashboard({ userId = '1' }) {
  return (
    <div style={styles.container}>
      <h2>用户中心</h2>
      <Suspense fallback={<div style={styles.loading}>加载用户资料...</div>}>
        <UserProfile userId={userId} />
      </Suspense>
      <Suspense fallback={<div style={styles.loading}>加载文章...</div>}>
        <UserPosts userId={userId} />
      </Suspense>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  profile: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  avatar: {
    fontSize: '60px'
  },
  posts: {
    padding: '20px',
    backgroundColor: '#fafafa',
    borderRadius: '8px'
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#666'
  }
}
```

### 5.5.5 示例2：并行数据获取

```jsx
import { use, Suspense } from 'react'

// ============================================
// 并行数据获取 - use() 的强大之处
// ============================================
function UserWithPosts({ userId }) {
  // 并行发起两个请求
  // use() 会自动处理 Suspense
  const user = use(fetchUser(userId))
  const posts = use(fetchPosts(userId))

  return (
    <div style={styles.container}>
      {/* 用户信息 */}
      <div style={styles.userCard}>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>注册时间: {user.joinDate}</p>
      </div>

      {/* 文章列表 */}
      <div style={styles.postsSection}>
        <h3>他的文章 ({posts.length})</h3>
        <ul>
          {posts.map(post => (
            <li key={post.id} style={styles.postItem}>
              {post.title}
              <span style={styles.views}>👁 {post.views}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ============================================
// 模拟 API
// ============================================
function fetchUser(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id,
        name: '李四',
        email: 'lisi@example.com',
        joinDate: '2024-01-15'
      })
    }, 800)
  })
}

function fetchPosts(userId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, title: '深入理解 React', views: 1200 },
        { id: 2, title: 'Hook 最佳实践', views: 890 },
        { id: 3, title: '性能优化技巧', views: 2100 }
      ])
    }, 1200)
  })
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  userCard: {
    padding: '20px',
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  postsSection: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  postItem: {
    padding: '10px',
    backgroundColor: 'white',
    marginBottom: '8px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  views: {
    color: '#666',
    fontSize: '14px'
  }
}
```

### 5.5.6 示例3：条件性数据获取

```jsx
import { useState, use } from 'react'

// ============================================
// 条件性数据获取 - use() 独有特性
// ============================================
function DataFetcher() {
  const [shouldFetch, setShouldFetch] = useState(false)

  // 模拟数据获取函数
  function getData() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ content: '这是获取到的数据！', timestamp: new Date().toISOString() })
      }, 1000)
    })
  }

  // use() 可以在条件语句中使用！
  // 这是 useContext 做不到的
  const data = shouldFetch ? use(getData()) : null

  return (
    <div style={styles.container}>
      <h2>条件性数据获取</h2>

      <button onClick={() => setShouldFetch(!shouldFetch)} style={styles.button}>
        {shouldFetch ? '停止获取' : '开始获取'}
      </button>

      <div style={styles.result}>
        {shouldFetch ? (
          data ? (
            <div>
              <p><strong>内容:</strong> {data.content}</p>
              <p><strong>时间:</strong> {data.timestamp}</p>
            </div>
          ) : (
            <p>加载中...</p>
          )
        ) : (
          <p style={styles.hint}>点击按钮开始获取数据</p>
        )}
      </div>

      <div style={styles.explanation}>
        <h4>use() vs useContext</h4>
        <ul>
          <li>use() 可以在条件语句中使用</li>
          <li>useContext 必须在组件顶层调用</li>
          <li>use() 支持 Promise，useContext 不支持</li>
        </ul>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  result: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    minHeight: '100px'
  },
  hint: {
    color: '#999',
    textAlign: 'center'
  },
  explanation: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px'
  }
}
```

### 5.5.7 示例4：use() 替代 useContext

```jsx
import { use, createContext } from 'react'

// ============================================
// 创建 Context
// ============================================
const ThemeContext = createContext('light')
const UserContext = createContext(null)

// ============================================
// 使用 use() 访问 Context
// ============================================
function ThemedButton() {
  // use() 可以替代 useContext()
  const theme = use(ThemeContext)

  return (
    <button style={{
      padding: '10px 20px',
      backgroundColor: theme === 'dark' ? '#333' : '#007bff',
      color: theme === 'dark' ? '#fff' : '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}>
      主题按钮 ({theme})
    </button>
  )
}

function UserBadge() {
  const user = use(UserContext)

  if (!user) {
    return <p>未登录</p>
  }

  return (
    <div style={{
      padding: '10px',
      backgroundColor: '#e3f2fd',
      borderRadius: '4px'
    }}>
      欢迎, {user.name}！
    </div>
  )
}

// ============================================
// 主组件 - 提供 Context
// ============================================
function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState({ name: '小明' })

  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <div style={{ padding: '20px' }}>
          <h2>use() 替代 useContext</h2>

          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
              切换主题
            </button>
          </div>

          <ThemedButton />
          <UserBadge />
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

// 需要导入 useState
import { useState } from 'react'
```

---

## 5.6 React 19.2 新特性

### 5.6.1 改进的 ref 清理函数

在 React 19.2 之前，useEffect 中的 ref 清理需要手动处理。现在可以更优雅地管理。

```jsx
import { useRef, useEffect } from 'react'

function VideoPlayer({ src }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // 创建视频元素
    video.src = src
    video.play()

    // 返回清理函数
    return () => {
      video.pause()
      video.src = ''
    }
  }, [src])

  return <video ref={videoRef} controls style={{ width: '100%' }} />
}
```

### 5.6.2 改进的表单处理

```jsx
import { useActionState } from 'react'

// 表单验证和提交的一体化处理
async function submitWithValidation(prevState, formData) {
  const email = formData.get('email')

  // 验证
  if (!email.includes('@')) {
    return { errors: { email: '无效的邮箱' }, values: { email } }
  }

  // 提交
  await submitToServer(formData)

  return { success: true }
}

function NewsletterForm() {
  const [state, action] = useActionState(submitWithValidation, {
    errors: {},
    values: {},
    success: false
  })

  if (state.success) {
    return <p>订阅成功！</p>
  }

  return (
    <form action={action}>
      <input
        name="email"
        defaultValue={state.values.email}
        placeholder="输入邮箱"
      />
      {state.errors?.email && <span>{state.errors.email}</span>}
      <button type="submit">订阅</button>
    </form>
  )
}
```

---

## 5.7 服务器组件 (RSC) 基础概念

### 5.7.1 什么是服务器组件？

服务器组件（React Server Components, RSC）是 React 19 引入的新概念，允许组件在服务器上渲染。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     客户端组件 vs 服务器组件                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  客户端组件 (Client Component)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • 在浏览器中运行                                                     │   │
│  │ • 可以使用 useState, useEffect, useRef                             │   │
│  │ • 可以处理用户交互                                                  │   │
│  │ • 使用 'use client' 声明                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  服务器组件 (Server Component)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • 在服务器上运行                                                    │   │
│  │ • 不能使用 useState, useEffect                                     │   │
│  │ • 可以直接访问数据库、文件系统                                      │   │
│  │ • 默认服务器组件，无需声明                                          │   │
│  │ • 减少客户端 JavaScript 体积                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  使用场景:                                                                  │
│  ┌─────────────────────┬─────────────────────┐                            │
│  │   服务器组件        │    客户端组件        │                            │
│  ├─────────────────────┼─────────────────────┤                            │
│  │ • 数据获取         │ • 用户交互          │                            │
│  │ • 访问后端资源     │ • 使用 Hooks        │                            │
│  │ • 大量静态内容     │ • 浏览器 API        │                            │
│  │ • 敏感信息处理     │ • 实时更新          │                            │
│  └─────────────────────┴─────────────────────┘                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.7.2 RSC 基本示例

```jsx
// ============================================
// 服务器组件示例 (默认)
// ============================================
/**
 * 这是一个服务器组件
 * - 默认在服务器上渲染
 * - 可以直接访问数据库
 * - 不会发送给客户端多余的 JavaScript
 */
async function UserList() {
  // 直接在服务器上查询数据库！
  const users = await db.users.findMany()

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

// ============================================
// 客户端组件
// ============================================
'use client'

/**
 * 这是一个客户端组件
 * - 需要 'use client' 声明
 * - 可以在浏览器中运行
 * - 可以处理用户交互
 */
import { useState } from 'react'

function LikeButton() {
  const [likes, setLikes] = useState(0)

  return (
    <button onClick={() => setLikes(l => l + 1)}>
      点赞 ({likes})
    </button>
  )
}
```

### 5.7.3 混合使用

```jsx
// ============================================
// 服务器组件 (父组件)
// ============================================
async function BlogPost({ postId }) {
  // 服务器端获取数据
  const post = await fetchPost(postId)
  const comments = await fetchComments(postId)

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      {/* 客户端组件 - 处理交互 */}
      <LikeButton />

      {/* 另一个服务器组件 */}
      <CommentList comments={comments} />
    </article>
  )
}

// ============================================
// 客户端组件
// ============================================
'use client'

import { useState } from 'react'

function LikeButton() {
  const [likes, setLikes] = useState(0)

  return (
    <button onClick={() => setLikes(l => l + 1)}>
      👍 点赞 ({likes})
    </button>
  )
}

function CommentList({ comments }) {
  return (
    <div>
      <h3>评论</h3>
      {comments.map(comment => (
        <p key={comment.id}>{comment.text}</p>
      ))}
    </div>
  )
}
```

---

## 5.8 综合示例：任务管理应用

```jsx
import { useState, useOptimistic, useActionState } from 'react'

// ============================================
// 模拟 API
// ============================================
const api = {
  async fetchTasks() {
    await new Promise(r => setTimeout(r, 500))
    return [
      { id: 1, text: '学习 React 19', done: true },
      { id: 2, text: '掌握 useActionState', done: false },
      { id: 3, text: '实践乐观更新', done: false }
    ]
  },

  async addTask(text) {
    await new Promise(r => setTimeout(r, 500))
    return { id: Date.now(), text, done: false }
  },

  async toggleTask(id) {
    await new Promise(r => setTimeout(r, 300))
    return { success: true }
  },

  async deleteTask(id) {
    await new Promise(r => setTimeout(r, 300))
    return { success: true }
  }
}

// ============================================
// Action: 添加任务
// ============================================
async function addTaskAction(previousState, formData) {
  const text = formData.get('task')

  if (!text || text.trim().length === 0) {
    return { error: '任务不能为空' }
  }

  await api.addTask(text)
  return { error: null, success: true }
}

// ============================================
// 任务管理应用
// ============================================
function TaskManager() {
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
  const [displayedTasks, updateTasks] = useOptimistic(
    tasks,
    (state, action) => {
      switch (action.type) {
        case 'add':
          return [...state, action.task]
        case 'toggle':
          return state.map(t =>
            t.id === action.task.id ? { ...t, done: !t.done } : t
          )
        case 'delete':
          return state.filter(t => t.id !== action.taskId)
        default:
          return state
      }
    }
  )

  // useActionState 管理添加任务状态
  const [addState, addAction, isAdding] = useActionState(addTaskAction, {
    error: null,
    success: false
  })

  // 添加任务
  async function handleAdd(formData) {
    const text = formData.get('task')

    // 乐观添加
    updateTasks({
      type: 'add',
      task: { id: `temp-${Date.now()}`, text, done: false }
    })

    // 执行 action
    await addAction(formData)

    // 刷新实际状态
    setTasks(await api.fetchTasks())
  }

  // 切换完成状态
  async function handleToggle(task) {
    updateTasks({ type: 'toggle', task })
    await api.toggleTask(task.id)
    setTasks(await api.fetchTasks())
  }

  // 删除任务
  async function handleDelete(taskId) {
    updateTasks({ type: 'delete', taskId })
    await api.deleteTask(taskId)
    setTasks(await api.fetchTasks())
  }

  if (loading) {
    return <div style={styles.loading}>加载中...</div>
  }

  const completedCount = displayedTasks.filter(t => t.done).length

  return (
    <div style={styles.container}>
      <h1>📝 任务管理器</h1>

      {/* 添加任务表单 */}
      <form action={handleAdd} style={styles.form}>
        <input
          name="task"
          placeholder="添加新任务..."
          style={styles.input}
        />
        <button type="submit" disabled={isAdding} style={styles.addBtn}>
          {isAdding ? '添加中...' : '添加'}
        </button>
      </form>

      {addState.error && (
        <div style={styles.error}>{addState.error}</div>
      )}

      {/* 任务列表 */}
      <ul style={styles.list}>
        {displayedTasks.map(task => (
          <li key={task.id} style={styles.task}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => handleToggle(task)}
            />
            <span style={{
              ...styles.taskText,
              textDecoration: task.done ? 'line-through' : 'none',
              color: task.done ? '#999' : '#333'
            }}>
              {task.text}
            </span>
            <button
              onClick={() => handleDelete(task.id)}
              style={styles.deleteBtn}
            >
              删除
            </button>
          </li>
        ))}
      </ul>

      {/* 统计信息 */}
      <div style={styles.stats}>
        总计: {displayedTasks.length} 个任务，
        已完成: {completedCount} 个
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: {
    color: '#dc3545',
    marginBottom: '10px'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  task: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    marginBottom: '8px'
  },
  taskText: {
    flex: 1
  },
  deleteBtn: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  stats: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e3f2fd',
    borderRadius: '4px',
    textAlign: 'center'
  }
}
```

---

## 本章小结

### 核心概念回顾

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          React 19 新特性总结                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┬──────────────────────────────────────────────────┐   │
│  │ Hook             │ 用途                                               │   │
│  ├──────────────────┼──────────────────────────────────────────────────┤   │
│  │ useActionState   │ 表单 action 状态管理                              │   │
│  │                  │ • 自动管理 pending 状态                           │   │
│  │                  │ • 简化表单提交逻辑                                │   │
│  │                  │ • 支持渐进式增强                                   │   │
│  ├──────────────────┼──────────────────────────────────────────────────┤   │
│  │ useFormStatus    │ 获取表单提交状态                                  │   │
│  │                  │ • 可以在表单任意位置使用                          │   │
│  │                  │ • 获取 pending/data/method                       │   │
│  ├──────────────────┼──────────────────────────────────────────────────┤   │
│  │ useOptimistic    │ 乐观更新                                          │   │
│  │                  │ • 立即更新 UI                                     │   │
│  │                  │ • 失败自动回滚                                    │   │
│  │                  │ • 适用点赞、评论、购物车等场景                     │   │
│  ├──────────────────┼──────────────────────────────────────────────────┤   │
│  │ use()            │ 通用数据获取                                       │   │
│  │                  │ • 直接使用 Promise                                │   │
│  │                  │ • 自动 Suspense 集成                              │   │
│  │                  │ • 支持条件性调用                                   │   │
│  └──────────────────┴──────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 知识点速查表

| Hook | 导入来源 | 使用场景 |
|------|----------|----------|
| `useActionState` | `react` | 表单提交状态管理 |
| `useFormStatus` | `react-dom` | 获取表单状态 |
| `useOptimistic` | `react` | 乐观更新 |
| `use()` | `react` | 数据获取、Context |

---

## 练习题

### 初级练习

1. **useActionState 练习**
   - 创建一个登录表单，包含用户名和密码
   - 使用 useActionState 管理表单状态
   - 实现基本的表单验证

2. **useFormStatus 练习**
   - 创建一个反馈表单
   - 使用 useFormStatus 创建一个自定义提交按钮
   - 按钮在提交时显示加载状态

3. **useOptimistic 练习**
   - 创建一个简单的点赞功能
   - 点击后立即更新点赞数
   - 模拟 API 延迟

### 中级练习

4. **组合练习**
   - 创建一个评论系统
   - 使用 useOptimistic 实现评论立即显示
   - 使用 useActionState 处理表单提交

5. **use() 练习**
   - 创建一个用户资料页面
   - 使用 use() 并行获取用户信息和文章列表
   - 用 Suspense 包裹显示加载状态

### 高级练习

6. **综合应用**
   - 创建一个待办事项应用
   - 使用 useOptimistic 实现添加、删除、完成的乐观更新
   - 结合 useActionState 处理表单验证

---

## 下章预告

下一章我们将学习 **Zustand 状态管理**：
- Zustand 简介与安装
- 创建 Store
- 在组件中使用 Store
- 高级特性：中间件
- 持久化与异步操作

---

## 参考资源

- [React 19 官方文档](https://react.dev/blog/2024/04/25/react-19)
- [React 19 Hooks API 参考](https://react.dev/reference/react)
- [useActionState 详解](https://react.dev/reference/react/useActionState)
- [useOptimistic 详解](https://react.dev/reference/react/useOptimistic)
- [use() 详解](https://react.dev/reference/react/use)
