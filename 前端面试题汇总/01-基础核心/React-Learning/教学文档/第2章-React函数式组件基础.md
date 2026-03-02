# 第2章：React 函数式组件基础

> 本章将带你深入学习 React 函数式组件的核心概念，包括 JSX 语法、组件定义、props 传递、事件处理等

---

## 2.1 函数式组件定义

### 什么是组件？

组件（Component）是 React 的核心概念，它允许我们将 UI 拆分为独立、可复用的代码片段，每个组件维护自己的逻辑和状态。

### 函数式组件 vs 类组件

在 React 19 中，推荐使用函数式组件，因为它更加简洁、易于理解和测试。

#### 类组件（旧写法，了解即可）

```jsx
import React, { Component } from 'react'

class MyComponent extends Component {
  render() {
    return <h1>Hello World</h1>
  }
}
```

#### 函数式组件（推荐写法）

```jsx
function MyComponent() {
  return <h1>Hello World</h1>
}

// 或使用箭头函数
const MyComponent = () => {
  return <h1>Hello World</h1>
}

// 简写形式
const MyComponent = () => <h1>Hello World</h1>
```

### 组件命名规范

1. **必须以大写字母开头**
   ```jsx
   // 正确
   function MyComponent() { return <h1>Hello</h1> }

   // 错误（会被当作 HTML 标签）
   function myComponent() { return <h1>Hello</h1> }
   ```

2. **使用 PascalCase 命名**
   ```jsx
   // 推荐
   function UserProfile() { }
   function ProductCard() { }

   // 不推荐
   function userProfile() { }
   function product_card() { }
   ```

3. **组件文件命名**
   ```
   MyComponent.jsx
   UserProfile.jsx
   ProductCard.jsx
   ```

### 组件的基本结构

```jsx
// 1. 引入 React（在新版本中可选）
import React from 'react'

// 2. 定义函数式组件
function Welcome(props) {
  // 3. 返回 JSX
  return (
    <div className="welcome">
      <h1>Hello, {props.name}!</h1>
      <p>欢迎来到 React 世界</p>
    </div>
  )
}

// 4. 导出组件
export default Welcome
```

---

## 2.2 JSX 语法详解

### 什么是 JSX？

JSX 是 JavaScript 的语法扩展，允许在 JavaScript 中编写类似 HTML 的标记。它是 React 声明式的核心。

### JSX 基础语法

#### 1. 标签必须闭合

```jsx
// 单标签必须自闭合
<input />
<br />
<img src="..." />

// 双标签
<div>
  <p>内容</p>
</div>
```

#### 2. 使用 className 替代 class

```jsx
// 正确
<div className="container">
  <p className="text">Hello</p>
</div>

// 错误（class 是 JavaScript 保留字）
<div class="container">
```

#### 3. 使用 camelCase 命名属性

```jsx
// HTML 属性（kebab-case）
<div onclick="handleClick()">
<input maxlength="100" />

// JSX 属性（camelCase）
<div onClick={handleClick}>
<input maxLength={100} />
```

#### 4. JavaScript 表达式嵌入

使用 `{}` 在 JSX 中嵌入 JavaScript 表达式：

```jsx
const name = 'Alice'
const age = 25

function App() {
  return (
    <div>
      <h1>{name}</h1>
      <p>年龄: {age}</p>
      <p>两年后: {age + 2}</p>
      <p>是否是成年人: {age >= 18 ? '是' : '否'}</p>
    </div>
  )
}
```

#### 5. 条件渲染

```jsx
function App() {
  const isLoggedIn = true

  return (
    <div>
      {/* 三元运算符 */}
      {isLoggedIn ? <p>欢迎回来</p> : <p>请登录</p>}

      {/* 逻辑与运算符 */}
      {isLoggedIn && <button>退出</button>}

      {/* if-else（需在 JSX 外使用） */}
      {(() => {
        if (isLoggedIn) return <p>已登录</p>
        return <p>未登录</p>
      })()}
    </div>
  )
}
```

#### 6. 列表渲染

```jsx
function App() {
  const fruits = ['苹果', '香蕉', '橙子']

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  )
}

// 更复杂的例子
function App() {
  const users = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
  ]

  return (
    <div>
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>年龄: {user.age}</p>
        </div>
      ))}
    </div>
  )
}
```

#### 7. 样式处理

**内联样式**：

```jsx
function App() {
  const style = {
    color: 'blue',
    fontSize: '16px',
    backgroundColor: '#f0f0f0'
  }

  return <p style={style}>内联样式</p>

  // 或直接内联
  return <p style={{ color: 'blue', fontSize: '16px' }}>内联样式</p>
}
```

**CSS 类名**：

```css
/* App.css */
.container {
  padding: 20px;
  background-color: #f5f5f5;
}

.title {
  color: #333;
  font-size: 24px;
}
```

