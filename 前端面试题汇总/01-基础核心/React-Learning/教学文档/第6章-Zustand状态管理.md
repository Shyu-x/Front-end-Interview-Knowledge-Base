# 第6章：Zustand 状态管理

> 本章将详细介绍 Zustand，一个小巧、快速、可扩展的 React 状态管理库。通过本章的学习，你将掌握 Zustand 的核心概念和实战技巧。

---

## 6.1 Zustand 简介与安装

### 6.1.1 什么是 Zustand？

Zustand（德语意为"状态"）是一个轻量级的 React 状态管理库，由 pmndrs 团队开发维护。它以其简洁的 API、优秀的性能和极小的体积赢得了广大开发者的青睐。

```
+----------------------------------------------------------+
|                      Zustand 特点                         |
+----------------------------------------------------------+
|                                                          |
|   +-------------+   +-------------+   +-------------+    |
|   |   轻量     |   |   简单      |   |   灵活      |    |
|   |  ~1KB      |   |  极简 API   |   | 无 Provider |    |
|   +-------------+   +-------------+   +-------------+    |
|                                                          |
|   +-------------+   +-------------+   +-------------+    |
|   |   高性能   |   |  TypeScript  |   |   可扩展    |    |
|   |  最小渲染  |   |  完整支持    |   |  中间件系统 |    |
|   +-------------+   +-------------+   +-------------+    |
|                                                          |
+----------------------------------------------------------+
```

### 6.1.2 Zustand vs Redux：核心优势对比

为什么选择 Zustand 而不是 Redux？下面通过多个维度进行详细对比：

```
+=======================================================================+
|                        Zustand vs Redux 对比                            |
+=======================================================================+
|                                                                       |
|  对比维度      |         Redux                |        Zustand        |
|------------------------------------------------------------------------|
|  体积         |  ~7KB (核心)                  |     ~1KB (压缩后)     |
|------------------------------------------------------------------------|
|  配置复杂度   |  需要创建 store、reducer、    |     只需 create()     |
|               |  action、middleware 等        |     即可创建 store   |
|------------------------------------------------------------------------|
|  模板代码     |  必须编写大量 action types   |     无需编写类型定义  |
|               |  和 action creators          |     和创建函数        |
|------------------------------------------------------------------------|
|  Provider     |  必须用 <Provider> 包裹      |     无需 Provider     |
|------------------------------------------------------------------------|
|  更新状态     |  dispatch(action)            |     直接调用方法      |
|------------------------------------------------------------------------|
|  学习曲线     |  陡峭（需理解 reducer、       |     平缓（几分钟      |
|               |  middleware、thunk 等）      |     即可上手）        |
|------------------------------------------------------------------------|
|  性能         |  好（但可能过度渲染）        |     更好（精确订阅）  |
|------------------------------------------------------------------------|
|  TypeScript   |  需要大量类型定义            |     自动类型推导      |
+=======================================================================+
```

### 6.1.3 Zustand 状态流架构

下面是 Zustand 的数据流架构图：

```
+==================================================================================+
|                              Zustand 状态流架构                                   |
+==================================================================================+
|                                                                                  |
|   +-------------------+                                                          |
|   |   create()        |  <-- 创建 Store                                         |
|   |   (工厂函数)       |                                                          |
|   +--------+----------+                                                          |
|            |                                                                     |
|            v                                                                     |
|   +-------------------+         +-------------------+                           |
|   |   Store           |         |   组件            |                           |
|   |  +-----------+    |         |  +-------------+  |                           |
|   |  | State     |    |         |  | useStore()  |  |                           |
|   |  | 状态数据   |    | <-----> |  | 订阅状态    |  |                           |
|   |  +-----------+    |         |  +-------------+  |                           |
|   |  | Actions   |    |         |                   |                           |
|   |  | 修改方法   |    |         |                   |                           |
|   |  +-----------+    |         |                   |                           |
|   |  | Middleware|    |         |                   |                           |
|   |  | 中间件    |    |         |                   |                           |
|   |  +-----------+    |         |                   |                           |
|   +-------------------+         +-------------------+                           |
|           ^                                     |                                |
|           |                                     |                                |
|           |         +-------------------+       |                                |
|           |         |  set()            |       |                                |
|           +---------|  更新状态          |<------+                                |
|                     +-------------------+                                     |
|                                                                                  |
+==================================================================================+
```

### 6.1.4 Zustand 安装

```bash
# 使用 npm
npm install zustand

# 使用 yarn
yarn add zustand

# 使用 pnpm
pnpm add zustand
```

### 6.1.5 快速体验

创建一个最简单的 Zustand store 只需要三行代码：

```jsx
import { create } from 'zustand'

// 创建 store，一行代码搞定！
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

function Counter() {
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)

  return (
    <button onClick={increment}>
      {count}
    </button>
  )
}
```

---

## 6.2 基础 Store 创建

### 6.2.1 create 函数详解

Zustand 的核心是 `create` 函数，它接受一个回调函数作为参数，这个回调函数就是 store 的配置函数。

```
+==================================================================================+
|                           create() 函数的工作原理                                  |
+==================================================================================+
|                                                                                  |
|   create((set, get, api) => {                                                    |
|       |              |    |    |                                                |
|       |              |    |    +---> api: 包含 subscribe、getState 等方法      |
|       |              |    +-------> get: 获取当前状态                          |
|       |              +-----------> set: 更新状态                               |
|       +-------------------------> 返回 store 的初始状态和方法                   |
|   })                                                                           |
|                                                                                  |
+==================================================================================+
```

### 6.2.2 基础 Store 示例

```jsx
import { create } from 'zustand'

// 定义 Store
const useCounterStore = create((set, get) => ({
  // ====== 1. 状态（State）======
  count: 0,
  name: '张三',
  isLoggedIn: false,
  users: [],

  // ====== 2. 同步方法 ======
  // 简单更新：直接传递对象
  setName: (name) => set({ name }),

  // 基于前一个状态更新：使用函数
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),

  // 登录/登出
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),

  // ====== 3. 异步方法 ======
  fetchUsers: async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const users = await response.json()
    set({ users })
  },

  // ====== 4. 计算属性（get）======
  // 获取用户数量
  getUserCount: () => get().users.length,

  // 检查是否成年
  isAdult: () => get().age >= 18,

  // ====== 5. 批量更新 ======
  updateProfile: (profile) => set(profile),

  // ====== 6. 重置为默认值 ======
  resetAll: () => set({
    count: 0,
    name: '张三',
    isLoggedIn: false,
    users: []
  })
}))

export default useCounterStore
```

