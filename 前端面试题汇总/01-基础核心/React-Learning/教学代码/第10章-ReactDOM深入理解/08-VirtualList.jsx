/**
 * ============================================
 * 虚拟列表（大型列表优化）
 * Chapter 10 - ReactDOM Deep Understanding
 * ============================================
 *
 * 本文件介绍虚拟列表（Virtual List）的实现原理和优化技术
 *
 * [目录]
 * 1. 虚拟列表简介
 * 2. 固定行高虚拟列表
 * 3. 动态行高虚拟列表
 * 4. 无限滚动加载
 * 5. 性能优化技巧
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ============================================================================
// 1. 虚拟列表简介
// ============================================================================

/*
 * 虚拟列表 (Virtual List) 是一种优化大型列表渲染的技术
 *
 * 传统列表的问题:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  假设有10000条数据                                          │
 * │  传统渲染: 创建10000个DOM节点                               │
 * │  问题: 内存占用大、滚动卡顿、渲染时间长                      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * 虚拟列表的原理:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  只渲染可见区域的DOM节点                                    │
 * │  10000条数据，但只渲染可见的20-30条                         │
 * │                                                              │
 * │  可视区域: [■■■■■■■■■■■■■■■■] ← 当前可见的约20项              │
 * │            ↓                                                │
 * │  数据:   [1][2][3][4][5][6][7][8][9][10]...[10000]         │
 * │                  ↑                                         │
 * │            滚动位置决定渲染哪些                              │
 * └─────────────────────────────────────────────────────────────┘
 *
 * 虚拟列表的优势:
 * - 大幅减少DOM节点数量
 * - 提高滚动性能
 * - 降低内存占用
 * - 加快首屏渲染
 */

// ============================================================================
// 2. 固定行高虚拟列表
// ============================================================================

/**
 * 固定行高的虚拟列表组件
 *
 * @param {Array} items - 数据列表
 * @param {number} itemHeight - 每项的高度（固定）
 * @param {number} containerHeight - 容器高度
 * @param {function} renderItem - 渲染每项的函数
 */
function FixedSizeVirtualList({
  items,
  itemHeight = 50,
  containerHeight = 400,
  renderItem
}) {
  const [scrollTop, setScrollTop] = useState(0);

  // 计算可见区域的起始和结束索引
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + 1
  );

  // 获取可见项
  const visibleItems = items.slice(startIndex, endIndex + 1);

  // 计算总高度（用于创建滚动条）
  const totalHeight = items.length * itemHeight;

  // 处理滚动事件
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
      onScroll={handleScroll}
    >
      {/* 占位元素，用于创建正确的滚动条 */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* 可见项的实际渲染 */}
        <div
          style={{
            position: 'absolute',
            top: startIndex * itemHeight,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 固定行高虚拟列表示例
// ============================================================================

/**
 * 固定行高虚拟列表示例
 */
function FixedSizeListDemo() {
  // 生成大量测试数据
  const [items] = useState(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? '管理员' : i % 3 === 1 ? '编辑' : '用户'
    }));
  });

  const [scrollInfo, setScrollInfo] = useState({ start: 0, end: 0 });

  const renderItem = useCallback((item, index) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 15px',
          height: '50px',
          borderBottom: '1px solid #eee',
          background: index % 2 === 0 ? '#fff' : '#f9f9f9'
        }}
      >
        <span style={{ width: '50px', color: '#666' }}>{item.id}</span>
        <span style={{ flex: 1 }}>{item.name}</span>
        <span style={{ flex: 1 }}>{item.email}</span>
        <span style={{
          width: '60px',
          color: item.role === '管理员' ? '#dc3545' : item.role === '编辑' ? '#ffc107' : '#28a745'
        }}>
          {item.role}
        </span>
      </div>
    );
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>1. 固定行高虚拟列表</h3>
      <p>渲染 10,000 条数据，但只创建约20个DOM节点</p>

      <div style={{ marginBottom: '15px', fontSize: '12px', color: '#666' }}>
        <p>当前可见范围: {scrollInfo.start} - {scrollInfo.end}</p>
      </div>

      <FixedSizeVirtualList
        items={items}
        itemHeight={50}
        containerHeight={400}
        renderItem={(item, index) => {
          if (index === 0) {
            setTimeout(() => setScrollInfo({ start: index, end: index + 8 }), 0);
          }
          return renderItem(item, index);
        }}
      />

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p><strong>原理:</strong></p>
        <ul>
          <li>计算滚动位置确定可见范围: startIndex = scrollTop / itemHeight</li>
          <li>只渲染可见区域的项目: items.slice(startIndex, endIndex)</li>
          <li>使用绝对定位将项目放置在正确位置</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// 3. 动态行高虚拟列表
