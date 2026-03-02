/**
 * 示例09: Store组合
 *
 * 本示例演示如何组合多个独立的Store
 * 展示独立Store模式和Store间通信
 */

import { create } from 'zustand'

// ====== 用户Store ======
const useUserStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,

  // 登录
  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const user = {
        id: 1,
        name: credentials.name || '张三',
        email: credentials.email || 'zhangsan@example.com',
        role: 'admin'
      }
      set({ user, isLoggedIn: true, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 登出
  logout: () => set({ user: null, isLoggedIn: false }),

  // 更新用户信息
  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    })),

  // 清除错误
  clearError: () => set({ error: null })
}))

// ====== 商品Store ======
const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  categories: ['电子产品', '服装', '食品', '图书'],

  // 获取商品列表
  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      // 模拟API
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockProducts = [
        { id: 1, name: 'iPhone 15', price: 6999, category: '电子产品', stock: 100 },
        { id: 2, name: 'MacBook Pro', price: 14999, category: '电子产品', stock: 50 },
        { id: 3, name: '运动鞋', price: 599, category: '服装', stock: 200 },
        { id: 4, name: '零食大礼包', price: 99, category: '食品', stock: 500 },
        { id: 5, name: '编程书籍', price: 89, category: '图书', stock: 150 }
      ]
      set({ products: mockProducts, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // 获取分类商品
  getProductsByCategory: (category) => (state) =>
    state.products.filter((p) => p.category === category),

  // 减少库存
  reduceStock: (id, quantity) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock - quantity) } : p
      )
    }))
}))

// ====== 购物车Store ======
const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  // 添加商品到购物车
  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id)
      let newItems
      let newTotal

      if (existing) {
        newItems = state.items.map((item) =>
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

    // 同时减少商品库存
    useProductStore.getState().reduceStock(product.id, 1)
  },

  // 移除商品
  removeItem: (id) => {
    const { items } = get()
    const item = items.find((i) => i.id === id)
    if (!item) return

    // 恢复库存
    useProductStore.getState().reduceStock(id, -item.quantity)

    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      total: state.total - item.price * item.quantity
    }))
  },

  // 更新数量
  updateQuantity: (id, quantity) => {
    if (quantity < 1) return

    set((state) => {
      const item = state.items.find((i) => i.id === id)
      if (!item) return state

      const diff = quantity - item.quantity
      return {
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        ),
        total: state.total + diff * item.price
      }
    })
  },

  // 清空购物车
  clearCart: () => set({ items: [], total: 0 }),

  // 获取商品数量
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
}))

// ====== 订单Store ======
const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,

  // 创建订单
  createOrder: () => {
    const { user } = useUserStore.getState()
    const { items, total } = useCartStore.getState()

    if (!user) {
      console.warn('请先登录')
      return
    }

    if (items.length === 0) {
      console.warn('购物车为空')
      return
    }

    const order = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      items: [...items],
      total,
      status: 'pending',
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

  // 更新订单状态
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      )
    })),

  // 清除当前订单
  clearCurrentOrder: () => set({ currentOrder: null })
}))

// ====== 派生Store：通知Store ======
const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (message, type = 'info') =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now(), message, type, timestamp: new Date().toISOString() }
      ]
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),
  clearNotifications: () => set({ notifications: [] })
}))

// ====== 示例组件 ======
function StoreCombinationDemo() {
  // 订阅多个Store
  const user = useUserStore((state) => state.user)
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)
  const login = useUserStore((state) => state.login)
  const logout = useUserStore((state) => state.logout)

  const products = useProductStore((state) => state.products)
  const loading = useProductStore((state) => state.loading)
  const fetchProducts = useProductStore((state) => state.fetchProducts)

  const cartItems = useCartStore((state) => state.items)
  const cartTotal = useCartStore((state) => state.total)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const itemCount = useCartStore((state) => state.getItemCount())

  const orders = useOrderStore((state) => state.orders)
  const createOrder = useOrderStore((state) => state.createOrder)

  // 组件加载时获取商品
  React.useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleLogin = () => {
    login({ name: '张三', email: 'zhangsan@example.com' })
  }

  const handleCreateOrder = () => {
    if (!isLoggedIn) {
      alert('请先登录')
      return
    }
    if (cartItems.length === 0) {
      alert('购物车为空')
      return
    }
    createOrder()
    alert('订单创建成功！')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Store组合示例</h2>

      {/* 用户状态 */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>用户状态</h3>
        {isLoggedIn ? (
          <div>
            <p>欢迎, {user?.name} ({user?.role})</p>
            <button onClick={logout}>退出登录</button>
          </div>
        ) : (
          <div>
            <p>未登录</p>
            <button onClick={handleLogin}>登录</button>
          </div>
        )}
      </div>

      {/* 商品列表 */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>商品列表 {loading && '(加载中...)'}</h3>
        <button onClick={fetchProducts}>刷新商品</button>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ¥{product.price} - 库存: {product.stock}
              <button onClick={() => addItem(product)} disabled={product.stock <= 0}>
                加入购物车
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 购物车 */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>购物车 ({itemCount} 件商品)</h3>
        <p>总计: ¥{cartTotal}</p>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ¥{item.price * item.quantity}
              <button onClick={() => removeItem(item.id)}>移除</button>
            </li>
          ))}
        </ul>
        <button onClick={handleCreateOrder}>创建订单</button>
      </div>

      {/* 订单历史 */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>订单历史</h3>
        {orders.length === 0 ? (
          <p>暂无订单</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                订单 #{order.id} - ¥{order.total} - 状态: {order.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// 导入React
import React from 'react'

export {
  useUserStore,
  useProductStore,
  useCartStore,
  useOrderStore,
  useNotificationStore,
  StoreCombinationDemo
}
