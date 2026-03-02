// 番茄钟 - 第3章 useEffect 示例
import { useState, useEffect } from 'react'

function PomodoroTimer() {
  // 工作时间25分钟，休息时间5分钟
  const WORK_TIME = 25 * 60
  const BREAK_TIME = 5 * 60

  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isWorking, setIsWorking] = useState(true) // true=工作，false=休息
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0) // 完成的工作轮数

  useEffect(() => {
    let interval = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // 时间到，切换状态
      setIsRunning(false)
      if (isWorking) {
        setSessions(s => s + 1)
        setIsWorking(false)
        setTimeLeft(BREAK_TIME)
      } else {
        setIsWorking(true)
        setTimeLeft(WORK_TIME)
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isWorking])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setIsWorking(true)
    setTimeLeft(WORK_TIME)
  }
  const handleSkip = () => {
    setIsRunning(false)
    if (isWorking) {
      setIsWorking(false)
      setTimeLeft(BREAK_TIME)
    } else {
      setIsWorking(true)
      setTimeLeft(WORK_TIME)
    }
  }

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      backgroundColor: isWorking ? '#fff' : '#f6ffed',
      borderRadius: '10px'
    }}>
      <h2>番茄钟</h2>

      {/* 状态标签 */}
      <div style={{
        display: 'inline-block',
        padding: '8px 20px',
        backgroundColor: isWorking ? '#ff4d4f' : '#52c41a',
        color: 'white',
        borderRadius: '20px',
        marginBottom: '20px'
      }}>
        {isWorking ? '工作时间' : '休息时间'}
      </div>

      {/* 时间显示 */}
      <div style={{
        fontSize: '96px',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: isWorking ? '#ff4d4f' : '#52c41a'
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        {!isRunning ? (
          <button onClick={handleStart}>开始</button>
        ) : (
          <button onClick={handlePause}>暂停</button>
        )}
        <button onClick={handleReset}>重置</button>
        <button onClick={handleSkip}>跳过</button>
      </div>

      {/* 统计 */}
      <div>已完成 {sessions} 个工作轮次</div>
    </div>
  )
}

export default PomodoroTimer