```jsx
// App.jsx
import './App.css'

function App() {
  return (
    <div className="container">
      <h1 className="title">Hello</h1>
    </div>
  )
}
```

#### 8. 注释写法

```jsx
function App() {
  return (
    <div>
      {/* 这是单行注释 */}

      {/* 这是
      多行注释 */}

      {/* 条件注释 */}
      {isShow && (
        <p>显示内容</p>
      )}
    </div>
  )
}
```

### JSX 原理简述

JSX 并不是直接的 HTML，它会被编译为 JavaScript 函数调用：

```jsx
// JSX
<div className="title">Hello</div>

// 编译后
React.createElement('div', { className: 'title' }, 'Hello')
```

---

## 2.3 组件通信：props

### 什么是 props？

props（properties）是父组件向子组件传递数据的方式。props 是只读的，子组件不能直接修改 props。

### 父组件向子组件传递数据

```jsx
// 子组件：接收 props
function ChildComponent(props) {
  return (
    <div>
      <h2>我是子组件</h2>
      <p>收到消息: {props.message}</p>
      <p>数字: {props.count}</p>
    </div>
  )
}

// 父组件：传递 props
function ParentComponent() {
  return (
    <div>
      <h1>我是父组件</h1>
      <ChildComponent message="你好！" count={42} />
    </div>
  )
}
```

### props 解构

```jsx
// 不使用解构
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.age}</p>
    </div>
  )
}

// 使用解构（推荐）
function UserCard({ name, age, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age} 岁</p>
      <p>{email}</p>
    </div>
  )
}

// 使用
<UserCard name="Alice" age={25} email="alice@example.com" />
```

### 默认 props 值

```jsx
// 方法1：默认值（ES6 解构默认值）
function Button({ text = '点击', type = 'primary' }) {
  return <button className={`btn btn-${type}`}>{text}</button>
}

// 方法2：defaultProps（传统方式，了解即可）
function Button({ text, type }) {
  return <button className={`btn btn-${type}`}>{text}</button>
}

Button.defaultProps = {
  text: '点击',
  type: 'primary'
}
```

### props 类型检查

#### 使用 PropTypes（可选）

```jsx
import PropTypes from 'prop-types'

function UserCard({ name, age, email, isActive }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>年龄: {age}</p>
      <p>邮箱: {email}</p>
      <p>状态: {isActive ? '活跃' : '不活跃'}</p>
    </div>
  )
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string,
  isActive: PropTypes.bool
}
```

### children 属性

`children` 是一个特殊的 props，表示组件的子元素：

```jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

// 使用
function App() {
  return (
    <Card title="我的卡片">
      <p>这是卡片的内容</p>
      <button>点击我</button>
    </Card>
  )
}
```

### 函数组件作为 props 传递

```jsx
function Parent() {
  const handleClick = () => {
    console.log('按钮被点击')
  }

  return <Child onClick={handleClick} />
}

function Child({ onClick }) {
  return <button onClick={onClick}>点击</button>
}
```

---

## 2.4 事件处理

### 基本事件处理

```jsx
function App() {
  function handleClick() {
    console.log('按钮被点击')
  }

  return (
    <button onClick={handleClick}>点击</button>
  )
}
```

### 传递参数

```jsx
function App() {
  function handleClick(message) {
    console.log(message)
  }

  return (
    <div>
      {/* 使用箭头函数 */}
      <button onClick={() => handleClick('Hello')}>按钮1</button>

      {/* 使用 bind */}
      <button onClick={handleClick.bind(null, 'World')}>按钮2</button>
    </div>
  )
}
```

### 事件对象

```jsx
function App() {
  function handleClick(event) {
    console.log('事件类型:', event.type)
    console.log('目标元素:', event.target)
    console.log('当前元素:', event.currentTarget)
  }

  return <button onClick={handleClick}>点击</button>
}
```

### 常见事件

#### 鼠标事件

```jsx
function EventsDemo() {
  const handleClick = (e) => console.log('click', e)
  const handleDoubleClick = (e) => console.log('dblclick', e)
  const handleMouseEnter = (e) => console.log('mouseenter', e)
  const handleMouseLeave = (e) => console.log('mouseleave', e)
  const handleMouseOver = (e) => console.log('mouseover', e)
  const handleMouseOut = (e) => console.log('mouseout', e)
  const handleMouseDown = (e) => console.log('mousedown', e)
  const handleMouseUp = (e) => console.log('mouseup', e)
  const handleMouseMove = (e) => console.log('mousemove', e)

  return (
    <div>
      <button onClick={handleClick}>单击</button>
      <button onDoubleClick={handleDoubleClick}>双击</button>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        鼠标事件区域
      </div>
    </div>
  )
}
```

