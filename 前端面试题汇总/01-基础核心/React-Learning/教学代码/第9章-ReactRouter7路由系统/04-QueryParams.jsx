/**
 * React Router 7 查询参数与筛选示例
 * ==========================================
 * 本文件展示如何在React Router 7中使用查询参数（Query Parameters）
 *
 * 查询参数特点:
 * - URL中 ? 后面的部分
 * - 格式: key=value&key2=value2
 * - 用于筛选、排序、分页等
 * - 不影响路由匹配
 *
 * 使用 useSearchParams Hook 来管理和读取查询参数
 */

import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useSearchParams, useLocation } from 'react-router';

/**
 * ========================================
 * 1. 模拟数据
 * ========================================
 */

const allProducts = [
  { id: 1, name: 'iPhone 15 Pro', price: 7999, category: '手机', brand: 'Apple' },
  { id: 2, name: 'Samsung S24 Ultra', price: 9999, category: '手机', brand: 'Samsung' },
  { id: 3, name: 'Xiaomi 14 Pro', price: 4999, category: '手机', brand: 'Xiaomi' },
  { id: 4, name: 'MacBook Pro 14寸', price: 14999, category: '电脑', brand: 'Apple' },
  { id: 5, name: 'ThinkPad X1 Carbon', price: 12999, category: '电脑', brand: 'Lenovo' },
  { id: 6, name: 'Huawei MateBook', price: 7999, category: '电脑', brand: 'Huawei' },
  { id: 7, name: 'iPad Pro 12.9寸', price: 9299, category: '平板', brand: 'Apple' },
  { id: 8, name: 'Galaxy Tab S9', price: 6999, category: '平板', brand: 'Samsung' },
];

const categories = ['全部', '手机', '电脑', '平板'];
const brands = ['全部', 'Apple', 'Samsung', 'Xiaomi', 'Lenovo', 'Huawei'];
const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'name-asc', label: '名称A-Z' },
  { value: 'name-desc', label: '名称Z-A' },
];

/**
 * ========================================
 * 2. 产品列表组件 - 展示查询参数的使用
 * ========================================
 */

/**
 * 产品筛选列表组件
 * 使用 useSearchParams 来读取和修改URL查询参数
 */
