/**
 * useMemo 示例 - 带搜索和筛选的产品列表
 * 展示性能优化 - 避免不必要的计算
 *
 * useMemo 用途:
 * - 缓存计算结果，避免每次渲染都重新计算
 * - 当依赖项改变时才重新计算
 * - 适合复杂计算或大量数据处理
 */

import React, { useState, useMemo } from 'react';

// ============================================
// 1. 类型定义
// ============================================

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
}

// 产品分类
const CATEGORIES = ['全部', '电子产品', '服装', '食品', '书籍', '运动'];

// 模拟产品数据
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'iPhone 15 Pro', category: '电子产品', price: 8999, rating: 4.8, stock: 50 },
  { id: 2, name: 'MacBook Pro', category: '电子产品', price: 14999, rating: 4.9, stock: 30 },
  { id: 3, name: 'AirPods Pro', category: '电子产品', price: 1899, rating: 4.7, stock: 100 },
  { id: 4, name: 'Nike运动鞋', category: '运动', price: 899, rating: 4.5, stock: 80 },
  { id: 5, name: 'Adidas运动衣', category: '运动', price: 599, rating: 4.4, stock: 60 },
  { id: 6, name: '《JavaScript高级编程》', category: '书籍', price: 99, rating: 4.6, stock: 200 },
  { id: 7, name: '《React实战》', category: '书籍', price: 79, rating: 4.8, stock: 150 },
  { id: 8, name: '优衣库T恤', category: '服装', price: 99, rating: 4.3, stock: 500 },
  { id: 9, name: '牛仔裤', category: '服装', price: 299, rating: 4.2, stock: 120 },
  { id: 10, name: '有机苹果', category: '食品', price: 29, rating: 4.4, stock: 300 },
  { id: 11, name: '进口红酒', category: '食品', price: 399, rating: 4.6, stock: 40 },
  { id: 12, name: 'iPad Pro', category: '电子产品', price: 9999, rating: 4.8, stock: 25 },
  { id: 13, name: '《算法导论》', category: '书籍', price: 128, rating: 4.9, stock: 80 },
  { id: 14, name: '瑜伽垫', category: '运动', price: 59, rating: 4.3, stock: 200 },
  { id: 15, name: '智能手表', category: '电子产品', price: 2999, rating: 4.5, stock: 70 },
];

// ============================================
// 2. 子组件 - 产品卡片
// ============================================

/**
 * 产品卡片组件
 * 使用 React.memo 避免不必要的重渲染
 *
 * React.memo:
 * - 包装组件，使其在 props 未变化时不重新渲染
 * - 对比 props 的引用是否变化
 */
const ProductCard = React.memo(({ product }: { product: Product }) => {
  // 模拟一个随机延迟，显示 memo 的效果
  const [renderCount, setRenderCount] = useState(0);
  setTimeout(() => setRenderCount(c => c + 1), 0);

  return (
    <div style={styles.productCard}>
      <div style={styles.productHeader}>
        <span style={styles.category}>{product.category}</span>
        <span style={styles.stock}>库存: {product.stock}</span>
      </div>
      <h3 style={styles.productName}>{product.name}</h3>
      <div style={styles.productInfo}>
        <span style={styles.price}>¥{product.price}</span>
        <span style={styles.rating}>★ {product.rating}</span>
      </div>
      <div style={styles.renderInfo}>
        渲染次数: {renderCount}
      </div>
    </div>
  );
});

// ============================================
// 3. 主组件 - 产品列表
// ============================================

