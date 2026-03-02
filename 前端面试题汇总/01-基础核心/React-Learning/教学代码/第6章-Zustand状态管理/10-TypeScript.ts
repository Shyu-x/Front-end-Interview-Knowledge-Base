/**
 * 示例10: TypeScript集成
 *
 * 本示例演示Zustand在TypeScript中的完整用法
 * 包括类型定义、泛型Store、中间件类型等
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// ====== 1. 基础类型定义 ======

// 定义状态类型接口
interface CounterState {
  count: number
  step: number
  increment: () => void
  decrement: () => void
  setStep: (step: number) => void
  reset: () => void
}

// 创建带类型的Store
const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  step: 1,

  increment: () => set((state) => ({ count: state.count + state.step })),
  decrement: () => set((state) => ({ count: state.count - state.step })),
  setStep: (step) => set({ step }),
  reset: () => set({ count: 0, step: 1 })
}))

// ====== 2. 完整业务类型定义 ======

// 数据模型
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
  stock: number
}

interface CartItem extends Product {
  quantity: number
}

// Store状态接口
interface UserState {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null

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

// ====== 3. 创建完整Store ======

// 用户Store
const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,

  login: async ({ email, password }) => {
    set({ loading: true, error: null })
    try {
      // 模拟API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const user: User = {
        id: 1,
        name: '张三',
        email,
        role: 'admin'
      }
      set({ user, isLoggedIn: true, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  logout: () => set({ user: null, isLoggedIn: false }),

  updateProfile: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null
    }))
}))

// 商品Store
const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockProducts: Product[] = [
        { id: 1, name: 'iPhone 15', price: 6999, category: '电子产品', stock: 100 },
        { id: 2, name: 'MacBook Pro', price: 14999, category: '电子产品', stock: 50 },
        { id: 3, name: '运动鞋', price: 599, category: '服装', stock: 200 }
      ]
      set({ products: mockProducts, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  getProductById: (id) => get().products.find((p) => p.id === id)
}))

// 购物车Store（使用中间件）
const useCartStore = create<CartState>()(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        total: 0,

        addItem: (product) =>
          set((state) => {
            const existing = state.items.find((item) => item.id === product.id)
            if (existing) {
              existing.quantity += 1
            } else {
              state.items.push({ ...product, quantity: 1 })
            }
            state.total += product.price
          }),

        removeItem: (id) =>
          set((state) => {
            const index = state.items.findIndex((item) => item.id === id)
            if (index !== -1) {
              state.total -= state.items[index].price * state.items[index].quantity
              state.items.splice(index, 1)
            }
          }),

        updateQuantity: (id, quantity) => {
          if (quantity < 1) return

          set((state) => {
            const item = state.items.find((i) => i.id === id)
            if (item) {
              const diff = quantity - item.quantity
              item.quantity = quantity
              state.total += diff * item.price
            }
          })
        },

        clearCart: () => set({ items: [], total: 0 }),

        getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
      })),
      { name: 'cart-storage' }
    ),
    { name: 'CartStore' }
  )
)

// ====== 4. 泛型CRUD Store ======

interface BaseEntity {
  id: number
}

interface CrudState<T extends BaseEntity> {
  items: T[]
  loading: boolean
  error: string | null
  selectedId: number | null

  fetchAll: () => Promise<void>
  add: (item: Omit<T, 'id'>) => void
  update: (id: number, data: Partial<T>) => void
  remove: (id: number) => void
  select: (id: number | null) => void
  getById: (id: number) => T | undefined
}

// 创建泛型CRUD Store工厂函数
const createCrudStore = <T extends BaseEntity>() => {
  return create<CrudState<T>>((set, get) => ({
    items: [],
    loading: false,
    error: null,
    selectedId: null,

    fetchAll: async () => {
      set({ loading: true, error: null })
      // 模拟API
      await new Promise((resolve) => setTimeout(resolve, 500))
      set({ loading: false })
    },

    add: (item) =>
      set((state) => ({
        items: [...state.items, { ...item, id: Date.now() } as T]
      })),

    update: (id, data) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...data } : item
        )
      })),

    remove: (id) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),

    select: (id) => set({ selectedId: id }),

    getById: (id) => get().items.find((item) => item.id === id)
  }))
}

// 使用泛型Store
interface Note extends BaseEntity {
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
}

const useNoteStore = createCrudStore<Note>()

// ====== 5. 示例组件 ======

function TypeScriptDemo() {
  // 使用类型安全的Store
  const count = useCounterStore((state) => state.count)
  const step = useCounterStore((state) => state.step)
  const { increment, decrement, setStep, reset } = useCounterStore()

  const { user, isLoggedIn, login, logout } = useUserStore()
  const { products, loading, fetchProducts } = useProductStore()
  const { items: cartItems, total: cartTotal, addItem, removeItem, clearCart, getItemCount } =
    useCartStore()
  const { items: notes, add: addNote, remove: removeNote, selectedId, select } = useNoteStore()

  // 组件加载时获取商品
  React.useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const [newNote, setNewNote] = React.useState({ title: '', content: '', priority: 'medium' as const })

  return (
    <div style={{ padding: '20px' }}>
      <h2>TypeScript集成示例</h2>

      {/* 计数器 */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>计数器</h3>
        <p>计数: {count}</p>
        <p>步长: {step}</p>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
        />
        <button onClick={reset}>重置</button>
      </div>

      {/* 用户 */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>用户</h3>
        {isLoggedIn ? (
          <div>
            <p>欢迎, {user?.name} ({user?.role})</p>
            <button onClick={logout}>退出</button>
          </div>
        ) : (
          <button onClick={() => login({ email: 'test@example.com', password: '123' })}>
            登录
          </button>
        )}
      </div>

      {/* 商品 */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>商品 {loading && '(加载中...)'}</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ¥{product.price}
              <button onClick={() => addItem(product)}>加入购物车</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 购物车 */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>购物车 ({getItemCount()} 件)</h3>
        <p>总计: ¥{cartTotal}</p>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ¥{item.price * item.quantity}
              <button onClick={() => removeItem(item.id)}>删除</button>
            </li>
          ))}
        </ul>
        <button onClick={clearCart}>清空</button>
      </div>

      {/* 笔记（泛型Store） */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>笔记</h3>
        <input
          placeholder="标题"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <input
          placeholder="内容"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <select
          value={newNote.priority}
          onChange={(e) => setNewNote({ ...newNote, priority: e.target.value as any })}
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
        <button
          onClick={() => {
            if (newNote.title && newNote.content) {
              addNote(newNote)
              setNewNote({ title: '', content: '', priority: 'medium' })
            }
          }}
        >
          添加
        </button>
        <ul>
          {notes.map((note) => (
            <li
              key={note.id}
              onClick={() => select(note.id)}
              style={{ cursor: 'pointer', background: selectedId === note.id ? '#eee' : 'transparent' }}
            >
              {note.title} - {note.priority}
              <button onClick={() => removeNote(note.id)}>删除</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// 导入React
import React from 'react'

export {
  useCounterStore,
  useUserStore,
  useProductStore,
  useCartStore,
  useNoteStore,
  TypeScriptDemo
}

// 导出类型供外部使用
export type { User, Product, CartItem, CounterState, UserState, ProductState, CartState }
