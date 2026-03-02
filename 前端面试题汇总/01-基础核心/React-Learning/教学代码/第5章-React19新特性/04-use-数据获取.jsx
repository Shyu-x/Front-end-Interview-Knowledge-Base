/**
 * 示例4: use() - 数据获取
 *
 * 本示例展示如何使用 use() Hook 来简化数据获取。
 * use() 是 React 19 引入的全新 Hook，允许直接使用 Promise 和 Context。
 *
 * 核心概念:
 * - 直接接受 Promise 作为参数
 * - 自动 Suspense 集成
 * - 可以在条件语句中使用 (useContext 不支持)
 * - 可以替代 useContext
 */

import { use, Suspense } from 'react'
import { useState, createContext } from 'react'

// ============================================
// 1. 模拟数据获取函数
// ============================================

/**
 * 获取用户信息
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} - 用户信息
 */
function fetchUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: '张三',
        email: 'zhangsan@example.com',
        avatar: '👤',
        bio: '前端开发者',
        location: '北京'
      })
    }, 1000) // 1秒延迟
  })
}

/**
 * 获取用户文章列表
 * @param {string} userId - 用户ID
 * @returns {Promise<Array>} - 文章列表
 */
function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'React 19 新特性详解', views: 1200, date: '2024-01-15' },
        { id: 2, title: 'use() Hook 完全指南', views: 890, date: '2024-01-10' },
        { id: 3, title: '乐观更新实战技巧', views: 2100, date: '2024-01-05' },
        { id: 4, title: '理解 React Server Components', views: 1800, date: '2024-01-01' }
      ])
    }, 1500) // 1.5秒延迟
  })
}

/**
 * 获取用户关注者
 * @param {string} userId - 用户ID
 * @returns {Promise<Array>} - 关注者列表
 */
function fetchFollowers(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: '李四', avatar: '👨' },
        { id: 2, name: '王五', avatar: '👩' },
        { id: 3, name: '赵六', avatar: '👨‍💻' }
      ])
    }, 800) // 0.8秒延迟
  })
}

// ============================================
// 2. 用户资料组件
// ============================================

/**
 * 用户资料组件 - 展示 use() 的基本用法
 *
 * @param {Object} props - 组件属性
 * @param {string} props.userId - 用户ID
 */
function UserProfile({ userId }) {
  // use() 会等待 Promise resolved
  // 当 Promise pending 时，组件会 Suspense
  const user = use(fetchUser(userId))

  return (
    <div style={styles.profile}>
      <div style={styles.avatarSection}>
        <span style={styles.avatar}>{user.avatar}</span>
        <h2 style={styles.name}>{user.name}</h2>
      </div>
      <div style={styles.info}>
        <p><strong>邮箱:</strong> {user.email}</p>
        <p><strong>简介:</strong> {user.bio}</p>
        <p><strong>位置:</strong> {user.location}</p>
      </div>
    </div>
  )
}

// ============================================
// 3. 用户文章列表组件
// ============================================

/**
 * 用户文章列表组件
 *
 * @param {Object} props - 组件属性
 * @param {string} props.userId - 用户ID
 */
