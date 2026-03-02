/**
 * React Router 7 动态路由参数示例
 * ==========================================
 * 本文件展示如何创建带动态参数的路由（如产品详情页、用户资料页）
 *
 * 动态路由参数使用 :paramName 语法定义
 * 通过 useParams hook 获取URL中的参数值
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router';

/**
 * ========================================
 * 1. 模拟数据
 * ========================================
 */

// 模拟产品数据
const products = [
  { id: 1, name: 'iPhone 15 Pro', price: 7999, category: '手机', description: '最新款iPhone，A17 Pro芯片，钛金属设计' },
  { id: 2, name: 'MacBook Pro 14寸', price: 14999, category: '电脑', description: 'M3 Pro芯片，18GB统一内存，512GB固态硬盘' },
  { id: 3, name: 'iPad Pro 12.9寸', price: 9299, category: '平板', description: 'M2芯片Liquid视网膜XDR显示屏' },
  { id: 4, name: 'AirPods Pro 2', price: 1899, category: '耳机', description: '主动降噪，空间音频，MagSafe充电盒' },
  { id: 5, name: 'Apple Watch Ultra 2', price: 6999, category: '手表', description: '49毫米钛金属表壳，36小时电池续航' },
];

// 模拟博客文章数据
const posts = [
  { id: 1, title: 'React 19 新特性详解', author: '张三', date: '2024-01-15', content: 'React 19引入了很多新特性...' },
  { id: 2, title: 'React Router 7 完全指南', author: '李四', date: '2024-01-20', content: 'React Router 7带来了革命性的变化...' },
  { id: 3, title: 'TypeScript 5.3 最佳实践', author: '王五', date: '2024-01-25', content: 'TypeScript 5.3带来了很多改进...' },
];

/**
 * ========================================
 * 2. 页面组件定义
 * ========================================
 */

/**
 * 产品列表页
 * 展示所有产品，点击进入详情页
 */