// ============================================================================

/*
 * 动态行高虚拟列表的挑战:
 *
 * ┌─────────────────────────────────────────────────────────────┐
 *  问题: 当行高不同时，无法预先计算滚动位置                      │
 *                                                              │
 *  方案1: 估计高度 + 渐进式调整                                 │
 *  方案2: 记录每行实际高度                                      │
 *  方案3: 使用两遍扫描（先测量再渲染）                          │
 * └─────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// 简化的动态行高虚拟列表
// ============================================================================

/**
 * 简化的动态行高虚拟列表
 * 使用估计高度 + 缓存实际高度
 */
function VariableSizeVirtualList({
  items,
  estimatedItemHeight = 50,
  containerHeight = 400,
  renderItem
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const [heights, setHeights] = useState({});
  const containerRef = useRef(null);

  // 缓存每项的高度
  const setItemHeight = useCallback((index, height) => {
    setHeights(prev => {
      if (prev[index] === height) return prev;
      return { ...prev, [index]: height };
    });
  }, []);

  // 计算累积高度
  const getItemOffset = useCallback((index) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += heights[i] || estimatedItemHeight;
    }
    return offset;
  }, [heights, estimatedItemHeight]);

  // 总高度
  const totalHeight = useMemo(() => {
    let height = 0;
    for (let i = 0; i < items.length; i++) {
      height += heights[i] || estimatedItemHeight;
    }
    return height;
  }, [heights, estimatedItemHeight, items.length]);

  // 计算可见范围（二分查找优化）
  const getVisibleRange = useCallback(() => {
    let start = 0;
    let end = items.length - 1;

    // 简单线性查找（实际可用二分查找优化）
    let currentOffset = 0;
    for (let i = 0; i < items.length; i++) {
      const itemHeight = heights[i] || estimatedItemHeight;
      if (currentOffset + itemHeight >= scrollTop) {
        start = Math.max(0, i - 2); // 多渲染几项避免闪烁
        break;
      }
      currentOffset += itemHeight;
    }

    currentOffset = 0;
    for (let i = 0; i < items.length; i++) {
      const itemHeight = heights[i] || estimatedItemHeight;
      if (currentOffset + itemHeight >= scrollTop + containerHeight) {
        end = Math.min(items.length - 1, i + 2);
        break;
      }
      currentOffset += itemHeight;
    }

    return { start, end };
  }, [scrollTop, heights, estimatedItemHeight, containerHeight, items.length]);

  const { start, end } = getVisibleRange();
  const visibleItems = items.slice(start, end + 1);

  // 处理滚动
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <VariableSizeItem
            key={start + index}
            item={item}
            index={start + index}
            renderItem={renderItem}
            onHeightChange={setItemHeight}
          />
        ))}
      </div>
    </div>
  );
}

// 动态高度项组件
function VariableSizeItem({ item, index, renderItem, onHeightChange }) {
  const itemRef = useRef(null);

  useEffect(() => {
    if (itemRef.current) {
      const height = itemRef.current.getBoundingClientRect().height;
      onHeightChange(index, height);
    }
  }, [index, onHeightChange, item.id]); // 当item变化时重新测量

  return (
    <div ref={itemRef} style={{ minHeight: '50px' }}>
      {renderItem(item, index)}
    </div>
  );
}

// ============================================================================
// 动态行高虚拟列表示例
// ============================================================================

/**
 * 动态行高虚拟列表示例
 */
