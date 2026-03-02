// 待办事项 Store - 第8章 实战项目
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTodoStore = create(
  persist(
    (set, get) => ({
      // 状态
      todos: [],
      filter: 'all', // all, active, completed
      category: 'all',

      // 添加待办
      addTodo: (text, category = '默认') => {
        const newTodo = {
          id: Date.now().toString(),
          text,
          category,
          completed: false,
          createdAt: new Date().toISOString()
        }
        set((state) => ({
          todos: [newTodo, ...state.todos]
        }))
      },

      // 删除待办
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id)
        }))
      },

      // 切换完成状态
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        }))
      },

      // 编辑待办
      editTodo: (id, text) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
          )
        }))
      },

      // 清除已完成
      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed)
        }))
      },

      // 设置筛选
      setFilter: (filter) => {
        set({ filter })
      },

      // 设置分类
      setCategory: (category) => {
        set({ category })
      },

      // 获取筛选后的待办
      getFilteredTodos: () => {
        const { todos, filter, category } = get()

        return todos.filter((todo) => {
          // 分类筛选
          if (category !== 'all' && todo.category !== category) {
            return false
          }

          // 状态筛选
          if (filter === 'active' && todo.completed) {
            return false
          }
          if (filter === 'completed' && !todo.completed) {
            return false
          }

          return true
        })
      },

      // 获取统计
      getStats: () => {
        const { todos } = get()
        const total = todos.length
        const completed = todos.filter((t) => t.completed).length
        const active = total - completed

        return { total, completed, active }
      }
    }),
    {
      name: 'todo-storage'
    }
  )
)

export default useTodoStore