### 6.2.3 Store 的完整结构

```
+==================================================================================+
|                            Store 内部结构                                         |
+==================================================================================+
|                                                                                  |
|   const useStore = create((set, get, api) => ({                                 |
|                                                                                  |
|       // +------------------------------------------------------------------+  |
|       // |                        State (状态)                              |  |
|       // +------------------------------------------------------------------+  |
|       count: 0,                                                                |
|       name: 'Alice',                                                           |
|       age: 25,                                                                 |
|       isLoggedIn: false,                                                      |
|       users: [],                                                               |
|       products: [],                                                            |
|       loading: false,                                                          |
|       error: null,                                                             |
|                                                                                  |
|       // +------------------------------------------------------------------+  |
|       // |                     Actions (动作)                               |  |
|       // +------------------------------------------------------------------+  |
|                                                                                  |
|       // 简单 setter                                                          |
|       setName: (name) => set({ name }),                                        |
|       setAge: (age) => set({ age }),                                          |
|                                                                                  |
|       // 带计算的更新                                                          |
|       increment: () => set((state) => ({                                      |
|           count: state.count + 1                                              |
|       })),                                                                     |
|                                                                                  |
|       // 异步 action                                                          |
|       fetchUsers: async () => {                                                |
|           const data = await api.fetch('/users')                               |
|           set({ users: data })                                                |
|       },                                                                       |
|                                                                                  |
|       // +------------------------------------------------------------------+  |
|       // |                  Computed (计算属性)                              |  |
|       // +------------------------------------------------------------------+  |
|                                                                                  |
|       getUserCount: () => get().users.length,                                 |
|       isAdult: () => get().age >= 18,                                        |
|                                                                                  |
|   }))                                                                          |
|                                                                                  |
+==================================================================================+
```

### 6.2.4 多重状态更新模式

```jsx
import { create } from 'zustand'

const useStore = create((set, get) => ({
  // 状态
  count: 0,
  user: null,
  items: [],

  // 方式一：直接传递对象（适用于简单更新）
  setCount: (count) => set({ count }),

  // 方式二：使用函数（适用于依赖前一个状态）
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),

  // 方式三：批量更新多个状态
  updateUserAndCount: (user, count) => set({ user, count }),

  // 方式四：在方法内部获取当前状态
  incrementIfOdd: () => {
    const { count } = get()
    if (count % 2 !== 0) {
      set({ count: count + 1 })
    }
  },

  // 方式五：重置状态
  reset: () => set({ count: 0, user: null, items: [] })
}))

export default useStore
```

---

## 6.3 在组件中使用 Store

### 6.3.1 基本使用方式

Zustand 最大的特点是不需要 Provider 包裹，可以直接在组件中使用。

```jsx
import useCounterStore from './store/counterStore'

function Counter() {
  // 方式一：订阅整个 store（不推荐，会导致不必要的重新渲染）
  const { count, increment } = useCounterStore()

  // 方式二：使用选择器精确订阅（推荐）
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  )
}
```

### 6.3.2 订阅模式图解

```
+==================================================================================+
|                          Zustand 订阅机制图解                                     |
+==================================================================================+
|                                                                                  |
|  不使用选择器（订阅整个 Store）                                                  |
|  +---------------------+       +---------------------+                          |
|  |   Store             |       |   Component A       |                          |
|  |  { count: 0,       |       |  useStore()         |                          |
|  |    name: 'A',      | <---> |  订阅所有状态        |                          |
|  |    age: 25 }       |       |                     |                          |
|  +---------------------+       +---------------------+                          |
|           ^                                       |                             |
|           |                                       |                             |
|           |         当 name 变化时               |                             |
|           +---------- 组件也会重新渲染 ------------+                             |
|                                                                                  |
|  使用选择器（精确订阅）                                                          |
|  +---------------------+       +---------------------+                          |
|  |   Store             |       |   Component A       |                          |
|  |  { count: 0,       |       |  useStore(s =>      |                          |
|  |    name: 'A',      | <---->|    s.count)         |                          |
|  |    age: 25 }       |       |  只订阅 count       |                          |
|  +---------------------+       +---------------------+                          |
|           ^                                                                     |
|           |                                                                     |
|           |         当 count 变化时               |                             |
|           +---------- 组件重新渲染 ----------------+                             |
|                                                                                  |
|           +---------------------+       +---------------------+                  |
|           |   Component B       |       |   Component C       |                  |
|           |  useStore(s =>      |       |  useStore(s =>      |                  |
|           |    s.name)          | <---->|    s.name)          |                  |
|           |  只订阅 name        |       |  只订阅 name        |                  |
|           +---------------------+       +---------------------+                  |
|                   当 name 变化时                                                  |
|            A、B、C 都会重新渲染                                                   |
|                                                                                  |
+==================================================================================+
```

### 6.3.3 完整组件示例

```jsx
// store/userStore.js
import { create } from 'zustand'

const useUserStore = create((set) => ({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  isLoggedIn: false,

  setName: (name) => set({ name }),
  setAge: (age) => set({ age }),
  setEmail: (email) => set({ email }),
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  updateProfile: (profile) => set(profile),
  reset: () => set({
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    isLoggedIn: false
  })
}))

export default useUserStore
```

```jsx
// components/UserProfile.jsx
import useUserStore from '../store/userStore'

function UserProfile() {
  // 精确订阅需要的状态
  const name = useUserStore((state) => state.name)
  const age = useUserStore((state) => state.age)
  const email = useUserStore((state) => state.email)
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)

  // 获取更新方法
  const setName = useUserStore((state) => state.setName)
  const setAge = useUserStore((state) => state.setAge)
  const setEmail = useUserStore((state) => state.setEmail)
  const updateProfile = useUserStore((state) => state.updateProfile)
  const reset = useUserStore((state) => state.reset)
  const login = useUserStore((state) => state.login)
  const logout = useUserStore((state) => state.logout)

  return (
    <div className="user-profile">
      <h2>用户信息</h2>

      {isLoggedIn ? (
        <>
          <div className="field">
            <label>姓名：</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>年龄：</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>邮箱：</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>批量更新：</label>
            <button onClick={() => updateProfile({ name: '李四', age: 30 })}>
              更新为李四
            </button>
          </div>

          <div className="actions">
            <button onClick={reset}>重置</button>
            <button onClick={logout}>退出登录</button>
          </div>

          <pre>{JSON.stringify({ name, age, email }, null, 2)}</pre>
        </>
      ) : (
        <div>
          <p>请登录</p>
          <button onClick={login}>登录</button>
        </div>
      )}
    </div>
  )
}

export default UserProfile
```