function UserPosts({ userId }) {
  const posts = use(fetchPosts(userId))

  return (
    <div style={styles.postsSection}>
      <h3 style={styles.sectionTitle}>他的文章</h3>
      <ul style={styles.postList}>
        {posts.map(post => (
          <li key={post.id} style={styles.postItem}>
            <div>
              <span style={styles.postTitle}>{post.title}</span>
              <span style={styles.postDate}>{post.date}</span>
            </div>
            <span style={styles.views}>👁 {post.views}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================
// 4. 用户关注者组件
// ============================================

/**
 * 用户关注者组件
 *
 * @param {Object} props - 组件属性
 * @param {string} props.userId - 用户ID
 */
function UserFollowers({ userId }) {
  const followers = use(fetchFollowers(userId))

  return (
    <div style={styles.followersSection}>
      <h3 style={styles.sectionTitle}>关注者 ({followers.length})</h3>
      <div style={styles.followerList}>
        {followers.map(follower => (
          <div key={follower.id} style={styles.followerItem}>
            <span style={styles.followerAvatar}>{follower.avatar}</span>
            <span>{follower.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 5. 并行数据获取组件 - 展示 use() 的强大之处
// ============================================

/**
 * 并行数据获取 - 展示 use() 并行请求能力
 *
 * @param {Object} props - 组件属性
 * @param {string} props.userId - 用户ID
 */
function UserDashboard({ userId }) {
  // 并行发起三个请求！
  // use() 会自动处理 Suspense
  // 每个 use() 调用会独立触发 Suspense
  const user = use(fetchUser(userId))
  const posts = use(fetchPosts(userId))
  const followers = use(fetchFollowers(userId))

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.dashboardTitle}>{user.name} 的个人主页</h2>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{posts.length}</span>
          <span style={styles.statLabel}>篇文章</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{followers.length}</span>
          <span style={styles.statLabel}>位关注者</span>
        </div>
      </div>

      <div style={styles.content}>
        <UserPosts userId={userId} />
        <UserFollowers userId={userId} />
      </div>
    </div>
  )
}

// ============================================
// 6. 条件性数据获取 - 展示 use() 独有特性
// ============================================

/**
 * 条件性数据获取组件
 * use() 可以在条件语句中使用，这是 useContext 做不到的
 */
function ConditionalFetcher() {
  const [shouldFetch, setShouldFetch] = useState(false)

  // 模拟数据获取函数
  function getData() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          content: '这是通过条件获取的数据！',
          timestamp: new Date().toISOString()
        })
      }, 1000)
    })
  }

  // use() 可以在条件语句中使用！
  // 这是 useContext 做不到的
  const data = shouldFetch ? use(getData()) : null

  return (
    <div style={styles.conditionalSection}>
      <h3 style={styles.sectionTitle}>条件性数据获取</h3>

      <button
        onClick={() => setShouldFetch(!shouldFetch)}
        style={styles.toggleButton}
      >
        {shouldFetch ? '停止获取' : '开始获取'}
      </button>

      <div style={styles.result}>
        {shouldFetch ? (
          data ? (
            <div>
              <p><strong>内容:</strong> {data.content}</p>
              <p><strong>时间:</strong> {data.timestamp}</p>
            </div>
          ) : (
            <p style={styles.loading}>加载中...</p>
          )
        ) : (
          <p style={styles.hint}>点击按钮开始获取数据</p>
        )}
      </div>

      <div style={styles.explanation}>
        <h4>use() vs useContext</h4>
        <ul>
          <li>use() 可以在条件语句中使用</li>
          <li>useContext 必须在组件顶层调用</li>
          <li>use() 支持 Promise，useContext 不支持</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================
// 7. 主组件 - 组合使用
// ============================================

function DataFetchingDemo() {
  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>use() 数据获取示例</h1>

      {/* 每个 Suspense 包裹独立的数据获取组件 */}
      <Suspense fallback={<div style={styles.loading}>加载用户资料...</div>}>
        <UserProfile userId="1" />
      </Suspense>

      {/* 也可以组合多个 Suspense */}
      <Suspense fallback={<div style={styles.loading}>加载中...</div>}>
        <UserDashboard userId="1" />
      </Suspense>

      <ConditionalFetcher />
    </div>
  )
}

// ============================================
// 8. 样式对象
// ============================================
const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
  },
  loading: {
    padding: '30px',
    textAlign: 'center',
    color: '#666',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    margin: '10px 0'
  },
  profile: {
    padding: '25px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  avatarSection: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  avatar: {
    fontSize: '80px'
  },
  name: {
    margin: '10px 0 0 0',
    color: '#333'
  },
  info: {
    color: '#555'
  },
  sectionTitle: {
    marginBottom: '15px',
    color: '#333'
  },
  postsSection: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  postList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  postItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  postTitle: {
    fontWeight: '500',
    marginRight: '10px'
  },
  postDate: {
    fontSize: '12px',
    color: '#999'
  },
  views: {
    color: '#666',
    fontSize: '14px'
  },
  followersSection: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  followerList: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  followerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px'
  },
  followerAvatar: {
    fontSize: '24px'
  },
  dashboard: {
    padding: '25px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  dashboardTitle: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '25px'
  },
  statCard: {
    textAlign: 'center',
    padding: '15px 30px',
    backgroundColor: '#e3f2fd',
    borderRadius: '8px'
  },
  statValue: {
    display: 'block',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1976d2'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  conditionalSection: {
    padding: '25px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  toggleButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '20px'
  },
  result: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    minHeight: '80px',
    marginBottom: '15px'
  },
  hint: {
    color: '#999',
    textAlign: 'center'
  },
  explanation: {
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    fontSize: '13px'
  }
}

export default DataFetchingDemo