export default function ProductList() {
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('name');
  const [showLowStock, setShowLowStock] = useState(false);

  // ============================================
  // 4. 使用 useMemo 缓存计算结果
  // ============================================

  /**
   * 过滤和排序后的产品列表
   * - 第一个参数: 计算函数
   * - 第二个参数: 依赖数组
   * - 只有当依赖项改变时才重新计算
   */
  const filteredAndSortedProducts = useMemo(() => {
    console.log('🔄 重新计算产品列表...');

    let result = [...MOCK_PRODUCTS];

    // 1. 按名称搜索
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. 按分类筛选
    if (selectedCategory !== '全部') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // 3. 按价格范围筛选
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // 4. 筛选低库存商品
    if (showLowStock) {
      result = result.filter((product) => product.stock < 50);
    }

    // 5. 排序
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [searchTerm, selectedCategory, priceRange, sortBy, showLowStock]);

  /**
   * 计算符合条件的商品数量（另一个 useMemo 示例）
   */
  const totalFilteredCount = useMemo(() => {
    return filteredAndSortedProducts.length;
  }, [filteredAndSortedProducts]);

  /**
   * 计算每个分类的商品数量
   */
  const categoryStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    MOCK_PRODUCTS.forEach((product) => {
      stats[product.category] = (stats[product.category] || 0) + 1;
    });
    return stats;
  }, []); // 空依赖数组，只计算一次

  /**
   * 计算价格区间的统计数据
   */
  const priceStats = useMemo(() => {
    const prices = MOCK_PRODUCTS.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    };
  }, []);

  // ============================================
  // 5. 渲染
  // ============================================

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>产品列表 (useMemo 性能优化)</h1>

      {/* 搜索和筛选控制面板 */}
      <div style={styles.controls}>
        {/* 搜索框 */}
        <div style={styles.controlGroup}>
          <label style={styles.label}>搜索产品:</label>
          <input
            type="text"
            placeholder="输入产品名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* 分类筛选 */}
        <div style={styles.controlGroup}>
          <label style={styles.label}>分类:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.select}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 价格排序 */}
        <div style={styles.controlGroup}>
          <label style={styles.label}>排序:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={styles.select}
          >
            <option value="name">名称</option>
            <option value="price">价格</option>
            <option value="rating">评分</option>
          </select>
        </div>

        {/* 低库存筛选 */}
        <div style={styles.controlGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showLowStock}
              onChange={(e) => setShowLowStock(e.target.checked)}
            />
            仅显示低库存商品
          </label>
        </div>
      </div>

      {/* 价格范围滑块 */}
      <div style={styles.priceRange}>
        <label style={styles.label}>
          价格范围: ¥{priceRange[0]} - ¥{priceRange[1]}
        </label>
        <div style={styles.rangeInputs}>
          <input
            type="range"
            min={0}
            max={priceStats.max}
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            style={styles.range}
          />
          <input
            type="range"
            min={0}
            max={priceStats.max}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            style={styles.range}
          />
        </div>
      </div>

      {/* 统计信息 */}
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>总商品数:</span>
          <span style={styles.statValue}>{MOCK_PRODUCTS.length}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>筛选结果:</span>
          <span style={styles.statValue}>{totalFilteredCount}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>平均价格:</span>
          <span style={styles.statValue}>¥{priceStats.avg.toFixed(0)}</span>
        </div>
      </div>

      {/* 分类统计 */}
      <div style={styles.categoryStats}>
        {Object.entries(categoryStats).map(([category, count]) => (
          <span key={category} style={styles.categoryBadge}>
            {category}: {count}
          </span>
        ))}
      </div>

      {/* 产品列表 */}
      <div style={styles.productGrid}>
        {filteredAndSortedProducts.length === 0 ? (
          <div style={styles.noResults}>没有找到匹配的产品</div>
        ) : (
          filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* 代码说明 */}
      <div style={styles.explanation}>
        <h3>📚 useMemo 核心概念</h3>
        <ul>
          <li><strong>useMemo</strong>: 缓存计算结果，避免不必要的重复计算</li>
          <li><strong>依赖数组</strong>: 当依赖项变化时，重新计算值</li>
          <li><strong>适用场景</strong>: 复杂计算、大数据处理、避免子组件不必要的渲染</li>
          <li><strong>性能优势</strong>: 减少CPU密集型操作，提升应用性能</li>
        </ul>
        <h3>🔍 调试技巧</h3>
        <ul>
          <li>打开控制台，观察"重新计算产品列表"的日志输出</li>
          <li>修改搜索词、分类等筛选条件时，日志会输出</li>
          <li>点击产品卡片（不改变筛选条件），日志不会输出，证明 useMemo 生效</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// 6. 样式对象
// ============================================

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#555',
  },
  input: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    minWidth: '200px',
  },
  select: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    minWidth: '150px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    height: '40px',
  },
  priceRange: {
    marginBottom: '20px',
  },
  rangeInputs: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
  },
  range: {
    flex: 1,
    cursor: 'pointer',
  },
  stats: {
    display: 'flex',
    gap: '30px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
  },
  statItem: {
    display: 'flex',
    gap: '8px',
  },
  statLabel: {
    fontWeight: '600',
  },
  statValue: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  categoryStats: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  categoryBadge: {
    padding: '6px 12px',
    backgroundColor: '#f0f0f0',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#666',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  productCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  category: {
    fontSize: '12px',
    color: '#666',
    backgroundColor: '#f0f0f0',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  stock: {
    fontSize: '12px',
    color: '#999',
  },
  productName: {
    margin: '10px 0',
    fontSize: '16px',
    color: '#333',
  },
  productInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#e53935',
  },
  rating: {
    color: '#ff9800',
    fontWeight: '600',
  },
  renderInfo: {
    marginTop: '10px',
    fontSize: '11px',
    color: '#999',
    textAlign: 'right',
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '16px',
  },
  explanation: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#e8f5e9',
    borderRadius: '10px',
  },
  explanation h3: {
    marginTop: 0,
    color: '#2e7d32',
  },
  explanation ul: {
    lineHeight: '1.8',
  },
};
