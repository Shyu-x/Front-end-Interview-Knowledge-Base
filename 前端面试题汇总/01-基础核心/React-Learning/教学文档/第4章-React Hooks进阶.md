# 第4章：React Hooks 进阶

> 本章将带你深入学习 React Hooks 的进阶知识，包括 useReducer、useMemo、useCallback、自定义 Hooks 以及 Hooks 的最佳实践。通过大量示例和 ASCII 图解，帮助你掌握性能优化和代码组织的技巧。

---

## 4.1 useReducer 复杂状态管理

### 什么是 useReducer？

在上一章中，我们学习了 `useState` 来管理简单的状态。但是，当你的状态逻辑变得复杂时（比如一个状态的变化会影响到多个其他状态），`useState` 可能会变得难以管理。

`useReducer` 是 `useState` 的替代方案，它更适合管理复杂的状态逻辑。想象一下，`useReducer` 就像是一个"状态机"，它会根据不同的"动作"（action）来更新状态。

### 为什么需要 useReducer？

让我们先看一个使用 `useState` 管理复杂状态的例子，然后对比 `useReducer`：

```jsx
// 使用 useState 管理复杂状态 - 容易变得混乱
function ShoppingCart() {
  const [items, setItems] = useState([])
  const [discount, setDiscount] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 添加商品
  const addItem = (item) => {
    setItems([...items, item])
    setShipping(items.length >= 5 ? 0 : 10) // 满5件免运费
  }

  // 移除商品
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
    setShipping(items.length > 5 ? 0 : 10)
  }

  // 应用折扣
  const applyDiscount = (code) => {
    if (code === 'SAVE10') {
      setDiscount(10)
    } else if (code === 'SAVE20') {
      setDiscount(20)
    }
  }

  // ... 还有很多状态需要管理
}
```

上面的代码有什么问题？
1. 状态更新逻辑分散在各个函数中
2. 多个状态之间有依赖关系，容易出错
3. 难以测试和维护

### useReducer vs useState

```
+------------------------+---------------------------+
|      useState          |       useReducer         |
+------------------------+---------------------------+
| 适合简单、独立的状态     | 适合复杂的状态逻辑        |
| 更新逻辑简单直接        | 更新逻辑集中管理          |
| 一个状态                | 多个相关的状态            |
| setState(value)        | dispatch({type, payload})|
| 异步更新               | 同步更新（通常）          |
+------------------------+---------------------------+
```

### useReducer 基础用法

```jsx
import { useReducer } from 'react'

// 1. 定义初始状态
const initialState = {
  count: 0,
  message: 'Hello'
}

// 2. 定义 reducer 函数
// reducer 函数接收当前状态和一个 action，返回新状态
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }
    case 'RESET':
      return { ...state, count: 0 }
    case 'SET':
      return { ...state, count: action.payload }
    default:
      return state
  }
}

// 3. 在组件中使用
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState)

  return (
    <div>
      <p>计数: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>重置</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>设为100</button>
    </div>
  )
}
```

### useReducer 的工作流程（ASCII 图解）

```
                    useReducer 工作流程

    +------------------+
    |                  |
    v                  |
+----------------+    |
|   Component    |    |
|                |    |
|  [dispatch]    |----+
|                |    |
+--------+-------+    |
         |             |
         | dispatch    |
         | action     |
         v             |
+----------------+    |
|    Reducer     |    |
|                |    |
|  switch(type)  |    |
|    case ...    |    |
+--------+-------+    |
         |             |
         | new state  |
         v             |
+----------------+    |
|    React      |    |
|               |    |
|  re-render    |<---+
|               |
+---------------+

代码流程：
1. 用户点击按钮
2. dispatch({ type: 'INCREMENT' })
3. React 调用 reducer(currentState, action)
4. reducer 返回新状态
5. React 检测到状态变化，重新渲染组件
```

### 购物车示例 - 完整代码

