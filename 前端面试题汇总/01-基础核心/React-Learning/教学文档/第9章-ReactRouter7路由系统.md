# 第9章：React Router 7 路由系统详解

> 本章将带你深入学习 React Router 7 的核心概念，包括路由配置、嵌套路由、编程式导航、路由守卫等完整的多页面应用开发

---

## 9.1 React Router 7 概述

### 什么是 React Router？

React Router 是 React 生态中最流行的路由库，用于实现 SPA（单页应用）中的页面导航。它允许用户在不同的 URL 之间切换，而不需要刷新整个页面。

### React Router 7 新特性

React Router v7 于 2024 年 11 月正式发布，是一个重大版本更新：

1. **三種模式**：
   - 传统模式：纯客户端路由，与 v6 用法相同
   - 数据模式：支持 loader、action 等数据加载
   - 框架模式：完整的全栈框架，集成 Remix 特性

2. **从 Remix 继承的特性**：
   - 服务端渲染 (SSR)
   - 预渲染 (Pre-rendering)
   - 流式渲染 (Streaming)
   - 数据加载 (loaders)
   - 表单提交 (actions)

3. **类型安全**：
   - 自动生成路由参数类型
   - loader 数据类型
   - action 参数类型

### 安装 React Router 7

```bash
# 使用 pnpm（推荐）
pnpm add react-router

# 或使用 npm
npm install react-router

# 或使用 yarn
yarn add react-router
```

---

## 9.2 基础路由配置

### 项目结构

```
src/
├── main.jsx              # 入口文件
├── App.jsx               # 主应用组件
├── pages/                # 页面组件
│   ├── Home.jsx          # 首页
│   ├── About.jsx         # 关于页
│   ├── Products.jsx      # 产品页
│   ├── ProductDetail.jsx # 产品详情页
│   └── NotFound.jsx     # 404 页面
└── components/          # 公共组件
    └── Navbar.jsx       # 导航栏组件
```

### 基本路由配置

#### 1. 在入口文件中配置路由

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.jsx'
import './index.css'

// 引入页面组件
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Products from './pages/Products.jsx'
import NotFound from './pages/NotFound.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          {/* 404 页面 - 匹配所有未匹配的路径 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
```

#### 2. App.jsx - 布局组件

```jsx
// App.jsx
import { Outlet } from 'react-router'
import Navbar from './components/Navbar.jsx'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {/* Outlet 渲染子路由的内容 */}
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2025 我的 React 应用</p>
      </footer>
    </div>
  )
}

export default App
```

### BrowserRouter vs HashRouter

```jsx
// BrowserRouter - 使用 HTML5 History API
// URL 格式: https://example.com/about
// 需要服务器配置支持刷新
import { BrowserRouter } from 'react-router'

// HashRouter - 使用 URL hash
// URL 格式: https://example.com/#/about
// 不需要服务器配置刷新
import { HashRouter } from 'react-router'

// MemoryRouter - 内存路由（用于测试）
import { MemoryRouter } from 'react-router'
```

---

## 9.3 路由组件详解

### Link 组件

用于创建可点击的链接，实现无刷新导航。

```jsx
import { Link } from 'react-router'

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/about">关于</Link>
        </li>
        <li>
          <Link to="/products">产品</Link>
        </li>
        <li>
          <Link to="/products/1">产品详情</Link>
        </li>
      </ul>
    </nav>
  )
}

// Link 组件的多种用法
function Links() {
  return (
    <div>
      {/* 基本用法 */}
      <Link to="/about">关于我们</Link>

      {/* 带查询参数 */}
      <Link to="/products?category=electronics">电子产品</Link>

      {/* 带状态 */}
      <Link to="/products" state={{ from: 'navbar' }}>产品</Link>

      {/* 带 className */}
      <Link to="/about" className="nav-link">关于</Link>

      {/* 使用 replace（替换历史记录） */}
      <Link to="/login" replace>登录</Link>
    </div>
  )
}
```

### NavLink 组件

NavLink 是 Link 的特殊版本，专门用于导航链接，自动处理激活状态。

```jsx
import { NavLink } from 'react-router'

