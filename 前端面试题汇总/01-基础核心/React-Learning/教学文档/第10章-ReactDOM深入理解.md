# 第10章：React DOM 深入理解

> 本章将带你深入学习 React DOM 的核心概念，包括渲染原理、Portals、虚拟 DOM、Diff 算法、性能优化等

---

## 10.1 React DOM 概述

### 什么是 React DOM？

React DOM 是 React 的渲染层，负责将 React 组件转换为实际的 DOM 节点。当你在浏览器中运行 React 应用时，React DOM 负责：

1. **创建 DOM 节点**：根据组件的 JSX 描述创建真实的 HTML 元素
2. **更新 DOM**：当组件状态变化时，高效地更新 DOM
3. **删除 DOM**：当组件卸载时，清理相关的 DOM 节点

### React DOM 与 React Native

React 不仅仅可以渲染到浏览器 DOM，还可以渲染到其他平台：

| 平台 | 渲染库 | 用途 |
|------|--------|------|
| 浏览器 | react-dom | Web 应用 |
| iOS/Android | react-native | 移动应用 |
| Windows/macOS | react-native-windows | 桌面应用 |
| PDF | react-pdf | PDF 文档 |
| Three.js | react-three-fiber | 3D 渲染 |

### 安装 React DOM

```bash
# 安装 React 和 React DOM
pnpm add react react-dom

# 或安装最新版本
pnpm add react@19 react-dom@19
```

---

## 10.2 渲染基础

### 传统渲染方式（React 18 之前）

```jsx
// main.jsx - React 17 之前的写法
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// 渲染应用到 root 元素
ReactDOM.render(<App />, document.getElementById('root'))
```

### 现代渲染方式（React 18+）

```jsx
// main.jsx - React 18+ 的写法
import { createRoot } from 'react-dom/client'
import App from './App'

// 创建 root 并渲染
const root = createRoot(document.getElementById('root'))
root.render(<App />)

// 或使用简洁写法
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(<App />)
```

### 渲染流程

```
┌─────────────────────────────────────────────────────────────┐
│                        JSX/TSX                              │
│  <div><h1>Hello</h1><Button /></div>                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Element                             │
│  { type: 'div', props: { children: [...] } }               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              React 虚拟 DOM (内存中)                         │
│  轻量级的 JavaScript 对象，表示 DOM 结构                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   React DOM                                 │
│  将虚拟 DOM 差异应用到真实 DOM                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    真实 DOM                                 │
│  <div><h1>Hello</h1><button></button></div>               │
└─────────────────────────────────────────────────────────────┘
```

### 完整入口文件示例

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 获取 DOM 元素
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('未找到 root 元素，请检查 index.html')
}

// 创建 React Root
const root = createRoot(rootElement)

// 渲染应用
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// 开发环境：热模块替换 (HMR)
if (module.hot) {
  module.hot.accept()
}
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React 应用</title>
  </head>
  <body>
    <!-- React 应用将渲染到这个元素 -->
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 10.3 Portals（传送门）

### 什么是 Portals？

Portals 提供了一种将子组件渲染到**父组件 DOM 层次结构之外**的方式。这在以下场景中特别有用：

1. **模态框（Modal）**：需要渲染到 body 层级，避免被父组件的 overflow: hidden 裁剪
2. **工具提示（Tooltip）**：需要渲染到 body 末尾，避免定位问题
3. **浮层组件**：如下拉菜单、警告框等
4. **全屏覆盖**：如加载动画、提示信息

### 基本用法

```jsx
import { createPortal } from 'react-dom'

function Modal({ children, isOpen }) {
  if (!isOpen) return null

  // 创建 Portal
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.body  // 渲染到 body 元素
  )
}
```

### 完整模态框示例

```jsx
// components/Modal.jsx
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

function Modal({ isOpen, onClose, title, children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // 阻止 body 滚动
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // 处理 ESC 键关闭
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  // 使用 Portal 渲染到 body
  return createPortal(
    <div className="modal-wrapper" onClick={onClose}>
      <div
        className="modal-container"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
```

```jsx
// App.jsx - 使用模态框
import { useState } from 'react'
import Modal from './components/Modal'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <div className="app">
      <h1>React Portals 示例</h1>

      <div className="button-group">
        <button onClick={() => setShowModal(true)}>
          打开信息模态框
        </button>
        <button onClick={() => setShowLoginModal(true)}>
          打开登录模态框
        </button>
      </div>

      {/* 信息模态框 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="提示信息"
      >
        <p>这是一个使用 Portal 渲染的模态框。</p>
        <p>它渲染在 body 元素上，不受父组件样式影响。</p>
      </Modal>

      {/* 登录模态框 */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="用户登录"
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          setShowLoginModal(false)
        }}>
          <div className="form-group">
            <label>用户名</label>
            <input type="text" placeholder="请输入用户名" />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input type="password" placeholder="请输入密码" />
          </div>
          <button type="submit" className="btn-primary">
            登录
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default App
```

```css
/* styles/modal.css */
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  background: white;
  border-radius: 8px;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  animation: slideIn 0.2s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
}

.modal-body {
  padding: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 工具提示组件

```jsx
// components/Tooltip.jsx
import { createPortal } from 'react-dom'
import { useState, useRef, useEffect } from 'react'

function Tooltip({ children, content, position = 'top' }) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef(null)

  const showTooltip = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const scrollX = window.scrollX
      const scrollY = window.scrollY

      switch (position) {
        case 'top':
          setCoords({
            x: rect.left + scrollX + rect.width / 2,
            y: rect.top + scrollY - 8
          })
          break
        case 'bottom':
          setCoords({
            x: rect.left + scrollX + rect.width / 2,
            y: rect.bottom + scrollY + 8
          })
          break
        case 'left':
          setCoords({
            x: rect.left + scrollX - 8,
            y: rect.top + scrollY + rect.height / 2
          })
          break
        case 'right':
          setCoords({
            x: rect.right + scrollX + 8,
            y: rect.top + scrollY + rect.height / 2
          })
          break
      }
    }
    setVisible(true)
  }

  const hideTooltip = () => setVisible(false)

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </span>

      {visible && createPortal(
        <div
          className={`tooltip tooltip-${position}`}
          style={{
            position: 'absolute',
            left: coords.x,
            top: coords.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}

export default Tooltip
```

### 通知提示组件

```jsx
// components/Notification.jsx
import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'

function Notification({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return createPortal(
    <div className={`notification notification-${type}`}>
      <span className="notification-icon">{icons[type]}</span>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>,
    document.body
  )
}

// 通知管理器
function NotificationManager() {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <>
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
      {/* 暴露方法给外部使用 */}
    </>
  )
}

export default Notification
```

---

## 10.4 强制同步更新

### flushSync

`flushSync` 强制 React 同步刷新状态更新和 DOM 操作。通常 React 会批量异步更新，但在某些场景下需要立即更新 DOM。

```jsx
import { flushSync } from 'react-dom'

function handleClick() {
  // 正常状态更新是异步的
  setCount(count + 1)

  // 使用 flushSync 强制同步更新
  flushSync(() => {
    setCount(count + 1)
  })

  // 此时 DOM 已经更新
  console.log(document.getElementById('counter').textContent)
}
```

### 使用场景

```jsx
// 场景1：需要立即获取更新后的 DOM 尺寸
function MeasureExample() {
  const [size, setSize] = useState(null)
  const elementRef = useRef(null)

  const measure = () => {
    flushSync(() => {
      // 强制同步更新
      setSize({ width: 0, height: 0 })
    })

    // 现在可以获取准确的尺寸
    const rect = elementRef.current.getBoundingClientRect()
    setSize({ width: rect.width, height: rect.height })
  }

  return (
    <div>
      <button onClick={measure}>测量</button>
      {size && (
        <div>尺寸: {size.width} x {size.height}</div>
      )}
      <div ref={elementRef} style={{ height: '100px', background: '#f0f0f0' }}>
        测量目标
      </div>
    </div>
  )
}

// 场景2：与第三方库集成
function ThirdPartyIntegration() {
  const [data, setData] = useState(null)

  const updateAndSync = () => {
    setData('new data')

    // 等待 DOM 更新后再调用第三方库
    flushSync(() => {
      setData('synced data')
    })

    // 第三方库需要最新的 DOM 状态
    someThirdPartyLibrary.update()
  }

  return <button onClick={updateAndSync}>更新</button>
}

// 场景3：表单验证后立即聚焦
function FormWithValidation() {
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!inputRef.current.value) {
      setError('请输入内容')

      // 立即聚焦到输入框
      flushSync(() => {
        setError('请输入内容')
      })

      inputRef.current.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} />
      {error && <span className="error">{error}</span>}
      <button type="submit">提交</button>
    </form>
  )
}
```

---

## 10.5 虚拟 DOM 与 Diff 算法

### 什么是虚拟 DOM？

虚拟 DOM 是 React 的核心概念，它是一个**轻量级的 JavaScript 对象**，用来表示真实 DOM 的结构。

```jsx
// JSX
<div className="container">
  <h1>Hello</h1>
  <button>Click me</button>
</div>

// 虚拟 DOM（React Element）
{
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello' }
      },
      {
        type: 'button',
        props: { children: 'Click me' }
      }
    ]
  }
}
```

### 为什么要用虚拟 DOM？

1. **减少直接 DOM 操作**：直接操作 DOM 性能消耗大
2. **跨平台**：同一套代码可以渲染到不同平台
3. **批量更新**：将多次更新合并为一次
4. **可预测性**：状态变更有明确的流程

### Diff 算法

React 使用 Diff 算法比较新旧虚拟 DOM，找出最小更新方案。

#### 传统 Diff 算法的问题

- O(n³) 复杂度：节点移动、插入、删除
- 无法处理大规模 DOM 更新

#### React Diff 策略

1. **tree diff**：只比较同层级节点
2. **component diff**：相同组件继续比较
3. **element diff**：通过 key 复用元素

```
原 DOM 结构                    新 DOM 结构
<div>                          <div>
  <A />                          <A />
  <B />                          <C />
</div>                         </div>

传统算法：可能重新创建所有节点
React Diff：识别出 B → C 的变化，复用 A
```

### Key 的重要性

```jsx
// 不使用 key（不推荐）
// React 会销毁所有子元素并重新创建
<ul>
  {items.map(item => (
    <li>{item.name}</li>
  ))}
</ul>

// 使用 key（推荐）
// React 可以精确追踪元素移动
<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>

// 使用索引作为 key（仅在列表不会变化时使用）
<ul>
  {items.map((item, index) => (
    <li key={index}>{item.name}</li>
  ))}
</ul>
```

### key 的最佳实践

```jsx
// 好例子：使用稳定的唯一 ID
function GoodExample() {
  const todos = [
    { id: 1, text: '学习 React' },
    { id: 2, text: '学习 Vue' },
    { id: 3, text: '学习 Angular' },
  ]

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}

// 坏例子：使用索引（列表会变化）
function BadExample() {
  const [items, setItems] = useState(['A', 'B', 'C'])

  const handleRemove = (index) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  return (
    <ul>
      {/* 使用索引作为 key 是错误的 */}
      {items.map((item, index) => (
        <li key={index}>
          {item}
          <button onClick={() => handleRemove(index)}>删除</button>
        </li>
      ))}
    </ul>
  )
}

// 正确做法：使用唯一 ID
function GoodExample2() {
  const [items, setItems] = useState([
    { id: 1, text: 'A' },
    { id: 2, text: 'B' },
    { id: 3, text: 'C' },
  ])

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.text}
          <button onClick={() => handleRemove(item.id)}>删除</button>
        </li>
      ))}
    </ul>
  )
}
```

---

## 10.6 性能优化

### React Profiler

```jsx
import { Profiler } from 'react'