```jsx
import { useReducer } from 'react'

// 初始状态
const initialState = {
  items: [],
  discount: 0,
  shipping: 0,
  isLoading: false,
  error: null
}

// Reducer 函数 - 所有的状态更新逻辑都集中在这里
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItems = [...state.items, action.payload]
      return {
        ...state,
        items: newItems,
        shipping: newItems.length >= 5 ? 0 : 10
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        shipping: newItems.length >= 5 ? 0 : 10
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return { ...state, items: newItems }
    }

    case 'APPLY_DISCOUNT':
      return { ...state, discount: action.payload }

    case 'CLEAR_CART':
      return { ...initialState }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    default:
      return state
  }
}

// 计算总价
function calculateTotal(items, discount, shipping) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * (discount / 100)
  return subtotal - discountAmount + shipping
}

// 购物车组件
function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const { items, discount, shipping, error } = state

  const total = calculateTotal(items, discount, shipping)

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } })
  }

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const applyDiscount = (code) => {
    if (code === 'SAVE10') {
      dispatch({ type: 'APPLY_DISCOUNT', payload: 10 })
    } else if (code === 'SAVE20') {
      dispatch({ type: 'APPLY_DISCOUNT', payload: 20 })
    } else {
      dispatch({ type: 'APPLY_DISCOUNT', payload: 0 })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  // 模拟添加一些商品
  const sampleItems = [
    { id: 1, name: 'React 入门', price: 59 },
    { id: 2, name: 'JavaScript 高级', price: 79 },
    { id: 3, name: 'Node.js 实战', price: 69 },
    { id: 4, name: 'TypeScript 教程', price: 89 },
    { id: 5, name: 'Vue3 完全指南', price: 99 }
  ]

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>购物车</h2>

      {/* 商品列表 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>可选商品</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {sampleItems.map(item => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              + {item.name} (¥{item.price})
            </button>
          ))}
        </div>
      </div>

      {/* 购物车内容 */}
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h3>购物车 ({items.length} 件商品)</h3>

        {items.length === 0 ? (
          <p style={{ color: '#999' }}>购物车是空的</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item, index) => (
              <li key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span>{item.name} - ¥{item.price}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button onClick={() => removeItem(item.id)} style={{ color: 'red' }}>删除</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 折扣码输入 */}
        <div style={{ marginTop: '15px' }}>
          <input
            type="text"
            placeholder="输入折扣码 (SAVE10 / SAVE20)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyDiscount(e.target.value)
                e.target.value = ''
              }
            }}
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>按回车应用折扣</span>
        </div>

        {/* 统计信息 */}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <p>小计: ¥{items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
          {discount > 0 && <p style={{ color: 'green' }}>折扣: {discount}%</p>}
          <p>运费: ¥{shipping}</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
            总计: ¥{total}
          </p>
          {shipping === 0 && <p style={{ color: 'green' }}>已免运费!</p>}

          <button
            onClick={clearCart}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            清空购物车
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default ShoppingCart
```

### 表单处理 - useReducer 实战

```jsx
import { useReducer } from 'react'

// 表单初始状态
const initialFormState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  errors: {},
  isSubmitting: false,
  isValid: false
}

// 表单 reducer
function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: '' // 清除该字段的错误
        }
      }

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error }
      }

    case 'VALIDATE':
      const errors = {}
      if (!state.username) errors.username = '用户名不能为空'
      if (!state.email) errors.email = '邮箱不能为空'
      if (!state.password) errors.password = '密码不能为空'
      if (state.password !== state.confirmPassword) {
        errors.confirmPassword = '两次密码不一致'
      }
      if (state.password && state.password.length < 6) {
        errors.password = '密码至少6位'
      }

      return {
        ...state,
        errors,
        isValid: Object.keys(errors).length === 0
      }

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload }

    case 'RESET':
      return initialFormState

    default:
      return state
  }
}

// 表单组件
function RegistrationForm() {
  const [form, dispatch] = useReducer(formReducer, initialFormState)

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD', field: name, value })
  }

  const handleBlur = (e) => {
    dispatch({ type: 'VALIDATE' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // 先验证
    dispatch({ type: 'VALIDATE' })

    if (form.isValid) {
      dispatch({ type: 'SET_SUBMITTING', payload: true })

      // 模拟提交
      setTimeout(() => {
        console.log('提交表单:', {
          username: form.username,
          email: form.email,
          password: form.password
        })
        dispatch({ type: 'SET_SUBMITTING', payload: false })
        alert('注册成功!')
        dispatch({ type: 'RESET' })
      }, 1000)
    }
  }

  const inputStyle = (field) => ({
    padding: '10px',
    width: '100%',
    border: form.errors[field] ? '2px solid red' : '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '5px'
  })

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>用户注册</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>用户名</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle('username')}
          />
          {form.errors.username && <span style={{ color: 'red', fontSize: '12px' }}>{form.errors.username}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>邮箱</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle('email')}
          />
          {form.errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{form.errors.email}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>密码</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle('password')}
          />
          {form.errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{form.errors.password}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>确认密码</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle('confirmPassword')}
          />
          {form.errors.confirmPassword && <span style={{ color: 'red', fontSize: '12px' }}>{form.errors.confirmPassword}</span>}
        </div>

        <button
          type="submit"
          disabled={form.isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: form.isSubmitting ? '#ccc' : '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: form.isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {form.isSubmitting ? '提交中...' : '注册'}
        </button>
      </form>
    </div>
  )
}

export default RegistrationForm
```

### useReducer 状态流程图

```
                    复杂表单状态管理流程

    +-----------+     dispatch      +-----------+     return      +-----------+
    |           |   +-----------+   |           |   +-----------+ |           |
    |  User     |-->|           |-->|  Reducer  |-->|           |-->|  State    |
    |  Input    |   |  Action   |   |  Function |   |  New State|   |  Update   |
    |           |   | {type,payload}  |           |   |           |   |           |
    +-----------+   +-----------+   +-----------+   +-----------+ +-----------+
         |                                    |                     |
         |                                    | switch               |
         |                                    | case                 |
         v                                    v                     v
    onChange                          +-----------+          +-----------+
    dispatch({type, field, value})   |  Logic   |          | Re-render |
                                      |  Centralized       | Component |
                                      +-----------+          +-----------+

    优势:
    1. 所有状态逻辑集中在一个地方
    2. 易于测试和调试
    3. 状态变化可预测
    4. 支持复杂的依赖关系
```

---

## 4.2 useMemo 性能优化

### 什么是 Memoization？

