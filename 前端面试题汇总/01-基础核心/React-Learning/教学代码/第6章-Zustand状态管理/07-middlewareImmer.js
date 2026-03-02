/**
 * 示例07: Immer中间件
 *
 * 本示例演示如何使用immer中间件以可变的方式更新深层嵌套状态
 * immer会自动处理不可变性，让代码更简洁
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// ====== 对比：不使用immer vs 使用immer ======

// 不使用immer - 传统方式（需要展开运算符）
const storeWithoutImmer = create((set) => ({
  users: [
    { id: 1, name: 'Alice', age: 25, address: { city: 'Beijing' } },
    { id: 2, name: 'Bob', age: 30, address: { city: 'Shanghai' } }
  ],

  // 添加用户 - 需要展开运算符
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user]
    })),

  // 更新用户 - 需要创建新数组
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, ...updates } : u
      )
    })),

  // 删除用户 - 需要创建新数组
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id)
    })),

  // 更新嵌套属性 - 需要多层展开
  updateUserCity: (id, city) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, address: { ...u.address, city } } : u
      )
    })),

  // 数组操作 - 比较复杂
  addUserAtBeginning: (user) =>
    set((state) => ({
      users: [user, ...state.users]
    })),

  reorderUsers: () =>
    set((state) => ({
      users: [...state.users].reverse()
    }))
}))

// 使用immer - 可以直接修改状态
const useImmerStore = create(
  immer((set) => ({
    users: [
      { id: 1, name: 'Alice', age: 25, address: { city: 'Beijing' } },
      { id: 2, name: 'Bob', age: 30, address: { city: 'Shanghai' } }
    ],

    // 添加用户 - 直接push
    addUser: (user) =>
      set((state) => {
        state.users.push(user)
      }),

    // 更新用户 - 直接修改
    updateUser: (id, updates) =>
      set((state) => {
        const index = state.users.findIndex((u) => u.id === id)
        if (index !== -1) {
          Object.assign(state.users[index], updates)
        }
      }),

    // 删除用户 - 直接过滤
    removeUser: (id) =>
      set((state) => {
        state.users = state.users.filter((u) => u.id !== id)
      }),

    // 更新嵌套属性 - 直接修改
    updateUserCity: (id, city) =>
      set((state) => {
        const user = state.users.find((u) => u.id === id)
        if (user) {
          user.address.city = city
        }
      }),

    // 数组操作 - 简单直观
    addUserAtBeginning: (user) =>
      set((state) => {
        state.users.unshift(user)
      }),

    reorderUsers: () =>
      set((state) => {
        state.users.reverse()
      }),

    sortUsersByAge: () =>
      set((state) => {
        state.users.sort((a, b) => a.age - b.age)
      }),

    clearUsers: () =>
      set((state) => {
        state.users = []
      })
  }))
)

// ====== 复杂示例：表单状态管理 ======
const useFormStore = create(
  immer((set) => ({
    form: {
      username: '',
      email: '',
      password: '',
      profile: {
        firstName: '',
        lastName: '',
        bio: '',
        address: {
          street: '',
          city: '',
          country: ''
        }
      },
      hobbies: [],
      settings: {
        notifications: true,
        theme: 'light',
        language: 'zh'
      }
    },

    // 更新简单字段
    setField: (field, value) =>
      set((state) => {
        state.form[field] = value
      }),

    // 更新嵌套字段
    setProfileField: (field, value) =>
      set((state) => {
        state.form.profile[field] = value
      }),

    // 更新深层嵌套字段
    setAddressField: (field, value) =>
      set((state) => {
        state.form.profile.address[field] = value
      }),

    // 更新设置
    updateSettings: (key, value) =>
      set((state) => {
        state.form.settings[key] = value
      }),

    // 数组操作 - 添加爱好
    addHobby: (hobby) =>
      set((state) => {
        if (!state.form.hobbies.includes(hobby)) {
          state.form.hobbies.push(hobby)
        }
      }),

    // 数组操作 - 移除爱好
    removeHobby: (hobby) =>
      set((state) => {
        state.form.hobbies = state.form.hobbies.filter((h) => h !== hobby)
      }),

    // 重置表单
    resetForm: () =>
      set((state) => {
        state.form = {
          username: '',
          email: '',
          password: '',
          profile: {
            firstName: '',
            lastName: '',
            bio: '',
            address: {
              street: '',
              city: '',
              country: ''
            }
          },
          hobbies: [],
          settings: {
            notifications: true,
            theme: 'light',
            language: 'zh'
          }
        }
      }),

    // 填充表单（模拟数据）
    fillForm: (data) =>
      set((state) => {
        Object.assign(state.form, data)
      })
  }))
)

// ====== 示例组件 ======
function ImmerDemo() {
  const users = useImmerStore((state) => state.users)
  const {
    addUser,
    updateUser,
    removeUser,
    updateUserCity,
    addUserAtBeginning,
    reorderUsers,
    sortUsersByAge,
    clearUsers
  } = useImmerStore()

  const form = useFormStore((state) => state.form)
  const {
    setField,
    setProfileField,
    setAddressField,
    updateSettings,
    addHobby,
    removeHobby,
    resetForm,
    fillForm
  } = useFormStore()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Immer中间件示例</h2>

      {/* 用户管理 */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>用户管理</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id} style={{ marginBottom: '10px' }}>
              {user.name} - {user.age}岁 - {user.address.city}
              <button onClick={() => updateUserCity(user.id, 'Shenzhen')}>
                改城市
              </button>
              <button onClick={() => updateUser(user.id, { age: user.age + 1 })}>
                长大
              </button>
              <button onClick={() => removeUser(user.id)}>删除</button>
            </li>
          ))}
        </ul>
        <button onClick={() => addUser({ id: Date.now(), name: '新用户', age: 20, address: { city: '未知' })}>
          添加用户
        </button>
        <button onClick={() => addUserAtBeginning({ id: Date.now(), name: '首位用户', age: 18, address: { city: '广州' })}>
          添加到开头
        </button>
        <button onClick={reorderUsers}>颠倒顺序</button>
        <button onClick={sortUsersByAge}>按年龄排序</button>
        <button onClick={clearUsers}>清空</button>
      </div>

      {/* 表单管理 */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>表单管理</h3>

        <div style={{ marginBottom: '10px' }}>
          <label>用户名: </label>
          <input
            value={form.username}
            onChange={(e) => setField('username', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>邮箱: </label>
          <input
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>名: </label>
          <input
            value={form.profile.firstName}
            onChange={(e) => setProfileField('firstName', e.target.value)}
          />
          <label> 姓: </label>
          <input
            value={form.profile.lastName}
            onChange={(e) => setProfileField('lastName', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>城市: </label>
          <input
            value={form.profile.address.city}
            onChange={(e) => setAddressField('city', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>爱好: </label>
          <button onClick={() => addHobby('编程')}>编程</button>
          <button onClick={() => addHobby('阅读')}>阅读</button>
          <button onClick={() => addHobby('运动')}>运动</button>
          <span> {form.hobbies.join(', ')} </span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={form.settings.notifications}
              onChange={(e) => updateSettings('notifications', e.target.checked)}
            />
            通知
          </label>
          <select
            value={form.settings.theme}
            onChange={(e) => updateSettings('theme', e.target.value)}
          >
            <option value="light">浅色</option>
            <option value="dark">深色</option>
          </select>
        </div>

        <button onClick={() => fillForm({
          username: 'test',
          email: 'test@example.com',
          profile: { firstName: 'Test', lastName: 'User', bio: 'Test bio', address: { street: 'Test St', city: 'Test City', country: 'China' } },
          hobbies: ['编程', '阅读']
        })}>
          填充表单
        </button>
        <button onClick={resetForm}>重置</button>

        <pre style={{ marginTop: '10px', background: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(form, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export { storeWithoutImmer, useImmerStore, useFormStore, ImmerDemo }