function ProductFilterList() {
  // useSearchParams: React Router 7的Hook
  // 返回一个数组: [searchParams, setSearchParams]
  // - searchParams: 类似于URLSearchParams的对象
  // - setSearchParams: 更新查询参数的函数
  const [searchParams, setSearchParams] = useSearchParams();

  // 从URL查询参数中获取筛选条件
  // get() 方法获取单个参数
  // getAll() 方法获取同名的所有参数（复选框场景）
  const category = searchParams.get('category') || '全部';
  const brand = searchParams.get('brand') || '全部';
  const sort = searchParams.get('sort') || 'default';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';

  // 根据查询参数筛选产品
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // 按分类筛选
    if (category !== '全部') {
      result = result.filter(p => p.category === category);
    }

    // 按品牌筛选
    if (brand !== '全部') {
      result = result.filter(p => p.brand === brand);
    }

    // 按名称搜索
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    // 按价格区间筛选
    if (minPrice) {
      result = result.filter(p => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= parseInt(maxPrice));
    }

    // 排序
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [category, brand, sort, minPrice, maxPrice, search]);

  // 更新查询参数的辅助函数
  const updateParam = (key, value) => {
    // 创建新的SearchParams对象
    const newParams = new URLSearchParams(searchParams);

    // 设置或删除参数
    if (value && value !== '全部' && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    // 更新URL（会触发组件重新渲染）
    setSearchParams(newParams);
  };

  // 清空所有筛选条件
  const clearFilters = () => {
    setSearchParams({});
  };

  // 获取当前URL（用于显示）
  const location = useLocation();

  return (
    <div style={{ padding: '20px' }}>
      <h2>产品筛选列表</h2>

      {/* 搜索框 */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="搜索产品名称..."
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* 筛选条件区域 */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4>筛选条件</h4>

        {/* 分类筛选 */}
        <div style={{ marginBottom: '15px' }}>
          <strong>分类: </strong>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => updateParam('category', cat)}
              style={{
                margin: '0 5px',
                padding: '6px 12px',
                background: category === cat ? '#3498db' : '#ecf0f1',
                color: category === cat ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 品牌筛选 */}
        <div style={{ marginBottom: '15px' }}>
          <strong>品牌: </strong>
          {brands.map(b => (
            <button
              key={b}
              onClick={() => updateParam('brand', b)}
              style={{
                margin: '0 5px',
                padding: '6px 12px',
                background: brand === b ? '#2ecc71' : '#ecf0f1',
                color: brand === b ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {b}
            </button>
          ))}
        </div>

        {/* 价格区间 */}
        <div style={{ marginBottom: '15px' }}>
          <strong>价格区间: </strong>
          <input
            type="number"
            placeholder="最低价"
            value={minPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            style={{ width: '100px', padding: '6px', marginRight: '10px' }}
          />
          <span> - </span>
          <input
            type="number"
            placeholder="最高价"
            value={maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            style={{ width: '100px', padding: '6px', marginLeft: '10px' }}
          />
        </div>

        {/* 排序 */}
        <div style={{ marginBottom: '15px' }}>
          <strong>排序: </strong>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '4px' }}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* 清空按钮 */}
        <button
          onClick={clearFilters}
          style={{
            padding: '8px 16px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          清空筛选条件
        </button>
      </div>

      {/* 当前筛选条件显示 */}
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <strong>当前URL查询参数:</strong>
        <code style={{ display: 'block', marginTop: '10px', background: '#2c3e50', color: '#ecf0f1', padding: '10px', borderRadius: '4px' }}>
          {location.search}
        </code>
        <div style={{ marginTop: '10px' }}>
          符合条件的商品: <strong>{filteredProducts.length}</strong> 件
        </div>
      </div>

      {/* 产品列表 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {filteredProducts.map(product => (
          <div
            key={product.id}
            style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h4 style={{ margin: '0 0 10px' }}>{product.name}</h4>
            <p style={{ color: '#7f8c8d', margin: '5px 0' }}>分类: {product.category}</p>
            <p style={{ color: '#7f8c8d', margin: '5px 0' }}>品牌: {product.brand}</p>
            <p style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '18px' }}>¥{product.price}</p>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
          没有找到符合条件的产品
        </div>
      )}
    </div>
  );
}

/**
 * ========================================
 * 3. 分页组件示例
 * ========================================
 */

/**
 * 分页列表组件
 * 展示如何将分页信息存储在URL查询参数中
 */
function PaginatedList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 获取分页参数
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 3;

  // 计算分页数据
  const totalPages = Math.ceil(allProducts.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  // 更新页码
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>分页列表</h2>

      {/* 产品列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentProducts.map(product => (
          <div
            key={product.id}
            style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <strong>{product.name}</strong>
              <span style={{ marginLeft: '15px', color: '#7f8c8d' }}>{product.category}</span>
            </div>
            <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>¥{product.price}</div>
          </div>
        ))}
      </div>

      {/* 分页控件 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
        gap: '10px'
      }}>
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          style={{
            padding: '8px 16px',
            background: page === 1 ? '#bdc3c7' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          上一页
        </button>

        {/* 页码按钮 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            style={{
              padding: '8px 12px',
              background: page === p ? '#3498db' : 'white',
              color: page === p ? 'white' : '#2c3e50',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          style={{
            padding: '8px 16px',
            background: page === totalPages ? '#bdc3c7' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          下一页
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px', color: '#7f8c8d' }}>
        第 {page} 页，共 {totalPages} 页
      </div>
    </div>
  );
}

/**
 * ========================================
 * 4. 路由配置
 * ========================================
 */
function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#ecf0f1', minHeight: '100vh' }}>
        <nav style={{
          background: '#2c3e50',
          padding: '15px 20px'
        }}>
          <Link to="/products?category=手机&sort=price-asc" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
            产品筛选
          </Link>
          <Link to="/pagination?page=1" style={{ color: 'white', textDecoration: 'none' }}>
            分页列表
          </Link>
        </nav>

        <Routes>
          <Route path="/products" element={<ProductFilterList />} />
          <Route path="/pagination" element={<PaginatedList />} />
          <Route path="/" element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>查询参数演示</h1>
              <p>点击上方导航查看示例</p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

/**
 * ========================================
 * 5. 核心概念总结
 * ========================================
 *
 * 1) 查询参数 vs 路由参数:
 *    ┌─────────────────────────────────────────────┐
 *    │  路由参数    /products/:id                   │
 *    │              /products/123                   │
 *    │              定义路由结构，匹配URL路径        │
 *    ├─────────────────────────────────────────────┤
 *    │  查询参数    /products?category=手机&sort=price │
 *    │              URL中?后面的key=value对          │
 *    │              用于筛选、排序、分页等           │
 *    └─────────────────────────────────────────────┘
 *
 * 2) useSearchParams Hook:
 *    - const [searchParams, setSearchParams] = useSearchParams()
 *    - searchParams.get('key') - 获取单个值
 *    - searchParams.getAll('key') - 获取多个值
 *    - setSearchParams(params) - 更新参数
 *
 * 3) URLSearchParams API:
 *    - has(key) - 检查参数是否存在
 *    - get(key) - 获取参数值
 *    - set(key, value) - 设置参数值
 *    - delete(key) - 删除参数
 *    - toString() - 转换为字符串
 *
 * 4) 实际应用场景:
 *    - 列表筛选: ?category=手机&brand=Apple
 *    - 搜索功能: ?search=iPhone
 *    - 排序: ?sort=price-asc
 *    - 分页: ?page=2&pageSize=20
 *    - 表单提交: ?success=true
 *
 * 5) 优势:
 *    - URL可分享: 复制链接即可分享当前筛选状态
 *    - 浏览器历史: 支持前进后退
 *    - SEO友好: 搜索引擎可以索引筛选结果
 *    - 无状态: 不需要服务端存储筛选状态
 *
 * ========================================
 */