在计算机科学中，Memoization（记忆化）是一种优化技术，用于缓存函数的计算结果，避免重复计算。

```
    没有 Memoization                有 Memoization

    calculate(5)                     calculate(5)
         |                               |
         v                               v
    +---------+                     +---------+
    | Compute |                     | Check   |
    | 5 * 5   |                     | Cache   |----- 命中! 返回缓存
    +---------+                     +---------+
         |                               |
         v                               v
    Result: 25                     Result: 25

    calculate(5) 再次调用            calculate(5) 再次调用
         |                               |
         v                               v
    +---------+                     +---------+
    | Compute |                     | Check   |----- 命中! 返回缓存
    | 5 * 5   |                     | Cache   |
    +---------+                     +---------+
         |                               |
         v                               v
    Result: 25                     Result: 25
```

### 为什么需要 useMemo？

React 组件在父组件重新渲染或者自身状态变化时会重新渲染。在重新渲染过程中，所有的计算都会重新执行，即使结果没有变化。这可能会导致性能问题，特别是：

1. 复杂的计算（如排序、过滤大型数组）
2. 渲染昂贵的组件
3. 大量数据的处理

### useMemo 基础用法

```jsx
import { useMemo } from 'react'

function MyComponent({ data, filter }) {
  // useMemo 接受两个参数：
  // 1. 计算函数 - 返回需要缓存的值
  // 2. 依赖数组 - 当依赖变化时，重新计算

  const filteredData = useMemo(() => {
    console.log('计算中...') // 调试用
    return data.filter(item => item.name.includes(filter))
  }, [data, filter]) // 只有 data 或 filter 变化时重新计算

  return (
    <ul>
      {filteredData.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

### 性能对比示例

```jsx
import { useState, useMemo } from 'react'

function PerformanceDemo() {
  const [count, setCount] = useState(0)
  const [items] = useState(() => {
    // 生成 10000 个项目
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      value: Math.random()
    }))
  })
  const [filter, setFilter] = useState('')

  // 不使用 useMemo - 每次渲染都会重新计算
  const filteredWithoutMemo = items.filter(item =>
    item.value.toString().includes(filter)
  )

  // 使用 useMemo - 只有 items 或 filter 变化时重新计算
  const filteredWithMemo = useMemo(() => {
    console.log('Filtering...') // 只在需要时打印
    return items.filter(item =>
      item.value.toString().includes(filter)
    )
  }, [items, filter])

  // 复杂计算示例
  const expensiveResult = useMemo(() => {
    console.log('Expensive calculation...')
    let result = 0
    for (let i = 0; i < 10000000; i++) {
      result += Math.sqrt(i)
    }
    return result
  }, []) // 空依赖数组，只计算一次

  return (
    <div style={{ padding: '20px' }}>
      <h2>useMemo 性能演示</h2>

      <div style={{ marginBottom: '20px' }}>
        <p>计数器: {count}</p>
        <button onClick={() => setCount(c => c + 1)}>增加计数</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="过滤..."
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <span>不使用 useMemo: {filteredWithoutMemo.length} 项</span>
        <br />
        <span>使用 useMemo: {filteredWithMemo.length} 项</span>
      </div>

      <div>
        <p>复杂计算结果（只计算一次）: {expensiveResult.toFixed(2)}</p>
        <p>尝试点击"增加计数"按钮，观察控制台输出</p>
      </div>
    </div>
  )
}
```

### 适用场景详解

#### 场景1：大型数组的过滤和排序

```jsx
import { useMemo } from 'react'

function UserList({ users, sortBy, filterText }) {
  // 只有 users、sortBy 或 filterText 变化时才重新计算
  const processedUsers = useMemo(() => {
    let result = [...users]

    // 过滤
    if (filterText) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(filterText.toLowerCase())
      )
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      return b.age - a.age
    })

    return result
  }, [users, sortBy, filterText])

  return (
    <ul>
      {processedUsers.map(user => (
        <li key={user.id}>{user.name} - {user.age}岁</li>
      ))}
    </ul>
  )
}
```

#### 场景2：避免不必要的对象创建

```jsx
import { useMemo } from 'react'

function ProductCard({ product, onAddToCart }) {
  // 每次渲染都会创建新的 style 对象
  // const style = { border: '1px solid #ddd', padding: '10px' }

  // 使用 useMemo 缓存 style 对象
  const style = useMemo(() => ({
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px'
  }), []) // 空依赖，样式不会变化

  // 每次渲染都会创建新的 onClick 函数
  // 这会导致子组件不必要的重新渲染
  // const handleClick = () => onAddToCart(product.id)

  // 使用 useCallback 缓存函数（后面会讲）
  const handleClick = useCallback(() => {
    onAddToCart(product.id)
  }, [onAddToCart, product.id])

  return (
    <div style={style}>
      <h3>{product.name}</h3>
      <p>价格: ¥{product.price}</p>
      <button onClick={handleClick}>加入购物车</button>
    </div>
  )
}
```

#### 场景3：计算派生状态

```jsx
import { useMemo } from 'react'

