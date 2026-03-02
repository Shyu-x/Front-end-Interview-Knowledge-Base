/**
 * React Router 7 完整多页面应用示例
 * ==========================================
 * 本文件是一个综合性的示例，展示了React Router 7的各种功能
 *
 * 涵盖的功能点:
 * 1. 基础路由配置
 * 2. 嵌套路由与Layout
 * 3. 动态路由参数
 * 4. 查询参数与筛选
 * 5. 编程式导航
 * 6. 路由守卫与权限控制
 * 7. 路由动画过渡
 * 8. 错误边界处理
 */

import React, { createContext, useContext, useState, useEffect, Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  Outlet
} from 'react-router';

/**
 * ========================================
 * 1. 模拟数据和工具
 * ========================================
 */

// 产品数据
const productsData = [
  { id: 1, name: 'iPhone 15 Pro', price: 7999, category: '手机', brand: 'Apple', image: '📱', description: '最新款iPhone，A17 Pro芯片' },
  { id: 2, name: 'MacBook Pro 14寸', price: 14999, category: '电脑', brand: 'Apple', image: '💻', description: 'M3 Pro芯片，专业级笔记本' },
  { id: 3, name: 'iPad Pro 12.9寸', price: 9299, category: '平板', brand: 'Apple', image: '📲', description: 'M2芯片，Liquid视网膜XDR' },
  { id: 4, name: 'Samsung S24 Ultra', price: 9999, category: '手机', brand: 'Samsung', image: '📱', description: 'Galaxy AI旗舰手机' },
  { id: 5, name: 'Xiaomi 14 Pro', price: 4999, category: '手机', brand: 'Xiaomi', image: '📱', description: '骁龙8 Gen 3处理器' },
  { id: 6, name: 'Sony WH-1000XM5', price: 2699, category: '耳机', brand: 'Sony', image: '🎧', description: '业界领先降噪耳机' },
];

// 文章数据
const articlesData = [
  { id: 1, title: 'React 19 新特性详解', author: '张三', date: '2024-01-15', category: 'React', content: 'React 19引入了很多新特性，包括Actions、use()等...' },
  { id: 2, title: 'React Router 7 完全指南', author: '李四', date: '2024-01-20', category: 'Router', content: 'React Router 7带来了革命性的变化，基于数据API...' },
  { id: 3, title: 'TypeScript 5.3 最佳实践', author: '王五', date: '2024-01-25', category: 'TypeScript', content: 'TypeScript 5.3带来了很多改进...' },
];

// 分类数据
const categoriesData = ['手机', '电脑', '平板', '耳机'];

/**
 * ========================================
 * 2. 认证系统
 * ========================================
 */

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('demo_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (username) => {
    const newUser = { name: username, cart: [] };
    setUser(newUser);
    localStorage.setItem('demo_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  const addToCart = (product) => {
    const updated = { ...user, cart: [...(user?.cart || []), product] };
    setUser(updated);
    localStorage.setItem('demo_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addToCart, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

/**
 * ========================================
 * 3. 路由守卫组件
 * ========================================
 */

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function RequireGuest({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * ========================================
 * 4. 布局组件
 * ========================================
 */

/**
 * 主应用布局
 */
function AppLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航栏 */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
            🛒 科技商城
          </Link>

          <nav style={{ display: 'flex', gap: '20px' }}>
            <NavLink to="/">首页</NavLink>
            <NavLink to="/products">商品</NavLink>
            <NavLink to="/articles">文章</NavLink>
            {isAuthenticated && <NavLink to="/cart">购物车</NavLink>}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: 'white' }}>
                欢迎, {user?.name}
                {user?.cart?.length > 0 && (
                  <span style={{
                    marginLeft: '8px',
                    padding: '2px 8px',
                    background: '#e74c3c',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}>
                    {user.cart.length}
                  </span>
                )}
              </span>
              <Link to="/profile" style={buttonStyle}>个人中心</Link>
              <button onClick={logout} style={logoutButtonStyle}>退出</button>
            </>
          ) : (
            <>
              <Link to="/login" style={buttonStyle}>登录</Link>
              <Link to="/register" style={{ ...buttonStyle, background: 'rgba(255,255,255,0.2)' }}>注册</Link>
            </>
          )}
        </div>
      </header>

      {/* 主要内容区域 */}
      <main style={{ flex: 1, background: '#f5f7fa' }}>
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer style={{
        background: '#2c3e50',
        color: 'white',
        padding: '30px',
        textAlign: 'center'
      }}>
        <p>&copy; 2024 科技商城 - React Router 7 演示项目</p>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#bdc3c7' }}>
          当前路由: {location.pathname}
        </div>
      </footer>
    </div>
  );
}

/**
 * 商店布局 - 带侧边栏
 */
function ShopLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';

  const handleCategoryChange = (newCategory) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    setSearchParams(params);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 200px)' }}>
      {/* 侧边栏 */}
      <aside style={{
        width: '200px',
        background: 'white',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ marginBottom: '15px' }}>商品分类</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <CategoryButton
            active={category === 'all'}
            onClick={() => handleCategoryChange('all')}
          >
            全部商品
          </CategoryButton>
          {categoriesData.map(cat => (
            <CategoryButton
              key={cat}
              active={category === cat}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </CategoryButton>
          ))}
        </div>
      </aside>

      {/* 主内容 */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}

/**
 * ========================================
 * 5. 页面组件
 * ========================================
 */

/**
 * 首页
 */
function HomePage() {
  const navigate = useNavigate();

  const featuredProducts = productsData.slice(0, 3);

  return (
    <div>
      {/* 英雄区域 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 30px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px' }}>欢迎来到科技商城</h1>
        <p style={{ fontSize: '20px', margin: '0 0 30px' }}>精选数码产品，尽在掌握</p>
        <button onClick={() => navigate('/products')} style={primaryButtonStyle}>
          立即购物
        </button>
      </div>

      {/* 精选商品 */}
      <div style={{ padding: '40px 30px' }}>
        <h2 style={{ marginBottom: '30px' }}>精选商品</h2>
        <div style={gridStyle}>
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 商品列表页
 */
function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  const filteredProducts = productsData.filter(p => {
    const matchCategory = category === 'all' || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSearch = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>
          {category === 'all' ? '全部商品' : category}
          <span style={{ fontSize: '16px', color: '#7f8c8d', marginLeft: '10px' }}>
            ({filteredProducts.length} 件)
          </span>
        </h2>
        <input
          type="text"
          placeholder="搜索商品..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div style={gridStyle}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} showAddToCart />
          ))}
        </div>
      ) : (
        <EmptyState message="没有找到相关商品" />
      )}
    </div>
  );
}

/**
 * 商品详情页
 */
function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useAuth();

  const product = productsData.find(p => p.id === parseInt(id));

  if (!product) {
    return <EmptyState message="商品不存在" action={{ label: '返回商品列表', onClick: () => navigate('/products') }} />;
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    addToCart(product);
    alert(`已将 ${product.name} 加入购物车！`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>
        ← 返回
      </button>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginTop: '20px',
        display: 'flex',
        gap: '40px'
      }}>
        <div style={{ fontSize: '120px' }}>{product.image}</div>

        <div style={{ flex: 1 }}>
          <span style={badgeStyle}>{product.category}</span>
          <h1 style={{ margin: '15px 0' }}>{product.name}</h1>
          <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>{product.description}</p>
          <p style={{ fontSize: '32px', color: '#e74c3c', fontWeight: 'bold' }}>¥{product.price}</p>
          <p style={{ color: '#95a5a6', marginTop: '10px' }}>品牌: {product.brand}</p>

          <button onClick={handleAddToCart} style={addToCartButtonStyle}>
            🛒 加入购物车
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 文章列表页
 */
function ArticleListPage() {
  const articles = articlesData;

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>技术文章</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {articles.map(article => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            style={articleCardStyle}
          >
            <h3 style={{ margin: '0 0 10px' }}>{article.title}</h3>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
              <span>作者: {article.author}</span>
              <span style={{ margin: '0 15px' }}>|</span>
              <span>日期: {article.date}</span>
              <span style={{ margin: '0 15px' }}>|</span>
              <span>分类: {article.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * 文章详情页
 */
function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = articlesData.find(a => a.id === parseInt(id));

  if (!article) {
    return <EmptyState message="文章不存在" action={{ label: '返回文章列表', onClick: () => navigate('/articles') }} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/articles')} style={backButtonStyle}>
        ← 返回文章列表
      </button>

      <article style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginTop: '20px'
      }}>
        <h1 style={{ marginBottom: '20px' }}>{article.title}</h1>
        <div style={{ color: '#7f8c8d', marginBottom: '20px' }}>
          作者: {article.author} | 日期: {article.date} | 分类: {article.category}
        </div>
        <div style={{ lineHeight: '1.8' }}>{article.content}</div>
      </article>
    </div>
  );
}

/**
 * 购物车页
 */
function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cart = user?.cart || [];

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛒</div>
        <h2>购物车是空的</h2>
        <p>快去挑选一些商品吧！</p>
        <button onClick={() => navigate('/products')} style={primaryButtonStyle}>
          去购物
        </button>
      </div>
    );
  }

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div>
      <h2>购物车</h2>
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        {cart.map((product, index) => (
          <div key={index} style={cartItemStyle}>
            <span style={{ fontSize: '30px', marginRight: '15px' }}>{product.image}</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px' }}>{product.name}</h4>
              <p style={{ margin: 0, color: '#7f8c8d' }}>{product.category}</p>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c' }}>
              ¥{product.price}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginTop: '20px',
        textAlign: 'right'
      }}>
        <p style={{ fontSize: '24px', margin: '0 0 20px' }}>
          总计: <strong style={{ color: '#e74c3c' }}>¥{total}</strong>
        </p>
        <button style={primaryButtonStyle}>结算</button>
      </div>
    </div>
  );
}

/**
 * 个人中心页
 */
function ProfilePage() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h2>个人中心</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginTop: '20px'
      }}>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>用户名</span>
          <span>{user?.name}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>购物车商品数</span>
          <span>{user?.cart?.length || 0}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>账户状态</span>
          <span style={{ color: '#2ecc71' }}>已登录</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 登录页
 */
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleLogin = () => {
    login('Demo User');
    navigate(from, { replace: true });
  };

  return (
    <div style={authPageStyle}>
      <div style={authCardStyle}>
        <h2>登录</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>点击下方按钮模拟登录</p>
        <button onClick={handleLogin} style={primaryButtonStyle}>
          登录（演示）
        </button>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#7f8c8d' }}>
          登录后会自动跳转到: {from}
        </p>
      </div>
    </div>
  );
}

/**
 * 注册页
 */
function RegisterPage() {
  return (
    <div style={authPageStyle}>
      <div style={authCardStyle}>
        <h2>注册</h2>
        <p style={{ color: '#7f8c8d' }}>注册页面（演示）</p>
      </div>
    </div>
  );
}

/**
 * 404页面
 */
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>404</div>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在</p>
      <button onClick={() => navigate('/')} style={primaryButtonStyle}>
        返回首页
      </button>
    </div>
  );
}

/**
 * ========================================
 * 6. 辅助组件
 * ========================================
 */

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      style={{
        color: isActive ? '#ffd700' : 'white',
        textDecoration: 'none',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'color 0.3s'
      }}
    >
      {children}
    </Link>
  );
}

function ProductCard({ product, showAddToCart }) {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${product.id}` } });
      return;
    }
    addToCart(product);
    alert(`已加入购物车！`);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      style={productCardStyle}
    >
      <div style={{ fontSize: '60px', textAlign: 'center', marginBottom: '15px' }}>
        {product.image}
      </div>
      <h4 style={{ margin: '0 0 10px' }}>{product.name}</h4>
      <p style={{ color: '#7f8c8d', fontSize: '14px', margin: '0 0 10px' }}>
        {product.description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c' }}>
          ¥{product.price}
        </span>
        {showAddToCart && (
          <button onClick={handleAddToCart} style={addButtonStyle}>
            🛒
          </button>
        )}
      </div>
    </Link>
  );
}

function CategoryButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 15px',
        background: active ? '#667eea' : 'transparent',
        color: active ? 'white' : '#2c3e50',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.3s'
      }}
    >
      {children}
    </button>
  );
}

function EmptyState({ message, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>😕</div>
      <h3>{message}</h3>
      {action && (
        <button onClick={action.onClick} style={primaryButtonStyle}>
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * ========================================
 * 7. 路由配置
 * ========================================
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 主布局 */}
          <Route element={<AppLayout />}>
            {/* 首页 */}
            <Route index element={<HomePage />} />

            {/* 商品模块 - 使用嵌套布局 */}
            <Route element={<ShopLayout />}>
              <Route path="products" element={<ProductListPage />} />
            </Route>

            {/* 商品详情 - 独立路由 */}
            <Route path="products/:id" element={<ProductDetailPage />} />

            {/* 文章模块 */}
            <Route path="articles" element={<ArticleListPage />} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />

            {/* 购物车 - 需要登录 */}
            <Route
              path="cart"
              element={
                <RequireAuth>
                  <CartPage />
                </RequireAuth>
              }
            />

            {/* 个人中心 - 需要登录 */}
            <Route
              path="profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />

            {/* 登录注册 - 访客专属 */}
            <Route
              path="login"
              element={
                <RequireGuest>
                  <LoginPage />
                </RequireGuest>
              }
            />
            <Route
              path="register"
              element={
                <RequireGuest>
                  <RegisterPage />
                </RequireGuest>
              }
            />

            {/* 404 */}
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
 * 8. 样式定义
 * ========================================
 */
const buttonStyle = {
  padding: '8px 20px',
  background: 'white',
  color: '#667eea',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  textDecoration: 'none',
  fontSize: '14px'
};

const logoutButtonStyle = {
  padding: '8px 20px',
  background: 'rgba(231, 76, 60, 0.9)',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const primaryButtonStyle = {
  padding: '12px 30px',
  background: 'white',
  color: '#667eea',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold'
};

const searchInputStyle = {
  padding: '10px 15px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  width: '250px'
};

const backButtonStyle = {
  padding: '10px 20px',
  background: '#ecf0f1',
  color: '#2c3e50',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const addToCartButtonStyle = {
  padding: '15px 40px',
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '18px',
  marginTop: '30px'
};

const addButtonStyle = {
  padding: '8px 15px',
  background: '#667eea',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px'
};

const productCardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s'
};

const articleCardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  display: 'block'
};

const cartItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #ecf0f1'
};

const badgeStyle = {
  display: 'inline-block',
  padding: '4px 12px',
  background: '#667eea',
  color: 'white',
  borderRadius: '4px',
  fontSize: '12px'
};

const infoRowStyle = {
  padding: '15px 0',
  borderBottom: '1px solid #ecf0f1',
  display: 'flex',
  justifyContent: 'space-between'
};

const infoLabelStyle = {
  color: '#7f8c8d'
};

const authPageStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh'
};

const authCardStyle = {
  background: 'white',
  padding: '40px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
};

/**
 * ========================================
 * 9. 核心概念总结
 * ========================================
 *
 * 本示例展示了React Router 7的综合应用:
 *
 * 1) 路由组织结构:
 *    ┌─────────────────────────────────────────┐
 *    │  AppLayout (主布局)                      │
 *    │  ├── Header (公共头部)                   │
 *    │  │                                      │
 *    │  ├── Outlet (内容区域)                  │
 *    │  │   ├── HomePage                       │
 *    │  │   ├── ShopLayout (商店布局)          │
 *    │  │   │   └── ProductListPage            │
 *    │  │   ├── ProductDetailPage              │
 *    │  │   ├── ArticleListPage               │
 *    │  │   ├── ArticleDetailPage             │
 *    │  │   ├── CartPage (需要登录)            │
 *    │  │   └── ProfilePage (需要登录)        │
 *    │  │                                      │
 *    │  └── Footer (公共底部)                  │
 *    └─────────────────────────────────────────┘
 *
 * 2) 认证流程:
 *    - AuthContext 提供全局认证状态
 *    - RequireAuth 守卫保护私有路由
 *    - RequireGuest 守卫保护访客路由
 *    - 登录状态持久化到 localStorage
 *
 * 3) 路由功能点:
 *    - 基础路由: /, /products, /articles
 *    - 动态路由: /products/:id, /articles/:id
 *    - 查询参数: /products?category=手机&search=iPhone
 *    - 嵌套路由: ShopLayout > ProductListPage
 *    - 路由守卫: RequireAuth, RequireGuest
 *    - 编程式导航: navigate(), useNavigate()
 *    - 状态传递: navigate('/path', { state })
 *
 * 4) 最佳实践:
 *    - 使用Context管理全局状态
 *    - 合理组织路由层级
 *    - 提取公共布局组件
 *    - 使用守卫保护路由
 *    - 保持URL与状态同步
 *
 * ========================================
 */