---

## 6.4 状态更新：set、getState、setState

### 6.4.1 set 函数详解

`set` 是 Zustand 中用于更新状态的函数，它有两种使用方式：

```
+==================================================================================+
|                              set() 函数用法                                      |
+==================================================================================+
|                                                                                  |
|  方式一：直接传入对象                                                            |
|  +------------------------------------------------------------------------+     |
|  set({ key: value })                                                         |
|                                                                            |
|  示例：                                                                     |
|  set({ count: 5 })  // 直接将 count 设置为 5                                 |
|  set({ name: 'Alice', age: 25 })  // 批量更新多个状态                         |
|  +------------------------------------------------------------------------+     |
|                                                                                  |
|  方式二：传入函数（推荐）                                                        |
|  +------------------------------------------------------------------------+     |
|  set((state) => ({ key: newValue }))                                         |
|                                                                            |
|  示例：                                                                     |
|  set((state) => ({ count: state.count + 1 }))  // 基于前一个状态              |
|  set((state) => ({                                                           |
|    users: [...state.users, newUser]                                         |
|  }))  // 数组操作                                                              |
|  +------------------------------------------------------------------------+     |
|                                                                                  |
+==================================================================================+
```

### 6.4.2 getState 函数

`getState` 用于在 store 内部获取当前状态，常用于：
- 在 action 中访问当前状态
- 计算派生数据

```jsx
import { create } from 'zustand'

const useStore = create((set, get) => ({
  count: 0,
  users: [],

  // 使用 get() 获取当前状态
  increment: () => {
    const currentCount = get().count
    console.log('当前计数:', currentCount)
    set({ count: currentCount + 1 })
  },

  // 使用 get() 进行条件更新
  incrementIfEven: () => {
    const { count } = get()
    if (count % 2 === 0) {
      set({ count: count + 1 })
    }
  },

  // 使用 get() 计算派生状态
  getUserCount: () => get().users.length,

  // 使用 get() 在异步操作中
  syncWithServer: async () => {
    const { users } = get()
    await fetch('/api/sync', {
      method: 'POST',
      body: JSON.stringify(users)
    })
  }
}))

export default useStore
```

### 6.4.3 外部访问状态：getState()

有时候你需要在 React 组件外部访问 store 状态，可以使用 `getState()` 方法：

```jsx
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

// ====== 在组件外部访问状态 ======

// 方式一：使用 getState()
const count = useStore.getState().count

// 方式二：订阅整个 store
const unsubscribe = useStore.subscribe((state) => {
  console.log('状态变化:', state.count)
})

// 取消订阅
unsubscribe()

// ====== 在事件处理器中访问 ======

function handleClick() {
  const { count, increment } = useStore.getState()
  console.log('当前计数:', count)
  increment()
}

// ====== 在异步操作中访问 ======

async function fetchData() {
  const { fetchUsers } = useStore.getState()
  await fetchUsers()
}
```

### 6.4.4 状态更新流程图

```
+==================================================================================+
|                          状态更新流程图解                                         |
+==================================================================================+
|                                                                                  |
|   组件调用 action                                                                |
|         |                                                                       |
|         v                                                                       |
|   +-------------+                                                                |
|   |   set()    |  <-- 接收新的状态对象或更新函数                                  |
|   +-------------+                                                                |
|         |                                                                       |
|         v                                                                       |
|   +-------------+                                                                |
|   |  合并状态   |  <-- Object.assign 或 Spread 运算符                           |
|   +-------------+                                                                |
|         |                                                                       |
|         v                                                                       |
|   +-------------+                                                                |
|   |  通知订阅者  |  <-- 触发 useStore 中的 subscribe                            |
|   +-------------+                                                                |
|         |                                                                       |
|         v                                                                       |
|   +-------------+                                                                |
|   |  组件重新   |  <-- React 检测到变化，触发重新渲染                            |
|   |  渲染      |                                                                |
|   +-------------+                                                                |
|                                                                                  |
+==================================================================================+
```

### 6.4.5 完整示例：计数器

```jsx
import { create } from 'zustand'

const useCounterStore = create((set, get) => ({
  count: 0,
  step: 1,

  // 基础增删
  increment: () => set((state) => ({ count: state.count + state.step })),
  decrement: () => set((state) => ({ count: state.count - state.step })),

  // 设置步长
  setStep: (step) => set({ step }),

  // 重置
  reset: () => set({ count: 0, step: 1 }),

  // 条件更新：只有大于0时才增加
  incrementIfPositive: () => {
    const { count, step } = get()
    if (count >= 0) {
      set({ count: count + step })
    }
  },

  // 批量更新
  setCountAndStep: (count, step) => set({ count, step }),

  // 获取当前值
  getCount: () => get().count
}))

export default useCounterStore
```

```jsx
// components/Counter.jsx
import useCounterStore from '../store/counterStore'

function Counter() {
  const count = useCounterStore((state) => state.count)
  const step = useCounterStore((state) => state.step)

  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const setStep = useCounterStore((state) => state.setStep)
  const reset = useCounterStore((state) => state.reset)

  return (
    <div className="counter">
      <h2>计数器</h2>

      <div className="display">
        <p>当前计数: {count}</p>
        <p>步长: {step}</p>
      </div>

      <div className="controls">
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>

      <div className="step-control">
        <label>设置步长: </label>
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
      </div>

      <button onClick={reset}>重置</button>

      <div className="external-access">
        <p>外部访问（通过 getState）:</p>
        <button onClick={() => console.log(useCounterStore.getState().count)}>
          打印当前计数
        </button>
      </div>
    </div>
  )
}

export default Counter
```

---

## 6.5 选择器优化

### 6.5.1 什么是选择器？

选择器（Selector）是 Zustand 实现精确订阅的核心机制，它决定组件订阅 store 的哪一部分。

```jsx
// 选择器函数
const selector = (state) => state.count

// 使用选择器
const count = useStore(selector)
```

### 6.5.2 为什么选择器重要？

