/**
 * React Router 7 路由守卫与权限控制示例
 * ==========================================
 * 本文件展示如何在React Router 7中实现路由守卫和权限控制
 *
 * 路由守卫（Route Guards）用于：
 * - 保护私有路由（需要登录才能访问）
 * - 权限控制（不同用户看到不同的菜单）
 * - 角色验证（管理员vs普通用户）
 * - 加载状态管理
 *
 * 实现方式：
 * 1. 使用Outlet的children render props（React Router 6.4+）
 * 2. 使用高阶组件包装
 * 3. 使用Navigate组件进行重定向
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate, useLocation, useNavigate } from 'react-router';

/**
 * ========================================
 * 1. 认证上下文 - 管理全局登录状态
 * ========================================
 */

// 创建认证上下文
const AuthContext = createContext(null);

/**
 * 认证Provider组件
 * 提供认证相关的状态和方法
 */
function AuthProvider({ children }) {
  // 模拟用户状态（实际应用中从localStorage或API获取）
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟初始化检查（检查localStorage等）
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // 登录方法
  const login = (username, role = 'user') => {
    const newUser = { name: username, role };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // 登出方法
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 检查是否有特定权限
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    if (requiredRole === 'user') return true; // 登录用户都有基本权限
    return user.role === requiredRole;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义Hook：使用认证上下文
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
}

/**
 * ========================================
 * 2. 路由守卫组件
 * ========================================
 */

/**
 * RequireAuth: 需要登录的路由守卫
 * 如果用户未登录，重定向到登录页
 */
function RequireAuth({ children, requiredRole }) {
  const { user, isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  // 加载中，显示loading
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px' }}>加载中...</div>
      </div>
    );
  }

  // 未登录，重定向到登录页
  if (!isAuthenticated) {
    // 保存原始请求的路径，登录后可以返回
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 需要特定权限但用户不满足
  if (requiredRole && !hasPermission(requiredRole)) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>权限不足</h2>
        <p>您没有权限访问此页面</p>
        <Link to="/">返回首页</Link>
      </div>
    );
  }

  // 通过验证，渲染子组件
  return children;
}

/**
 * RequireGuest: 访客路由守卫
 * 如果用户已登录，重定向到首页
 * 用于登录页、注册页等
 */
function RequireGuest({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>加载中...</div>;
  }

  if (isAuthenticated) {
    // 重定向到首页或之前尝试访问的页面
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return children;
}

/**
 * AdminRoute: 管理员专用路由
 */
function AdminRoute({ children }) {
  return (
    <RequireAuth requiredRole="admin">
      {children}
    </RequireAuth>
  );
}

/**
 * ========================================
 * 3. 布局组件
 * ========================================
 */

/**
 * 主布局 - 带顶部导航栏
 */
function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 */}
      <header style={{
        background: '#2c3e50',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
            React Router 7 权限演示
          </Link>
        </div>

        <nav>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#ecf0f1' }}>
                欢迎, {user?.name}
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  background: user?.role === 'admin' ? '#e74c3c' : '#3498db',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {user?.role === 'admin' ? '管理员' : '普通用户'}
                </span>
              </span>
              <Link to="/profile" style={navLinkStyle}>个人资料</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" style={navLinkStyle}>管理后台</Link>
              )}
              <button onClick={logout} style={logoutButtonStyle}>退出</button>
            </div>
          ) : (
            <div>
              <Link to="/login" style={navLinkStyle}>登录</Link>
              <Link to="/register" style={navLinkStyle}>注册</Link>
            </div>
          )}
        </nav>
      </header>

      {/* 主内容区域 */}
      <main style={{ flex: 1, padding: '20px', background: '#ecf0f1' }}>
        <Outlet />
      </main>

      {/* 底部 */}
      <footer style={{
        background: '#34495e',
        color: 'white',
        padding: '15px',
        textAlign: 'center'
      }}>
        React Router 7 路由守卫示例
      </footer>
    </div>
  );
}

/**
 * ========================================
 * 4. 页面组件
 * ========================================
 */

// 首页
function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>欢迎来到首页</h1>
      <p>这是公开页面，所有人都可以访问</p>

      <div style={{ marginTop: '30px' }}>
        <h3>功能演示：</h3>
        <ul style={{ lineHeight: '2' }}>
          <li><Link to="/public">公开页面</Link> - 无需登录即可访问</li>
          <li><Link to="/profile">个人资料</Link> - 需要登录才能访问</li>
          <li><Link to="/admin">管理后台</Link> - 仅管理员可访问</li>
          <li><Link to="/settings">设置页面</Link> - 需要登录才能访问</li>
        </ul>
      </div>
    </div>
  );
}

// 公开页面
function PublicPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>公开页面</h2>
      <p>这是一个公开页面，不需要登录即可访问</p>
    </div>
  );
}

