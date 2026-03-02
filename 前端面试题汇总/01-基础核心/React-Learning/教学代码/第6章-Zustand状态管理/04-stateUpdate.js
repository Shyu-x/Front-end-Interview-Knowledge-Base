/**
 * 示例04: 状态更新方法
 *
 * 本示例演示Zustand中状态更新的各种方法
 * 包括set()、getState()和外部访问
 */

import { create } from 'zustand'

// ====== 创建计数器Store ======
const useCounterStore = create((set, get) => ({
  count: 0,
  step: 1,
  history: [],

  // 方式一: 直接传入对象（简单更新）
  setCount: (count) => set({ count }),

  // 方式二: 使用函数更新（推荐，依赖前一个状态）
  increment: () => set((state) => ({ count: state.count + state.step })),
  decrement: () => set((state) => ({ count: state.count - state.step })),

  // 设置步长
  setStep: (step) => set({ step }),

  // 方式三: 批量更新多个状态
  setCountAndStep: (count, step) => set({ count, step }),

  // 方式四: 在方法内部使用get()获取当前状态
  incrementIfPositive: () => {
    const { count, step } = get()
    if (count >= 0) {
      set({ count: count + step })
    }
  },

  // 方式五: 记录操作历史
  incrementWithHistory: () => {
    const { count, step, history } = get()
    const newCount = count + step
    set({
      count: newCount,
      history: [...history, { type: 'increment', value: step, result: newCount }]
    })
  },

  // 方式六: 带条件判断的更新
  decrementIfNotZero: () => {
    const { count, step } = get()
    if (count - step >= 0) {
      set({ count: count - step })
    }
  },

  // 方式七: 复杂的条件更新
  incrementWithCondition: (condition) => {
    const { count, step } = get()
    if (condition === 'even' && count % 2 === 0) {
      set({ count: count + step })
    } else if (condition === 'odd' && count % 2 !== 0) {
      set({ count: count + step })
    } else if (condition === 'always') {
      set({ count: count + step })
    }
  },

  // 方式八: 重置状态
  reset: () => set({ count: 0, step: 1, history: [] }),

  // 方式九: 获取当前状态的方法
  getCount: () => get().count,
  getStep: () => get().step,

  // 方式十: 获取历史记录长度
  getHistoryLength: () => get().history.length
}))

// ====== 外部访问状态的方法 ======
// 在React组件外部访问store
function getCountFromOutside() {
  return useCounterStore.getState().count
}

function incrementFromOutside() {
  const { increment } = useCounterStore.getState()
  increment()
}

// ====== 订阅状态变化 ======
function subscribeToCount() {
  const unsubscribe = useCounterStore.subscribe((state) => {
    console.log('计数变化:', state.count)
  })

  // 取消订阅
  return unsubscribe
}

// ====== 示例组件 ======
function CounterDemo() {
  const count = useCounterStore((state) => state.count)
  const step = useCounterStore((state) => state.step)
  const history = useCounterStore((state) => state.history)

  const {
    increment,
    decrement,
    setStep,
    incrementIfPositive,
    incrementWithHistory,
    decrementIfNotZero,
    incrementWithCondition,
    reset,
    getCount
  } = useCounterStore()

  return (
    <div style={{ padding: '20px' }}>
      <h2>计数器演示</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>当前计数: {count}</h3>
        <p>步长: {step}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={increment}>+ 步长</button>
        <button onClick={decrement}>- 步长</button>
        <button onClick={incrementIfPositive}>正数时+</button>
        <button onClick={decrementIfNotZero}>不为零时-</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => incrementWithCondition('even')}>偶数时+</button>
        <button onClick={() => incrementWithCondition('odd')}>奇数时+</button>
        <button onClick={() => incrementWithCondition('always')}>总是+</button>
        <button onClick={incrementWithHistory}>+并记录历史</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          设置步长:
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            style={{ marginLeft: '10px', width: '60px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={reset}>重置</button>
        <button onClick={() => console.log('getCount():', getCount())}>
          打印getCount()
        </button>
        <button onClick={() => console.log('getState():', useCounterStore.getState())}>
          打印getState()
        </button>
      </div>

      {history.length > 0 && (
        <div>
          <h4>操作历史:</h4>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                {item.type}: +{item.value} = {item.result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export {
  useCounterStore,
  getCountFromOutside,
  incrementFromOutside,
  subscribeToCount,
  CounterDemo
}
