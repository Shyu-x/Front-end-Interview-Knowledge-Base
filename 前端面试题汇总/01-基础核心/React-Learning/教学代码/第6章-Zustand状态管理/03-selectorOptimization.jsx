/**
 * 示例03: 选择器优化
 *
 * 本示例演示Zustand中选择器的重要性
 * 展示如何正确使用选择器避免不必要的重新渲染
 */

import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

// ====== 创建Store ======
const useStore = create((set) => ({
  count: 0,
  name: 'Alice',
  age: 25,
  users: [],
  user: { name: 'Bob', age: 30, address: { city: 'Beijing' } },
  preferences: { theme: 'dark', language: 'zh' },
  loading: false
}))

// ====== 选择器函数 ======
// 提取选择器函数可以避免每次渲染创建新函数
const selectCount = (state) => state.count
const selectName = (state) => state.name
const selectAge = (state) => state.age
const selectUsers = (state) => state.users
const selectUser = (state) => state.user
const selectPreferences = (state) => state.preferences
const selectLoading = (state) => state.loading

// ====== 组件A: 使用内联选择器（推荐）======
function ComponentA() {
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)

  console.log('ComponentA 渲染')

  return (
    <div style={{ padding: '10px', border: '1px solid blue', margin: '5px' }}>
      <h3>组件A - 内联选择器</h3>
      <p>计数: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  )
}

// ====== 组件B: 使用提取的选择器 ======
function ComponentB() {
  const count = useStore(selectCount)
  const name = useStore(selectName)
  const age = useStore(selectAge)

  console.log('ComponentB 渲染')

  return (
    <div style={{ padding: '10px', border: '1px solid green', margin: '5px' }}>
      <h3>组件B - 提取的选择器</h3>
      <p>计数: {count}</p>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
    </div>
  )
}

// ====== 组件C: 使用shallow比较（对象/数组）======
function ComponentC() {
  // 订阅多个状态时使用 shallow 比较
  const { user, preferences } = useStore(
    (state) => ({
      user: state.user,
      preferences: state.preferences
    }),
    shallow
  )

  console.log('ComponentC 渲染')

  return (
    <div style={{ padding: '10px', border: '1px solid orange', margin: '5px' }}>
      <h3>组件C - shallow比较</h3>
      <p>用户: {user.name}, {user.age}</p>
      <p>主题: {preferences.theme}</p>
      <p>语言: {preferences.language}</p>
    </div>
  )
}

// ====== 组件D: 订阅方法 ======
function ComponentD() {
  const increment = useStore((state) => state.increment)
  const decrement = useStore((state) => state.decrement)
  const reset = useStore((state) => state.reset)

  console.log('ComponentD 渲染')

  return (
    <div style={{ padding: '10px', border: '1px solid purple', margin: '5px' }}>
      <h3>组件D - 订阅方法</h3>
      <button onClick={increment}>增加</button>
      <button onClick={decrement}>减少</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}

// ====== 组件E: 派生状态 ======
function ComponentE() {
  // 直接在组件中计算派生状态
  const users = useStore(selectUsers)
  const loading = useStore(selectLoading)

  const userCount = users.length
  const status = loading ? '加载中' : '完成'

  console.log('ComponentE 渲染')

  return (
    <div style={{ padding: '10px', border: '1px solid red', margin: '5px' }}>
      <h3>组件E - 派生状态</h3>
      <p>用户数量: {userCount}</p>
      <p>状态: {status}</p>
    </div>
  )
}

// ====== Store提供的方法 ======
function useStoreActions() {
  return useStore((state) => ({
    increment: state.increment,
    decrement: state.decrement,
    reset: state.reset,
    setName: state.setName,
    setAge: state.setAge,
    updateUser: state.updateUser,
    updatePreferences: state.updatePreferences,
    setUsers: state.setUsers,
    setLoading: state.setLoading
  }))
}

// ====== 导出完整Store和组件 ======
export {
  useStore,
  useStoreActions,
  ComponentA,
  ComponentB,
  ComponentC,
  ComponentD,
  ComponentE
}
