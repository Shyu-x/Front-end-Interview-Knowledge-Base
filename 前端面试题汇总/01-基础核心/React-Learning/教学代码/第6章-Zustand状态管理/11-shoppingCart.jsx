/**
 * 示例11: 购物车综合示例
 *
 * 本示例是一个完整的购物车应用
 * 展示Zustand在实际项目中的综合运用
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import React from 'react'

// ====== 数据模型 ======
interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  description: string
}

interface CartItem extends Product {
  quantity: number
}

interface Order {
  id: number
  items: CartItem[]
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  createdAt: string
}

// ====== 商品数据 ======
const mockProducts: Product[] = [
  { id: 1, name: 'iPhone 15 Pro', price: 7999, category: '手机', image: '📱', description: '最新款iPhone' },
  { id: 2, name: 'MacBook Pro 14"', price: 14999, category: '电脑', image: '💻', description: '专业级笔记本' },
  { id: 3, name: 'iPad Pro 12.9"', price: 9999, category: '平板', image: '📱', description: '大屏平板' },
  { id: 4, name: 'AirPods Pro 2', price: 1899, category: '耳机', image: '🎧', description: '主动降噪耳机' },
  { id: 5, name: 'Apple Watch S9', price: 2999, category: '手表', image: '⌚', description: '智能手表' },
  { id: 6, name: 'iMac 24"', price: 12999, category: '电脑', image: '🖥️', description: '一体机' }
]

// ====== 用户Store ======
interface UserState {
  user: { id: number; name: string; email: string } | null
  isLoggedIn: boolean
  login: (name: string, email: string) => void
  logout: () => void
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoggedIn: false,
        login: (name, email) => set({ user: { id: 1, name, email }, isLoggedIn: true }),
        logout: () => set({ user: null, isLoggedIn: false })
      }),
      { name: 'user-storage' }
    ),
    { name: 'UserStore' }
  )
)

// ====== 商品Store ======
interface ProductState {
  products: Product[]
  loading: boolean
  selectedCategory: string | null
  fetchProducts: () => Promise<void>
  setCategory: (category: string | null) => void
  getFilteredProducts: () => Product[]
}

const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: mockProducts,
      loading: false,
      selectedCategory: null,

      fetchProducts: async () => {
        set({ loading: true })
        // 模拟API延迟
        await new Promise((resolve) => setTimeout(resolve, 500))
        set({ products: mockProducts, loading: false })
      },

      setCategory: (category) => set({ selectedCategory: category }),

      getFilteredProducts: () => {
        const { products, selectedCategory } = get()
        if (!selectedCategory) return products
        return products.filter((p) => p.category === selectedCategory)
      }
    }),
    { name: 'ProductStore' }
  )
)

// ====== 购物车Store ======
interface CartState {
  items: CartItem[]
  total: number
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
}

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

// ====== 订单Store ======
interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  createOrder: () => void
  updateOrderStatus: (id: number, status: Order['status']) => void
}

const useOrderStore = create<OrderState>()(
  devtools(
    (set) => ({
      orders: [],
      currentOrder: null,

      createOrder: () => {
        const { items, total } = useCartStore.getState()
        if (items.length === 0) return

        const order: Order = {
          id: Date.now(),
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
      },

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o))
        }))
    }),
    { name: 'OrderStore' }
  )
)

// ====== UI Store ======
interface UIState {
  activeTab: 'products' | 'cart' | 'orders' | 'profile'
  setActiveTab: (tab: UIState['activeTab']) => void
}

const useUIStore = create<UIState>((set) => ({
  activeTab: 'products',
  setActiveTab: (tab) => set({ activeTab: tab })
}))

// ====== 组件: 商品列表 ======
function ProductList() {
  const products = useProductStore((state) => state.products)
  const selectedCategory = useProductStore((state) => state.selectedCategory)
  const setCategory = useProductStore((state) => state.setCategory)
  const addItem = useCartStore((state) => state.addItem)

  const categories = [...new Set(products.map((p) => p.category))]

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>商品列表</h2>

      {/* 分类筛选 */}
      <div style={styles.categoryFilter}>
        <button
          style={{ ...styles.categoryBtn, background: !selectedCategory ? '#007bff' : '#f0f0f0' }}
          onClick={() => setCategory(null)}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            style={{ ...styles.categoryBtn, background: selectedCategory === cat ? '#007bff' : '#f0f0f0', color: selectedCategory === cat ? '#fff' : '#333' }}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 商品网格 */}
      <div style={styles.productGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={styles.productCard}>
            <div style={styles.productImage}>{product.image}</div>
            <h3>{product.name}</h3>
            <p style={styles.description}>{product.description}</p>
            <p style={styles.category}>{product.category}</p>
            <p style={styles.price}>¥{product.price.toLocaleString()}</p>
            <button style={styles.addBtn} onClick={() => addItem(product)}>
              加入购物车
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ====== 组件: 购物车 ======
function Cart() {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.total)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const getItemCount = useCartStore((state) => state.getItemCount)
  const createOrder = useOrderStore((state) => state.createOrder)
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)

  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert('请先登录')
      return
    }
    if (items.length === 0) {
      alert('购物车为空')
      return
    }
    createOrder()
    alert('订单创建成功！')
  }

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>购物车 ({getItemCount()} 件商品)</h2>

      {items.length === 0 ? (
        <p style={styles.empty}>购物车是空的</p>
      ) : (
        <>
          <div style={styles.cartList}>
            {items.map((item) => (
              <div key={item.id} style={styles.cartItem}>
                <div style={styles.cartItemInfo}>
                  <span style={styles.cartItemImage}>{item.image}</span>
                  <div>
                    <h4>{item.name}</h4>
                    <p>¥{item.price.toLocaleString()}</p>
                  </div>
                </div>
                <div style={styles.cartItemActions}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span style={styles.quantity}>{item.quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeItem(item.id)}
                  >
                    删除
                  </button>
                </div>
                <div style={styles.subtotal}>
                  ¥{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.cartSummary}>
            <h3>总计: ¥{total.toLocaleString()}</h3>
            <button style={styles.checkoutBtn} onClick={handleCheckout}>
              结账
            </button>
            <button style={styles.clearBtn} onClick={clearCart}>
              清空购物车
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ====== 组件: 订单历史 ======
function OrderHistory() {
  const orders = useOrderStore((state) => state.orders)
  const user = useUserStore((state) => state.user)

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>订单历史</h2>

      {orders.length === 0 ? (
        <p style={styles.empty}>暂无订单</p>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <span>订单号: {order.id}</span>
                <span style={styles.statusBadge}>{order.status}</span>
              </div>
              <div style={styles.orderItems}>
                {order.items.map((item) => (
                  <span key={item.id}>
                    {item.name} x {item.quantity}
                  </span>
                ))}
              </div>
              <div style={styles.orderFooter}>
                <span>下单时间: {new Date(order.createdAt).toLocaleString()}</span>
                <span style={styles.orderTotal}>¥{order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ====== 组件: 用户信息 ======
function UserProfile() {
  const { user, isLoggedIn, login, logout } = useUserStore()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')

  const handleLogin = () => {
    if (name && email) {
      login(name, email)
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={styles.section}>
        <h2 style={styles.title}>登录</h2>
        <div style={styles.loginForm}>
          <input
            style={styles.input}
            placeholder="请输入姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="请输入邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button style={styles.loginBtn} onClick={handleLogin}>
            登录
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>用户信息</h2>
      <div style={styles.profile}>
        <p>姓名: {user?.name}</p>
        <p>邮箱: {user?.email}</p>
        <p>ID: {user?.id}</p>
        <button style={styles.logoutBtn} onClick={logout}>
          退出登录
        </button>
      </div>
    </div>
  )
}

// ====== 主应用 ======
function ShoppingCartApp() {
  const activeTab = useUIStore((state) => state.activeTab)
  const setActiveTab = useUIStore((state) => state.setActiveTab)
  const cartItemCount = useCartStore((state) => state.getItemCount())

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductList />
      case 'cart':
        return <Cart />
      case 'orders':
        return <OrderHistory />
      case 'profile':
        return <UserProfile />
      default:
        return <ProductList />
    }
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🛒 购物商城</h1>
        <nav style={styles.nav}>
          <button
            style={{ ...styles.navBtn, background: activeTab === 'products' ? '#007bff' : 'transparent', color: activeTab === 'products' ? '#fff' : '#333' }}
            onClick={() => setActiveTab('products')}
          >
            商品
          </button>
          <button
            style={{ ...styles.navBtn, background: activeTab === 'cart' ? '#007bff' : 'transparent', color: activeTab === 'cart' ? '#fff' : '#333' }}
            onClick={() => setActiveTab('cart')}
          >
            购物车 ({cartItemCount})
          </button>
          <button
            style={{ ...styles.navBtn, background: activeTab === 'orders' ? '#007bff' : 'transparent', color: activeTab === 'orders' ? '#fff' : '#333' }}
            onClick={() => setActiveTab('orders')}
          >
            订单
          </button>
          <button
            style={{ ...styles.navBtn, background: activeTab === 'profile' ? '#007bff' : 'transparent', color: activeTab === 'profile' ? '#fff' : '#333' }}
            onClick={() => setActiveTab('profile')}
          >
            我的
          </button>
        </nav>
      </header>
      <main style={styles.main}>{renderContent()}</main>
    </div>
  )
}

// ====== 样式 ======
const styles: Record<string, React.CSSProperties> = {
  app: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  logo: { margin: 0, color: '#333' },
  nav: { display: 'flex', gap: '10px' },
  navBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  main: { minHeight: '500px' },
  section: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px' },
  title: { marginTop: 0, marginBottom: '20px' },
  categoryFilter: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  categoryBtn: { padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  productCard: { padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' },
  productImage: { fontSize: '48px', marginBottom: '10px' },
  description: { color: '#666', fontSize: '14px' },
  category: { color: '#999', fontSize: '12px' },
  price: { fontSize: '20px', fontWeight: 'bold', color: '#e53935', margin: '10px 0' },
  addBtn: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#999', padding: '40px' },
  cartList: { marginBottom: '20px' },
  cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #e0e0e0' },
  cartItemInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  cartItemImage: { fontSize: '24px' },
  cartItemActions: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { width: '30px', height: '30px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: '#fff' },
  quantity: { minWidth: '30px', textAlign: 'center' },
  removeBtn: { padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  subtotal: { fontWeight: 'bold', minWidth: '100px', textAlign: 'right' },
  cartSummary: { textAlign: 'right', padding: '20px', borderTop: '2px solid #e0e0e0' },
  checkoutBtn: { padding: '12px 30px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' },
  clearBtn: { padding: '12px 30px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' },
  orderList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  orderCard: { padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  statusBadge: { padding: '4px 8px', backgroundColor: '#ffc107', borderRadius: '4px', fontSize: '12px' },
  orderItems: { color: '#666', marginBottom: '10px' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '14px' },
  orderTotal: { fontWeight: 'bold', color: '#e53935' },
  loginForm: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px' },
  loginBtn: { padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  profile: { padding: '20px' },
  logoutBtn: { padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }
}

export default ShoppingCartApp
export { useUserStore, useProductStore, useCartStore, useOrderStore, useUIStore }