// 登录页面
function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 如果已登录，重定向到首页
  if (isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  const handleLogin = (role) => {
    login(role === 'admin' ? 'Admin User' : 'Regular User', role);
    // 登录成功后跳转到原来请求的页面
    const from = location.state?.from || '/';
    navigate(from, { replace: true });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>登录</h2>
      <p>选择用户类型进行演示：</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <button onClick={() => handleLogin('user')} style={loginButtonStyle}>
          登录为普通用户
        </button>
        <button onClick={() => handleLogin('admin')} style={{ ...loginButtonStyle, background: '#e74c3c' }}>
          登录为管理员
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h4>提示：</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>普通用户可以访问个人资料和设置</li>
          <li>管理员可以额外访问管理后台</li>
          <li>登录信息保存在localStorage中</li>
          <li>刷新页面后登录状态会保持</li>
        </ul>
      </div>
    </div>
  );
}

// 注册页面
function RegisterPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>注册页面</h2>
      <p>这是一个受保护的注册页面，需要GuestRoute守卫</p>
      <p>如果已登录，将被重定向到首页</p>
    </div>
  );
}

// 个人资料页 - 需要登录
function ProfilePage() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h2>个人资料</h2>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <p><strong>用户名:</strong> {user?.name}</p>
        <p><strong>角色:</strong> {user?.role}</p>
        <p><strong>状态:</strong> 已登录</p>
      </div>
    </div>
  );
}

// 设置页 - 需要登录
function SettingsPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>系统设置</h2>
      <p>这是一个需要登录的设置页面</p>
    </div>
  );
}

// 管理后台 - 仅管理员
function AdminPage() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h2>管理后台</h2>
      <p>欢迎管理员 {user?.name}</p>

      <div style={{ marginTop: '30px' }}>
        <h3>管理功能：</h3>
        <ul style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <li>用户管理</li>
          <li>内容管理</li>
          <li>系统配置</li>
          <li>数据统计</li>
        </ul>
      </div>
    </div>
  );
}

// 404页面
function NotFoundPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>404 - 页面未找到</h2>
      <Link to="/">返回首页</Link>
    </div>
  );
}

/**
 * ========================================
 * 5. 路由配置 - 应用路由守卫
 * ========================================
 *
 * 路由层级结构:
 *
 * MainLayout (主布局)
 * ├── /public (公开)
 * ├── /login (访客专属)
 * ├── /register (访客专属)
 * ├── /profile (需要认证)
 * ├── /settings (需要认证)
 * └── /admin (仅管理员)
 *     └── AdminRoute (管理员守卫)
 *
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 使用MainLayout作为父路由 */}
          <Route element={<MainLayout />}>
            {/* 公开路由 - 所有人可访问 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/public" element={<PublicPage />} />

            {/* 访客专属路由 - 已登录用户会被重定向 */}
            <Route
              path="/login"
              element={
                <RequireGuest>
                  <LoginPage />
                </RequireGuest>
              }
            />
            <Route
              path="/register"
              element={
                <RequireGuest>
                  <RegisterPage />
                </RequireGuest>
              }
            />

            {/* 需要登录的路由 */}
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <SettingsPage />
                </RequireAuth>
              }
            />

            {/* 仅管理员可访问 */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* 404页面 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

/**
 * ========================================
 * 6. 样式定义
 * ========================================
 */
const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  marginLeft: '15px',
  padding: '8px 15px',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '4px'
};

const logoutButtonStyle = {
  marginLeft: '15px',
  padding: '8px 15px',
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const loginButtonStyle = {
  padding: '15px',
  background: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px'
};

/**
 * ========================================
 * 7. 核心概念总结
 * ========================================
 *
 * 1) 路由守卫实现原理:
 *    ┌─────────────────────────────────────────┐
 *    │  路由匹配流程:                           │
 *    │                                          │
 *    │  URL变化                                 │
 *    │    │                                    │
 *    │    ▼                                    │
 *    │  Route组件渲染                           │
 *    │    │                                    │
 *    │    ▼                                    │
 *    │  守卫组件检查                            │
 *    │    │                                    │
 *    │    ├─ 通过 → 渲染目标组件                │
 *    │    └─ 不通过 → Navigate重定向            │
 *    └─────────────────────────────────────────┘
 *
 * 2) 守卫组件类型:
 *    - RequireAuth: 需要登录
 *    - RequireGuest: 访客专用（未登录）
 *    - AdminRoute: 管理员专用
 *    - 自定义守卫: 根据业务需求定制
 *
 * 3) 状态管理:
 *    - AuthContext: 全局认证状态
 *    - localStorage: 持久化登录状态
 *    - useAuth Hook: 方便访问认证状态
 *
 * 4) 重定向时的状态传递:
 *    - Navigate的state属性传递原始路径
 *    - 登录后可以正确跳回用户想访问的页面
 *    - 提升用户体验
 *
 * 5) 路由配置最佳实践:
 *    - 公开路由放在前面
 *    - 受保护路由使用守卫包装
 *    - 使用嵌套路由共享布局
 *    - 404路由放在最后
 *
 * 6) 实际应用场景:
 *    - 登录后才能访问的页面
 *    - 管理员才能访问的后台
 *    - 会员专属内容
 *    - 角色权限控制
 *    - 登录页注册页（未登录访问时重定向）
 *
 * ========================================
 */
