# 第3章：React Hooks 入门（详细版）

> 本章将带你深入学习 React Hooks 的核心知识，包括 use_state、useEffect、useRef、useContext 等基础 Hooks，配有丰富的示例代码

---

## 3.1 Hooks 简介

### 什么是 Hooks？

Hooks 是 React 16.8 引入的新特性，它允许在函数组件中使用 state 和其他 React 特性。Hooks 让函数组件具有了类组件的能力，同时保持了函数组件的简洁性。

### Hooks 的基本规则

1. **只能在顶层调用**：不要在循环、条件语句或嵌套函数中调用 Hooks
2. **只能在 React 函数中调用**：只能在函数组件或自定义 Hook 中调用
3. **Hooks 命名规范**：以 "use" 开头，如 `useState`、`useEffect`

---

## 3.2 useState 状态管理

### 什么是 useState？

`useState` 是最常用的 Hook，用于在函数组件中添加状态。

### 基本语法

```jsx
import { useState } from 'react'

function MyComponent() {
  // 声明一个状态变量
  // count: 当前状态值
  // setCount: 更新状态的函数
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        加 1
      </button>
    </div>
  )
}
```

### 语法解析

```
const [状态变量, 更新函数] = useState(初始值)
```

- **状态变量**：保存当前状态的值
- **更新函数**：用于更新状态的函数，调用后会导致组件重新渲染
- **初始值**：状态的初始值，可以是任意类型

---

## 3.3 useState 的多种用法

### 示例1：数字类型计数器

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>计数器</h2>
      <p style={{ fontSize: '48px', margin: '20px 0' }}>{count}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={decrement} style={{ padding: '10px 20px' }}>
          - 减少
        </button>
        <button onClick={reset} style={{ padding: '10px 20px' }}>
          重置
        </button>
        <button onClick={increment} style={{ padding: '10px 20px' }}>
          + 增加
        </button>
      </div>
    </div>
  )
}

export default Counter
```

### 示例2：字符串类型（输入框）

```jsx
import { useState } from 'react'

function InputDemo() {
  const [name, setName] = useState('')

  return (
    <div style={{ padding: '20px' }}>
      <h2>输入框示例</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="请输入名字"
        style={{ padding: '8px', fontSize: '16px', marginRight: '10px' }}
      />
      <p>你好, <strong>{name || '陌生人'}</strong>!</p>
      <p>字符数: {name.length}</p>
    </div>
  )
}

export default InputDemo
```

### 示例3：布尔类型（开关）

```jsx
import { useState } from 'react'

function Toggle() {
  const [isOn, setIsOn] = useState(false)

  return (
    <div style={{ padding: '20px' }}>
      <h2>开关示例</h2>
      <button
        onClick={() => setIsOn(!isOn)}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: isOn ? '#4CAF50' : '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {isOn ? '🌟 已开启' : '⚪ 已关闭'}
      </button>
      <p>当前状态: <strong>{isOn ? 'ON' : 'OFF'}</strong></p>
    </div>
  )
}

export default Toggle
```

### 示例4：数组类型（待办事项）

```jsx
import { useState } from 'react'

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', completed: false },
    { id: 2, text: '完成项目', completed: true },
    { id: 3, text: '写代码', completed: false }
  ])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false }
      ])
      setInputValue('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>待办事项列表</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="添加新待办..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={addTodo}>添加</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: todo.completed ? '#f5f5f5' : '#fff',
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ flex: 1 }}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>

      <p>总计: {todos.length} 个任务，完成了 {todos.filter(t => t.completed).length} 个</p>
    </div>
  )
}

export default TodoList
```

### 示例5：对象类型（用户表单）

```jsx
import { useState } from 'react'

