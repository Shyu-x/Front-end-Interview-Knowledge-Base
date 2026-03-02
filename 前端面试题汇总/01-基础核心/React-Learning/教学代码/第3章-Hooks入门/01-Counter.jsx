// 计数器组件 - 第3章 useState 示例
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)

  return (
    <div style={{ padding: '20px' }}>
      <h2>计数器示例</h2>
      <p>当前计数: <strong>{count}</strong></p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>重置</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  )
}

export default Counter
