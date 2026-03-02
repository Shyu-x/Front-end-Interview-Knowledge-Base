/**
 * React Router 7 基础路由配置示例
 * ==========================================
 * 本文件展示React Router 7中最基础的路由配置方法
 *
 * React Router 7 是React Router的最新版本，提供了两种路由配置方式：
 * 1. 基于文件的路由系统（File-based Routing）- 类似Next.js
 * 2. 传统的配置式路由（Config-based Routing）- 使用routes数组
 *
 * 本示例使用配置式路由，因为更容易理解路由的核心概念
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router';

/**
 * ========================================
 * 1. 基础组件定义
 * ========================================
 */

// 首页组件
function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>欢迎来到首页</h1>
      <p>这是一个使用React Router 7的基础路由示例</p>
      <div style={{ marginTop: '20px' }}>
        <h3>导航链接：</h3>
        <ul>
          <li><Link to="/">首页</Link></li>
          <li><Link to="/about">关于</Link></li>
          <li><Link to="/contact">联系我们</Link></li>
        </ul>
      </div>
    </div>
  );
}

// 关于页面组件
function AboutPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>关于页面</h1>
      <p>这是一个简单的关于页面</p>
      <p>React Router 7 让路由配置变得简单直观</p>
    </div>
  );
}

// 联系页面组件
function ContactPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>联系我们</h1>
      <p>邮箱: example@email.com</p>
      <p>电话: 123-456-7890</p>
    </div>
  );
}

// 404页面组件 - 当没有匹配的路由时显示
function NotFoundPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>404 - 页面未找到</h1>
      <p>您访问的页面不存在</p>
      <Link to="/">返回首页</Link>
    </div>
  );
}

/**
 * ========================================
 * 2. 主应用组件 - 路由配置
 * ========================================
 */
function App() {
  return (
    // BrowserRouter: 启用HTML5 History API，支持干净的URL
    // basename: 设置应用的基础路径（可选，用于子目录部署）
    <BrowserRouter basename="/">
      <div>
        {/* 导航菜单 - 使用Link组件实现无刷新导航 */}
        <nav style={{
          background: '#f0f0f0',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <Link to="/" style={{ margin: '0 10px' }}>首页</Link>
          <Link to="/about" style={{ margin: '0 10px' }}>关于</Link>
          <Link to="/contact" style={{ margin: '0 10px' }}>联系我们</Link>
        </nav>

        {/*
         * Routes: 路由出口
         * - 类似于Vue Router的router-view
         * - 会匹配第一个符合条件的Route并渲染其element
         * - Route的顺序很重要，React Router 7使用最佳匹配算法
         */}
        <Routes>
          {/* 基础路由配置：path + element */}
          <Route path="/" element={<HomePage />} />

          {/* /about 路由 */}
          <Route path="/about" element={<AboutPage />} />

          {/* /contact 路由 */}
          <Route path="/contact" element={<ContactPage />} />

          {/*
           * 通配符路由 - 捕获所有未匹配的路由
           * path="*" 是React Router的特殊语法，匹配所有剩余路径
           * 通常放在最后作为404页面
           */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

/**
 * ========================================
 * 3. 路由配置图解
 * ========================================
 *
 * URL请求流程:
 *
 *   用户访问 URL
 *         │
 *         ▼
 *   ┌─────────────────┐
 *   │   BrowserRouter │
 *   │  (History API)  │
 *   └────────┬────────┘
 *            │
 *            ▼
 *   ┌─────────────────┐
 *   │     Routes      │
 *   │  (路由匹配器)    │
 *   └────────┬────────┘
 *            │
 *      ┌─────┴─────┐
 *      │           │
 *      ▼           ▼
 *  /about      /contact
 *   Route       Route
 *      │           │
 *      ▼           ▼
 * AboutPage  ContactPage
 *
 * ========================================
 * 4. 核心概念总结
 * ========================================
 *
 * 1) BrowserRouter:
 *    - 使用HTML5 History API (pushState, replaceState)
 *    - URL格式: /path/to/page
 *    - 需要服务器配置支持所有路由
 *
 * 2) Link组件:
 *    - 渲染为<a>标签
 *    - 点击时使用History API更新URL
 *    - 不会触发页面刷新
 *
 * 3) Routes组件:
 *    - 容器组件，管理所有Route
 *    - 根据URL找到匹配的Route并渲染
 *
 * 4) Route组件:
 *    - path: 路由路径，支持通配符(*)
 *    - element: 要渲染的React组件
 *
 * 5) 路由匹配规则:
 *    - 精确匹配: 默认情况下，/只匹配/
 *    - 通配符: * 匹配任意字符
 *    - 动态段: :paramName 匹配动态参数
 *
 * ========================================
 */
