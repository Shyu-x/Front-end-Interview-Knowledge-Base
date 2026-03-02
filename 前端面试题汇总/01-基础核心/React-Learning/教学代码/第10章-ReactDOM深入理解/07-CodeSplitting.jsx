/**
 * ============================================
 * 代码分割与懒加载
 * Chapter 10 - ReactDOM Deep Understanding
 * ============================================
 *
 * 本文件介绍React的代码分割和懒加载技术
 *
 * [目录]
 * 1. 代码分割简介
 * 2. React.lazy 与 Suspense
 * 3. 路由级别代码分割
 * 4. 组件级别代码分割
 * 5. 预加载策略
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';

// ============================================================================
// 1. 代码分割简介
// ============================================================================

/*
 * 代码分割 (Code Splitting) 是将代码拆分成多个小块，按需加载的技术
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │           未使用代码分割                 │
 *                    └─────────────────────────────────────────┘
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │              main.js                    │
 *                    │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
 *                    │  │ 公共代码 │ │ 页面A   │ │ 页面B   │  │
 *                    │  │         │ │         │ │         │  │
 *                    │  └─────────┘ └─────────┘ └─────────┘  │
 *                    │                                           │
 *                    │  问题: 用户访问页面A也要下载页面B的代码   │
 *                    └─────────────────────────────────────────┘
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │           使用代码分割                   │
 *                    └─────────────────────────────────────────┘
 *
 *    main.js (首屏必需)     pageA.js (按需加载)     pageB.js (按需加载)
 *    ┌─────────┐            ┌─────────┐            ┌─────────┐
 *    │ 公共代码│            │ 页面A   │            │ 页面B   │
 *    │ 首屏渲染│            │ 特定代码│            │ 特定代码│
 *    └─────────┘            └─────────┘            └─────────┘
 *
 *    优势: 首屏加载更快，用户只下载需要的代码
 */

// ============================================================================
// 2. React.lazy 与 Suspense
// ============================================================================

/*
 * React.lazy: 动态导入组件
 * Suspense: 在组件加载时显示fallback
 *
 * 语法:
 * const LazyComponent = lazy(() => import('./LazyComponent'));
 *
 * 使用:
 * <Suspense fallback={<Loading />}>
 *   <LazyComponent />
 * </Suspense>
 */

// ============================================================================
// 模拟懒加载组件
// ============================================================================

/**
 * 模拟一个重型组件（实际项目中这些组件会很大）
 */
function HeavyComponent({ title, color }) {
  // 模拟组件初始化
  useEffect(() => {
    console.log(`${title} 组件加载了`);
  }, [title]);

  return (
    <div style={{
      padding: '20px',
      background: color,
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3>{title}</h3>
      <p>这是一个重型组件，包含了大量代码...</p>
      <ul>
        <li>功能1: 数据处理</li>
        <li>功能2: 图表渲染</li>
        <li>功能3: 复杂交互</li>
      </ul>
    </div>
  );
}

// 模拟各种重型组件
const Dashboard = () => <HeavyComponent title="仪表盘" color="#e3f2fd" />;
const Profile = () => <HeavyComponent title="用户资料" color="#f3e5f5" />;
const Settings = () => <HeavyComponent title="系统设置" color="#e8f5e9" />;
const Reports = () => <HeavyComponent title="报表分析" color="#fff3e0" />;
const Messages = () => <HeavyComponent title="消息中心" color="#fce4ec" />;

// ============================================================================
// 基础懒加载示例
// ============================================================================

/**
 * 基础懒加载示例
 */
function LazyBasic() {
  const [showComponent, setShowComponent] = useState(false);

  // 使用 React.lazy 懒加载组件
  // 实际开发中: const LazyComponent = lazy(() => import('./HeavyComponent'));
  // 这里我们模拟懒加载行为
  const LazyDashboard = lazy(() => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ default: Dashboard }), 1000);
    });
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>1. React.lazy 基础用法</h3>

      <button onClick={() => setShowComponent(true)} style={{ marginBottom: '15px' }}>
        加载仪表盘组件
      </button>

      {showComponent && (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyDashboard />
        </Suspense>
      )}
    </div>
  );
}