function onRender(id, phase, actualTime, baseTime, startTime, commitTime) {
  console.log(`${id} 渲染耗时: ${actualTime}ms`)
}

function App() {
  return (
    <Profiler id="App" onRender={onRender}>
      <Components />
    </Profiler>
  )
}
```

### useMemo - 缓存计算结果

```jsx
import { useMemo } from 'react'

function ExpensiveComponent({ data, filter }) {
  // 缓存计算结果，只有 data 或 filter 变化时重新计算
  const filteredData = useMemo(() => {
    console.log('计算中...')
    return data.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [data, filter])

  return (
    <ul>
      {filteredData.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}

// 复杂计算示例
function ProductList({ products, category }) {
  // 筛选和排序
  const sortedProducts = useMemo(() => {
    return products
      .filter(p => p.category === category)
      .sort((a, b) => b.price - a.price)
  }, [products, category])

  return (
    <ul>
      {sortedProducts.map(p => (
        <li key={p.id}>{p.name} - ${p.price}</li>
      ))}
    </ul>
  )
}
```

### useCallback - 缓存函数

```jsx
import { useCallback } from 'react'

function ParentComponent() {
  const [count, setCount] = useState(0)

  // 缓存函数，避免子组件不必要地重新渲染
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, []) // 空依赖：函数永远不变

  const handleIncrement = useCallback(() => {
    setCount(c => c + 1)
  }, []) // 依赖空：状态更新函数

  const handleSubmit = useCallback((data) => {
    console.log('submit:', data)
  }, []) // 只在需要时更新

  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <Counter onIncrement={handleIncrement} />
      <Form onSubmit={handleSubmit} />
    </div>
  )
}

// 子组件
const ChildComponent = React.memo(({ onClick }) => {
  console.log('ChildComponent 渲染')
  return <button onClick={onClick}>点击</button>
})
```

### React.memo - 缓存组件

```jsx
import { memo } from 'react'

// 基本用法
const MyComponent = memo(function MyComponent({ name, age }) {
  return (
    <div>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
    </div>
  )
})

// 自定义比较函数
const MyComponent2 = memo(
  function MyComponent({ name, age }) {
    return (
      <div>
        <p>姓名: {name}</p>
        <p>年龄: {age}</p>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // 返回 true 表示相同，不重新渲染
    return prevProps.name === nextProps.name
  }
)

// 使用示例
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        增加: {count}
      </button>

      {/* 只有 name 变化时才会重新渲染 */}
      <MyComponent name="张三" age={25} />
    </div>
  )
}
```

### 虚拟列表（大型列表优化）

```jsx
import { useState, useMemo } from 'react'

function VirtualList({ items, itemHeight = 50 }) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerHeight = 400

  // 计算可见区域
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  )

  // 获取可见项目
  const visibleItems = useMemo(() => {
    const result = []
    for (let i = startIndex; i <= endIndex; i++) {
      result.push(items[i])
    }
    return result
  }, [items, startIndex, endIndex])

  const totalHeight = items.length * itemHeight

  return (
    <div
      style={{
        height: containerHeight,
        overflow: 'auto'
      }}
      onScroll={e => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              padding: '10px'
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// 使用
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    content: `项目 ${i + 1}`
  }))

  return <VirtualList items={items} />
}
```

### 代码分割（懒加载）

```jsx
import { lazy, Suspense } from 'react'

// 懒加载组件
const LazyComponent = lazy(() => import('./HeavyComponent'))

// 加载中组件
function LoadingFallback() {
  return <div>加载中...</div>
}

function App() {
  return (
    <div>
      <h1>应用</h1>
      <Suspense fallback={<LoadingFallback />}>
        <LazyComponent />
      </Suspense>
    </div>
  )
}

