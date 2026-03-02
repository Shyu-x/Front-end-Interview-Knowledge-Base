// 倒计时器 - 第3章 useEffect 示例
// 基础倒计时器
import { useState, useEffect } from 'react'

function CountdownTimer() {
  // 倒计时初始值（60秒）
  const [timeLeft, setTimeLeft] = useState(60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(60)
  }

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h2>基础倒计时器</h2>

      <div style={{
        fontSize: '72px',
        fontWeight: 'bold',
        margin: '20px 0',
        color: timeLeft <= 10 ? '#ff4d4f' : '#1890ff'
      }}>
        {formatTime(timeLeft)}
      </div>

      {timeLeft === 0 && (
        <p style={{ color: '#ff4d4f', fontSize: '18px' }}>时间到！</p>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!isRunning ? (
          <button onClick={handleStart}>开始</button>
        ) : (
          <button onClick={handlePause}>暂停</button>
        )}
        <button onClick={handleReset}>重置</button>
      </div>
    </div>
  )
}

export default CountdownTimer