// 加载中的占位符
function LoadingSpinner({ message = '加载中...' }) {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      background: '#f5f5f5',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 15px'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p>{message}</p>
    </div>
  );
}

// ============================================================================
// 3. 路由级别代码分割
// ============================================================================

/*
 *                    ┌─────────────────────────────────────────┐
 *                    │         路由级别代码分割                 │
 *                    └─────────────────────────────────────────┘
 *
 *  不使用代码分割:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  import Dashboard from './Dashboard';                     │
 *  │  import Profile from './Profile';                          │
 *  │  import Settings from './Settings';                       │
 *  │                                                              │
 *  │  用户访问 /dashboard 时会加载所有页面的代码                 │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *  使用代码分割:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  const Dashboard = lazy(() => import('./Dashboard'));     │
 *  │  const Profile = lazy(() => import('./Profile'));         │
 *  │  const Settings = lazy(() => import('./Settings'));      │
 *  │                                                              │
 *  │  用户访问 /dashboard 时只加载 Dashboard 的代码              │
 *  └─────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// 路由懒加载示例
// ============================================================================

/**
 * 路由级别的代码分割示例
 */
function RouteLazyLoading() {
  const [currentRoute, setCurrentRoute] = useState('dashboard');

  // 模拟路由级别的懒加载
  const routes = {
    dashboard: lazy(() => new Promise(resolve => {
      setTimeout(() => resolve({ default: Dashboard }), 800);
    })),
    profile: lazy(() => new Promise(resolve => {
      setTimeout(() => resolve({ default: Profile }), 800);
    })),
    settings: lazy(() => new Promise(resolve => {
      setTimeout(() => resolve({ default: Settings }), 800);
    })),
    reports: lazy(() => new Promise(resolve => {
      setTimeout(() => resolve({ default: Reports }), 800);
    })),
    messages: lazy(() => new Promise(resolve => {
      setTimeout(() => resolve({ default: Messages }), 800);
    }))
  };

  // 加载日志
  const [loadLog, setLoadLog] = useState([]);

  useEffect(() => {
    setLoadLog(prev => [...prev, `切换到路由: ${currentRoute}`]);
  }, [currentRoute]);

  const CurrentComponent = routes[currentRoute];

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>2. 路由级别代码分割</h3>

      {/* 模拟路由导航 */}
      <div style={{ marginBottom: '15px' }}>
        <p style={{ marginBottom: '10px' }}>点击切换路由:</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.keys(routes).map(route => (
            <button
              key={route}
              onClick={() => setCurrentRoute(route)}
              style={{
                padding: '8px 16px',
                background: currentRoute === route ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 路由内容 */}
      <Suspense fallback={<LoadingSpinner />}>
        <CurrentComponent />
      </Suspense>

      {/* 加载日志 */}
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p>加载日志:</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '100px', overflow: 'auto' }}>
          {loadLog.join('\n')}
        </pre>
        <p>注意: 切换路由时会触发组件的动态加载</p>
      </div>
    </div>
  );
}

// ============================================================================
// 4. 组件级别代码分割
// ============================================================================

/*
 *                    ┌─────────────────────────────────────────┐
 *                    │        组件级别代码分割                  │
 *                    └─────────────────────────────────────────┘
 *
 *  场景: 模态框、工具提示等不总是显示的组件
 *
 *  示例:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  function App() {                                           │
 *  │    const [showModal, setShowModal] = useState(false);      │
 *  │                                                              │
 *  │    // 懒加载模态框组件                                       │
 *  │    const Modal = lazy(() => import('./Modal'));            │
 *  │                                                              │
 *  │    return (                                                 │
 *  │      <div>                                                 │
 *  │        <button onClick={() => setShowModal(true)}>        │
 *  │          打开模态框                                        │
 *  │        </button>                                           │
 *  │                                                              │
 *  │        {showModal && (                                     │
 *  │          <Suspense fallback={null}>                        │
 *  │            <Modal onClose={() => setShowModal(false)} />  │
 *  │          </Suspense>                                       │
 *  │        )}                                                  │
 *  │      </div>                                                 │
 *  │    );                                                       │
 *  │  }                                                          │
 *  └─────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// 组件级别懒加载示例
// ============================================================================

/**
 * 组件级别的代码分割 - 模态框
 */
