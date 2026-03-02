/**
 * React Router 7 嵌套路由与Layout示例
 * ==========================================
 * 本文件展示React Router 7中的嵌套路由（Nested Routes）功能
 *
 * 嵌套路由允许你在一个路由内部渲染另一个路由
 * 常用于：后台管理系统、标签页切换、父子页面关系等场景
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router';

/**
 * ========================================
 * 1. 嵌套路由的Layout组件
 * ========================================
 * Layout组件（布局组件）是一个特殊的父级组件
 * 它包含公共的UI部分（如导航、侧边栏）
 * 并使用<Outlet />来渲染子路由内容
 */

/**
 * 主布局组件 - 包含顶部导航和侧边栏
 * <Outlet /> 是React Router 7的组件，表示子路由的渲染位置
 *
 * 布局结构:
 * ┌────────────────────────────────────┐
 * │           顶部导航栏                │
 * ├──────────┬─────────────────────────┤
 * │          │                         │
 * │  侧边栏   │      主内容区域          │
 * │  (导航)   │    (通过Outlet渲染)     │
 * │          │                         │
 * └──────────┴─────────────────────────┘
 */
function MainLayout() {
  const location = useLocation();

  // 辅助函数：检查当前路径是否激活
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航栏 */}
      <header style={{
        background: '#2c3e50',
        color: 'white',
        padding: '15px 20px'
      }}>
        <h2>我的应用</h2>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* 侧边栏导航 */}
        <aside style={{
          width: '200px',
          background: '#34495e',
          padding: '20px 0'
        }}>
          <nav>
            <div style={{
              padding: '10px 20px',
              color: isActive('/dashboard') ? '#3498db' : 'white',
              fontWeight: isActive('/dashboard') ? 'bold' : 'normal'
            }}>
              <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
                仪表盘
              </Link>
            </div>
            <div style={{
              padding: '10px 20px',
              color: isActive('/products') ? '#3498db' : 'white',
              fontWeight: isActive('/products') ? 'bold' : 'normal'
            }}>
              <Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>
                产品管理
              </Link>
            </div>
            <div style={{
              padding: '10px 20px',
              color: isActive('/orders') ? '#3498db' : 'white',
              fontWeight: isActive('/orders') ? 'bold' : 'normal'
            }}>
              <Link to="/orders" style={{ color: 'inherit', textDecoration: 'none' }}>
                订单管理
              </Link>
            </div>
            <div style={{
              padding: '10px 20px',
              color: isActive('/settings') ? '#3498db' : 'white',
              fontWeight: isActive('/settings') ? 'bold' : 'normal'
            }}>
              <Link to="/settings" style={{ color: 'inherit', textDecoration: 'none' }}>
                系统设置
              </Link>
            </div>
          </nav>
        </aside>

        {/* 主内容区域 - Outlet渲染子路由 */}
        <main style={{
          flex: 1,
          padding: '20px',
          background: '#ecf0f1'
        }}>
          {/*
           * Outlet组件:
           * - 是React Router 7的核心组件之一
           * - 作为占位符，渲染当前匹配路由的子元素
           * - 类似于Vue Router的<router-view>
           */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/**
 * 产品管理布局 - 带标签页的布局
 *
 * 结构:
 * ┌────────────────────────────────────┐
 * │         产品管理                    │
 * ├────────────────────────────────────┤
 * │ [产品列表] [分类管理] [添加产品]     │  <- 子导航
 * ├────────────────────────────────────┤
 * │                                    │
 * │         子路由内容                  │
 * │                                    │
 * └────────────────────────────────────┘
 */
function ProductsLayout() {
  const location = useLocation();

  // 判断当前激活的标签
  const activeTab = location.pathname.split('/').pop();

  return (
    <div>
      <h2>产品管理</h2>

      {/* 子导航 - 产品管理的二级导航 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '1px solid #bdc3c7'
      }}>
        <Link
          to="/products"
          style={{
            padding: '10px 20px',
            background: activeTab === 'products' ? '#3498db' : 'transparent',
            color: activeTab === 'products' ? 'white' : '#2c3e50',
            textDecoration: 'none',
            borderRadius: '4px 4px 0 0'
          }}
        >
          产品列表
        </Link>
        <Link
          to="/products/categories"
          style={{
            padding: '10px 20px',
            background: activeTab === 'categories' ? '#3498db' : 'transparent',
            color: activeTab === 'categories' ? 'white' : '#2c3e50',
            textDecoration: 'none',
            borderRadius: '4px 4px 0 0'
          }}
        >
          分类管理
        </Link>
        <Link
          to="/products/add"
          style={{
            padding: '10px 20px',
            background: activeTab === 'add' ? '#3498db' : 'transparent',
            color: activeTab === 'add' ? 'white' : '#2c3e50',
            textDecoration: 'none',
            borderRadius: '4px 4px 0 0'
          }}
        >
          添加产品
        </Link>
      </div>

      {/* 子路由内容渲染位置 */}
      <Outlet />
    </div>
  );
}

/**
 * ========================================
 * 2. 页面组件定义
 * ========================================
 */

// 首页/仪表盘
function Dashboard() {
  return (
    <div>
      <h3>仪表盘</h3>
      <p>欢迎使用管理系统</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h4>总订单</h5>
          <p style={{ fontSize: '24px', color: '#3498db' }}>1,234</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h4>总用户</h4>
          <p style={{ fontSize: '24px', color: '#2ecc71' }}>5,678</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h4>总收入</h4>
          <p style={{ fontSize: '24px', color: '#e74c3c' }}>$98,765</p>
        </div>
      </div>
    </div>
  );
}

// 产品列表页
function ProductList() {
  const products = [
    { id: 1, name: 'iPhone 15', price: 6999, stock: 100 },
    { id: 2, name: 'MacBook Pro', price: 14999, stock: 50 },
    { id: 3, name: 'iPad Air', price: 4599, stock: 200 },
  ];

  return (
    <div>
      <h3>产品列表</h3>
      <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>产品名称</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>价格</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>库存</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
              <td style={{ padding: '12px' }}>{p.id}</td>
              <td style={{ padding: '12px' }}>{p.name}</td>
              <td style={{ padding: '12px' }}>¥{p.price}</td>
              <td style={{ padding: '12px' }}>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 分类管理页
function Categories() {
  const categories = ['手机', '电脑', '平板', '配件'];

  return (
    <div>
      <h3>产品分类</h3>
      <ul style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        {categories.map((cat, idx) => (
          <li key={idx} style={{ padding: '10px', borderBottom: '1px solid #ecf0f1' }}>
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 添加产品页
function AddProduct() {
  return (
    <div>
      <h3>添加产品</h3>
      <form style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>产品名称:</label>
          <input type="text" style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>价格:</label>
          <input type="number" style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{
          padding: '10px 20px',
          background: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}>
          提交
        </button>
      </form>
    </div>
  );
}

// 订单管理页
function Orders() {
  const orders = [
    { id: 'ORD001', customer: '张三', total: 6999, status: '已完成' },
    { id: 'ORD002', customer: '李四', total: 14999, status: '处理中' },
    { id: 'ORD003', customer: '王五', total: 4599, status: '待支付' },
  ];

  return (
    <div>
      <h3>订单列表</h3>
      <ul style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        {orders.map(order => (
          <li key={order.id} style={{
            padding: '15px',
            borderBottom: '1px solid #ecf0f1',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <div>
              <strong>{order.id}</strong> - {order.customer}
            </div>
            <div>
              <span style={{ marginRight: '15px' }}>¥{order.total}</span>
              <span style={{
                padding: '3px 10px',
                background: order.status === '已完成' ? '#2ecc71' :
                           order.status === '处理中' ? '#f39c12' : '#95a5a6',
                color: 'white',
                borderRadius: '3px'
              }}>
                {order.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 系统设置页
function Settings() {
  return (
    <div>
      <h3>系统设置</h3>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <p>系统版本: v1.0.0</p>
        <p>最后更新: 2024-01-15</p>
      </div>
    </div>
  );
}

/**
 * ========================================
 * 3. 路由配置 - 展示嵌套路由结构
 * ========================================
 *
 * 路由结构图解:
 *
 * /
 * ├── MainLayout (主布局)
 * │   ├── Outlet -> /dashboard
 * │   │   └── Dashboard
 * │   │
 * │   ├── Outlet -> /products
 * │   │   ├── ProductsLayout (产品布局)
 * │   │   │   ├── Outlet -> /products
 * │   │   │   │   └── ProductList
 * │   │   │   │
 * │   │   │   ├── Outlet -> /products/categories
 * │   │   │   │   └── Categories
 * │   │   │   │
 * │   │   │   └── Outlet -> /products/add
 * │   │   │       └── AddProduct
 * │   │   │
 * │   │   ├── Outlet -> /orders
 * │   │   │   └── Orders
 * │   │   │
 * │   │   └── Outlet -> /settings
 * │   │       └── Settings
 *
 */
function App() {
  return (
    <BrowserRouter>
      {/*
       * 嵌套路由配置:
       * - 父路由使用layout组件
       * - 子路由使用 Outlet 渲染
       * - 通过嵌套的Route实现
       */}
      <Routes>
        {/* 方式一：使用index route作为默认页面 */}
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          {/* 产品管理的嵌套路由 */}
          <Route path="products" element={<ProductsLayout />}>
            {/* index route: /products 时渲染ProductList */}
            <Route index element={<ProductList />} />
            {/* /products/categories */}
            <Route path="categories" element={<Categories />} />
            {/* /products/add */}
            <Route path="add" element={<AddProduct />} />
          </Route>

          {/* 其他一级路由 */}
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/**
 * ========================================
 * 4. 核心概念总结
 * ========================================
 *
 * 1) Outlet 组件:
 *    - 用于在父路由组件中渲染子路由
 *    - 支持多层嵌套
 *    - 类似于Vue的<router-view>
 *
 * 2) 嵌套路由的优势:
 *    - 代码复用：公共布局只写一次
 *    - 逻辑清晰：层级结构直观
 *    - 状态保持：切换子路由时父布局不变
 *
 * 3) index route:
 *    - path="/" 时使用 index: true
 *    - 当URL完全匹配父路由时渲染
 *    - 常用于默认页面/首页
 *
 * 4) 路由组织方式:
 *    - 方式一：所有路由平铺，使用element包装
 *    - 方式二：使用layout组件 + Outlet
 *    - 推荐方式二，结构更清晰
 *
 * ========================================
 */