function VariableSizeListDemo() {
  const [items] = useState(() => {
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      title: `标题 ${i + 1}`,
      content: i % 3 === 0
        ? '这是一段很短的内容。'
        : i % 3 === 1
        ? '这是一段中等长度的内容。\n包含两行文字。\n可能还有第三行。'
        : '这是一段很长的内容。\n包含多行文字。\n可能还有更多行。\n甚至更多。\n真的是很多内容。',
      hasImage: i % 5 === 0
    }));
  });

  const renderItem = useCallback((item, index) => {
    return (
      <div
        style={{
          padding: '15px',
          borderBottom: '1px solid #eee',
          background: index % 2 === 0 ? '#fff' : '#f9f9f9'
        }}
      >
        <h4 style={{ margin: '0 0 10px 0' }}>{item.title}</h4>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#666' }}>
          {item.content}
        </p>
        {item.hasImage && (
          <div style={{
            marginTop: '10px',
            height: '80px',
            background: '#e3f2fd',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1976d2'
          }}>
            图片占位符
          </div>
        )}
      </div>
    );
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>2. 动态行高虚拟列表</h3>
      <p>处理高度不固定的列表项</p>

      <VariableSizeVirtualList
        items={items}
        estimatedItemHeight={80}
        containerHeight={400}
        renderItem={renderItem}
      />

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p><strong>实现原理:</strong></p>
        <ul>
          <li>记录每行的实际高度到缓存中</li>
          <li>根据累积高度计算滚动位置</li>
          <li>渲染后测量实际高度并更新缓存</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// 4. 无限滚动加载
// ============================================================================

/**
 * 无限滚动加载组件
 */
function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);

  // 模拟加载数据
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    const newItems = Array.from({ length: 20 }, (_, i) => ({
      id: page * 20 + i + 1,
      content: `这是第 ${page * 20 + i + 1} 条数据`
    }));

    if (page >= 4) {
      setHasMore(false);
    } else {
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    }

    setLoading(false);
  }, [page, loading, hasMore]);

  // 初始加载
  useEffect(() => {
    loadMore();
  }, []);

  // 滚动检测
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // 接近底部时加载更多
    if (scrollHeight - scrollTop - clientHeight < 100) {
      loadMore();
    }
  }, [loadMore]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>3. 无限滚动加载</h3>
      <p>滚动到底部时自动加载更多数据</p>

      <div
        ref={containerRef}
        style={{
          height: '400px',
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
        onScroll={handleScroll}
      >
        {items.map(item => (
          <div
            key={item.id}
            style={{
              padding: '15px',
              borderBottom: '1px solid #eee'
            }}
          >
            {item.content}
          </div>
        ))}

        {loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            加载中...
          </div>
        )}

        {!hasMore && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            已加载全部数据
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. 虚拟列表 + 无限滚动
// ============================================================================

/**
 * 虚拟列表与无限滚动的结合
 */
function VirtualInfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const ITEM_HEIGHT = 60;
  const BUFFER_SIZE = 10;

  // 加载更多数据
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const newItems = Array.from({ length: 50 }, (_, i) => ({
      id: page * 50 + i + 1,
      title: `项目 ${page * 50 + i + 1}`,
      description: `这是项目 ${page * 50 + i + 1} 的描述信息`,
      status: ['进行中', '已完成', '待处理'][Math.floor(Math.random() * 3)]
    }));

    if (page >= 9) {
      setHasMore(false);
    } else {
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    }

    setLoading(false);
  }, [page, loading, hasMore]);

  // 初始加载
  useEffect(() => {
    loadMore();
  }, []);

  // 滚动检测
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollHeight - scrollTop - clientHeight < 200) {
      loadMore();
    }
  }, [loadMore]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>4. 虚拟列表 + 无限滚动</h3>
      <p>结合虚拟列表和无限滚动，高效渲染大量数据</p>

      <div
        style={{
          height: '400px',
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
        onScroll={handleScroll}
      >
        <div style={{ height: items.length * ITEM_HEIGHT, position: 'relative' }}>
          {items.slice(0, 100).map((item, index) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                top: index * ITEM_HEIGHT,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                padding: '10px 15px',
                borderBottom: '1px solid #eee',
                background: index % 2 === 0 ? '#fff' : '#f9f9f9'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{item.description}</div>
              <span style={{
                fontSize: '10px',
                color: item.status === '已完成' ? '#28a745' :
                       item.status === '进行中' ? '#007bff' : '#ffc107'
              }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>当前数据: {items.length} 条 | 加载中: {loading ? '是' : '否'}</p>
      </div>
    </div>
  );
}

// ============================================================================
// 6. 实际应用示例 - 虚拟表格
// ============================================================================

/**
 * 虚拟表格组件
 */
function VirtualTableDemo() {
  const [data] = useState(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `138-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      status: ['活跃', '离线', '忙碌'][Math.floor(Math.random() * 3)]
    }));
  });

  const [scrollTop, setScrollTop] = useState(0);
  const ROW_HEIGHT = 40;
  const VISIBLE_ROWS = 15;

  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const endIndex = Math.min(data.length - 1, startIndex + VISIBLE_ROWS + 1);
  const visibleData = data.slice(startIndex, endIndex + 1);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>5. 虚拟表格 - 10000行数据</h3>

      <div
        style={{
          height: ROW_HEIGHT * VISIBLE_ROWS + 2,
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
        onScroll={handleScroll}
      >
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed'
        }}>
          <thead>
            <tr style={{ background: '#f5f5f5', position: 'sticky', top: 0, zIndex: 1 }}>
              <th style={{ width: '60px', padding: '10px', textAlign: 'left' }}>ID</th>
              <th style={{ width: '150px', padding: '10px', textAlign: 'left' }}>姓名</th>
              <th style={{ width: '200px', padding: '10px', textAlign: 'left' }}>邮箱</th>
              <th style={{ width: '150px', padding: '10px', textAlign: 'left' }}>电话</th>
              <th style={{ width: '80px', padding: '10px', textAlign: 'left' }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row, index) => (
              <tr
                key={row.id}
                style={{
                  position: 'absolute',
                  top: (startIndex + index) * ROW_HEIGHT,
                  width: '100%',
                  height: ROW_HEIGHT,
                  background: index % 2 === 0 ? '#fff' : '#fafafa'
                }}
              >
                <td style={{ padding: '8px 10px' }}>{row.id}</td>
                <td style={{ padding: '8px 10px' }}>{row.name}</td>
                <td style={{ padding: '8px 10px' }}>{row.email}</td>
                <td style={{ padding: '8px 10px' }}>{row.phone}</td>
                <td style={{ padding: '8px 10px' }}>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 占位元素 */}
        <div style={{ height: data.length * ROW_HEIGHT }} />
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>总行数: {data.length} | 可见行: {endIndex - startIndex + 1}</p>
      </div>
    </div>
  );
}

// ============================================================================
// 7. 虚拟列表实现原理图解
// ============================================================================

/**
 * 虚拟列表实现原理
 */
function VirtualListDiagram() {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>6. 虚拟列表实现原理</h3>

      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
{`
┌─────────────────────────────────────────────────────────────────────┐
│                    虚拟列表数据结构                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  数据数组: items = [item0, item1, item2, ..., item9999]            │
│                          │                                          │
│                          ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │              滚动位置计算                                       │ │
│  │                                                               │ │
│  │  scrollTop = 500  (当前滚动位置)                              │ │
│  │  itemHeight = 50   (固定行高)                                 │ │
│  │                                                               │ │
│  │  startIndex = scrollTop / itemHeight                         │ │
│  │             = 500 / 50 = 10  (起始索引)                       │ │
│  │                                                               │ │
│  │  endIndex = (scrollTop + containerHeight) / itemHeight      │ │
│  │            = (500 + 400) / 50 = 18  (结束索引)               │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                          │                                          │
│                          ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │              只渲染可见区域                                     │ │
│  │                                                               │ │
│  │  可视区域: [item10, item11, item12, ..., item18]            │ │
│  │           共 9 个项目                                        │ │
│  │                                                               │ │
│  │  但实际上会多渲染 2-3 个项目作为缓冲区                         │ │
│  │  实际渲染: item8 ~ item20 (13个)                             │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │              位置计算                                           │ │
│  │                                                               │ │
│  │  每个item的位置: top = index * itemHeight                    │ │
│  │                                                               │ │
│  │  item10: top = 10 * 50 = 500px                               │ │
│  │  item11: top = 11 * 50 = 550px                               │ │
│  │  item12: top = 12 * 50 = 600px                               │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    滚动容器结构                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  <div style={{ height: '400px', overflow: 'auto' }}>              │
│    <div style={{ height: '500000px' }}>  ← 总高度 (10000 * 50)     │
│      <div style={{ position: 'absolute', top: '400px' }}>          │
│        item10                                                       │
│      </div>                                                         │
│      <div style={{ position: 'absolute', top: '450px' }}>          │
│        item11                                                       │
│      </div>                                                         │
│      ...                                                            │
│    </div>                                                           │
│  </div>                                                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
`}
      </pre>
    </div>
  );
}

// ============================================================================
// 主组件
// ============================================================================

export default function VirtualList() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>虚拟列表（大型列表优化）</h1>

      <p style={{ color: '#666', marginBottom: '20px' }}>
        虚拟列表通过只渲染可见区域的DOM节点来优化大量数据的渲染性能
      </p>

      {/* 固定行高虚拟列表 */}
      <FixedSizeListDemo />

      {/* 动态行高虚拟列表 */}
      <VariableSizeListDemo />

      {/* 无限滚动加载 */}
      <InfiniteScrollList />

      {/* 虚拟列表 + 无限滚动 */}
      <VirtualInfiniteScroll />

      {/* 虚拟表格 */}
      <VirtualTableDemo />

      {/* 实现原理图解 */}
      <VirtualListDiagram />

      {/* 总结 */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginTop: '20px' }}>
        <h3>虚拟列表总结</h3>

        <h4>核心概念</h4>
        <ul>
          <li><strong>只渲染可见区域</strong> - 无论有多少数据，只渲染屏幕可见的20-30个节点</li>
          <li><strong>计算滚动位置</strong> - 根据滚动位置计算可见项的索引范围</li>
          <li><strong>绝对定位</strong> - 使用绝对定位将项目放置在正确位置</li>
        </ul>

        <h4>固定高度 vs 动态高度</h4>
        <ul>
          <li><strong>固定高度</strong> - 实现简单，性能更好，适用于列表项高度统一的场景</li>
          <li><strong>动态高度</strong> - 需要测量每项实际高度并缓存，适用于内容不固定的场景</li>
        </ul>

        <h4>无限滚动</h4>
        <ul>
          <li>监听滚动事件，当接近底部时加载更多数据</li>
          <li>与虚拟列表结合，实现"无限"数据的流畅渲染</li>
        </ul>

        <h4>使用场景</h4>
        <ul>
          <li>长列表（数千到数万条数据）</li>
          <li>表格（大型数据表格）</li>
          <li>消息/聊天记录</li>
          <li>搜索结果列表</li>
        </ul>

        <h4>注意事项</h4>
        <ul>
          <li>保持行高一致或使用动态高度方案</li>
          <li>添加缓冲区避免快速滚动时出现空白</li>
          <li>考虑使用现成的库如 react-window、react-virtualized</li>
          <li>注意键盘导航和可访问性</li>
        </ul>

        <h4>推荐库</h4>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// react-window - 轻量级虚拟列表库
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={10000}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>

// react-virtualized - 功能更全面的虚拟列表库
import { List } from 'react-virtualized';

<List
  width={800}
  height={400}
  rowCount={10000}
  rowHeight={50}
  rowRenderer={({ index, key, style }) => (
    <div key={key} style={style}>{items[index].name}</div>
  )}
/>`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// 导出
// ============================================================================

export {
  FixedSizeVirtualList,
  VariableSizeVirtualList,
  InfiniteScrollList,
  VirtualInfiniteScroll,
  VirtualTableDemo
};