function Invoice({ items, taxRate = 0.1 }) {
  // 使用 useMemo 计算派生状态
  const subtotal = useMemo(() =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const tax = useMemo(() =>
    subtotal * taxRate,
    [subtotal, taxRate]
  )

  const total = useMemo(() =>
    subtotal + tax,
    [subtotal, tax]
  )

  return (
    <div>
      <p>小计: ¥{subtotal.toFixed(2)}</p>
      <p>税费: ¥{tax.toFixed(2)}</p>
      <p>总计: ¥{total.toFixed(2)}</p>
    </div>
  )
}
```

### 依赖数组详解

```
    useMemo 依赖数组规则

    +------------------+----------------------------------+
    | 依赖             | 行为                             |
    +------------------+----------------------------------+
    | []               | 只计算一次（初始渲染时）          |
    | [a]              | 当 a 变化时重新计算               |
    | [a, b]           | 当 a 或 b 变化时重新计算          |
    | 未提供           | 每次渲染都重新计算（不推荐）       |
    +------------------+----------------------------------+

    常见错误：

    1. 遗漏依赖
    const result = useMemo(() => a + b, [a]) // 错误！遗漏了 b

    2. 过多依赖
    const result = useMemo(() => {
      return compute(a) // compute 内部使用了 b, c, d
    }, [a, b, c, d]) // 可能导致不必要的重新计算

    3. 使用对象或数组作为依赖
    const style = useMemo(() => ({
      color: 'red'
    }), [items]) // 错误！items 是数组，每次都是新引用

    正确做法：
    const style = useMemo(() => ({
      color: theme.color // 使用具体值
    }), [theme.color])
```

### useMemo 工作流程图

```
              useMemo 执行流程

    +-----------+      +------------+      +-------------+
    |           |      |            |      |             |
    |  Render   |----->|  Check     |----->|  Computed   |
    |           |      |  Dependencies     |  (Cached)   |
    +-----------+      +------------+      +-------------+
                               |                    |
                               | 依赖变化           | 返回缓存
                               |                    |
                               v                    v
                        +------------+      +-------------+
                        |            |      |             |
                        |  Execute   |      |  Return     |
                        |  Function  |      |  Value      |
                        |            |      |             |
                        +------------+      +-------------+
```

---

## 4.3 useCallback 函数缓存

### 什么时候使用 useCallback？

`useCallback` 用于缓存函数，避免在每次渲染时创建新的函数实例。这在以下场景特别有用：

1. **传递给子组件的回调函数** - 防止子组件不必要地重新渲染
2. **作为 useEffect 的依赖** - 避免 effect 频繁触发
3. **事件处理函数** - 当函数依赖频繁变化的状态时

### useCallback 基础用法

```jsx
import { useCallback } from 'react'

function MyComponent({ onClick }) {
  // 不使用 useCallback - 每次渲染都创建新函数
  const handleClick = () => {
    console.log('clicked')
    onClick()
  }

  // 使用 useCallback - 只有 onClick 变化时才创建新函数
  const handleClickCached = useCallback(() => {
    console.log('clicked')
    onClick()
  }, [onClick])

  return <button onClick={handleClickCached}>点击</button>
}
```

### useCallback vs useMemo

```
    useCallback vs useMemo

    +--------------------+---------------------------+
    | useCallback(fn)    | useMemo(() => fn)        |
    | 等价于             | 等价于                    |
    | useMemo(fn, [fn]) | useMemo(() => fn, [])    |
    +--------------------+---------------------------+
    | 缓存函数本身        | 缓存函数的返回值           |
    +--------------------+---------------------------+

    // 这两行代码是等价的：
    const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
    const memoizedCallback = useMemo(() => () => doSomething(a, b), [a, b])
```

### 子组件优化示例

```jsx
import { useState, useCallback } from 'react'

// 子组件 - 使用 React.memo 优化
const Button = React.memo(({ onClick, children }) => {
  console.log(`渲染按钮: ${children}`)
  return (
    <button onClick={onClick} style={{ margin: '5px', padding: '8px 16px' }}>
      {children}
    </button>
  )
})

function ParentComponent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  // 不使用 useCallback - 每次渲染都会创建新函数
  // 导致 Button 组件不必要地重新渲染
  const handleIncrement = () => setCount(c => c + 1)
  const handleDecrement = () => setCount(c => c - 1)
  const handleReset = () => setCount(0)

  // 使用 useCallback - 只有依赖变化时才创建新函数
  const handleIncrementMemo = useCallback(() => setCount(c => c + 1), [])
  const handleDecrementMemo = useCallback(() => setCount(c => c - 1), [])
  const handleResetMemo = useCallback(() => setCount(0), [])

  return (
    <div style={{ padding: '20px' }}>
      <h2>Parent Component</h2>
      <p>计数: {count}</p>
      <p>名字: {name}</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="输入名字..."
        style={{ padding: '8px', marginBottom: '20px' }}
      />

      <div>
        <h3>没有使用 useCallback（会不必要的重新渲染子组件）</h3>
        <Button onClick={handleIncrement}>+1</Button>
        <Button onClick={handleDecrement}>-1</Button>
        <Button onClick={handleReset}>重置</Button>
      </div>

      <div>
        <h3>使用了 useCallback（优化后）</h3>
        <Button onClick={handleIncrementMemo}>+1</Button>
        <Button onClick={handleDecrementMemo}>-1</Button>
        <Button onClick={handleResetMemo}>重置</Button>
      </div>

      <p style={{ marginTop: '20px', color: '#666' }}>
        提示：尝试在输入框中输入文字，观察控制台输出
      </p>
    </div>
  )
}
```

### 实际应用场景

#### 场景1：表单提交

```jsx
import { useState, useCallback } from 'react'