function ProductList() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>产品列表</h2>
      <p>点击产品查看详情</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            style={{
              display: 'block',
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
          >
            <h3 style={{ margin: '0 0 10px', color: '#2c3e50' }}>{product.name}</h3>
            <p style={{ color: '#e74c3c', fontSize: '18px', fontWeight: 'bold' }}>¥{product.price}</p>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: '#3498db',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {product.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * 产品详情页 - 展示单个产品的完整信息
 * 使用 useParams hook 获取URL中的动态参数
 *
 * URL示例: /products/1 -> 获取id=1的产品
 */
function ProductDetail() {
  // useParams: React Router 7的核心Hook
  // 返回一个对象，包含URL中的所有动态参数
  // 例如: /products/:id -> 返回 { id: "1" }
  const params = useParams();

  // 从URL参数中获取产品ID
  const productId = parseInt(params.id);

  // 查找对应的产品数据
  const product = products.find(p => p.id === productId);

  // 如果产品不存在，显示404提示
  if (!product) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>产品不存在</h2>
        <p>抱歉，您查找的产品ID ({productId}) 不存在</p>
        <Link to="/products">返回产品列表</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/products" style={{ color: '#3498db', textDecoration: 'none' }}>
        ← 返回产品列表
      </Link>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginTop: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          background: '#3498db',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          marginBottom: '15px'
        }}>
          {product.category}
        </span>

        <h1 style={{ margin: '0 0 20px', color: '#2c3e50' }}>{product.name}</h1>

        <p style={{
          fontSize: '32px',
          color: '#e74c3c',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}>
          ¥{product.price}
        </p>

        <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>{product.description}</p>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ecf0f1' }}>
          <button style={{
            padding: '12px 30px',
            background: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px'
          }}>
            加入购物车
          </button>
          <button style={{
            padding: '12px 30px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            立即购买
          </button>
        </div>
      </div>

      {/* 显示URL参数信息（用于演示） */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>当前URL参数:</strong>
        <pre style={{ margin: '10px 0 0', background: '#2c3e50', color: '#ecf0f1', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(params, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/**
 * 博客文章列表页
 */
function BlogList() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>技术博客</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {posts.map(post => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            style={{
              display: 'block',
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 10px', color: '#2c3e50' }}>{post.title}</h3>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
              作者: {post.author} | 日期: {post.date}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * 博客文章详情页
 * 展示单个文章的完整内容
 */
function BlogPost() {
  const params = useParams();
  const postId = parseInt(params.id);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>文章不存在</h2>
        <Link to="/blog">返回博客列表</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/blog" style={{ color: '#3498db', textDecoration: 'none' }}>
        ← 返回博客列表
      </Link>

      <article style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginTop: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#2c3e50' }}>{post.title}</h1>

        <div style={{ color: '#7f8c8d', marginBottom: '20px' }}>
          作者: {post.author} | 发布日期: {post.date}
        </div>

        <div style={{ lineHeight: '1.8', color: '#34495e' }}>
          {post.content}
        </div>
      </article>
    </div>
  );
}

/**
 * 用户资料页 - 展示多个动态参数的用法
 * URL示例: /users/:userId/posts/:postId
 */
function UserPost() {
  const params = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <h2>用户文章详情</h2>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3>用户ID: {params.userId}</h3>
        <h3>文章ID: {params.postId}</h3>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <strong>所有URL参数:</strong>
        <pre style={{ margin: '10px 0 0', background: '#2c3e50', color: '#ecf0f1', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(params, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/**
 * 首页
 */
function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>动态路由演示</h1>
      <p>点击下方链接查看不同页面</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <Link
          to="/products"
          style={{
            padding: '15px 30px',
            background: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          产品列表
        </Link>
        <Link
          to="/blog"
          style={{
            padding: '15px 30px',
            background: '#2ecc71',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          博客文章
        </Link>
      </div>
    </div>
  );
}

/**
 * ========================================
 * 3. 路由配置 - 动态参数定义
 * ========================================
 *
 * 动态路由语法:
 * - :paramName - 匹配单个路径段
 * - :paramName? - 可选参数（React Router 7）
 * - * - 捕获剩余路径
 *
 * URL匹配示例:
 * /products/:id  ->  /products/1    ✓  { id: "1" }
 *                          /products/abc  ✓  { id: "abc" }
 *                          /products      ✗  不匹配
 *
 * 路由结构图解:
 *
 * /products
 * └── /products/:id      ->  /products/1, /products/2
 *      └── ProductDetail
 *
 * /blog
 * └── /blog/:id           ->  /blog/1, /blog/2
 *      └── BlogPost
 *
 * /users/:userId/posts/:postId
 *      -> /users/123/posts/456
 *      -> { userId: "123", postId: "456" }
 *
 */
function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#ecf0f1', minHeight: '100vh' }}>
        {/* 顶部导航 */}
        <nav style={{
          background: '#2c3e50',
          padding: '15px 20px'
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
            首页
          </Link>
          <Link to="/products" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
            产品
          </Link>
          <Link to="/blog" style={{ color: 'white', textDecoration: 'none' }}>
            博客
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />

          {/* 动态路由: 产品详情页 */}
          {/* :id 是动态参数，可以匹配任意值 */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* 动态路由: 博客文章 */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* 多参数动态路由 */}
          <Route path="/users/:userId/posts/:postId" element={<UserPost />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

/**
 * ========================================
 * 4. 核心概念总结
 * ========================================
 *
 * 1) 动态路由定义:
 *    - 在path中使用 :paramName 语法
 *    - :id, :productId, :userId 等
 *    - 可以有多个动态参数
 *
 * 2) useParams Hook:
 *    - 返回包含所有动态参数的对象
 *    - const { id } = useParams()
 *    - 参数值永远是字符串类型
 *
 * 3) 参数类型转换:
 *    - URL参数都是字符串
 *    - 需要手动转换为数字: parseInt(id)
 *    - 或者使用 +id 进行转换
 *
 * 4) 路由匹配规则:
 *    - 动态路由会匹配任意值
 *    - 精确路由优先于动态路由
 *    - 按定义顺序依次匹配
 *
 * 5) 404处理:
 *    - 检查参数是否存在
 *    - 不存在时显示友好提示
 *    - 可以重定向到404页面
 *
 * 6) 实际应用场景:
 *    - 产品详情页: /products/:id
 *    - 用户资料页: /users/:userId
 *    - 文章详情页: /posts/:postId
 *    - 订单详情页: /orders/:orderId
 *
 * ========================================
 */