```
+==================================================================================+
|                        选择器优化原理图解                                         |
+==================================================================================+
|                                                                                  |
|  Store 状态:                                                                    |
|  +--------------------------------------------------------------------------+   |
|  | { count: 0, name: 'A', age: 25, email: 'x@x.com', ... }                |   |
|  +--------------------------------------------------------------------------+   |
|                                                                                  |
|  场景：不使用选择器，订阅整个 Store                                              |
|  +--------------------------------------------------------------------------+   |
|  | const { count, name } = useStore()                                     |   |
|  |                                                                         |   |
|  | 当 name 变化时，count 组件也会重新渲染！                                 |   |
|  +--------------------------------------------------------------------------+   |
|                                                                                  |
|  场景：使用选择器，精确订阅                                                      |
|  +--------------------------------------------------------------------------+   |
|  | const count = useStore((state) => state.count)                        |   |
|  | const name = useStore((state) => state.name)                          |   |
|  |                                                                         |   |
|  | 当 name 变化时，订阅 count 的组件不会重新渲染！                         |   |
|  +--------------------------------------------------------------------------+   |
|                                                                                  |
+==================================================================================+
```

### 6.5.3 选择器的正确使用方式

```jsx
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  name: 'Alice',
  age: 25,
  users: [],
  loading: false
}))

// ====== 正确方式 ======

// 方式一：内联选择器（推荐）
function ComponentA() {
  const count = useStore((state) => state.count)
  return <div>{count}</div>
}

// 方式二：提取选择器函数（避免每次渲染创建新函数）
const selectCount = (state) => state.count
const selectName = (state) => state.name

function ComponentB() {
  const count = useStore(selectCount)
  const name = useStore(selectName)
  return <div>{count} - {name}</div>
}

// 方式三：使用 shallow 比较（适用于对象/数组）
import { shallow } from 'zustand/shallow'

function ComponentC() {
  const { count, name } = useStore(
    (state) => ({ count: state.count, name: state.name }),
    shallow
  )
  return <div>{count} - {name}</div>
}

// ====== 错误方式 ======

function ComponentD() {
  // 错误：每次渲染都创建新对象
  const { count, name } = useStore((state) => ({
    count: state.count,
    name: state.name
  }))
  // 这会导致无限循环或性能问题！
  return <div>{count} - {name}</div>
}
```

### 6.5.4 使用 shallow 进行浅比较

当选择器返回对象或数组时，必须使用 `shallow` 比较来避免不必要的重新渲染：

```jsx
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

const useStore = create((set) => ({
  user: { name: 'Alice', age: 25 },
  items: ['a', 'b', 'c'],
  preferences: { theme: 'dark', language: 'zh' }
}))

// ====== 不使用 shallow（可能导致问题）======

function BadComponent() {
  // 错误：每次 store 变化都会创建新对象
  const user = useStore((state) => state.user)
  const items = useStore((state) => state.items)

  return <div>{user.name}</div>
}

// ====== 使用 shallow（正确方式）======

function GoodComponent() {
  // 正确：使用 shallow 进行浅比较
  const user = useStore((state) => state.user, shallow)
  const items = useStore((state) => state.items, shallow)

  return <div>{user.name}</div>
}

// ====== 提取选择器并使用 shallow ======

const selectUser = (state) => state.user
const selectItems = (state) => state.items
const selectPreferences = (state) => state.preferences

function BestComponent() {
  const user = useStore(selectUser, shallow)
  const items = useStore(selectItems, shallow)
  const preferences = useStore(selectPreferences, shallow)

  return (
    <div>
      <p>{user.name}</p>
      <p>{items.join(', ')}</p>
      <p>{preferences.theme}</p>
    </div>
  )
}
```

### 6.5.5 派生状态的正确处理

```jsx
import { create } from 'zustand'

const useStore = create((set, get) => ({
  items: [
    { id: 1, name: 'Apple', price: 5, category: 'fruit' },
    { id: 2, name: 'Banana', price: 3, category: 'fruit' },
    { id: 3, name: 'Carrot', price: 2, category: 'vegetable' }
  ],

  // 方法一：在 Store 中定义计算方法
  getTotal: () => {
    const { items } = get()
    return items.reduce((sum, item) => sum + item.price, 0)
  },

  getCount: () => get().items.length,

  // 方法二：过滤方法
  getFruits: () => {
    const { items } = get()
    return items.filter(item => item.category === 'fruit')
  }
}))

// ====== 在组件中计算派生状态 ======

function CartSummary() {
  const items = useStore((state) => state.items)
  const getTotal = useStore((state) => state.getTotal)
  const getCount = useStore((state) => state.getCount)

  // 方式一：调用 Store 中的方法
  const total = getTotal()
  const count = getCount()

  // 方式二：在组件中直接计算（推荐，更清晰）
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div>
      <p>商品数量: {count}</p>
      <p>总价: {totalPrice}</p>
    </div>
  )
}
```

---

## 6.6 中间件系统

### 6.6.1 什么是中间件？

中间件是拦截状态更新的函数，可以在状态变化前后执行额外的逻辑。Zustand 提供了强大的中间件系统。

```
+==================================================================================+
|                           中间件工作流程                                          |
+==================================================================================+
|                                                                                  |
|   组件调用 set()                                                                 |
|         |                                                                       |
|         v                                                                       |
|   +-------------+         +-------------+         +-------------+               |
|   | Middleware1 |  --->   | Middleware2 |  --->   | Middleware3 |  --->        |
|   | (日志)      |         | (持久化)     |         | (DevTools)  |              |
|   +-------------+         +-------------+         +-------------+               |
|         |                                                                       |
|         v                                                                       |
|   +-------------+                                                                |
|   |  更新状态   |                                                                |
|   +-------------+                                                                |
|                                                                                  |
+==================================================================================+
```

### 6.6.2 persist 中间件（数据持久化）

`persist` 中间件可以将状态保存到 localStorage 或其他存储介质，实现数据持久化。

```jsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // 状态
      count: 0,
      name: 'Alice',
      theme: 'light',
      user: null,

      // 方法
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      setName: (name) => set({ name }),
      setTheme: (theme) => set({ theme }),
      login: (user) => set({ user }),
      logout: () => set({ user: null })
    }),
    {
      name: 'my-app-storage', // localStorage 中的键名

      // 可选配置
      // storage: 自定义存储，默认为 localStorage
      // partialize: 只持久化部分状态
      // onRehydrateStorage: 重新水合完成后的回调
    }
  )
)

// ====== 完整配置示例 ======

const useFullStore = create(
  persist(
    (set, get) => ({
      count: 0,
      name: 'Default',
      preferences: { theme: 'light', language: 'zh' }
    }),
    {
      name: 'full-app-storage',

      // 自定义存储（默认使用 localStorage）
      storage: {
        // 获取数据
        getItem: (name) => {
          const value = localStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        // 保存数据
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        // 删除数据
        removeItem: (name) => {
          localStorage.removeItem(name)
        }
      },

      // 只持久化部分状态
      partialize: (state) => ({
        count: state.count,
        theme: state.preferences.theme
      }),

      // 重新水合完成后的回调
      onRehydrateStorage: (state) => {
        console.log('hydration finished')
        return (prev, curr) => {
          console.log('从', prev, '水合到', curr)
        }
      }
    }
  )
)

export default useStore
```

### 6.6.3 devtools 中间件（开发工具）

`devtools` 中间件集成 Chrome/Firefox 开发者工具，可以查看状态变化历史。

```jsx
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// 基础用法
const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }))
    }),
    { name: 'MyStore' } // 在 DevTools 中显示的名称
  )
)

// ====== 进阶用法：自定义名称 ======

const useCounterStore = create(
  devtools(
    (set) => ({
      count: 0,
      step: 1,
      increment: () => set((state) => ({ count: state.count + state.step })),
      decrement: () => set((state) => ({ count: state.count - state.step })),
      setStep: (step) => set({ step })
    }),
    {
      name: 'CounterStore', // store 名称
      enabled: process.env.NODE_ENV !== 'production' // 只在开发环境启用
    }
  )
)

// ====== 禁用特定操作的记录 ======

const useLimitedStore = create(
  devtools(
    (set) => ({
      count: 0,
      // 第三个参数可用于控制是否在 DevTools 中显示
      increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
      // 或者使用更详细的配置
      incrementWithMeta: () => set(
        (state) => ({ count: state.count + 1 }),
        { type: 'increment', timestamp: Date.now() },
        'increment'
      )
    }),
    { name: 'LimitedStore' }
  )
)
```

### 6.6.4 immer 中间件（不可变状态更新）

`immer` 中间件允许以可变的方式更新状态，Zustand 会自动处理不可变性。

```jsx
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useStore = create(
  immer((set) => ({
    // 状态
    users: [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 }
    ],
    preferences: {
      theme: 'light',
      language: 'zh'
    },

    // 使用 immer 可以直接修改状态
    addUser: (user) =>
      set((state) => {
        state.users.push(user)
      }),

    updateUser: (id, updates) =>
      set((state) => {
        const index = state.users.findIndex((u) => u.id === id)
        if (index !== -1) {
          // 直接修改，无需展开运算符
          Object.assign(state.users[index], updates)
        }
      }),

    removeUser: (id) =>
      set((state) => {
        state.users = state.users.filter((u) => u.id !== id)
      }),

    updatePreferences: (key, value) =>
      set((state) => {
        state.preferences[key] = value
      }),

    // 数组操作示例
    reorderUsers: () =>
      set((state) => {
        // 颠倒用户顺序
        state.users.reverse()
      })
  }))
)

// ====== 对比：不使用 immer vs 使用 immer ======

// 不使用 immer（传统方式）
const storeWithoutImmer = create((set) => ({
  users: [],
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user] // 需要展开运算符
    }))
}))

// 使用 immer
const storeWithImmer = create(
  immer((set) => ({
    users: [],
    addUser: (user) =>
      set((state) => {
        state.users.push(user) // 直接 push，更直观
      })
  }))
)
```

### 6.6.5 组合多个中间件

Zustand 支持组合多个中间件，按从内到外的顺序执行：

```jsx
import { create } from 'zustand'
import { devtools, persist, immer } from 'zustand/middleware'

// 组合中间件的顺序很重要！
// 从内到外：immer -> persist -> devtools

const useStore = create(
  devtools(
    persist(
      immer(
        (set, get) => ({
          count: 0,
          users: [],

          increment: () =>
            set((state) => {
              state.count += 1
            }),

          addUser: (user) =>
            set((state) => {
              state.users.push(user)
            }),

          reset: () =>
            set((state) => {
              state.count = 0
              state.users = []
            })
        })
      ),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
)

// ====== 使用 combine 简化中间件组合 ======

import { combine } from 'zustand/middleware'

const useCombinedStore = create(
  devtools(
    persist(
      combine(
        // 初始状态
        { count: 0, name: '' },
        // actions
        (set) => ({
          increment: () => set((state) => ({ count: state.count + 1 })),
          setName: (name) => set({ name })
        })
      ),
      { name: 'combined-storage' }
    ),
    { name: 'CombinedStore' }
  )
)
```

### 6.6.6 自定义中间件

你也可以创建自己的中间件：

```jsx
import { create } from 'zustand'

// ====== 日志中间件 ======
const logger = (config) => (set, get, api) => {
  const originalSet = set

  set = (...args) => {
    console.log('=== 状态即将更新 ===')
    console.log('更新内容:', args[0])
    console.log('当前状态:', get())

    // 执行原始 set
    originalSet(...args)

    console.log('=== 状态已更新 ===')
    console.log('新状态:', get())
  }

  return config(set, get, api)
}

// ====== 定时中间件 ======
const timed = (config) => (set, get, api) => {
  const originalSet = set

  set = (...args) => {
    const start = performance.now()

    // 执行原始 set
    const result = originalSet(...args)

    const end = performance.now()
    console.log(`状态更新耗时: ${(end - start).toFixed(2)}ms`)

    return result
  }

  return config(set, get, api)
}

// ====== 使用自定义中间件 ======

const useLoggedStore = create(
  logger((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 }))
  }))
)

const useTimedStore = create(
  timed((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 }))
  }))
)

// ====== 组合自定义中间件 ======

const useFullLoggedStore = create(
  logger(timed((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 }))
  })))
)
```

---

## 6.7 异步操作

### 7.7.1 异步 Store 基础

Zustand 原生支持异步操作，不需要像 Redux 那样使用 thunk 或 saga。

