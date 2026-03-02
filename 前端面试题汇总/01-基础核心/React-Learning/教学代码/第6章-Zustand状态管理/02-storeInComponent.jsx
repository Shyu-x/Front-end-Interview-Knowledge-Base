/**
 * 示例02: 在组件中使用Store
 *
 * 本示例演示如何在React组件中使用Zustand Store
 * 展示选择器订阅和完整组件实现
 */

// ====== Store 定义 ======
import { create } from 'zustand'

const useUserStore = create((set) => ({
  // 状态
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  isLoggedIn: false,
  preferences: {
    theme: 'light',
    language: 'zh-CN'
  },

  // 同步方法
  setName: (name) => set({ name }),
  setAge: (age) => set({ age }),
  setEmail: (email) => set({ email }),

  // 登录/登出
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),

  // 批量更新
  updateProfile: (profile) => set(profile),

  // 更新嵌套属性
  setTheme: (theme) => set((state) => ({
    preferences: { ...state.preferences, theme }
  })),

  // 重置
  reset: () => set({
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    isLoggedIn: false,
    preferences: { theme: 'light', language: 'zh-CN' }
  })
}))

// ====== 组件: 用户信息表单 ======
function UserProfile() {
  // 使用选择器订阅特定状态
  // 精确订阅可以避免不必要的重新渲染
  const name = useUserStore((state) => state.name)
  const age = useUserStore((state) => state.age)
  const email = useUserStore((state) => state.email)
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)
  const theme = useUserStore((state) => state.preferences.theme)

  // 获取更新方法
  const setName = useUserStore((state) => state.setName)
  const setAge = useUserStore((state) => state.setAge)
  const setEmail = useUserStore((state) => state.setEmail)
  const updateProfile = useUserStore((state) => state.updateProfile)
  const setTheme = useUserStore((state) => state.setTheme)
  const reset = useUserStore((state) => state.reset)
  const login = useUserStore((state) => state.login)
  const logout = useUserStore((state) => state.logout)

  // 根据主题切换样式
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '500px',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif'
    },
    field: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc'
    },
    button: {
      padding: '8px 16px',
      marginRight: '10px',
      cursor: 'pointer',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff'
    },
    pre: {
      backgroundColor: theme === 'dark' ? '#222' : '#f5f5f5',
      padding: '10px',
      borderRadius: '4px',
      overflow: 'auto'
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <h2>请登录</h2>
        <button style={styles.button} onClick={login}>
          登录
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2>用户信息</h2>

      {/* 姓名输入 */}
      <div style={styles.field}>
        <label style={styles.label}>姓名:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* 年龄输入 */}
      <div style={styles.field}>
        <label style={styles.label}>年龄:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          style={styles.input}
        />
      </div>

      {/* 邮箱输入 */}
      <div style={styles.field}>
        <label style={styles.label}>邮箱:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* 主题切换 */}
      <div style={styles.field}>
        <label style={styles.label}>主题:</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={styles.input}
        >
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
      </div>

      {/* 批量更新按钮 */}
      <div style={styles.field}>
        <button
          style={styles.button}
          onClick={() => updateProfile({ name: '李四', age: 30 })}
        >
          批量更新为李四
        </button>
        <button style={styles.button} onClick={reset}>
          重置
        </button>
        <button
          style={{ ...styles.button, backgroundColor: '#dc3545' }}
          onClick={logout}
        >
          退出登录
        </button>
      </div>

      {/* 显示当前状态 */}
      <pre style={styles.pre}>
        {JSON.stringify({ name, age, email, theme }, null, 2)}
      </pre>
    </div>
  )
}

// ====== 组件: 另一个使用同一Store的组件 ======
function UserStatus() {
  const name = useUserStore((state) => state.name)
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', marginTop: '10px' }}>
      <p>
        状态: {isLoggedIn ? `已登录 - ${name}` : '未登录'}
      </p>
    </div>
  )
}

// ====== 完整示例导出 ======
export { useUserStore, UserProfile, UserStatus }