function SearchComponent({ onSearch }) {
  const [query, setQuery] = useState('')

  // 使用 useCallback 缓存搜索函数
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query)
    }
  }, [query, onSearch])

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索..."
      />
      <button onClick={handleSearch}>搜索</button>
    </div>
  )
}

function Parent() {
  const [results, setResults] = useState([])

  const performSearch = useCallback((query) => {
    console.log('执行搜索:', query)
    // 模拟 API 调用
    setResults([`结果1: ${query}`, `结果2: ${query}`])
  }, [])

  return <SearchComponent onSearch={performSearch} />
}
```

#### 场景2：定时器回调

```jsx
import { useState, useCallback, useEffect } from 'react'

function TimerComponent() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // 使用 useCallback 确保定时器回调函数稳定
  const tick = useCallback(() => {
    setSeconds(s => s + 1)
  }, [])

  useEffect(() => {
    let interval = null

    if (isRunning) {
      interval = setInterval(tick, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, tick])

  return (
    <div>
      <p>时间: {seconds} 秒</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '暂停' : '开始'}
      </button>
    </div>
  )
}
```

### useCallback 工作流程

```
              useCallback 工作原理

    首次渲染：
    +-----------+     +------------+     +-------------+
    |           |     |            |     |             |
    |  Define   |---->|  Store     |---->|  Return    |
    |  Function |     |  Function  |     |  Function  |
    |           |     |  in Cache  |     |  Reference |
    +-----------+     +------------+     +-------------+

    后续渲染（依赖未变）：
    +-----------+     +------------+     +-------------+
    |           |     |            |     |             |
    |  Define   |---->|  Check     |---->|  Return     |
    |  Function |     |  Dependencies     |  Cached     |
    |           |     |  (same)    |     |  Reference  |
    +-----------+     +------------+     +-------------+

    后续渲染（依赖变化）：
    +-----------+     +------------+     +-------------+
    |           |     |            |     |             |
    |  Define   |---->|  Check     |---->|  Return     |
    |  Function |     |  Dependencies     |  New        |
    |           |     |  (changed) |     |  Reference  |
    +-----------+     +------------+     +-------------+
```

---

## 4.4 自定义 Hooks

### 什么是自定义 Hooks？

自定义 Hooks 是一个 JavaScript 函数，其名称以 "use" 开头，可以在函数组件中调用其他 Hooks。自定义 Hooks 允许你复用组件逻辑。

```
    自定义 Hooks 本质：

    +------------------+        +------------------+
    |   普通函数       |        |   自定义 Hook    |
    +------------------+        +------------------+
    | 不能调用 Hooks   |   =>   | 可以调用 Hooks   |
    | 无特殊要求       |        | 必须以 "use" 开头 |
    +------------------+        +------------------+
```

### 自定义 Hooks 的规则

1. **命名规范**：必须以 "use" 开头（如 `useLocalStorage`、`useFetch`）
2. **调用位置**：只能在 React 函数组件或自定义 Hook 中调用
3. **顶层调用**：不能在循环、条件语句或嵌套函数中调用
4. **复用逻辑**：用于提取和复用状态逻辑

### 自定义 Hooks 基础示例

```jsx
import { useState, useEffect } from 'react'

// 自定义 Hook: useWindowSize
// 监听窗口大小变化
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)

    // 清理函数
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

// 使用自定义 Hook
function MyComponent() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>窗口宽度: {width}px</p>
      <p>窗口高度: {height}px</p>
    </div>
  )
}
```

### 实用自定义 Hooks 示例

#### 1. useLocalStorage - 本地存储 Hook

```jsx
import { useState, useEffect } from 'react'

// useLocalStorage Hook
function useLocalStorage(key, initialValue) {
  // 从 localStorage 获取值，如果没有则使用初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return initialValue
    }
  })

  // 创建一个函数来更新 localStorage
  const setValue = (value) => {
    try {
      // 允许传入值或函数
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  }

  return [storedValue, setValue]
}

// 使用示例
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'zh-CN')

  return (
    <div>
      <h2>设置</h2>
      <div>
        <label>主题: </label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
      </div>
      <div>
        <label>语言: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="zh-CN">中文</option>
          <option value="en-US">English</option>
        </select>
      </div>
      <p>当前主题: {theme}</p>
      <p>当前语言: {language}</p>
    </div>
  )
}
```

#### 2. useDebounce - 防抖 Hook

```jsx
import { useState, useEffect } from 'react'