```jsx
import { create } from 'zustand'

const useUserStore = create((set, get) => ({
  // 状态
  users: [],
  loading: false,
  error: null,

  // 异步方法
  fetchUsers: async () => {
    // 开始加载
    set({ loading: true, error: null })

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const users = await response.json()

      // 成功
      set({ users, loading: false })
    } catch (error) {
      // 失败
      set({ error: error.message, loading: false })
    }
  },

  // 异步添加用户
  addUser: async (user) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      if (!response.ok) {
        throw new Error('Failed to add user')
      }

      const newUser = await response.json()

      // 更新状态
      set((state) => ({
        users: [...state.users, newUser],
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 异步删除用户
  deleteUser: async (id) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      // 更新状态
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 使用 get() 在异步操作中访问状态
  fetchAndProcess: async () => {
    const { users } = get()

    // 先获取用户
    await get().fetchUsers()

    // 基于已有状态处理
    const { users: newUsers } = get()
    console.log('总用户数:', newUsers.length + users.length)
  }
}))

export default useUserStore
```

### 7.7.2 异步流程图

```
+==================================================================================+
|                          异步操作流程图解                                         |
+==================================================================================+
|                                                                                  |
|   组件调用异步方法                                                               |
|         |                                                                       |
|         v                                                                       |
|   +-------------+                                                                |
|   | set()      |  <-- 设置 loading: true                                        |
|   +-------------+                                                                |
|         |                                                                       |
|         v                                                                       |
|   +-------------+                                                                |
|   | await API  |  <-- 等待异步请求完成                                          |
|   +-------------+                                                                |
|         |                                                                       |
|    +----+----+                                                                  |
|    |         |                                                                  |
|    v         v                                                                  |
| 成功        失败                                                                |
|    |         |                                                                  |
|    v         v                                                                  |
| +-------------+  +-------------+                                                |
| | set(data)  |  | set(error)  |                                                |
| | loading:   |  | loading:    |                                                |
| | false      |  | false       |                                                |
| +-------------+  +-------------+                                                |
|         |                                                                       |
|         v                                                                       |
|   +-------------+                                                                |
|   | 触发重新   |  <-- 组件更新                                                  |
|   | 渲染      |                                                                |
|   +-------------+                                                                |
|                                                                                  |
+==================================================================================+
```

### 7.7.3 在组件中使用异步 Store

```jsx
import { useEffect } from 'react'
import useUserStore from '../store/userStore'

function UserList() {
  // 选择器订阅状态
  const users = useUserStore((state) => state.users)
  const loading = useUserStore((state) => state.loading)
  const error = useUserStore((state) => state.error)

  // 选择器订阅方法
  const fetchUsers = useUserStore((state) => state.fetchUsers)
  const addUser = useUserStore((state) => state.addUser)
  const deleteUser = useUserStore((state) => state.deleteUser)

  // 组件加载时获取数据
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // 处理添加用户
  const handleAddUser = async () => {
    await addUser({
      name: '新用户',
      email: 'new@example.com'
    })
  }

  // 处理删除用户
  const handleDeleteUser = async (id) => {
    await deleteUser(id)
  }

  // 渲染界面
  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  return (
    <div>
      <h2>用户列表</h2>

      <button onClick={fetchUsers}>刷新</button>
      <button onClick={handleAddUser}>添加用户</button>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleDeleteUser(user.id)}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserList
```

### 7.7.4 处理Loading状态

```jsx
import { create } from 'zustand'

const useLoadingStore = create((set, get) => ({
  // 状态
  data: null,
  loading: false,
  error: null,

  // 基础异步方法
  fetchData: async (url) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(url)
      const data = await response.json()
      set({ data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 带有请求锁的异步方法（防止重复请求）
  fetchDataWithLock: async (url) => {
    const { loading } = get()
    if (loading) return // 忽略重复请求

    set({ loading: true, error: null })

    try {
      const response = await fetch(url)
      const data = await response.json()
      set({ data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 重置状态
  reset: () => set({ data: null, loading: false, error: null })
}))

// ====== 在组件中使用 ======

function DataComponent() {
  const { data, loading, error, fetchData, reset } = useLoadingStore()

  return (
    <div>
      {loading && <p>加载中...</p>}
      {error && <p className="error">{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      <button onClick={() => fetchData('/api/data')}>获取数据</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

### 7.7.5 并行异步操作

```jsx
import { create } from 'zustand'

const useParallelStore = create((set, get) => ({
  users: [],
  posts: [],
  comments: [],
  loading: false,

  // 串行请求
  fetchSequentially: async () => {
    set({ loading: true })

    const usersRes = await fetch('/api/users')
    const users = await usersRes.json()
    set({ users })

    const postsRes = await fetch('/api/posts')
    const posts = await postsRes.json()
    set({ posts })

    set({ loading: false })
  },

  // 并行请求（推荐）
  fetchParallel: async () => {
    set({ loading: true })

    try {
      const [usersRes, postsRes, commentsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/posts'),
        fetch('/api/comments')
      ])

      const [users, posts, comments] = await Promise.all([
        usersRes.json(),
        postsRes.json(),
        commentsRes.json()
      ])

      set({ users, posts, comments, loading: false })
    } catch (error) {
      set({ loading: false })
      console.error('Failed to fetch:', error)
    }
  },

  // 竞态处理：取消旧请求
  fetchWithRaceCondition: () => {
    let cancel = false

    const fetchData = async () => {
      set({ loading: true })

      const response = await fetch('/api/data')
      const data = await response.json()

      if (!cancel) {
        set({ data, loading: false })
      }
    }

    fetchData()

    // 返回取消函数
    return () => {
      cancel = true
    }
  }
}))
```

---

## 6.8 Store 组合（组合多个Store）

### 6.8.1 为什么需要 Store 组合？

```
+==================================================================================+
|                         Store 组合策略                                            |
+==================================================================================+
|                                                                                  |
|  场景：大型应用有多个独立功能模块                                                  |
|                                                                                  |
|  +-------------+  +-------------+  +-------------+  +-------------+           |
|  |  用户模块   |  |  商品模块   |  |  购物车模块 |  |  订单模块   |           |
|  |  useUser   |  |  useProduct |  |  useCart    |  |  useOrder   |           |
|  +-------------+  +-------------+  +-------------+  +-------------+           |
|                                                                                  |
|  组合方式：                                                                     |
|  1. 独立使用（推荐）：每个模块使用自己的 store                                    |
|  2. 组合使用：在组件中同时订阅多个 store                                          |
|  3. 派生使用：在 store 中引用其他 store                                          |
|                                                                                  |
+==================================================================================+
```

### 6.8.2 独立 Store 模式（推荐）

```jsx
// stores/userStore.js
import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false })
}))

