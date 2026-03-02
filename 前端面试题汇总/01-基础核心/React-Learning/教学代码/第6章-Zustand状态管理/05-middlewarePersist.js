/**
 * 示例05: 持久化中间件
 *
 * 本示例演示如何使用persist中间件将状态持久化到localStorage
 * 包括基础用法和完整配置
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ====== 基础用法 ======
const useBasicStore = create(
  persist(
    (set) => ({
      count: 0,
      name: 'Alice',
      theme: 'light',

      increment: () => set((state) => ({ count: state.count + 1 })),
      setName: (name) => set({ name }),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'basic-storage' // localStorage中的键名
    }
  )
)

// ====== 完整配置用法 ======
const useFullStore = create(
  persist(
    (set, get) => ({
      // 状态
      count: 0,
      name: 'Default',
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        notifications: true
      },
      user: null,

      // 方法
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      setName: (name) => set({ name }),

      setPreferences: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value }
        })),

      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      reset: () =>
        set({
          count: 0,
          name: 'Default',
          preferences: { theme: 'light', language: 'zh-CN', notifications: true },
          user: null
        })
    }),
    {
      // localStorage键名
      name: 'full-app-storage',

      // 自定义存储（可选，默认使用localStorage）
      // 可以使用sessionStorage或其他存储
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        }
      },

      // 只持久化部分状态（可选）
      // 返回需要持久化的状态部分
      partialize: (state) => ({
        count: state.count,
        theme: state.preferences.theme,
        language: state.preferences.language
      }),

      // 重新水合完成后的回调
      onRehydrateStorage: (state) => {
        console.log('hydration开始')
        return (prev, curr) => {
          console.log('hydration完成:', prev, '->', curr)
        }
      }
    }
  )
)

// ====== 使用sessionStorage的示例 ======
const useSessionStore = create(
  persist(
    (set) => ({
      tempData: null,
      setTempData: (data) => set({ tempData: data }),
      clearTempData: () => set({ tempData: null })
    }),
    {
      name: 'session-storage',
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name)
        }
      }
    }
  )
)

// ====== 示例组件 ======
function PersistDemo() {
  const count = useBasicStore((state) => state.count)
  const name = useBasicStore((state) => state.name)
  const theme = useBasicStore((state) => state.theme)
  const increment = useBasicStore((state) => state.increment)
  const setName = useBasicStore((state) => state.setName)
  const setTheme = useBasicStore((state) => state.setTheme)

  const fullCount = useFullStore((state) => state.count)
  const fullName = useFullStore((state) => state.name)
  const preferences = useFullStore((state) => state.preferences)
  const user = useFullStore((state) => state.user)
  const { increment: fullIncrement, setPreferences, login, logout, reset } =
    useFullStore()

  return (
    <div style={{ padding: '20px' }}>
      <h2>持久化中间件示例</h2>

      {/* 基础用法 */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>基础用法</h3>
        <p>计数: {count}</p>
        <p>名称: {name}</p>
        <p>主题: {theme}</p>
        <button onClick={increment}>+1</button>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
        <p style={{ fontSize: '12px', color: '#666' }}>
          刷新页面后，count、name、theme会从localStorage恢复
        </p>
      </div>

      {/* 完整配置 */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>完整配置（部分持久化）</h3>
        <p>计数: {fullCount}</p>
        <p>名称: {fullName}</p>
        <p>主题: {preferences.theme}</p>
        <p>语言: {preferences.language}</p>
        <p>通知: {preferences.notifications ? '开启' : '关闭'}</p>
        <p>用户: {user ? user.name : '未登录'}</p>

        <button onClick={fullIncrement}>+1</button>
        <button onClick={() => setPreferences('theme', 'dark')}>深色主题</button>
        <button onClick={() => setPreferences('theme', 'light')}>浅色主题</button>
        <button onClick={() => login({ name: '张三', id: 1 })}>登录</button>
        <button onClick={logout}>退出</button>
        <button onClick={reset}>重置</button>

        <p style={{ fontSize: '12px', color: '#666' }}>
          注意：只持久化了count、theme、language，user和name不会持久化
        </p>
      </div>
    </div>
  )
}

// ====== 导出 ======
export { useBasicStore, useFullStore, useSessionStore, PersistDemo }