function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({
      ...user,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('提交的数据:', user)
    alert(`提交成功！\n姓名: ${user.name}\n邮箱: ${user.email}\n年龄: ${user.age}`)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>用户表单</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <div>
          <label>姓名: </label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="请输入姓名"
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <div>
          <label>邮箱: </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="请输入邮箱"
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <div>
          <label>年龄: </label>
          <input
            type="number"
            name="age"
            value={user.age}
            onChange={handleChange}
            placeholder="请输入年龄"
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#1890ff', color: 'white', border: 'none', cursor: 'pointer' }}>
          提交
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h3>表单数据:</h3>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default UserForm
```

---

## 3.4 函数式更新

当新状态依赖于旧状态时，可以使用函数形式：

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  // 错误写法（如果依赖旧值）
  const increment = () => setCount(count + 1)

  // 正确写法（函数式更新）
  const increment = () => setCount(prevCount => prevCount + 1)

  // 推荐：无论什么情况都使用函数式更新
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(0)

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

---

## 3.5 useEffect 副作用处理

### 什么是副作用？

副作用（Side Effect）是指与组件渲染无关的操作，如：
- 数据获取（API 请求）
- 订阅（WebSocket、事件监听）
- 手动修改 DOM
- 计时器（setTimeout、setInterval）
- 访问 localStorage

### useEffect 基础

```jsx
import { useEffect } from 'react'

function MyComponent() {
  useEffect(() => {
    // 副作用逻辑
    console.log('组件挂载或更新')

    // 返回清理函数（可选）
    return () => {
      console.log('清理工作')
    }
  }, [依赖数组]) // 依赖数组
}
```

### useEffect 的执行时机

#### 1. 不带依赖数组

```jsx
function Demo() {
  useEffect(() => {
    console.log('每次渲染后执行')
  })

  return <div>Demo</div>
}
```

#### 2. 空依赖数组

```jsx
function Demo() {
  useEffect(() => {
    console.log('只执行一次（组件挂载时）')
  }, [])  // 空数组

  return <div>Demo</div>
}
```

#### 3. 有依赖数组

```jsx
function Demo({ id }) {
  useEffect(() => {
    console.log('id 变化时执行')
  }, [id])  // 当 id 变化时执行

  return <div>Demo: {id}</div>
}
```

---

## 3.6 useEffect 常见使用场景

### 场景1：数据获取（API 请求）

```jsx
import { useState, useEffect } from 'react'

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 创建 AbortController 取消请求
    const controller = new AbortController()

    async function fetchUsers() {
      try {
        setLoading(true)
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal
        })
        const data = await response.json()
        setUsers(data.slice(0, 5)) // 只取前5个
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()

    // 清理函数：组件卸载时取消请求
    return () => controller.abort()
  }, [])  // 空依赖，只在挂载时执行

  if (loading) return <p>加载中...</p>
  if (error) return <p>错误: {error}</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### 场景2：订阅/取消订阅

```jsx
import { useState, useEffect } from 'react'

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    // 订阅
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    // 清理：取消订阅
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])  // 只订阅一次

  return <p>窗口宽度: {width}px</p>
}
```

### 场景3：计时器

```jsx
import { useState, useEffect } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // 清理：清除计时器
    return () => clearInterval(interval)
  }, [])  // 只创建一次计时器

  return <p>已运行: {seconds} 秒</p>
}
```

---

## 3.7 ⭐ 倒计时器时钟 - 完整示例

### 示例1：基础倒计时器

```jsx
import { useState, useEffect } from 'react'

function CountdownTimer() {
  // 倒计时初始值（60秒）
  const [timeLeft, setTimeLeft] = useState(60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(60)
  }

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h2>⏱️ 基础倒计时器</h2>

      <div style={{
        fontSize: '72px',
        fontWeight: 'bold',
        margin: '20px 0',
        color: timeLeft <= 10 ? '#ff4d4f' : '#1890ff'
      }}>
        {formatTime(timeLeft)}
      </div>

      {timeLeft === 0 && (
        <p style={{ color: '#ff4d4f', fontSize: '18px' }}>时间到！</p>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!isRunning ? (
          <button onClick={handleStart} style={btnStyle('#52c41a')}>
            ▶ 开始
          </button>
        ) : (
          <button onClick={handlePause} style={btnStyle('#faad14')}>
            ⏸ 暂停
          </button>
        )}
        <button onClick={handleReset} style={btnStyle('#ff4d4f')}>
          ↺ 重置
        </button>
      </div>
    </div>
  )
}

// 按钮样式
const btnStyle = (color) => ({
  padding: '12px 24px',
  fontSize: '16px',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
})

export default CountdownTimer
```

### 示例2：自定义时间倒计时器