export default useUserStore
```

```jsx
// stores/productStore.js
import { create } from 'zustand'

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true })
    const response = await fetch('/api/products')
    const products = await response.json()
    set({ products, loading: false })
  }
}))

export default useProductStore
```

```jsx
// stores/cartStore.js
import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find(item => item.id === product.id)
      if (existing) {
        return {
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + product.price
        }
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }],
        total: state.total + product.price
      }
    })
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id),
      total: state.items
        .filter(item => item.id !== id)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
    }))
  }
}))

export default useCartStore
```

### 6.8.3 在组件中组合多个 Store

```jsx
// components/UserDashboard.jsx
import useUserStore from '../stores/userStore'
import useProductStore from '../stores/productStore'
import useCartStore from '../stores/cartStore'

function UserDashboard() {
  // 从不同 store 订阅状态
  const user = useUserStore((state) => state.user)
  const products = useProductStore((state) => state.products)
  const cartItems = useCartStore((state) => state.items)
  const cartTotal = useCartStore((state) => state.total)

  return (
    <div>
      <h1>欢迎, {user?.name}</h1>

      <div className="products">
        <h2>商品列表</h2>
        {products.map(product => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>

      <div className="cart">
        <h2>购物车 ({cartItems.length} 件)</h2>
        <p>总价: {cartTotal}</p>
      </div>
    </div>
  )
}

export default UserDashboard
```

### 6.8.4 在 Store 中引用其他 Store

```jsx
// stores/orderStore.js
import { create } from 'zustand'
import useCartStore from './cartStore'

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,

  // 在 store 中访问另一个 store
  createOrder: () => {
    const { items, total } = useCartStore.getState()
    const { user } = useUserStore.getState()

    const order = {
      id: Date.now(),
      userId: user?.id,
      items: [...items],
      total,
      createdAt: new Date().toISOString()
    }

    set((state) => ({
      orders: [...state.orders, order],
      currentOrder: order
    }))

    // 清空购物车
    useCartStore.getState().clearCart()

    return order
  },

  // 也可以在 getter 中访问其他 store
  getOrderCount: () => get().orders.length
}))

export default useOrderStore
```

### 6.8.5 使用 Context 组合 Store

```jsx
import { createContext, useContext } from 'react'

// 创建 Store 上下文
const StoreContext = createContext({})

// Provider 组件
export function StoreProvider({ children, stores }) {
  return (
    <StoreContext.Provider value={stores}>
      {children}
    </StoreContext.Provider>
  )
}

// Hook：使用多个 store
export function useStores() {
  return useContext(StoreContext)
}

// 使用
function MyComponent() {
  const { userStore, cartStore, productStore } = useStores()

  const user = userStore((state) => state.user)
  const cartItems = cartStore((state) => state.items)

  return <div>...</div>
}
```

### 6.8.6 派生 Store

```jsx
import { create } from 'zustand'

// 基础 Store
const useUserStore = create((set) => ({
  users: [
    { id: 1, name: 'Alice', age: 25, role: 'admin' },
    { id: 2, name: 'Bob', age: 30, role: 'user' },
    { id: 3, name: 'Charlie', age: 35, role: 'user' }
  ]
}))

// 派生 Store：管理员列表
const useAdminUsers = () => {
  const users = useUserStore((state) => state.users)
  return users.filter(user => user.role === 'admin')
}

// 派生 Store：用户数量
const useUserCount = () => {
  const users = useUserStore((state) => state.users)
  return users.length
}

// 在组件中使用派生 Store
function UserStats() {
  const adminCount = useAdminUsers().length
  const totalCount = useUserCount()

  return (
    <div>
      <p>总用户数: {totalCount}</p>
      <p>管理员数: {adminCount}</p>
    </div>
  )
}
```

---

## 6.9 TypeScript 集成

### 6.9.1 基础 TypeScript 类型定义

```typescript
import { create } from 'zustand'

// 定义状态类型
interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

// 创建 Store 并指定类型
const useCounterStore = create<CounterState>((set) => ({
  count: 0,

  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}))

// 使用时自动获得类型推断
function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+1</button>
    </div>
  )
}
```

### 6.9.2 完整 TypeScript 示例

```typescript
import { create } from 'zustand'

// ====== 定义数据类型 ======

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface Product {
  id: number
  name: string
  price: number
  category: string
}

interface CartItem extends Product {
  quantity: number
}

// ====== 定义 Store 类型 ======

interface UserState {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null

  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null

  fetchProducts: () => Promise<void>
  getProductById: (id: number) => Product | undefined
}

interface CartState {
  items: CartItem[]
  total: number

  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
}

// ====== 创建 Store ======

// 用户 Store
const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,

  login: async ({ email, password }) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const user = await response.json()
      set({ user, isLoggedIn: true, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  logout: () => set({ user: null, isLoggedIn: false }),

  updateProfile: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null
    }))
  }
}))

// 商品 Store
const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })

    try {
      const response = await fetch('/api/products')
      const products = await response.json()
      set({ products, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  getProductById: (id) => {
    return get().products.find(p => p.id === id)
  }
}))

// 购物车 Store
const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find(item => item.id === product.id)

      let newItems: CartItem[]
      let newTotal: number

      if (existing) {
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        newTotal = state.total + product.price
      } else {
        newItems = [...state.items, { ...product, quantity: 1 }]
        newTotal = state.total + product.price
      }

      return { items: newItems, total: newTotal }
    })
  },

  removeItem: (id) => {
    set((state) => {
      const item = state.items.find(i => i.id === id)
      if (!item) return state

      return {
        items: state.items.filter(i => i.id !== id),
        total: state.total - item.price * item.quantity
      }
    })
  },

  updateQuantity: (id, quantity) => {
    if (quantity < 1) return

    set((state) => {
      const item = state.items.find(i => i.id === id)
      if (!item) return state

      const diff = quantity - item.quantity
      return {
        items: state.items.map(i =>
          i.id === id ? { ...i, quantity } : i
        ),
        total: state.total + diff * item.price
      }
    })
  },

  clearCart: () => set({ items: [], total: 0 }),

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  }
}))