function ComponentLazyLoading() {
  const [modalType, setModalType] = useState(null);

  // 模拟不同类型的模态框组件
  const modals = {
    user: lazy(() => new Promise(resolve => {
      setTimeout(() => resolve({
        default: () => (
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            <h3>用户信息模态框</h3>
            <p>这是用户信息的详细内容...</p>
          </div>
        )
      }), 500);
    })),
    confirm: lazy(() => new Promise(resolve => {
      setTimeout(() => resolve({
        default: () => (
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            <h3>确认对话框</h3>
            <p>确定要执行这个操作吗？</p>
          </div>
        )
      }), 500);
    })),
    form: lazy(() => new Promise(resolve => {
      setTimeout(() => resolve({
        default: () => (
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            <h3>表单模态框</h3>
            <input placeholder="输入内容..." style={{ padding: '8px', marginRight: '10px' }} />
            <button>提交</button>
          </div>
        )
      }), 500);
    }))
  };

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>3. 组件级别代码分割</h3>
      <p>点击按钮动态加载不同的模态框组件</p>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <button onClick={() => openModal('user')}>用户信息</button>
        <button onClick={() => openModal('confirm')}>确认对话框</button>
        <button onClick={() => openModal('form')}>表单</button>
        <button onClick={closeModal} disabled={!modalType}>关闭</button>
      </div>

      {/* 渲染模态框 */}
      {modalType && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Suspense fallback={<LoadingSpinner message="加载组件中..." />}>
            {React.createElement(modals[modalType])}
          </Suspense>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. 预加载策略
// ============================================================================

/*
 *                    ┌─────────────────────────────────────────┐
 *                    │            预加载策略                    │
 *                    └─────────────────────────────────────────┘
 *
 *  预加载 (Preloading): 用户可能需要的组件提前加载
 *
 *  鼠标悬停预加载:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  <Link to="/dashboard"                                    │
 *  │    onMouseEnter={() => {                                   │
 *  │      import('./Dashboard');  // 预加载                     │
 *  │    }}                                                      │
 *  │  >                                                         │
 *  │    仪表盘                                                  │
 *  │  </Link>                                                   │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *  立即预加载:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  // 用户登录后立即预加载主要页面                             │
 *  │  useEffect(() => {                                         │
 *  │    import('./Dashboard');                                  │
 *  │    import('./Profile');                                   │
 *  │  }, []);                                                   │
 *  └─────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// 预加载示例
// ============================================================================

/**
 * 预加载策略示例
 */
function PreloadingDemo() {
  const [hoveredRoute, setHoveredRoute] = useState(null);
  const [preloadedRoutes, setPreloadedRoutes] = useState([]);
  const [loadTime, setLoadTime] = useState({});

  // 模拟预加载函数
  const preloadRoute = (routeName) => {
    if (preloadedRoutes.includes(routeName)) return;

    const startTime = Date.now();
    new Promise(resolve => {
      setTimeout(() => {
        const endTime = Date.now();
        setPreloadedRoutes(prev => [...prev, routeName]);
        setLoadTime(prev => ({ ...prev, [routeName]: endTime - startTime }));
        resolve();
      }, 500);
    });
  };

  const routes = ['dashboard', 'profile', 'settings', 'reports'];

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>4. 预加载策略</h3>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ marginBottom: '10px' }}>鼠标悬停预加载 (onMouseEnter):</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {routes.map(route => (
            <button
              key={route}
              onMouseEnter={() => {
                setHoveredRoute(route);
                preloadRoute(route);
              }}
              onMouseLeave={() => setHoveredRoute(null)}
              style={{
                padding: '10px 20px',
                background: hoveredRoute === route ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: preloadedRoutes.includes(route) ? 0.6 : 1
              }}
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
              {preloadedRoutes.includes(route) && ' (已预加载)'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        <p>预加载状态:</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(preloadedRoutes, null, 2) || '将鼠标悬停在按钮上开始预加载'}
        </pre>
        <p>加载时间:</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(loadTime, null, 2) || '暂无'}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// 错误边界
// ============================================================================

/*
 * 错误边界 (Error Boundaries) 用于捕获懒加载组件的错误
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │         错误边界的工作原理              │
 *                    └─────────────────────────────────────────┘
 *
 *  <ErrorBoundary fallback={<ErrorPage />}>
 *    <Suspense fallback={<Loading />}>
 *      <LazyComponent />
 *    </Suspense>
 *  </ErrorBoundary>
 */

// ============================================================================
// 简化版错误边界组件
// ============================================================================

/**
 * 简化错误边界
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>出错了</div>;
    }
    return this.props.children;
  }
}

// ============================================================================
// 带错误边界的懒加载
// ============================================================================

/**
 * 带错误边界的懒加载示例
 */
function ErrorBoundaryDemo() {
  const [shouldError, setShouldError] = useState(false);

  // 模拟会失败的懒加载组件
  const FailingComponent = lazy(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError) {
          reject(new Error('组件加载失败'));
        } else {
          resolve({
            default: () => (
              <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
                <h3>组件加载成功</h3>
                <p>这是一个正常工作的懒加载组件</p>
              </div>
            )
          });
        }
      }, 1000);
    });
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>5. 错误边界与懒加载</h3>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setShouldError(true)} style={{ marginRight: '10px' }}>
          触发加载错误
        </button>
        <button onClick={() => setShouldError(false)}>
          重置
        </button>
      </div>

      <ErrorBoundary fallback={
        <div style={{ padding: '20px', background: '#ffebee', borderRadius: '8px' }}>
          <h3>加载失败</h3>
          <p>组件加载时出现错误，请稍后重试</p>
        </div>
      }>
        <Suspense fallback={<LoadingSpinner />}>
          <FailingComponent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// ============================================================================