```jsx
import { useState, useEffect } from 'react'

function CustomCountdown() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // 计算总秒数
  useEffect(() => {
    setTotalSeconds(hours * 3600 + minutes * 60 + seconds)
  }, [hours, minutes, seconds])

  useEffect(() => {
    let interval = null

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(t => t - 1)
      }, 1000)
    } else if (totalSeconds === 0) {
      setIsRunning(false)
    }

    return () => clearInterval(interval)
  }, [isRunning, totalSeconds])

  // 从总秒数转换回时分秒
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  const formatTime = (n) => n.toString().padStart(2, '0')

  const handleStart = () => {
    if (totalSeconds > 0) setIsRunning(true)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTotalSeconds(0)
    setHours(0)
    setMinutes(5)
    setSeconds(0)
  }

  return (
    <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#fafafa' }}>
      <h2>⏰ 自定义倒计时器</h2>

      {/* 时间显示 */}
      <div style={{
        fontSize: '64px',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        margin: '20px 0',
        color: totalSeconds <= 60 && totalSeconds > 0 ? '#ff4d4f' : '#333'
      }}>
        {formatTime(h)}:{formatTime(m)}:{formatTime(s)}
      </div>

      {/* 时间输入（未运行时显示） */}
      {!isRunning && totalSeconds === 0 && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
          <div>
            <label>时</label><br/>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={e => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
              style={inputStyle}
            />
          </div>
          <div>
            <label>分</label><br/>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={e => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              style={inputStyle}
            />
          </div>
          <div>
            <label>秒</label><br/>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={e => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {/* 倒计时进度条 */}
      <div style={{ width: '300px', height: '10px', backgroundColor: '#e8e8e8', borderRadius: '5px', margin: '20px auto', overflow: 'hidden' }}>
        <div style={{
          width: `${(totalSeconds / (hours * 3600 + minutes * 60 + seconds || 1)) * 100}%`,
          height: '100%',
          backgroundColor: totalSeconds <= 60 ? '#ff4d4f' : '#52c41a',
          transition: 'width 1s linear'
        }} />
      </div>

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!isRunning ? (
          <button onClick={handleStart} style={btnStyle('#52c41a')} disabled={totalSeconds === 0}>
            ▶ 开始
          </button>
        ) : (
          <button onClick={() => setIsRunning(false)} style={btnStyle('#faad14')}>
            ⏸ 暂停
          </button>
        )}
        <button onClick={handleReset} style={btnStyle('#ff4d4f')}>
          ↺ 重置
        </button>
      </div>

      {totalSeconds === 0 && hours + minutes + seconds > 0 && (
        <p style={{ color: '#ff4d4f', marginTop: '20px', fontSize: '18px' }}>🎉 时间到！</p>
      )}
    </div>
  )
}

const inputStyle = {
  width: '60px',
  padding: '8px',
  fontSize: '18px',
  textAlign: 'center',
  border: '1px solid #d9d9d9',
  borderRadius: '4px'
}

const btnStyle = (color) => ({
  padding: '10px 24px',
  fontSize: '16px',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
})

export default CustomCountdown
```

### 示例3：番茄钟（Pomodoro Timer）

```jsx
import { useState, useEffect } from 'react'

function PomodoroTimer() {
  // 工作时间25分钟，休息时间5分钟
  const WORK_TIME = 25 * 60
  const BREAK_TIME = 5 * 60

  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isWorking, setIsWorking] = useState(true) // true=工作，false=休息
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0) // 完成的工作轮数

  useEffect(() => {
    let interval = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // 时间到，切换状态
      setIsRunning(false)
      if (isWorking) {
        setSessions(s => s + 1)
        setIsWorking(false)
        setTimeLeft(BREAK_TIME)
      } else {
        setIsWorking(true)
        setTimeLeft(WORK_TIME)
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isWorking])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setIsWorking(true)
    setTimeLeft(WORK_TIME)
  }
  const handleSkip = () => {
    setIsRunning(false)
    if (isWorking) {
      setIsWorking(false)
      setTimeLeft(BREAK_TIME)
    } else {
      setIsWorking(true)
      setTimeLeft(WORK_TIME)
    }
  }

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      backgroundColor: isWorking ? '#fff' : '#f6ffed',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2>🍅 番茄钟</h2>

      {/* 状态标签 */}
      <div style={{
        display: 'inline-block',
        padding: '8px 20px',
        backgroundColor: isWorking ? '#ff4d4f' : '#52c41a',
        color: 'white',
        borderRadius: '20px',
        marginBottom: '20px'
      }}>
        {isWorking ? '工作时间' : '休息时间'}
      </div>

      {/* 时间显示 */}
      <div style={{
        fontSize: '96px',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: isWorking ? '#ff4d4f' : '#52c41a'
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* 进度环 */}
      <div style={{ margin: '20px auto', width: '200px', height: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <div style={{
          width: `${(timeLeft / (isWorking ? WORK_TIME : BREAK_TIME)) * 100}%`,
          height: '100%',
          backgroundColor: isWorking ? '#ff4d4f' : '#52c41a',
          borderRadius: '5px',
          transition: 'width 1s linear'
        }} />
      </div>

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        {!isRunning ? (
          <button onClick={handleStart} style={btnStyle('#52c41a')}>
            ▶ 开始
          </button>
        ) : (
          <button onClick={handlePause} style={btnStyle('#faad14')}>
            ⏸ 暂停
          </button>
        )}
        <button onClick={handleReset} style={btnStyle('#1890ff')}>
          ↺ 重置
        </button>
        <button onClick={handleSkip} style={btnStyle('#722ed1')}>
          ⏭ 跳过
        </button>
      </div>

      {/* 统计 */}
      <div style={{ color: '#666' }}>
        已完成 {sessions} 个工作轮次
      </div>

      {/* 提示 */}
      <div style={{ marginTop: '20px', color: '#999', fontSize: '14px' }}>
        {isWorking ? '保持专注，拒绝分心！' : '适当休息，提高效率！'}
      </div>
    </div>
  )
}

const btnStyle = (color) => ({
  padding: '12px 24px',
  fontSize: '16px',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
})

export default PomodoroTimer
```

