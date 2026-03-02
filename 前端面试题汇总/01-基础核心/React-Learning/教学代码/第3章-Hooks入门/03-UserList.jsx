// 数据获取组件 - 第3章 useEffect 示例
import { useState, useEffect } from 'react'

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 模拟 API 请求
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // 使用占位 API
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) throw new Error('获取失败')
        const data = await response.json()
        setUsers(data.slice(0, 5)) // 只取前5个
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, []) // 空依赖数组，只在挂载时执行

  if (loading) return <p>加载中...</p>
  if (error) return <p>错误: {error}</p>

  return (
    <div style={{ padding: '20px' }}>
      <h2>用户列表</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} style={{ marginBottom: '10px' }}>
            <strong>{user.name}</strong>
            <br />
            <small>{user.email}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserList
