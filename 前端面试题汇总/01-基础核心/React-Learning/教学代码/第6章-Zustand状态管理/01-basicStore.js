// Zustand Store 示例 - 第6章
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 创建带持久化的 Store
const useStore = create(
  persist(
    (set, get) => ({
      // 状态
      count: 0,
      name: 'Alice',
      users: [],

      // 方法
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),

      setName: (name) => set({ name }),

      // 异步方法
      fetchUsers: async () => {
        set({ users: [] })
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/users')
          const data = await response.json()
          set({ users: data.slice(0, 10) })
        } catch (error) {
          console.error('获取失败:', error)
        }
      },

      // 计算属性
      getCount: () => get().count,
      getUserCount: () => get().users.length
    }),
    {
      name: 'my-app-storage', // localStorage 键名
      partialize: (state) => ({ count: state.count }) // 只持久化部分状态
    }
  )
)

export default useStore