// 路由懒加载
import { Routes, Route } from 'react-router'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Suspense>
  )
}
```

---

## 10.7 服务端渲染（SSR）基础

### 什么是 SSR？

服务端渲染（Server-Side Rendering）是在服务器上生成完整的 HTML 页面，然后发送给客户端。

**CSR（客户端渲染）**：
```
浏览器请求 → 服务器返回空白 HTML → 加载 JS → React 渲染 → 用户看到内容
```

**SSR（服务端渲染）**：
```
浏览器请求 → 服务器运行 React → 生成 HTML → 返回完整页面 → 用户立即看到内容
```

### Next.js（推荐）

```bash
# 创建 Next.js 项目
pnpm create next-app@latest my-app

# 或使用最新版本
pnpm create next-app@latest my-app --typescript
```

```jsx
// app/page.tsx - Next.js 13+ App Router
export default function HomePage() {
  return (
    <main>
      <h1>欢迎来到 Next.js</h1>
      <p>这是一个服务端渲染的页面</p>
    </main>
  )
}
```

### React SSR 实现

```jsx
// server.js - 简单 SSR 示例
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

const app = express()

app.get('/', (req, res) => {
  // 在服务端渲染 React 组件
  const html = renderToString(<App />)

  // 返回完整 HTML
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR 示例</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/client.js"></script>
      </body>
    </html>
  `)
})

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000')
})
```

### SSR vs CSR 选择

| 特性 | SSR | CSR |
|------|-----|-----|
| 首屏加载 | 快 | 慢 |
| SEO | 好 | 差 |
| 交互性 | 需等待水合 | 快 |
| 服务器负载 | 高 | 低 |
| 开发复杂度 | 高 | 低 |

---

## 10.8 完整示例：待办事项应用

```jsx
// components/TodoApp.jsx
import { useState, useMemo, useCallback } from 'react'

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', completed: true },
    { id: 2, text: '学习 React Router', completed: false },
    { id: 3, text: '完成项目', completed: false },
  ])
  const [filter, setFilter] = useState('all') // all, active, completed

  const addTodo = useCallback((text) => {
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, completed: false }
    ])
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed)
      case 'completed':
        return todos.filter(t => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos]
  )

  return (
    <div className="todo-app">
      <h1>待办事项</h1>

      <TodoForm onAdd={addTodo} />

      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        activeCount={activeCount}
      />

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  )
}

// TodoForm.jsx
function TodoForm({ onAdd }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim())
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="添加新任务..."
      />
      <button type="submit">添加</button>
    </form>
  )
}

// FilterBar.jsx
function FilterBar({ filter, onFilterChange, activeCount }) {
  return (
    <div className="filter-bar">
      <span>还有 {activeCount} 个任务</span>
      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => onFilterChange('all')}
        >
          全部
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => onFilterChange('active')}
        >
          进行中
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => onFilterChange('completed')}
        >
          已完成
        </button>
      </div>
    </div>
  )
}

// TodoList.jsx
function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <div className="empty">暂无任务</div>
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

// TodoItem.jsx
const TodoItem = React.memo(function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span>{todo.text}</span>
      </label>
      <button onClick={() => onDelete(todo.id)}>删除</button>
    </li>
  )
})

export default TodoApp
```

---

## 10.9 本章小结

本章学习了：
1. **React DOM 基础**：渲染方式、发展历程
2. **Portals 传送门**：模态框、工具提示等组件的实现
3. **flushSync**：强制同步更新
4. **虚拟 DOM 与 Diff 算法**：核心原理、key 的重要性
5. **性能优化**：useMemo、useCallback、React.memo、懒加载
6. **SSR 基础**：服务端渲染概念、Next.js 入门

---

## 练习题

1. **Portal 实践**：创建一个可复用的 Toast 通知组件
2. **性能优化**：优化一个大型列表组件
3. **虚拟列表**：实现一个高性能的虚拟滚动列表
4. **代码分割**：将应用拆分为多个代码块
5. **SSR 了解**：使用 Next.js 创建一个 SSR 应用

---

## 拓展阅读

- [React 官方文档 - React DOM](https://react.docschina.org/reference/react-dom)
- [React 虚拟 DOM 原理](https://github.com/acdlite/react-fiber-architecture)
- [Next.js 官方文档](https://nextjs.org/docs)