// 主组件
// ============================================================================

export default function CodeSplitting() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>代码分割与懒加载</h1>

      <p style={{ color: '#666', marginBottom: '20px' }}>
        介绍React的代码分割(Code Splitting)和懒加载(Lazy Loading)技术
      </p>

      {/* 基础用法 */}
      <LazyBasic />

      {/* 路由级别 */}
      <RouteLazyLoading />

      {/* 组件级别 */}
      <ComponentLazyLoading />

      {/* 预加载 */}
      <PreloadingDemo />

      {/* 错误边界 */}
      <ErrorBoundaryDemo />

      {/* 总结 */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginTop: '20px' }}>
        <h3>代码分割总结</h3>

        <h4>核心API</h4>
        <ul>
          <li><strong>React.lazy()</strong> - 动态导入组件</li>
          <li><strong>Suspense</strong> - 加载状态占位符</li>
          <li><strong>ErrorBoundary</strong> - 错误处理</li>
        </ul>

        <h4>使用场景</h4>
        <ul>
          <li><strong>路由分割</strong> - 每个页面独立打包</li>
          <li><strong>组件分割</strong> - 大型组件按需加载</li>
          <li><strong>库分割</strong> - 不常用的库单独打包</li>
        </ul>

        <h4>预加载策略</h4>
        <ul>
          <li><strong>悬停预加载</strong> - 鼠标悬停时加载</li>
          <li><strong>立即预加载</strong> - 关键路径后立即加载</li>
          <li><strong>预测预加载</strong> - 根据用户行为预测加载</li>
        </ul>

        <h4>代码分割示例</h4>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// 1. 路由懒加载
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
      </Router>
    </Suspense>
  );
}

// 2. 组件懒加载
const Modal = lazy(() => import('./Modal'));

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>打开</button>
      {showModal && (
        <Suspense fallback={null}>
          <Modal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </>
  );
}

// 3. 预加载
function App() {
  return (
    <Link
      to="/dashboard"
      onMouseEnter={() => {
        import('./Dashboard');
      }}
    >
      仪表盘
    </Link>
  );
}`}
        </pre>

        <h4>注意事项</h4>
        <ul>
          <li>Suspense 必须包裹所有懒加载组件</li>
          <li>确保为 Suspense 提供 fallback</li>
          <li>使用 ErrorBoundary 处理加载错误</li>
          <li>不要过度分割，保持合理的包大小</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// 导出
// ============================================================================

export {
  LazyBasic,
  RouteLazyLoading,
  ComponentLazyLoading,
  PreloadingDemo,
  ErrorBoundaryDemo,
  LoadingSpinner
};
