/**
 * React Router 7 编程式导航示例
 * ==========================================
 * 本文件展示如何在React Router 7中使用编程式导航
 *
 * 编程式导航允许你通过JavaScript代码来控制页面跳转
 * 常见场景：表单提交后跳转、权限验证后跳转、倒计时跳转等
 *
 * 主要API:
 * - useNavigate: 返回导航函数
 * - useLocation: 返回当前location对象
 */

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router';

/**
 * ========================================
 * 1. 基础导航组件
 * ========================================
 */

/**
 * 首页 - 展示各种导航方式的入口
 */
function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>编程式导航演示</h1>
      <p>以下示例展示不同的导航方式</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <Link to="/basic-navigation" style={linkStyle}>基础导航示例</Link>
        <Link to="/form-submit" style={linkStyle}>表单提交后跳转</Link>
        <Link to="/auth-redirect" style={linkStyle}>权限验证跳转</Link>
        <Link to="/countdown" style={linkStyle}>倒计时自动跳转</Link>
        <Link to="/deep-linking" style={linkStyle}>带参数的跳转</Link>
      </div>
    </div>
  );
}

/**
 * 基础导航示例
 * 展示useNavigate的基本用法
 */
function BasicNavigation() {
  // useNavigate: React Router 7的核心Hook
  // 返回一个导航函数，可以接受以下参数:
  // - 字符串: 目标路径
  // - 对象: { pathname, search, hash, state }
  // - 数字: 前进或后退（类似history.go()）
  const navigate = useNavigate();

  // useLocation: 返回当前URL的信息
  // 包含: pathname, search, hash, state
  const location = useLocation();

  // 简单的页面跳转
  const goToAbout = () => {
    navigate('/about');
  };

  // 带查询参数的跳转
  const goToProducts = () => {
    navigate('/products?category=手机&sort=price');
  };

  // 带状态的跳转（类似Vue的router.push with query）
  const goWithState = () => {
    navigate('/about', {
      // state: 传递的数据，会被存储在location.state中
      // 刷新页面后仍然可以使用（React Router 7特性）
      state: { from: 'basic-navigation', message: '你好，这是传递的状态数据' },
      // replace: true 会替换当前历史记录，而不是添加新记录
      // 作用：防止用户点击返回按钮回到跳转前的页面
      replace: false
    });
  };

  // 历史记录操作（类似浏览器的前进后退）
  const goBack = () => navigate(-1);  // 后退一页
  const goForward = () => navigate(1); // 前进一页
  const goHome = () => navigate('/');  // 回到首页

  return (
    <div style={{ padding: '20px' }}>
      <h2>基础导航示例</h2>

      {/* 当前location信息 */}
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4>当前Location信息:</h4>
        <pre style={{ margin: '10px 0', background: '#2c3e50', color: '#ecf0f1', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(location, null, 2)}
        </pre>
      </div>

      {/* 导航按钮 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={goToAbout} style={buttonStyle}>跳转到关于页面</button>
        <button onClick={goToProducts} style={buttonStyle}>跳转到产品页（带查询参数）</button>
        <button onClick={goWithState} style={buttonStyle}>带状态跳转到关于页面</button>
        <button onClick={goBack} style={buttonStyle}>← 后退</button>
        <button onClick={goForward} style={buttonStyle}>前进 →</button>
        <button onClick={goHome} style={buttonStyle}>回到首页</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/">← 返回首页</Link>
      </div>
    </div>
  );
}

/**
 * 关于页面 - 展示如何接收跳转时传递的状态
 */
function About() {
  const location = useLocation();
  const navigate = useNavigate();

  // 接收上一个页面传递的状态
  const from = location.state?.from || '未知';
  const message = location.state?.message || '没有传递消息';

  return (
    <div style={{ padding: '20px' }}>
      <h2>关于页面</h2>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3>跳转来源: {from}</h3>
        <p>传递的消息: {message}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate(-1)} style={buttonStyle}>
          ← 返回上一页
        </button>
      </div>
    </div>
  );
}

/**
 * ========================================
 * 2. 表单提交后跳转示例
 * ========================================
 */

/**
 * 登录表单组件
 * 展示表单提交后的编程式跳转
 */
function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // 模拟表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);

    // 登录成功后的编程式导航
    // 跳转到首页，并替换历史记录（防止用户返回到登录页）
    navigate('/', {
      replace: true,
      state: { isLoggedIn: true, username: formData.username }
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>登录表单</h2>

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>用户名:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>密码:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            background: isLoading ? '#bdc3c7' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}

/**
 * ========================================
 * 3. 权限验证后跳转示例
 * ========================================
 */

/**
 * 需要权限的页面
 */
function ProtectedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 模拟检查用户是否有权限
  const isAuthenticated = location.state?.isAuthenticated || false;

  if (!isAuthenticated) {
    // 如果没有权限，重定向到登录页
    // 使用Navigate组件进行重定向
    // state中保存原始请求的路径，登录后可以返回
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>受保护的页面</h2>
      <p>只有登录用户才能访问此页面</p>

      <button onClick={() => navigate(-1)} style={buttonStyle}>
        返回
      </button>
    </div>
  );
}

/**
 * ========================================
 * 4. 倒计时自动跳转示例
 * ========================================
 */

/**
 * 成功页面 - 倒计时后自动跳转
 */
function SuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 倒计时逻辑
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/'); // 倒计时结束，跳转到首页
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 清理定时器
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#2ecc71' }}>操作成功！</h2>
      <p>将在 {countdown} 秒后自动跳转到首页...</p>

      <button
        onClick={() => navigate('/')}
        style={{ ...buttonStyle, marginTop: '20px' }}
      >
        立即返回
      </button>
    </div>
  );
}

/**
 * ========================================
 * 5. 深度链接示例
 * ========================================
 */

/**
 * 产品详情页 - 展示如何组合使用导航功能
 */
function ProductDetail() {
  const navigate = useNavigate();
  const [product] = useState({ id: 1, name: 'iPhone 15 Pro', price: 7999 });

  const handleBuy = () => {
    // 模拟购买流程
    // 跳转时带查询参数
    navigate('/checkout', {
      state: { product },
      search: '?quantity=1'
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{product.name}</h2>
      <p>价格: ¥{product.price}</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={handleBuy} style={{ ...buttonStyle, background: '#2ecc71' }}>
          立即购买
        </button>
        <button onClick={() => navigate(-1)} style={buttonStyle}>
          返回
        </button>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>确认订单</h2>
      <p>产品: {product.name}</p>
      <p>价格: ¥{product.price}</p>

      <button onClick={() => navigate('/success')} style={{ ...buttonStyle, background: '#2ecc71' }}>
        确认支付
      </button>
    </div>
  );
}

/**
 * ========================================
 * 6. 路由配置
 * ========================================
 */
function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#ecf0f1', minHeight: '100vh' }}>
        <nav style={{ background: '#2c3e50', padding: '15px 20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>首页</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/basic-navigation" element={<BasicNavigation />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<ProductDetail />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/auth-redirect" element={<ProtectedPage />} />
          <Route path="/countdown" element={<SuccessPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/deep-linking" element={<ProductDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

/**
 * ========================================
 * 7. 样式定义
 * ========================================
 */
const linkStyle = {
  display: 'inline-block',
  padding: '12px 20px',
  background: 'white',
  color: '#3498db',
  textDecoration: 'none',
  borderRadius: '6px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const buttonStyle = {
  padding: '10px 20px',
  background: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '10px',
  marginBottom: '10px'
};

/**
 * ========================================
 * 8. 核心概念总结
 * ========================================
 *
 * 1) useNavigate Hook:
 *    - 返回导航函数 navigate(to, options)
 *    - to: 字符串路径 或 对象 { pathname, search, hash, state }
 *    - options.replace: 是否替换历史记录
 *    - options.state: 传递的状态数据
 *
 * 2) useLocation Hook:
 *    - 返回当前location对象
 *    - location.pathname: 当前路径
 *    - location.search: 查询参数
 *    - location.state: 传递的状态数据
 *
 * 3) Navigate组件:
 *    - 编程式重定向
 *    - to: 重定向目标
 *    - replace: 是否替换历史
 *    - state: 传递状态
 *
 * 4) 导航函数参数:
 *    ┌─────────────────────────────────────────┐
 *    │  字符串: navigate('/about')             │
 *    │         跳转到指定路径                   │
 *    ├─────────────────────────────────────────┤
 *    │  数字: navigate(-1) / navigate(1)       │
 *    │       后退/前进                          │
 *    ├─────────────────────────────────────────┤
 *    │  对象: navigate({                        │
 *    │         pathname: '/about',             │
 *    │         search: '?id=1',                │
 *    │         hash: '#section',               │
 *    │         state: { data: 'xxx' }          │
 *    │       })                                 │
 *    └─────────────────────────────────────────┘
 *
 * 5) 实际应用场景:
 *    - 表单提交后跳转
 *    - 权限验证失败重定向
 *    - 购物车结算流程
 *    - 支付完成后跳转
 *    - 倒计时自动跳转
 *    - 错误页面自动返回
 *
 * ========================================
 */