// useDebounce Hook - 延迟更新值
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // 设置定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 清理函数 - 值变化时清除之前的定时器
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// 使用示例 - 搜索框
function SearchInput() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  // 使用防抖 - 等待用户停止输入 500ms 后才搜索
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) {
      // 模拟搜索 API
      console.log('搜索:', debouncedQuery)
      setResults([`结果: ${debouncedQuery} 1`, `结果: ${debouncedQuery} 2`])
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  return (
    <div style={{ padding: '20px' }}>
      <h2>防抖搜索示例</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入搜索内容..."
        style={{ padding: '8px', width: '300px', marginBottom: '10px' }}
      />
      <p>当前输入: {query}</p>
      <p>防抖值: {debouncedQuery}</p>
      <ul>
        {results.map((result, i) => (
          <li key={i}>{result}</li>
        ))}
      </ul>
    </div>
  )
}
```

#### 3. useFetch - 数据获取 Hook

```jsx
import { useState, useEffect } from 'react'

// useFetch Hook
function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 创建 AbortController 用于取消请求
    const controller = new AbortController()
    const { signal } = controller

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, {
          ...options,
          signal
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()
        setData(json)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // 清理：组件卸载时取消请求
    return () => controller.abort()
  }, [url, JSON.stringify(options)])

  return { data, loading, error }
}

// 使用示例
function UserList() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users')

  if (loading) return <p>加载中...</p>
  if (error) return <p>错误: {error}</p>

  return (
    <ul>
      {data && data.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  )
}
```

#### 4. useToggle - 切换 Hook

```jsx
import { useState, useCallback } from 'react'

// useToggle Hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  return [value, toggle, setTrue, setFalse]
}

// 使用示例
function Modal() {
  const [isOpen, toggle, setOpen, setClose] = useToggle(false)

  return (
    <div>
      <button onClick={toggle}>
        {isOpen ? '关闭弹窗' : '打开弹窗'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          border: '1px solid #ddd',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>弹窗内容</h3>
          <p>这是一个使用 useToggle 的弹窗</p>
          <button onClick={setClose}>关闭</button>
        </div>
      )}
    </div>
  )
}
```

#### 5. usePrevious - 获取上一个状态值

```jsx
import { useRef, useEffect } from 'react'

// usePrevious Hook
function usePrevious(value) {
  const ref = useRef()

  // 每次渲染后更新 ref
  useEffect(() => {
    ref.current = value
  }, [value])

  // 返回上一次的值
  return ref.current
}

// 使用示例
function Counter() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div>
      <p>当前值: {count}</p>
      <p>上一个值: {previousCount !== undefined ? previousCount : '无'}</p>
      <p>变化: {previousCount !== undefined ? count - previousCount : 0}</p>
      <button onClick={() => setCount(c => c + 1)}>增加</button>
      <button onClick={() => setCount(c => c - 1)}>减少</button>
    </div>
  )
}
```

### 自定义 Hooks 组合示例

```jsx
import { useState, useEffect } from 'react'

// 多个自定义 Hook 组合使用

// Hook 1: 监听鼠标位置
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}

// Hook 2: 监听键盘按键
function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false)

  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true)
      }
    }

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false)
      }
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [targetKey])

  return keyPressed
}

// 组合使用
function AdvancedComponent() {
  const mousePosition = useMousePosition()
  const isSpacePressed = useKeyPress(' ')

  return (
    <div style={{ padding: '20px' }}>
      <h2>鼠标位置: ({mousePosition.x}, {mousePosition.y})</h2>
      <p>空格键按下: {isSpacePressed ? '是' : '否'}</p>
    </div>
  )
}
```

### 自定义 Hooks 架构图

```
    自定义 Hooks 架构

    +--------------------------------------------------+
    |                  自定义 Hooks                      |
    +--------------------------------------------------+
    |                                                  |
    |  +-------------+     +-------------+             |
    |  | useWindow   |     | useLocal    |             |
    |  | Size        |     | Storage     |             |
    |  +-------------+     +-------------+             |
    |                                                  |
    |  +-------------+     +-------------+             |
    |  | useFetch    |     | useDebounce |             |
    |  +-------------+     +-------------+             |
    |                                                  |
    |  +-------------+     +-------------+             |
    |  | useToggle   |     | usePrevious |             |
    |  +-------------+     +-------------+             |
    |                                                  |
    +--------------------------------------------------+
           |              |              |
           v              v              v
    +--------------------------------------------------+
    |              React 函数组件                       |
    +--------------------------------------------------+
    |  function MyComponent() {                        |
    |    const size = useWindowSize()                  |
    |    const [theme, setTheme] = useLocalStorage()  |
    |    const { data } = useFetch('/api')            |
    |    // ...                                        |
    |  }                                               |
    +--------------------------------------------------+
```

---

## 4.5 Hooks 规则与最佳实践

### Hooks 的两条基本规则

```
    Hooks 规则

    +--------------------------------------------------+
    |  规则 1: 只在顶层调用 Hooks                       |
    +--------------------------------------------------+
    |                                                  |
    |  正确写法:           错误写法:                     |
    |  function MyComponent() {                         |
    |    const [a, setA] = useState()  // OK          |
    |    const [b, setB] = useState()  // OK          |
    |    const value = useMemo(...)    // OK          |
    |  }                                             |
    |                                                  |
    |  function MyComponent() {                         |
    |    if (condition) {                              |
    |      const [a, setA] = useState()  // 错误!     |
    |    }                                            |
    |  }                                             |
    |                                                  |
    |  function MyComponent() {                         |
    |    for (let i = 0; i < 3; i++) {                |
    |      const [a, setA] = useState()  // 错误!     |
    |    }                                            |
    |  }                                             |
    |                                                  |
    +--------------------------------------------------+

    +--------------------------------------------------+
    |  规则 2: 只在 React 函数中调用 Hooks              |
    +--------------------------------------------------+
    |                                                  |
    |  正确调用位置:          错误调用位置:             |
    |  - 函数组件             - 普通 JavaScript 函数    |
    |  - 自定义 Hook          - 类组件                  |
    |                          - setTimeout 回调        |
    |                                                  |
    +--------------------------------------------------+