function Navigation() {
  return (
    <nav>
      {/* isActive 自动判断是否当前路径 */}
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        首页
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        关于
      </NavLink>

      {/* end 属性表示精确匹配 */}
      <NavLink
        to="/products"
        end
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        产品
      </NavLink>

      {/* 使用 children 渲染自定义内容 */}
      <NavLink to="/contact">
        {({ isActive }) => (
          <span className={isActive ? 'active' : ''}>
            联系我们
          </span>
        )}
      </NavLink>
    </nav>
  )
}
```

### Navigate 组件

用于编程式重定向。

```jsx
import { Navigate } from 'react-router'

function LoginPage() {
  const isLoggedIn = false

  // 未登录时重定向到登录页
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <h1>欢迎回来</h1>
}

// 使用 replace 属性替换历史记录
function OldPage() {
  return <Navigate to="/new-page" replace />
}

// 带状态的重定向
function RedirectWithState() {
  return <Navigate to="/products" state={{ message: '请先登录' }} />
}
```

### Outlet 组件

用于渲染嵌套路由的内容。

```jsx
import { Outlet } from 'react-router'

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav>
          <Link to="/dashboard">概览</Link>
          <Link to="/dashboard/settings">设置</Link>
          <Link to="/dashboard/profile">个人资料</Link>
        </nav>
      </aside>
      <main className="content">
        {/* 子路由内容在这里渲染 */}
        <Outlet />
      </main>
    </div>
  )
}
```

---

## 9.4 路由参数与查询参数

### 动态路由参数

```jsx
// 路由配置
<Route path="/products/:id" element={<ProductDetail />} />

// ProductDetail.jsx - 获取路由参数
import { useParams } from 'react-router'

function ProductDetail() {
  const { id } = useParams()

  return (
    <div>
      <h1>产品详情</h1>
      <p>产品 ID: {id}</p>
    </div>
  )
}

// 多个参数
// 路由: /products/:category/:id
function ProductDetail() {
  const { category, id } = useParams()

  return (
    <div>
      <p>分类: {category}</p>
      <p>产品 ID: {id}</p>
    </div>
  )
}
```

### 查询参数（URL Search Params）

```jsx
import { useSearchParams } from 'react-router'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 获取查询参数
  const category = searchParams.get('category')
  const page = searchParams.get('page') || '1'
  const sort = searchParams.get('sort') || 'name'

  // 处理搜索
  const handleSearch = (e) => {
    const query = e.target.value
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    setSearchParams(params)
  }

  // 处理分页
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage)
    setSearchParams(params)
  }

  // 处理筛选
  const handleFilterChange = (filterValue) => {
    const params = new URLSearchParams(searchParams)
    if (filterValue) {
      params.set('category', filterValue)
    } else {
      params.delete('category')
    }
    setSearchParams(params)
  }

  return (
    <div>
      <h1>产品列表</h1>

      {/* 搜索框 */}
      <input
        type="text"
        placeholder="搜索产品..."
        onChange={handleSearch}
      />

      {/* 筛选 */}
      <select
        value={category || ''}
        onChange={(e) => handleFilterChange(e.target.value)}
      >
        <option value="">全部分类</option>
        <option value="electronics">电子产品</option>
        <option value="clothing">服装</option>
        <option value="books">图书</option>
      </select>

      {/* 显示当前筛选条件 */}
      <div>
        <p>当前分类: {category || '全部'}</p>
        <p>当前页码: {page}</p>
        <p>排序方式: {sort}</p>
      </div>

      {/* 分页按钮 */}
      <button onClick={() => handlePageChange(Number(page) - 1)}>
        上一页
      </button>
      <button onClick={() => handlePageChange(Number(page) + 1)}>
        下一页
      </button>

      {/* 清除所有筛选 */}
      <button onClick={() => setSearchParams({})}>
        清除筛选
      </button>
    </div>
  )
}