export { useUserStore, useProductStore, useCartStore }
```

### 6.9.3 使用泛型创建可复用的 Store 类型

```typescript
import { create } from 'zustand'

// ====== 泛型 CRUD Store ======

interface BaseEntity {
  id: number
}

interface CrudState<T extends BaseEntity> {
  items: T[]
  loading: boolean
  error: string | null

  fetchAll: () => Promise<void>
  add: (item: Omit<T, 'id'>) => Promise<void>
  update: (id: number, data: Partial<T>) => Promise<void>
  remove: (id: number) => Promise<void>
  getById: (id: number) => T | undefined
}

// 创建用户 Store
interface User extends BaseEntity {
  name: string
  email: string
}

const createUserStore = () => {
  return create<CrudState<User>>((set, get) => ({
    items: [],
    loading: false,
    error: null,

    fetchAll: async () => {
      set({ loading: true })
      const response = await fetch('/api/users')
      const items = await response.json()
      set({ items, loading: false })
    },

    add: async (user) => {
      set({ loading: true })
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(user)
      })
      const newUser = await response.json()
      set((state) => ({
        items: [...state.items, newUser],
        loading: false
      }))
    },

    update: async (id, data) => {
      set({ loading: true })
      await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
      set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, ...data } : item
        ),
        loading: false
      }))
    },

    remove: async (id) => {
      set({ loading: true })
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      set((state) => ({
        items: state.items.filter(item => item.id !== id),
        loading: false
      }))
    },

    getById: (id) => get().items.find(item => item.id === id)
  }))
}

const useUserStore = createUserStore()
```

### 6.9.4 类型安全的中间件

```typescript
import { create } from 'zustand'
import { persist, devtools, immer } from 'zustand/middleware'

// 中间件也有类型支持
interface StoreWithPersist {
  count: number
  increment: () => void
}

const useStore = create<StoreWithPersist>()(
  persist(
    devtools(
      immer((set) => ({
        count: 0,
        increment: () => set((state) => { state.count += 1 })
      }))
    ),
    { name: 'counter-storage' }
  )
)

// ====== 自定义中间件的 TypeScript 支持 ======

const typedLogger = <T>(
  config: (set: (fn: (state: T) => Partial<T>) => void, get: () => T, api: unknown) => T
) => (set: any, get: any, api: any) => {
  const loggedSet = (...args: any[]) => {
    console.log('Before:', get())
    set(...args)
    console.log('After:', get())
  }
  return config(loggedSet, get, api)
}

const useTypedStore = create(
  typedLogger<{ count: number }>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 }))
  }))
)
```

---

## 6.10 最佳实践与总结

### 6.10.1 Zustand 最佳实践

```
+==================================================================================+
|                           Zustand 最佳实践                                        |
+==================================================================================+
|                                                                                  |
|  1. 使用选择器订阅                                                               |
|     +------------------------------------------------------------------------+  |
|     | // 正确：精确订阅需要的部分                                            |  |
|     | const count = useStore((state) => state.count)                       |  |
|     |                                                                        |  |
|     | // 避免：订阅整个 store                                              |  |
|     | const { count } = useStore()  // 会导致不必要的重新渲染              |  |
|     +------------------------------------------------------------------------+  |
|                                                                                  |
|  2. 拆分 Store                                                                 |
|     +------------------------------------------------------------------------+  |
|     | // 推荐：按功能模块拆分                                               |  |
|     | const useUserStore = create(...)                                      |  |
|     | const useProductStore = create(...)                                  |  |
|     | const useCartStore = create(...)                                     |  |
|     +------------------------------------------------------------------------+  |
|                                                                                  |
|  3. 使用 immer 处理复杂状态                                                       |
|     +------------------------------------------------------------------------+  |
|     | // 对于深层嵌套的状态，使用 immer                                     |  |
|     | import { immer } from 'zustand/middleware/immer'                    |  |
|     | const store = create(immer((set) => ({ ... })))                     |  |
|     +------------------------------------------------------------------------+  |
|                                                                                  |
|  4. 使用 persist 持久化重要数据                                                  |
|     +------------------------------------------------------------------------+  |
|     | // 用户偏好、购物车等需要持久化的数据                                  |  |
|     | const useCartStore = create(persist((set) => ({ ... }), { ... }))  |  |
|     +------------------------------------------------------------------------+  |
|                                                                                  |
|  5. 开发环境启用 devtools                                                        |
|     +------------------------------------------------------------------------+  |
|     | const store = create(devtools((set) => ({ ... }), {                 |  |
|     |   name: 'Store',                                                     |  |
|     |   enabled: process.env.NODE_ENV !== 'production'                    |  |
|     | }))                                                                  |  |
|     +------------------------------------------------------------------------+  |
|                                                                                  |
+==================================================================================+
```

### 6.10.2 本章小结

本章我们详细学习了 Zustand 状态管理库的核心知识：

1. **Zustand 简介**：轻量、简单、高性能的状态管理库，相比 Redux 有显著优势
2. **基础 Store 创建**：掌握 `create()` 函数、`set()` 和 `get()` 的使用
3. **在组件中使用 Store**：学会使用选择器进行精确订阅
4. **状态更新**：掌握 `set()`、`getState()` 和状态更新的各种模式
5. **选择器优化**：理解选择器的重要性，学会使用 `shallow` 进行浅比较
6. **中间件系统**：
   - `persist`：数据持久化
   - `devtools`：开发工具集成
   - `immer`：不可变状态更新
   - 自定义中间件
7. **异步操作**：Zustand 原生支持异步，无需额外库
8. **Store 组合**：多个独立 Store 的组合使用
9. **TypeScript 集成**：完整的类型支持

---

## 练习题

1. 创建一个用户管理的 Store，包含用户列表的增删改查功能
2. 使用 persist 中间件实现用户偏好的持久化
3. 创建一个待办事项应用，使用 Zustand 管理状态
4. 使用 immer 中间件实现一个复杂的表单状态管理
5. 结合 React 19 新特性，创建完整的 CRUD 应用

---

## 下章预告

下一章我们将学习 Ant Design 组件库：
- Ant Design 简介与安装
- 布局组件
- 基础组件
- 表单组件
- 数据展示组件
- 反馈组件
- 导航组件

---

## 参考资源

- [Zustand 官方文档](https://docs.pmnd.rs/zustand/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand 中间件](https://docs.pmnd.rs/zustand/integrations/middleware)
