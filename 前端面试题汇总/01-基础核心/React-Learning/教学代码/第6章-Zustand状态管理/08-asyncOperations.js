/**
 * 示例08: 异步操作
 *
 * 本示例演示Zustand中如何处理异步操作
 * 展示数据获取、添加、删除等CRUD操作
 */

import { create } from 'zustand'

// ====== 异步用户Store ======
const useAsyncUserStore = create((set, get) => ({
  // 状态
  users: [],
  loading: false,
  error: null,
  currentUser: null,

  // 获取用户列表
  fetchUsers: async () => {
    set({ loading: true, error: null })

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const users = await response.json()
      // 只取前10个用户
      set({ users: users.slice(0, 10), loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 获取单个用户
  fetchUserById: async (id) => {
    set({ loading: true, error: null, currentUser: null })

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      if (!response.ok) {
        throw new Error('User not found')
      }
      const user = await response.json()
      set({ currentUser: user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 添加用户（模拟）
  addUser: async (user) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })

      if (!response.ok) {
        throw new Error('Failed to add user')
      }

      const newUser = await response.json()

      // 由于是模拟API，我们将新用户添加到列表
      set((state) => ({
        users: [...state.users, { ...newUser, id: Date.now() }],
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 更新用户（模拟）
  updateUser: async (id, updates) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      const updatedUser = await response.json()

      set((state) => ({
        users: state.users.map((u) =>
          u.id === id ? { ...u, ...updatedUser } : u
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 删除用户
  deleteUser: async (id) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 搜索用户（本地过滤）
  searchUsers: (query) => {
    const { users } = get()
    if (!query) return users

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    )
  },

  // 清除当前用户
  clearCurrentUser: () => set({ currentUser: null }),

  // 重置状态
  reset: () => set({ users: [], loading: false, error: null, currentUser: null })
}))

// ====== 带请求锁的Store（防止重复请求）======
const useLockedStore = create((set, get) => ({
  data: null,
  loading: false,
  error: null,

  // 基础请求（可能重复）
  fetchDataBasic: async (url) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(url)
      const data = await response.json()
      set({ data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 带请求锁（防止重复请求）
  fetchDataWithLock: async (url) => {
    const { loading } = get()
    if (loading) {
      console.log('请求进行中，跳过')
      return
    }

    set({ loading: true, error: null })

    try {
      const response = await fetch(url)
      const data = await response.json()
      set({ data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))

// ====== 示例组件 ======
function AsyncDemo() {
  const { users, loading, error, currentUser, fetchUsers, fetchUserById, addUser, updateUser, deleteUser, clearCurrentUser, reset } =
    useAsyncUserStore()

  const [newUser, setNewUser] = React.useState({ name: '', email: '' })
  const [searchQuery, setSearchQuery] = React.useState('')

  // 搜索过滤
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users

  return (
    <div style={{ padding: '20px' }}>
      <h2>异步操作示例</h2>

      {/* 加载状态和错误 */}
      {loading && <p style={{ color: 'blue' }}>加载中...</p>}
      {error && <p style={{ color: 'red' }}>错误: {error}</p>}

      {/* 操作按钮 */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => fetchUsers()}>获取用户列表</button>
        <button onClick={reset}>重置</button>
      </div>

      {/* 搜索 */}
      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="搜索用户..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 添加用户 */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h4>添加用户</h4>
        <input
          placeholder="姓名"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          placeholder="邮箱"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button
          onClick={() => {
            if (newUser.name && newUser.email) {
              addUser(newUser)
              setNewUser({ name: '', email: '' })
            }
          }}
        >
          添加
        </button>
      </div>

      {/* 用户列表 */}
      <div style={{ marginBottom: '20px' }}>
        <h4>用户列表 ({filteredUsers.length})</h4>
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id} style={{ marginBottom: '10px' }}>
              <strong>{user.name}</strong> - {user.email}
              <button onClick={() => fetchUserById(user.id)}>查看</button>
              <button onClick={() => updateUser(user.id, { name: user.name + '(已更新)' })}>
                更新
              </button>
              <button onClick={() => deleteUser(user.id)}>删除</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 当前用户详情 */}
      {currentUser && (
        <div style={{ padding: '10px', border: '1px solid green' }}>
          <h4>当前用户</h4>
          <p>姓名: {currentUser.name}</p>
          <p>邮箱: {currentUser.email}</p>
          <p>电话: {currentUser.phone}</p>
          <p>城市: {currentUser.address?.city}</p>
          <button onClick={clearCurrentUser}>关闭</button>
        </div>
      )}
    </div>
  )
}

// 导入React
import React from 'react'

export { useAsyncUserStore, useLockedStore, AsyncDemo }