```

### 依赖数组的正确使用

```
    依赖数组常见问题和解决方案

    +--------------------------------------------------+
    |  问题 1: 遗漏依赖                                 |
    +--------------------------------------------------+
    |                                                  |
    |  错误:                       正确:                |
    |  useEffect(() => {          useEffect(() => {   |
    |    doSomething(a, b)          doSomething(a, b)  |
    |  }, [a])                    }, [a, b])           |
    |                               ^                  |
    |                               遗漏了 b!          |
    +--------------------------------------------------+

    +--------------------------------------------------+
    |  问题 2: 依赖过多                                 |
    +--------------------------------------------------+
    |                                                  |
    |  错误:                       正确:                |
    |  const result = useMemo(() => compute(a, b, c, d)|
    |  , [a, b, c, d])            , [a])              |
    |                               ^                  |
    |  compute 内部只用到了 a     只需在 a 变化时重新计算|
    +--------------------------------------------------+

    +--------------------------------------------------+
    |  问题 3: 对象/数组作为依赖                        |
    +--------------------------------------------------+
    |                                                  |
    |  错误:                       正确:                |
    |  useEffect(() => {          useEffect(() => {   |
    |    // ...                    // ...              |
    |  }, [options])              }, [options.count])  |
    |  ^                          ^                    |
    |  options 是对象            使用具体值而非对象     |
    |  每次渲染都是新引用!         |
    +--------------------------------------------------+

    +--------------------------------------------------+
    |  最佳实践: 使用 ESLint 插件                       |
    +--------------------------------------------------+
    |                                                  |
    |  安装 eslint-plugin-react-hooks                  |
    |                                                  |
    |  npm install eslint-plugin-react-hooks --save-dev|
    |                                                  |
    |  配置 .eslintrc:                                 |
    |  {                                               |
    |    "plugins": ["react-hooks"],                  |
    |    "rules": {                                   |
    |      "react-hooks/rules-of-hooks": "error",     |
    |      "react-hooks/exhaustive-deps": "warn"      |
    |    }                                            |
    |  }                                               |
    +--------------------------------------------------+
```

### 常见陷阱和解决方案

#### 陷阱1：闭包问题

```jsx
import { useState, useEffect, useRef } from 'react'

// 问题：setInterval 闭包陷阱
function CounterWithBug() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1) // 闭包中的 count 永远是 0!
    }, 1000)

    return () => clearInterval(interval)
  }, []) // 空依赖，只执行一次

  return <p>计数: {count}</p>
  // 结果：count 永远停留在 1！
}

// 解决方案 1: 使用函数式更新
function CounterWithFix1() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1) // 使用函数获取最新值
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <p>计数: {count}</p>
}

// 解决方案 2: 使用 useRef
function CounterWithFix2() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  useEffect(() => {
    countRef.current = count
  }, [count])

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(countRef.current + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <p>计数: {count}</p>
}
```

#### 陷阱2：无限循环

```jsx
import { useState, useEffect } from 'react'

// 问题：无限循环
function BuggyComponent() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData().then(result => {
      setData(result) // 设置数据
    })
  }, [data]) // 错误！data 变化会触发 effect！

  return <div>{data}</div>
}

// 解决方案：正确设置依赖
function FixedComponent() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData().then(result => {
      setData(result)
    })
  }, []) // 空依赖，只在挂载时执行一次

  return <div>{data}</div>
}
```

#### 陷阱3：useState 初始值计算昂贵

```jsx
import { useState, useMemo } from 'react'

// 问题：每次渲染都重新计算初始值
function BuggyComponent() {
  const [items] = useState(expensiveOperation()) // 每次渲染都执行!
  // ...
}

// 解决方案 1: 传入函数（惰性初始化）
function FixedComponent1() {
  const [items] = useState(() => expensiveOperation()) // 只执行一次
  // ...
}

// 解决方案 2: 使用 useMemo
function FixedComponent2() {
  const items = useMemo(() => expensiveOperation(), []) // 只执行一次
  const [data, setData] = useState(items)
  // ...
}
```

#### 陷阱4：在依赖中遗漏函数

```jsx
import { useState, useEffect } from 'react'

// 问题：回调函数没有包含在依赖中
function Parent() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    console.log('clicked')
  }

  useEffect(() => {
    // 依赖中有 count，但没有 handleClick
    console.log('count changed:', count)
  }, [count])

  return <Child onClick={handleClick} />
}

