/**
 * 示例06: DevTools中间件
 *
 * 本示例演示如何使用devtools中间件集成Chrome/Firefox开发者工具
 * 可以在浏览器中查看状态变化历史
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// ====== 基础用法 ======
const useBasicDevtoolsStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 })
    }),
    { name: 'BasicCounterStore' } // 在DevTools中显示的名称
  )
)

// ====== 只在开发环境启用 ======
const useDevOnlyStore = create(
  devtools(
    (set) => ({
      count: 0,
      step: 1,
      increment: () => set((state) => ({ count: state.count + state.step })),
      decrement: () => set((state) => ({ count: state.count - state.step })),
      setStep: (step) => set({ step }),
      reset: () => set({ count: 0, step: 1 })
    }),
    {
      name: 'DevOnlyStore',
      enabled: process.env.NODE_ENV !== 'production' // 只在开发环境启用
    }
  )
)

// ====== 进阶用法：自定义操作名称 ======
const useCustomActionsStore = create(
  devtools(
    (set) => ({
      count: 0,
      users: [],

      // 使用第三个参数自定义在DevTools中显示的名称
      // set(state, replacedState, actionName)
      increment: () =>
        set(
          (state) => ({ count: state.count + 1 }),
          false, // 不替换状态，用于区分
          'increment_count' // 自定义操作名称
        ),

      decrement: () =>
        set(
          (state) => ({ count: state.count - 1 }),
          false,
          'decrement_count'
        ),

      addUser: (user) =>
        set(
          (state) => ({ users: [...state.users, user] }),
          false,
          'add_user'
        ),

      removeUser: (id) =>
        set(
          (state) => ({
            users: state.users.filter((u) => u.id !== id)
          }),
          false,
          'remove_user'
        ),

      reset: () =>
        set(
          { count: 0, users: [] },
          false,
          'reset_all'
        )
    }),
    { name: 'CustomActionsStore' }
  )
)

// ====== 完整示例：购物车 ======
const useCartStore = create(
  devtools(
    (set) => ({
      items: [],
      total: 0,

      addItem: (product) =>
        set(
          (state) => {
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
          },
          false,
          'add_to_cart'
        ),

      removeItem: (id) =>
        set(
          (state) => {
            const item = state.items.find((i) => i.id === id)
            if (!item) return state

            return {
              items: state.items.filter((i) => i.id !== id),
              total: state.total - item.price * item.quantity
            }
          },
          false,
          'remove_from_cart'
        ),

      updateQuantity: (id, quantity) =>
        set(
          (state) => {
            if (quantity < 1) return state

            const item = state.items.find((i) => i.id === id)
            if (!item) return state

            const diff = quantity - item.quantity
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity } : i
              ),
              total: state.total + diff * item.price
            }
          },
          false,
          'update_quantity'
        ),

      clearCart: () =>
        set(
          { items: [], total: 0 },
          false,
          'clear_cart'
        )
    }),
    { name: 'CartStore' }
  )
)

// ====== 示例组件 ======
function DevtoolsDemo() {
  const count = useBasicDevtoolsStore((state) => state.count)
  const { increment, decrement, reset } = useBasicDevtoolsStore()

  const devCount = useDevOnlyStore((state) => state.count)
  const devStep = useDevOnlyStore((state) => state.step)
  const { increment: devIncrement, setStep, reset: devReset } = useDevOnlyStore()

  const customCount = useCustomActionsStore((state) => state.count)
  const users = useCustomActionsStore((state) => state.users)
  const {
    increment: customIncrement,
    addUser,
    removeUser,
    reset: customReset
  } = useCustomActionsStore()

  const cartItems = useCartStore((state) => state.items)
  const cartTotal = useCartStore((state) => state.total)
  const { addItem, removeItem, clearCart } = useCartStore()

  // 模拟商品
  const products = [
    { id: 1, name: 'iPhone 15', price: 6999 },
    { id: 2, name: 'MacBook Pro', price: 14999 },
    { id: 3, name: 'iPad Pro', price: 5999 }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h2>DevTools中间件示例</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        提示：打开浏览器开发者工具的Zustand面板，可以查看状态变化历史
      </p>

      {/* 基础用法 */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>基础用法</h3>
        <p>计数: {count}</p>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={reset}>重置</button>
      </div>

      {/* 开发环境启用 */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>开发环境启用</h3>
        <p>计数: {devCount}</p>
        <p>步长: {devStep}</p>
        <button onClick={devIncrement}>+步长</button>
        <button onClick={() => setStep(2)}>设置步长为2</button>
        <button onClick={devReset}>重置</button>
      </div>

      {/* 自定义操作名称 */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>自定义操作名称</h3>
        <p>计数: {customCount}</p>
        <p>用户: {users.map((u) => u.name).join(', ')}</p>
        <button onClick={customIncrement}>计数+1</button>
        <button onClick={() => addUser({ id: Date.now(), name: '新用户' })}>
          添加用户
        </button>
        <button onClick={customReset}>重置</button>
      </div>

      {/* 购物车示例 */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>购物车示例</h3>
        <p>总计: {cartTotal}</p>
        <div>
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => addItem(product)}
              style={{ marginRight: '10px' }}
            >
              加入 {product.name}
            </button>
          ))}
        </div>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ${item.price * item.quantity}
              <button onClick={() => removeItem(item.id)}>删除</button>
            </li>
          ))}
        </ul>
        <button onClick={clearCart}>清空购物车</button>
      </div>
    </div>
  )
}

export {
  useBasicDevtoolsStore,
  useDevOnlyStore,
  useCustomActionsStore,
  useCartStore,
  DevtoolsDemo
}
