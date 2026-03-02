/**
 * 示例5: use() 替代 useContext
 *
 * 本示例展示如何使用 use() 来替代 useContext()。
 * use() 可以用于访问 Context，这是 React 19 的新特性。
 *
 * 核心概念:
 * - use(Context) 等同于 useContext(Context)
 * - use() 可以在条件语句中使用，useContext 不行
 * - use() 支持 Promise，useContext 不支持
 */

import { use, createContext } from 'react'
import { useState } from 'react'

// ============================================
// 1. 创建 Context
// ============================================

/**
 * 主题 Context - 存储主题设置
 */
const ThemeContext = createContext('light')

/**
 * 用户 Context - 存储用户信息
 */
const UserContext = createContext(null)

/**
 * 语言 Context - 存储语言设置
 */
const LanguageContext = createContext('zh-CN')

// ============================================
// 2. 使用 use() 访问 Context 的组件
// ============================================

/**
 * 主题按钮组件 - 展示 use() 访问 Context
 */
function ThemedButton() {
  // use() 可以替代 useContext()
  // const theme = useContext(ThemeContext) 等同于:
  const theme = use(ThemeContext)

  return (
    <button style={{
      padding: '12px 24px',
      backgroundColor: theme === 'dark' ? '#333' : '#007bff',
      color: theme === 'dark' ? '#fff' : '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s'
    }}>
      主题按钮 ({theme})
    </button>
  )
}

/**
 * 用户徽章组件
 */
function UserBadge() {
  const user = use(UserContext)

  if (!user) {
    return (
      <div style={styles.notLoggedIn}>
        <span>未登录</span>
      </div>
    )
  }

  return (
    <div style={styles.userBadge}>
      <span style={styles.avatar}>{user.avatar}</span>
      <div>
        <div style={styles.userName}>{user.name}</div>
        <div style={styles.userEmail}>{user.email}</div>
      </div>
    </div>
  )
}

/**
 * 语言切换组件
 */
function LanguageSwitcher() {
  const language = use(LanguageContext)

  const languages = {
    'zh-CN': '中文',
    'en-US': 'English',
    'ja-JP': '日本語'
  }

  return (
    <div style={styles.languageBox}>
      <span style={styles.currentLang}>
        当前语言: {languages[language]}
      </span>
    </div>
  )
}

// ============================================
// 3. 展示 use() 独有特性 - 条件性使用 Context
// ============================================

/**
 * 条件性 Context 访问组件
 * use() 可以在条件语句中使用，这是 useContext 做不到的
 */
function ConditionalContextDemo() {
  const [showPremium, setShowPremium] = useState(false)

  // use() 可以在条件语句中使用
  // 这对于根据条件显示不同内容非常有用
  const premiumContext = showPremium ? use(ThemeContext) : 'default'

  return (
    <div style={styles.conditionalSection}>
      <h4>条件性 Context 访问</h4>
      <p>Premium 主题: {premiumContext}</p>

      <button
        onClick={() => setShowPremium(!showPremium)}
        style={styles.toggleButton}
      >
        {showPremium ? '切换到免费版' : '切换到 Premium'}
      </button>

      <div style={styles.note}>
        <p>注意: use() 可以在条件语句中使用，</p>
        <p>而 useContext() 必须总是在组件顶层调用。</p>
      </div>
    </div>
  )
}

// ============================================
// 4. 对比演示: use() vs useContext
// ============================================

/**
 * 使用 use() 的组件
 */
function WithUse() {
  const theme = use(ThemeContext)
  return <p>use() - 主题: {theme}</p>
}

/**
 * 使用 useContext 的组件 (如果需要)
 */
function WithUseContext() {
  // 如果需要使用 useContext，可以通过导入实现
  // import { useContext } from 'react'
  // const theme = useContext(ThemeContext)
  return <p>useContext - 需要额外导入</p>
}

// ============================================
// 5. 主应用组件 - 提供 Context
// ============================================

function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState({ name: '小明', email: 'xiaoming@example.com', avatar: '👤' })
  const [language, setLanguage] = useState('zh-CN')

  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <LanguageContext.Provider value={language}>
          <div style={styles.container}>
            <h1 style={styles.title}>use() 替代 useContext 示例</h1>

            {/* 状态控制面板 */}
            <div style={styles.controls}>
              <div style={styles.controlGroup}>
                <label>主题:</label>
                <button
                  onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                  style={styles.controlButton}
                >
                  切换主题 (当前: {theme})
                </button>
              </div>

              <div style={styles.controlGroup}>
                <label>用户:</label>
                <button
                  onClick={() => setUser(user ? null : { name: '小明', email: 'xiaoming@example.com', avatar: '👤'})}
                  style={styles.controlButton}
                >
                  {user ? '退出登录' : '登录'}
                </button>
              </div>

              <div style={styles.controlGroup}>
                <label>语言:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={styles.select}
                >
                  <option value="zh-CN">中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>
            </div>

            {/* 演示区域 */}
            <div style={styles.demo}>
              {/* 主题按钮 */}
              <div style={styles.demoSection}>
                <h3>主题 Context</h3>
                <ThemedButton />
              </div>

              {/* 用户徽章 */}
              <div style={styles.demoSection}>
                <h3>用户 Context</h3>
                <UserBadge />
              </div>

              {/* 语言切换 */}
              <div style={styles.demoSection}>
                <h3>语言 Context</h3>
                <LanguageSwitcher />
              </div>

              {/* 条件性 Context */}
              <ConditionalContextDemo />

              {/* 对比 */}
              <div style={styles.demoSection}>
                <h3>use() vs useContext 对比</h3>
                <WithUse />
                <WithUseContext />
              </div>
            </div>

            {/* 说明 */}
            <div style={styles.explanation}>
              <h3>use() vs useContext</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>特性</th>
                    <th style={styles.th}>use()</th>
                    <th style={styles.th}>useContext()</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>条件调用</td>
                    <td style={styles.td}>支持</td>
                    <td style={styles.td}>不支持</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Promise 支持</td>
                    <td style={styles.td}>支持</td>
                    <td style={styles.td}>不支持</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>语法</td>
                    <td style={styles.td}>use(Context)</td>
                    <td style={styles.td}>useContext(Context)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </LanguageContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

// ============================================
// 6. 样式对象
// ============================================
const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px'
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  controlButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd'
  },
  demo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  demoSection: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    backgroundColor: '#e3f2fd',
    borderRadius: '8px'
  },
  avatar: {
    fontSize: '36px'
  },
  userName: {
    fontWeight: 'bold',
    color: '#333'
  },
  userEmail: {
    fontSize: '13px',
    color: '#666'
  },
  notLoggedIn: {
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    color: '#666'
  },
  languageBox: {
    padding: '15px',
    backgroundColor: '#fff3e0',
    borderRadius: '8px'
  },
  currentLang: {
    fontWeight: '600',
    color: '#e65100'
  },
  conditionalSection: {
    padding: '20px',
    backgroundColor: '#fce4ec',
    borderRadius: '12px'
  },
  toggleButton: {
    padding: '10px 20px',
    backgroundColor: '#e91e63',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  note: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#666'
  },
  explanation: {
    marginTop: '30px',
    padding: '25px',
    backgroundColor: '#e8f5e9',
    borderRadius: '12px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #4caf50',
    backgroundColor: '#c8e6c9'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd'
  }
}

export default App