// 解决方案：使用 useCallback 缓存函数
function FixedParent() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    console.log('clicked')
  }, []) // 依赖为空，函数永远不会变化

  useEffect(() => {
    console.log('count changed:', count)
  }, [count])

  return <Child onClick={handleClick} />
}
```

### Hooks 最佳实践总结

```
    Hooks 最佳实践

    +--------------------------------------------------+
    |  1. 保持 Hooks 调用顺序一致                       |
    +--------------------------------------------------+
    |  总是以相同的顺序调用 Hooks，确保它们的顺序在       |
    |  每次渲染时都是相同的。                           |
    +--------------------------------------------------+

    +--------------------------------------------------+
    |  2. 合理拆分组件                                  |
    +--------------------------------------------------+
    |  如果组件变得太大，考虑将其拆分成更小的组件，       |
    |  每个组件使用自己的 Hooks。                       |
    +--------------------------------------------------+

    +--------------------------------------------------+
    |  3. 提取重复逻辑到自定义 Hooks                    |
    +--------------------------------------------------+
    |  如果多个组件使用相同的逻辑，考虑提取到自定义 Hook。|
    +--------------------------------------------------+

    +--------------------------------------------------+
    |  4. 谨慎使用 useMemo 和 useCallback               |
    +--------------------------------------------------+
    |  不是所有地方都需要优化，过度使用可能导致：         |
    |  - 代码复杂度增加                                 |
    |  - 内存占用增加                                   |
    |  - 维护困难                                       |
    |                                                  |
    |  只在确实存在性能问题时使用。                      |
    +--------------------------------------------------+

    +--------------------------------------------------+
    |  5. 优先使用 useReducer 管理复杂状态               |
    +--------------------------------------------------+
    |  当状态逻辑复杂或多个状态相互依赖时，               |
    |  useReducer 比多个 useState 更容易维护。          |
    +--------------------------------------------------+

    +--------------------------------------------------+
    |  6. 使用 ESLint 插件                              |
    +--------------------------------------------------+
    |  使用 eslint-plugin-react-hooks 自动检测          |
    |  规则违规和依赖问题。                             |
    +--------------------------------------------------+
```

### Hooks 调用规则流程图

```
              Hooks 调用规则流程

    +--------------------------------------------------+
    |                                                  |
    |    +------------------+                          |
    |    | 组件开始渲染     |                          |
    |    +--------+---------+                          |
    |             |                                    |
    |             v                                    |
    |    +------------------+                          |
    |    | 是函数组件吗？   |                          |
    |    +--------+---------+                          |
    |             |                                    |
    |      是      |       否                          |
    |             v                                    |
    |    +------------------+     +------------------+ |
    |    | 检查 Hook 名称    |     |  错误：不能在    | |
    |    | 是否以 use 开头  |     |  类组件中调用    | |
    |    +--------+---------+     +------------------+ |
    |             |                                    |
    |      是      |       否                          |
    |             v                                    |
    |    +------------------+     +------------------+ |
    |    | 在顶层调用吗？   |     |  错误：只能在    | |
    |    | (不在循环/条件/  |     |  顶层调用 Hooks  | |
    |    |  嵌套函数中)     |     +------------------+ |
    |    +--------+---------+                          |
    |             |                                    |
    |      是      |       否                          |
    |             v                                    |
    |    +------------------+                          |
    |    | 调用 Hook        |                          |
    |    | 执行逻辑         |                          |
    |    +------------------+                          |
    |                                                  |
    +--------------------------------------------------+
```

---

## 本章小结

本章学习了 React Hooks 的进阶知识：

1. **useReducer 复杂状态管理**
   - 理解 useReducer 的概念和适用场景
   - 掌握 reducer 函数的编写
   - 学会使用 dispatch 触发状态更新
   - 理解状态流程

2. **useMemo 性能优化**
   - 理解 memoization 概念
   - 掌握 useMemo 的使用场景
   - 正确配置依赖数组
   - 避免常见错误

3. **useCallback 函数缓存**
   - 理解何时使用 useCallback
   - 掌握与 useMemo 的区别
   - 学会优化子组件渲染

4. **自定义 Hooks**
   - 理解自定义 Hooks 的概念
   - 掌握自定义 Hooks 的规则
   - 学会创建实用的自定义 Hooks
   - 理解 Hooks 组合

5. **Hooks 规则与最佳实践**
   - 理解两条基本规则
   - 掌握依赖数组的正确使用
   - 识别常见陷阱并知道如何解决
   - 遵循最佳实践

---

## 练习题

1. **useReducer 练习**：使用 useReducer 实现一个待办事项管理器，支持添加、删除、标记完成、筛选等功能。

2. **useMemo 练习**：创建一个大型列表组件，使用 useMemo 优化过滤和排序性能。

3. **useCallback 练习**：创建一个父组件包含多个子组件，通过 useCallback 防止不必要的重新渲染。

4. **自定义 Hooks 练习**：创建一个 `useInterval` 自定义 Hook，用于替代 setInterval。

5. **综合练习**：创建一个完整的表单组件，包含：
   - 使用 useReducer 管理表单状态
   - 使用 useMemo 计算派生状态
   - 使用 useCallback 缓存事件处理函数
   - 实现表单验证

---

## 下章预告

下一章我们将学习 React 19 的新特性：

- useOptimistic 乐观更新
- useFormStatus 表单状态
- useActionState 操作状态
- 新的 Hooks API
- Server Components 基础

准备好迎接 React 的最新特性了吗？让我们继续前进！