// 完整示例：产品列表
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const products = [
    { id: 1, name: 'iPhone', category: 'electronics', price: 999 },
    { id: 2, name: 'MacBook', category: 'electronics', price: 1999 },
    { id: 3, name: 'T恤', category: 'clothing', price: 29 },
    { id: 4, name: '牛仔裤', category: 'clothing', price: 89 },
  ]

  // 获取筛选参数
  const categoryFilter = searchParams.get('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  // 筛选产品
  let filteredProducts = products

  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(
      p => p.category === categoryFilter
    )
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      p => p.price >= Number(minPrice)
    )
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      p => p.price <= Number(maxPrice)
    )
  }

  return (
    <div>
      <h2>产品列表</h2>

      {/* 筛选控件 */}
      <div className="filters">
        <select
          value={categoryFilter || ''}
          onChange={e => {
            const params = new URLSearchParams(searchParams)
            if (e.target.value) {
              params.set('category', e.target.value)
            } else {
              params.delete('category')
            }
            setSearchParams(params)
          }}
        >
          <option value="">全部分类</option>
          <option value="electronics">电子产品</option>
          <option value="clothing">服装</option>
        </select>

        <input
          type="number"
          placeholder="最低价格"
          value={minPrice || ''}
          onChange={e => {
            const params = new URLSearchParams(searchParams)
            if (e.target.value) {
              params.set('minPrice', e.target.value)
            } else {
              params.delete('minPrice')
            }
            setSearchParams(params)
          }}
        />

        <input
          type="number"
          placeholder="最高价格"
          value={maxPrice || ''}
          onChange={e => {
            const params = new URLSearchParams(searchParams)
            if (e.target.value) {
              params.set('maxPrice', e.target.value)
            } else {
              params.delete('maxPrice')
            }
            setSearchParams(params)
          }}
        />
      </div>

      {/* 产品列表 */}
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>
            <Link to={`/products/${product.id}?from=list`}>
              {product.name} - ${product.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### 路由状态（location.state）

```jsx
import { useLocation, Link } from 'react-router'

// 传递方
function PageA() {
  return (
    <Link
      to="/page-b"
      state={{ message: '来自页面A的问候', timestamp: Date.now() }}
    >
      跳转到页面B
    </Link>
  )
}

// 接收方
function PageB() {
  const location = useLocation()
  const state = location.state

  return (
    <div>
      <h1>页面B</h1>
      {state?.message && <p>收到的消息: {state.message}</p>}
      {state?.timestamp && <p>时间戳: {state.timestamp}</p>}
    </div>
  )
}

// 注意：从其他页面直接访问时（如刷新），state 可能为空
function SafePageB() {
  const location = useLocation()
  const state = location.state || {}

  return (
    <div>
      <h1>页面B</h1>
      <p>收到的消息: {state.message || '默认消息'}</p>
    </div>
  )
}
```

---

## 9.5 嵌套路由

### 基本嵌套路由

```jsx
// main.jsx
<Routes>
  <Route path="/" element={<App />}>
    {/* index 路由 - 默认显示的子路由 */}
    <Route index element={<Home />} />

    {/* 嵌套路由 */}
    <Route path="products" element={<ProductsLayout />}>
      <Route index element={<ProductsList />} />
      <Route path=":id" element={<ProductDetail />} />
      <Route path="new" element={<ProductForm />} />
      <Route path=":id/edit" element={<ProductForm />} />
    </Route>

    {/* 更多嵌套 */}
    <Route path="dashboard" element={<DashboardLayout />}>
      <Route index element={<DashboardHome />} />
      <Route path="settings" element={<DashboardSettings />} />
      <Route path="profile" element={<DashboardProfile />} />
    </Route>
  </Route>
</Routes>
```

### 完整示例：产品管理系统

```jsx
// pages/ProductsLayout.jsx
import { Outlet, Link, useLocation } from 'react-router'

function ProductsLayout() {
  const location = useLocation()
  const isNewPage = location.pathname.includes('/products/new')
  const isEditPage = location.pathname.includes('/edit')

  return (
    <div className="products-layout">
      <aside className="products-sidebar">
        <h3>产品管理</h3>
        <nav>
          <Link to="/products">产品列表</Link>
          <Link to="/products/new">添加产品</Link>
        </nav>
      </aside>

      <main className="products-main">
        {/* 显示当前位置 */}
        <div className="breadcrumb">
          当前位置: {isNewPage ? '添加产品' : isEditPage ? '编辑产品' : '产品列表'}
        </div>

        {/* 子路由渲染位置 */}
        <Outlet />
      </main>
    </div>
  )
}

// pages/ProductsList.jsx
import { Link, useSearchParams } from 'react-router'
import { useState } from 'react'

function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products] = useState([
    { id: 1, name: 'iPhone 15', price: 999, category: '手机' },
    { id: 2, name: 'MacBook Pro', price: 1999, category: '电脑' },
    { id: 3, name: 'iPad Air', price: 599, category: '平板' },
    { id: 4, name: 'AirPods Pro', price: 249, category: '耳机' },
  ])

  const category = searchParams.get('category')

  const filteredProducts = category
    ? products.filter(p => p.category === category)
    : products

  return (
    <div>
      <h2>产品列表</h2>

      {/* 分类筛选 */}
      <div className="filter-bar">
        <button
          onClick={() => setSearchParams({})}
          className={!category ? 'active' : ''}
        >
          全部
        </button>
        <button
          onClick={() => setSearchParams({ category: '手机' })}
          className={category === '手机' ? 'active' : ''}
        >
          手机
        </button>
        <button
          onClick={() => setSearchParams({ category: '电脑' })}
          className={category === '电脑' ? 'active' : ''}
        >
          电脑
        </button>
      </div>

      {/* 产品表格 */}
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>分类</th>
            <th>价格</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>
                <Link to={`/products/${product.id}`}>详情</Link>
                <Link to={`/products/${product.id}/edit`}>编辑</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// pages/ProductDetail.jsx
import { useParams, Link, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟 API 调用
    const fetchProduct = async () => {
      setLoading(true)
      // 模拟数据
      const mockData = {
        1: { id: 1, name: 'iPhone 15', price: 999, category: '手机', description: '最新款iPhone' },
        2: { id: 2, name: 'MacBook Pro', price: 1999, category: '电脑', description: '专业级笔记本' },
        3: { id: 3, name: 'iPad Air', price: 599, category: '平板', description: '轻薄便携' },
        4: { id: 4, name: 'AirPods Pro', price: 249, category: '耳机', description: '主动降噪' },
      }

      setTimeout(() => {
        setProduct(mockData[id] || null)
        setLoading(false)
      }, 300)
    }

    fetchProduct()
  }, [id])

  if (loading) return <div>加载中...</div>
  if (!product) return <div>产品不存在</div>

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p>分类: {product.category}</p>
      <p>价格: ${product.price}</p>
      <p>描述: {product.description}</p>

      <div className="actions">
        <Link to="/products">返回列表</Link>
        <Link to={`/products/${id}/edit`}>编辑</Link>
        <button onClick={() => {
          if (confirm('确定要删除吗？')) {
            navigate('/products')
          }
        }}>删除</button>
      </div>
    </div>
  )
}
```

---

## 9.6 编程式导航

### useNavigate Hook

```jsx
import { useNavigate } from 'react-router'

function LoginForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 模拟登录
    if (username && password) {
      // 登录成功，跳转到首页
      navigate('/')
      // 或者带状态
      navigate('/', { state: { message: '登录成功' } })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="用户名"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="密码"
      />
      <button type="submit">登录</button>
    </form>
  )
}

// 更多导航示例
function NavigationExamples() {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  const goBack = () => {
    navigate(-1) // -1 表示后退一页
  }

  const goForward = () => {
    navigate(1) // 前进一页
  }

  const replaceNavigate = () => {
    navigate('/target', { replace: true }) // 替换当前历史记录
  }

  return (
    <div>
      <button onClick={goHome}>首页</button>
      <button onClick={goBack}>后退</button>
      <button onClick={goForward}>前进</button>
      <button onClick={replaceNavigate}>替换导航</button>
    </div>
  )
}
```

### 完整示例：用户认证流程

```jsx
// components/ProtectedRoute.jsx - 路由守卫
import { Navigate, useLocation } from 'react-router'

function ProtectedRoute({ children, isAuthenticated }) {
  const location = useLocation()

  if (!isAuthenticated) {
    // 将用户重定向到登录页，并记录当前位置
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// pages/Login.jsx - 登录页
import { useNavigate, useLocation } from 'react-router'
import { useState } from 'react'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  // 获取来源页面（如果有）
  const from = location.state?.from?.pathname || '/dashboard'

  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 模拟登录请求
    setTimeout(() => {
      setLoading(false)
      // 登录成功后跳转到来源页面
      navigate(from, { replace: true })
    }, 1000)
  }

  return (
    <div className="login-page">
      <h2>登录</h2>
      <p>来自: {from}</p>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="用户名"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}

// 路由配置
function AppRoutes({ isAuthenticated }) {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* 公开路由 */}
        <Route path="login" element={<Login />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />

        {/* 受保护的路由 */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
```

---

## 9.7 路由守卫与权限控制

### 基于角色的权限控制

```jsx
// types.js
// 角色类型定义
const ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
}

// 权限配置
const PERMISSIONS = {
  [ROLES.GUEST]: ['view_home', 'view_products'],
  [ROLES.USER]: ['view_home', 'view_products', 'view_profile', 'edit_profile'],
  [ROLES.ADMIN]: ['*'], // 所有权限
}

// 检查权限
function hasPermission(role, permission) {
  if (role === ROLES.ADMIN) return true
  return PERMISSIONS[role]?.includes(permission) || false
}

// RoleRoute.jsx - 角色路由组件
import { Navigate } from 'react-router'

function RoleRoute({ children, requiredRole, currentRole }) {
  const roleHierarchy = {
    guest: 0,
    user: 1,
    admin: 2,
  }

  if (roleHierarchy[currentRole] < roleHierarchy[requiredRole]) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// AdminRoute.jsx - 管理员专用路由
import { Navigate } from 'react-router'

function AdminRoute({ children, userRole }) {
  if (userRole !== 'admin') {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
```

### 完整权限系统示例

```jsx
// AuthProvider.jsx - 认证提供者
import { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router'

const AuthContext = createContext(null)

// 模拟用户数据
const MOCK_USERS = {
  'admin': { id: 1, username: 'admin', role: 'admin', name: '管理员' },
  'user': { id: 2, username: 'user', role: 'user', name: '普通用户' },
  'guest': { id: 3, username: 'guest', role: 'guest', name: '访客' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = async (username) => {
    // 模拟 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS[username] || MOCK_USERS.guest
        setUser(foundUser)
        resolve(foundUser)
      }, 500)
    })
  }

  const logout = () => {
    setUser(null)
  }

  const hasRole = (role) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.role === role
  }

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true

    const rolePermissions = {
      guest: ['view_home', 'view_products', 'view_about'],
      user: ['view_home', 'view_products', 'view_about', 'view_profile', 'edit_profile', 'create_order'],
    }

    return rolePermissions[user.role]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// ProtectedRoute.jsx - 保护路由
import { Navigate, useLocation } from 'react-router'
import { useAuth } from './AuthProvider'

export function ProtectedRoute({ children, requiredRole, requiredPermission }) {
  const { user, hasRole, hasPermission } = useAuth()
  const location = useLocation()

  // 未登录
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 角色检查
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  // 权限检查
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// GuestRoute.jsx - 只允许未登录用户访问
import { Navigate, useLocation } from 'react-router'
import { useAuth } from './AuthProvider'

export function GuestRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (user) {
    // 已登录，跳转到首页或来源页
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return children
}

// 路由配置示例
function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />

        {/* 只允许访客访问 */}
        <Route
          path="login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* 受保护的路由 */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute requiredRole="user">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* 权限不足页面 */}
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
```

---

## 9.8 路由动画与过渡

### 使用 CSS 实现路由过渡

```jsx
// App.jsx
import { useLocation, Routes, Route } from 'react-router'
import { useState, useEffect } from 'react'

function App() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionState, setTransitionState] = useState('enter')

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionState('enter')
    }
  }, [location, displayLocation])

  const onTransitionEnd = () => {
    setDisplayLocation(location)
    setTransitionState('idle')
  }

  return (
    <div className="app" onTransitionEnd={onTransitionEnd}>
      <Routes location={displayLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </div>
  )
}
```

```css
/* index.css */
.app {
  position: relative;
}

/* 简单的淡入淡出效果 */
.app > * {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滑入滑出效果 */
.slide-enter {
  transform: translateX(100%);
}

.slide-enter-active {
  transform: translateX(0);
  transition: transform 0.3s ease-out;
}

.slide-exit {
  transform: translateX(0);
}

.slide-exit-active {
  transform: translateX(-100%);
  transition: transform 0.3s ease-in;
}
```

---

## 9.9 完整多页面应用示例

### 项目结构

```
src/
├── main.jsx               # 入口文件
├── App.jsx                # 主应用组件
├── pages/                 # 页面组件
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── Settings.jsx
│   ├── Cart.jsx
│   ├── NotFound.jsx
│   └── Unauthorized.jsx
├── components/            # 公共组件
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ProtectedRoute.jsx
│   └── GuestRoute.jsx
├── context/               # Context
│   └── AuthContext.jsx
└── styles/               # 样式文件
    └── index.css
```

### 完整代码实现

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

// App.jsx
import { Routes, Route, useRoutes } from 'react-router'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Cart from './pages/Cart.jsx'
import NotFound from './pages/NotFound.jsx'
import Unauthorized from './pages/Unauthorized.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'

function App() {
  const element = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'products', element: <Products /> },
        { path: 'products/:id', element: <ProductDetail /> },
        {
          path: 'login',
          element: (
            <GuestRoute>
              <Login />
            </GuestRoute>
          )
        },
        {
          path: 'register',
          element: (
            <GuestRoute>
              <Register />
            </GuestRoute>
          )
        },
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute requiredRole="user">
              <Dashboard />
            </ProtectedRoute>
          )
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute requiredRole="user">
              <Profile />
            </ProtectedRoute>
          )
        },
        {
          path: 'settings',
          element: (
            <ProtectedRoute requiredRole="admin">
              <Settings />
            </ProtectedRoute>
          )
        },
        {
          path: 'cart',
          element: (
            <ProtectedRoute requiredRole="user">
              <Cart />
            </ProtectedRoute>
          )
        },
        { path: 'unauthorized', element: <Unauthorized /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ])

  return element
}