#### 表单事件

```jsx
function FormEvents() {
  const handleSubmit = (e) => {
    e.preventDefault()  // 阻止表单默认提交
    console.log('表单提交')
  }

  const handleChange = (e) => {
    console.log('输入值:', e.target.value)
    console.log('输入框名称:', e.target.name)
  }

  const handleFocus = (e) => {
    console.log('获得焦点')
  }

  const handleBlur = (e) => {
    console.log('失去焦点')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <button type="submit">提交</button>
    </form>
  )
}
```

#### 键盘事件

```jsx
function KeyboardEvents() {
  const handleKeyDown = (e) => {
    console.log('按键:', e.key)
    console.log('按键码:', e.keyCode)
  }

  const handleKeyUp = (e) => {
    console.log('释放:', e.key)
  }

  const handleKeyPress = (e) => {
    console.log('按键按下:', e.key)
  }

  return (
    <input
      type="text"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onKeyPress={handleKeyPress}
    />
  )
}
```

#### 剪贴板事件

```jsx
function ClipboardEvents() {
  const handleCopy = (e) => {
    console.log('复制事件')
  }

  const handleCut = (e) => {
    console.log('剪切事件')
  }

  const handlePaste = (e) => {
    console.log('粘贴事件')
  }

  return (
    <textarea
      onCopy={handleCopy}
      onCut={handleCut}
      onPaste={handlePaste}
    />
  )
}
```

---

## 2.5 条件渲染与列表渲染

### 条件渲染

#### 使用 if 语句

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>欢迎回来</h1>
  }
  return <h1>请登录</h1>
}
```

#### 使用三元运算符

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>欢迎回来</h1>
      ) : (
        <h1>请登录</h1>
      )}
    </div>
  )
}
```

#### 使用逻辑与运算符

```jsx
function Notification({ messages }) {
  return (
    <div>
      {messages.length > 0 && (
        <p>您有 {messages.length} 条新消息</p>
      )}
    </div>
  )
}
```

#### 多个条件

```jsx
function Status({ status }) {
  return (
    <div>
      {status === 'loading' && <Spinner />}
      {status === 'error' && <ErrorMessage />}
      {status === 'success' && <SuccessMessage />}
      {status === 'idle' && <IdleMessage />}
    </div>
  )
}

// 使用 switch 更清晰
function Status({ status }) {
  switch (status) {
    case 'loading':
      return <Spinner />
    case 'error':
      return <ErrorMessage />
    case 'success':
      return <SuccessMessage />
    default:
      return <IdleMessage />
  }
}
```

### 列表渲染

#### 基本列表渲染

```jsx
function FruitList() {
  const fruits = ['苹果', '香蕉', '橙子', '葡萄']

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  )
}
```

#### 渲染对象数组

```jsx
function UserList() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ]

  return (
    <div>
      {users.map(user => (
        <div key={user.id} className="user-item">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}
```

#### 嵌套列表

```jsx
function CategoryList() {
  const categories = [
    {
      id: 1,
      name: '水果',
      items: ['苹果', '香蕉', '橙子']
    },
    {
      id: 2,
      name: '蔬菜',
      items: ['白菜', '萝卜', '黄瓜']
    }
  ]

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

#### 列表筛选与排序

```jsx
function ProductList() {
  const products = [
    { id: 1, name: 'iPhone', price: 999, category: 'phone' },
    { id: 2, name: 'MacBook', price: 1999, category: 'laptop' },
    { id: 3, name: 'iPad', price: 599, category: 'tablet' },
    { id: 4, name: 'AirPods', price: 199, category: 'audio' }
  ]

  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // 筛选
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  // 排序
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    }
    return a.price - b.price
  })

  return (
    <div>
      <input
        type="text"
        placeholder="搜索..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="name">按名称</option>
        <option value="price">按价格</option>
      </select>

      <ul>
        {sortedProducts.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 本章小结

本章学习了：
1. **函数式组件的定义**：如何创建和使用函数式组件
2. **JSX 语法**：标签语法、表达式嵌入、条件渲染、列表渲染
3. **props**：父子组件数据传递
4. **事件处理**：各种事件的使用方法
5. **条件渲染与列表渲染**：根据状态显示不同内容

---

## 练习题

1. **创建一个问候组件**：接受 name props，显示 "Hello, [name]!"
2. **创建一个待办事项列表**：使用数组渲染列表项
3. **创建登录/登出状态切换**：根据登录状态显示不同内容
4. **创建一个表单**：包含输入框和提交按钮，阻止默认提交行为

---

## 下章预告

下一章我们将学习 React Hooks 的基础知识：
- useState 状态管理
- useEffect 副作用处理
- useRef DOM 引用
- useContext 跨组件通信