---

## 3.8 useRef DOM 引用

### useRef 基础

`useRef` 用于访问 DOM 元素或保存可变值，它可以在组件生命周期内保持不变。

```jsx
import { useRef } from 'react'

function MyComponent() {
  const inputRef = useRef(null)

  const handleClick = () => {
    // 访问 DOM 元素
    inputRef.current.focus()
    console.log(inputRef.current.value)
  }

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>聚焦</button>
    </div>
  )
}
```

### 使用 useRef 实现自动聚焦

```jsx
import { useRef, useEffect } from 'react'

function AutoFocus() {
  const inputRef = useRef(null)

  useEffect(() => {
    // 组件挂载后聚焦输入框
    inputRef.current.focus()
  }, [])  // 只执行一次

  return (
    <div style={{ padding: '20px' }}>
      <h2>自动聚焦输入框</h2>
      <input
        ref={inputRef}
        type="text"
        placeholder="页面加载后自动聚焦"
        style={{ padding: '10px', fontSize: '16px', width: '300px' }}
      />
    </div>
  )
}

export default AutoFocus
```

---

## 3.9 useContext 跨组件通信

### 什么是 Context？

Context 提供了一种在组件树中传递数据的方式，避免一层层手动传递 props。

### useContext 基础

```jsx
import { createContext, useContext } from 'react'

// 1. 创建 Context
const ThemeContext = createContext('light')

// 2. 提供 Context（通常在根组件）
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ChildComponent />
    </ThemeContext.Provider>
  )
}

// 3. 子组件使用 Context
function ChildComponent() {
  const theme = useContext(ThemeContext)

  return <div className={theme}>当前主题: {theme}</div>
}
```

### 完整示例：主题切换

```jsx
import { createContext, useContext, useState } from 'react'

// 创建 Context
const ThemeContext = createContext()

// Provider 组件
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 使用 Context 的组件
function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <header style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff'
    }}>
      <h1>我的应用</h1>
      <button onClick={toggleTheme}>
        切换主题 ({theme})
      </button>
    </header>
  )
}

function Content() {
  const { theme } = useContext(ThemeContext)

  return (
    <main style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#222',
      color: theme === 'light' ? '#333' : '#fff'
    }}>
      <p>当前主题: {theme}</p>
    </main>
  )
}

// 根组件
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Content />
    </ThemeProvider>
  )
}

export default App
```

---

## 本章小结

本章学习了 React Hooks 的基础知识：

1. **useState**：函数组件的状态管理
   - 基础用法
   - 多种数据类型（数字、字符串、布尔、数组、对象）
   - 函数式更新
   - 惰性初始化

2. **useEffect**：副作用处理
   - 执行时机
   - 常见场景（数据获取、订阅、计时器）
   - 清理函数
   - 依赖数组

3. **useRef**：DOM 引用和可变值
   - 访问 DOM
   - 保存可变值

4. **useContext**：跨组件通信
   - 创建和使用 Context
   - 多个 Context

---

## 练习题

1. **计数器**：使用 useState 实现一个计数器，支持增加、减少、重置
2. **待办事项**：使用 useState 实现待办事项的添加、删除、标记完成
3. **数据获取**：使用 useEffect 从 API 获取数据并显示
4. **倒计时器**：创建一个带自定义时间的倒计时器
5. **番茄钟**：创建一个完整的番茄钟工作法计时器

---

## 下章预告

下一章我们将学习 React Hooks 的进阶知识：
- useReducer 复杂状态逻辑
- useMemo 性能优化
- useCallback 函数缓存
- 自定义 Hooks
- Hooks 规则与最佳实践