export default App

// components/Layout.jsx
import { Outlet } from 'react-router'
import Navbar from './Navbar.jsx'

function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2025 React 商店 - All rights reserved</p>
      </footer>
    </div>
  )
}

export default Layout

// components/Navbar.jsx
import { Link, NavLink } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">React 商店</Link>
      </div>

      <ul className="navbar-menu">
        <li>
          <NavLink to="/" end>首页</NavLink>
        </li>
        <li>
          <NavLink to="/products">产品</NavLink>
        </li>
        <li>
          <NavLink to="/about">关于</NavLink>
        </li>

        {user ? (
          <>
            <li>
              <NavLink to="/cart">购物车</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard">控制台</NavLink>
            </li>
            <li>
              <NavLink to="/profile">个人资料</NavLink>
            </li>
            {user.role === 'admin' && (
              <li>
                <NavLink to="/settings">设置</NavLink>
              </li>
            )}
            <li>
              <button onClick={logout} className="btn-logout">
                退出
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">登录</NavLink>
            </li>
            <li>
              <NavLink to="/register">注册</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar

// pages/Home.jsx
import { Link } from 'react-router'

function Home() {
  const featuredProducts = [
    { id: 1, name: 'iPhone 15', price: 999, image: '📱' },
    { id: 2, name: 'MacBook Pro', price: 1999, image: '💻' },
    { id: 3, name: 'iPad Air', price: 599, image: '📱' },
  ]

  return (
    <div className="home-page">
      <section className="hero">
        <h1>欢迎来到 React 商店</h1>
        <p>精选优质产品，极致购物体验</p>
        <Link to="/products" className="btn-primary">
          立即选购
        </Link>
      </section>

      <section className="featured">
        <h2>热门产品</h2>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <Link to={`/products/${product.id}`} className="btn-secondary">
                查看详情
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>快速配送</h3>
          <p>全场包邮，极速发货</p>
        </div>
        <div className="feature">
          <h3>正品保证</h3>
          <p>100%正品，假一赔十</p>
        </div>
        <div className="feature">
          <h3>7天无理由</h3>
          <p>无忧退货，售后保障</p>
        </div>
      </section>
    </div>
  )
}

export default Home

// pages/Products.jsx
import { Link, useSearchParams } from 'react-router'
import { useState } from 'react'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products] = useState([
    { id: 1, name: 'iPhone 15', price: 999, category: '手机', image: '📱' },
    { id: 2, name: 'iPhone 15 Pro', price: 1199, category: '手机', image: '📱' },
    { id: 3, name: 'MacBook Pro 14"', price: 1999, category: '电脑', image: '💻' },
    { id: 4, name: 'MacBook Air', price: 1099, category: '电脑', image: '💻' },
    { id: 5, name: 'iPad Pro', price: 999, category: '平板', image: '📱' },
    { id: 6, name: 'iPad Air', price: 599, category: '平板', image: '📱' },
    { id: 7, name: 'AirPods Pro', price: 249, category: '耳机', image: '🎧' },
    { id: 8, name: 'AirPods Max', price: 549, category: '耳机', image: '🎧' },
  ])

  const category = searchParams.get('category')
  const sort = searchParams.get('sort')

  // 筛选
  let filteredProducts = category
    ? products.filter(p => p.category === category)
    : products

  // 排序
  if (sort === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
  } else if (sort === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
  } else if (sort === 'name') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <div className="products-page">
      <h1>产品列表</h1>

      <div className="filters">
        <div className="filter-group">
          <label>分类:</label>
          <select
            value={category || ''}
            onChange={e => {
              const params = new URLSearchParams(searchParams)
              if (e.target.value) {
                params.set('category', e.target.value)
              } else {
                params.delete('category')
              }
              setSearchParams(params)
            }}
          >
            <option value="">全部分类</option>
            <option value="手机">手机</option>
            <option value="电脑">电脑</option>
            <option value="平板">平板</option>
            <option value="耳机">耳机</option>
          </select>
        </div>

        <div className="filter-group">
          <label>排序:</label>
          <select
            value={sort || ''}
            onChange={e => {
              const params = new URLSearchParams(searchParams)
              if (e.target.value) {
                params.set('sort', e.target.value)
              } else {
                params.delete('sort')
              }
              setSearchParams(params)
            }}
          >
            <option value="">默认</option>
            <option value="name">名称</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <h3>{product.name}</h3>
            <p className="category">{product.category}</p>
            <p className="price">${product.price}</p>
            <Link to={`/products/${product.id}`} className="btn-primary">
              查看详情
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products

// pages/ProductDetail.jsx
import { useParams, Link, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    // 模拟 API
    const mockProducts = {
      1: { id: 1, name: 'iPhone 15', price: 999, category: '手机', description: '最新款 iPhone，A17 芯片，强大性能', image: '📱' },
      2: { id: 2, name: 'iPhone 15 Pro', price: 1199, category: '手机', description: 'Pro 级配置，钛金属设计', image: '📱' },
      3: { id: 3, name: 'MacBook Pro 14"', price: 1999, category: '电脑', description: 'M3 Pro 芯片，专业级性能', image: '💻' },
    }

    setTimeout(() => {
      setProduct(mockProducts[id] || null)
      setLoading(false)
    }, 300)
  }, [id])

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) return <div className="loading">加载中...</div>
  if (!product) return <div className="error">产品不存在</div>

  return (
    <div className="product-detail-page">
      <div className="breadcrumb">
        <Link to="/products">产品列表</Link> &gt; {product.category} &gt; {product.name}
      </div>

      <div className="product-detail">
        <div className="product-image-large">{product.image}</div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>

          <div className="actions">
            <button
              className={`btn-primary ${addedToCart ? 'success' : ''}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? '已加入购物车' : '加入购物车'}
            </button>
            <button className="btn-secondary" onClick={() => navigate(-1)}>
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

// pages/Dashboard.jsx
import { Link, Outlet, useLocation } from 'react-router'

function Dashboard() {
  const location = useLocation()

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <h3>控制台</h3>
        <nav>
          <Link
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            概览
          </Link>
          <Link
            to="/dashboard/orders"
            className={location.pathname.includes('/orders') ? 'active' : ''}
          >
            我的订单
          </Link>
          <Link
            to="/dashboard/favorites"
            className={location.pathname.includes('/favorites') ? 'active' : ''}
          >
            收藏夹
          </Link>
          <Link
            to="/dashboard/addresses"
            className={location.pathname.includes('/addresses') ? 'active' : ''}
          >
            地址管理
          </Link>
        </nav>
      </aside>

      <main className="dashboard-content">
        <h2>欢迎回来！</h2>
        <div className="stats">
          <div className="stat-card">
            <h4>订单数</h4>
            <p className="stat-value">12</p>
          </div>
          <div className="stat-card">
            <h4>收藏数</h4>
            <p className="stat-value">8</p>
          </div>
          <div className="stat-card">
            <h4>优惠券</h4>
            <p className="stat-value">3</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
```

### 样式文件

```css
/* styles/index.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  align-items: center;
}

.navbar-menu a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.navbar-menu a:hover,
.navbar-menu a.active {
  color: #1890ff;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Footer */
.footer {
  padding: 1.5rem;
  text-align: center;
  background: #f5f5f5;
  color: #666;
}

/* Buttons */
.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #1890ff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #d9d9d9;
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.product-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: box-shadow 0.3s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-image {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.product-card h3 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.category {
  color: #999;
  font-size: 0.9rem;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #ff4d4f;
  margin: 0.5rem 0;
}

/* Filters */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

/* Dashboard */
.dashboard-page {
  display: flex;
  gap: 2rem;
}

.dashboard-sidebar {
  width: 200px;
  flex-shrink: 0;
}

.dashboard-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dashboard-sidebar a {
  padding: 0.75rem 1rem;
  color: #666;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s;
}

.dashboard-sidebar a:hover,
.dashboard-sidebar a.active {
  background: #e6f7ff;
  color: #1890ff;
}

.dashboard-content {
  flex: 1;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1890ff;
  margin-top: 0.5rem;
}

/* Product Detail */
.product-detail-page {
  padding: 1rem 0;
}

.breadcrumb {
  margin-bottom: 1.5rem;
  color: #999;
}

.breadcrumb a {
  color: #1890ff;
  text-decoration: none;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.product-image-large {
  font-size: 8rem;
  text-align: center;
}

.product-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.product-info .description {
  margin: 1rem 0;
  color: #666;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.success {
  background: #52c41a !important;
}
```

---

## 9.10 本章小结

本章学习了：
1. **React Router 7 基础**：安装、三种模式（传统、数据、框架）
2. **路由配置**：BrowserRouter、Routes、Route 组件
3. **导航组件**：Link、NavLink、Navigate、Outlet
4. **路由参数**：动态路由参数（:id）、查询参数（useSearchParams）、路由状态（location.state）
5. **嵌套路由**：父子路由结构、Layout 组件
6. **编程式导航**：useNavigate Hook、导航方法
7. **路由守卫**：ProtectedRoute、GuestRoute、基于角色的权限控制
8. **完整多页面应用**：电商网站示例，涵盖产品列表、详情、用户中心等

---

## 练习题

1. **基础路由**：创建包含首页、关于、联系页面的应用
2. **动态路由**：创建博客系统，支持文章列表和详情页
3. **查询参数**：创建可筛选、可排序的产品列表
4. **路由守卫**：实现登录验证和权限控制
5. **完整项目**：创建电商后台管理系统，包含仪表盘、订单管理、商品管理

---

## 下章预告

下一章我们将学习 React DOM 相关内容：
- React DOM 渲染原理
- Portals 传送门
- 虚拟 DOM 与 Diff 算法
- 性能优化技巧
- 服务端渲染 (SSR) 基础
