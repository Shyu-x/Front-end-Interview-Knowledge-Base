/**
 * ============================================
 * 性能优化示例
 * Chapter 10 - ReactDOM Deep Understanding
 * ============================================
 *
 * 本文件介绍React中的性能优化技术：useMemo、useCallback、React.memo
 *
 * [目录]
 * 1. useMemo - 缓存计算结果
 * 2. useCallback - 缓存函数
 * 3. React.memo - 缓存组件
 * 4. 综合性能优化
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

// ============================================================================
// 1. useMemo - 缓存计算结果
// ============================================================================

/*
 * useMemo 用于缓存计算结果，避免不必要的重复计算
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │            useMemo 原理                 │
 *                    └─────────────────────────────────────────┘
 *
 *  不使用 useMemo:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  组件渲染 ──→ 每次都执行 expensiveCalculation()          │
 *  │              ──→ 计算结果可能相同但仍然重新计算             │
 *  │              ──→ 性能浪费                                  │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *  使用 useMemo:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  组件渲染 ──→ 检查依赖数组                                 │
 *  │              ──→ 依赖未变化 → 返回缓存结果                  │
 *  │              ──→ 依赖变化 → 重新计算                       │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *  语法:
 *  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
 */

// ============================================================================
// useMemo 基础示例
// ============================================================================

/**
 * useMemo 基础用法
 */
function UseMemoBasic() {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(10);

  // 模拟耗时计算
  const expensiveCalculation = (n) => {
    console.log('执行耗时计算...');
    let result = 0;
    for (let i = 0; i < 10000000; i++) {
      result += Math.sqrt(i);
    }
    return result + n;
  };

  // 不使用 useMemo - 每次渲染都重新计算
  const normalResult = expensiveCalculation(num);

  // 使用 useMemo - 只有当 num 改变时才重新计算
  const memoizedResult = useMemo(() => expensiveCalculation(num), [num]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>1. useMemo 基础用法</h3>

      <div style={{ marginBottom: '15px' }}>
        <p>计数 (改变这个会触发渲染但不重新计算): {count}</p>
        <p>数字 (改变这个会重新计算): {num}</p>
        <button onClick={() => setCount(c => c + 1)} style={{ marginRight: '10px' }}>
          增加计数
        </button>
        <button onClick={() => setNum(n => n + 1)}>
          增加数字
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ padding: '15px', background: '#ffebee', borderRadius: '4px' }}>
          <p><strong>不使用 useMemo:</strong></p>
          <p>结果: {normalResult.toFixed(0)}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>每次渲染都重新计算</p>
        </div>
        <div style={{ padding: '15px', background: '#e8f5e9', borderRadius: '4px' }}>
          <p><strong>使用 useMemo:</strong></p>
          <p>结果: {memoizedResult.toFixed(0)}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>只在num改变时重新计算</p>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
        提示：打开控制台查看"执行耗时计算..."的输出次数
      </p>
    </div>
  );
}

// ============================================================================
// useMemo 进阶示例 - 对象缓存
// ============================================================================

/**
 * useMemo 用于对象和数组的缓存
 */
function UseMemoObject() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');
  const [age, setAge] = useState(25);

  // 问题：每次渲染都会创建新对象，导致子组件重新渲染
  const userInfo = { name, age };

  // 解决：使用 useMemo 缓存对象
  const memoizedUserInfo = useMemo(() => ({ name, age }), [name, age]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>2. useMemo 缓存对象</h3>

      <div style={{ marginBottom: '15px' }}>
        <p>计数: {count}</p>
        <p>姓名: {name}</p>
        <p>年龄: {age}</p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setCount(c => c + 1)}>增加计数</button>
          <button onClick={() => setName('李四')}>修改姓名</button>
          <button onClick={() => setAge(a => a + 1)}>增加年龄</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <p><strong>不使用 useMemo:</strong></p>
          <p style={{ fontSize: '12px' }}>userInfo 对象: {JSON.stringify(userInfo)}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            每次渲染都是新对象引用<br />
            (count 改变时也是新对象)
          </p>
        </div>
        <div>
          <p><strong>使用 useMemo:</strong></p>
          <p style={{ fontSize: '12px' }}>memoizedUserInfo: {JSON.stringify(memoizedUserInfo)}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            只有 name 或 age 改变时才创建新对象<br />
            (count 改变时保持相同引用)
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. useCallback - 缓存函数
// ============================================================================

/*
 * useCallback 用于缓存函数，避免因函数引用变化导致的不必要渲染
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │          useCallback 原理               │
 *                    └─────────────────────────────────────────┘
 *
 *  问题场景:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  function Parent() {                                        │
 *  │    const handleClick = () => { ... }  // 每次渲染创建新函数 │
 *  │    return <Child onClick={handleClick} />                  │
 *  │  }                                                          │
 *  │                                                              │
 *  │  const Child = React.memo(({ onClick }) => {               │
 *  │    return <button onClick={onClick}>点击</button>         │
 *  │  });                                                        │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *  问题: handleClick 每次都是新引用，Child 会认为 props 变化而重新渲染
 *
 *  解决: 使用 useCallback
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  const handleClick = useCallback(() => { ... }, []);        │
 *  │  // 依赖数组为空，函数引用保持不变                          │
 *  └─────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// useCallback 基础示例
// ============================================================================

/**
 * useCallback 基础用法
 */
function UseCallbackBasic() {
  const [count, setCount] = useState(0);

  // 不使用 useCallback - 每次渲染都是新函数
  const handleClickNormal = () => {
    console.log('普通函数被调用');
  };

  // 使用 useCallback - 只有依赖变化时才创建新函数
  const handleClickMemoized = useCallback(() => {
    console.log('useCallback 函数被调用, count:', count);
  }, [count]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>3. useCallback 基础用法</h3>

      <p>计数: {count}</p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => setCount(c => c + 1)}>增加计数</button>
        <button onClick={handleClickNormal}>普通函数</button>
        <button onClick={handleClickMemoized}>useCallback函数</button>
      </div>

      <p style={{ fontSize: '12px', color: '#666' }}>
        打开控制台查看函数引用是否变化<br />
        每次点击"增加计数"，普通函数的引用会变化，useCallback的函数在count变化时也会变化
      </p>
    </div>
  );
}

// ============================================================================
// useCallback 与子组件
// ============================================================================

/**
 * useCallback 与 React.memo 配合使用
 */

// 子组件 - 使用 React.memo 包装
const Button = React.memo(function Button({ onClick, children }) {
  console.log(`Button "${children}" 渲染`);
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        margin: '5px',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
});

function UseCallbackWithMemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // 问题：不使用 useCallback
  const handleIncrement = () => {
    setCount(c => c + 1);
  };

  // 解决：使用 useCallback
  const handleNameChange = useCallback((e) => {
    setName(e.target.value);
  }, []);

  // 带依赖的 useCallback
  const handleDoubleIncrement = useCallback(() => {
    setCount(c => c + 2);
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>4. useCallback 与 React.memo</h3>

      <div style={{ marginBottom: '15px' }}>
        <p>计数: {count}</p>
        <p>姓名: {name}</p>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="输入姓名"
            style={{ padding: '8px', marginRight: '10px' }}
          />
        </div>

        <Button onClick={handleIncrement}>
          +1 (未使用useCallback)
        </Button>

        <Button onClick={handleDoubleIncrement}>
          +2 (使用useCallback)
        </Button>
      </div>

      <p style={{ fontSize: '12px', color: '#666' }}>
        观察控制台输出：输入文字时，第二个按钮不会重新渲染（因为使用了useCallback）
      </p>
    </div>
  );
}

// ============================================================================
// 3. React.memo - 缓存组件
// ============================================================================

/*
 * React.memo 是一个高阶组件，用于缓存整个组件
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │           React.memo 原理               │
 *                    └─────────────────────────────────────────┘
 *
 *  不使用 React.memo:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  父组件渲染 ──→ 子组件无条件重新渲染                        │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *  使用 React.memo:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  父组件渲染 ──→ 比较 props ──→ props相同 → 跳过渲染         │
 *  │                   ──→ props不同 → 重新渲染                  │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *  语法:
 *  const MemoizedComponent = React.memo(function MyComponent(props) {
 *    return <div>{props.value}</div>;
 *  });
 *
 *  // 或者带自定义比较函数
 *  const MemoizedComponent = React.memo(MyComponent, (prevProps, nextProps) => {
 *    return prevProps.id === nextProps.id;
 *  });
 */

// ============================================================================
// React.memo 示例
// ============================================================================

/**
 * React.memo 基础用法
 */
function MemoBasic() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 普通子组件
  function NormalChild({ value }) {
    console.log('NormalChild 渲染');
    return <div style={{ padding: '10px', background: '#ffebee' }}>普通子组件: {value}</div>;
  }

  // 使用 React.memo 的子组件
  const MemoizedChild = React.memo(function MemoizedChild({ value }) {
    console.log('MemoizedChild 渲染');
    return <div style={{ padding: '10px', background: '#e8f5e9' }}>Memo子组件: {value}</div>;
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>5. React.memo 基础用法</h3>

      <div style={{ marginBottom: '15px' }}>
        <p>计数: {count} | 文本: {text}</p>
        <button onClick={() => setCount(c => c + 1)} style={{ marginRight: '10px' }}>
          增加计数
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入文本"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <NormalChild value={count} />
        <MemoizedChild value={count} />
      </div>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        提示：输入文本时，MemoizedChild不会重新渲染（因为props没变）
      </p>
    </div>
  );
}

// ============================================================================
// 自定义比较函数
// ============================================================================

/**
 * React.memo 自定义比较函数
 */
function MemoCustomCompare() {
  const [user, setUser] = useState({ name: '张三', age: 25 });

  // 只有当 name 改变时才重新渲染，age 改变不触发渲染
  const MemoizedUser = React.memo(
    function UserCard({ user }) {
      return (
        <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
          <p>姓名: {user.name}</p>
          <p>年龄: {user.age}</p>
        </div>
      );
    },
    (prevProps, nextProps) => {
      // 返回 true 表示相同时不重新渲染
      return prevProps.user.name === nextProps.user.name;
    }
  );

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>6. React.memo 自定义比较</h3>

      <div style={{ marginBottom: '15px' }}>
        <p>当前用户: {user.name}, {user.age}岁</p>
        <button onClick={() => setUser({ ...user, name: user.name === '张三' ? '李四' : '张三' })} style={{ marginRight: '10px' }}>
          切换姓名
        </button>
        <button onClick={() => setUser({ ...user, age: user.age + 1 })}>
          增加年龄
        </button>
      </div>

      <MemoizedUser user={user} />

      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        切换姓名会触发重新渲染，增加年龄不会（因为自定义比较函数只比较name）
      </p>
    </div>
  );
}

// ============================================================================
// 4. 综合性能优化
// ============================================================================

/**
 * 综合性能优化示例
 */
function ComprehensiveOptimization() {
  const [items, setItems] = useState([
    { id: 1, name: '苹果', price: 5 },
    { id: 2, name: '香蕉', price: 3 },
    { id: 3, name: '橙子', price: 4 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [counter, setCounter] = useState(0);

  // 1. 使用 useMemo 缓存过滤结果
  const filteredItems = useMemo(() => {
    console.log('过滤列表...');
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // 2. 使用 useMemo 缓存计算结果
  const totalPrice = useMemo(() => {
    console.log('计算总价...');
    return filteredItems.reduce((sum, item) => sum + item.price, 0);
  }, [filteredItems]);

  // 3. 使用 useCallback 缓存处理函数
  const handleAddItem = useCallback(() => {
    const newId = Math.max(...items.map(i => i.id)) + 1;
    const newItem = {
      id: newId,
      name: `水果${newId}`,
      price: Math.floor(Math.random() * 10) + 1
    };
    setItems([...items, newItem]);
  }, [items]);

  const handleRemoveItem = useCallback((id) => {
    setItems(items.filter(item => item.id !== id));
  }, [items]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>7. 综合性能优化示例</h3>

      <div style={{ marginBottom: '15px' }}>
        <p>计数器: {counter}</p>
        <button onClick={() => setCounter(c => c + 1)} style={{ marginRight: '10px' }}>
          增加计数（触发父组件渲染）
        </button>
        <button onClick={handleAddItem}>添加水果</button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索水果..."
          style={{ padding: '8px', width: '200px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p><strong>商品列表:</strong></p>
        {filteredItems.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              margin: '5px 0',
              background: '#f5f5f5',
              borderRadius: '4px'
            }}
          >
            <span>{item.name} - ${item.price}</span>
            <button onClick={() => handleRemoveItem(item.id)}>删除</button>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
        总价: ${totalPrice}
      </p>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
        <strong>优化说明:</strong><br />
        1. useMemo 缓存过滤和计算结果，避免不必要的重复计算<br />
        2. useCallback 缓存函数，避免子组件不必要的重新渲染<br />
        3. 点击"增加计数"只更新计数器，不过滤列表<br />
        4. 打开控制台查看各函数的执行次数
      </p>
    </div>
  );
}

// ============================================================================
// 何时使用性能优化
// ============================================================================

/**
 * 何时使用性能优化 - 反面教材 vs 正面教材
 */
function WhenToOptimize() {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>8. 何时使用性能优化</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>过度优化的反面教材</h4>
        <pre style={{ background: '#ffebee', padding: '15px', borderRadius: '4px', fontSize: '12px' }}>
{`// 不需要优化的场景
function Counter() {
  const [count, setCount] = useState(0);

  // 不需要 useMemo - 简单计算
  const double = useMemo(() => count * 2, [count]);

  // 不需要 useCallback - 函数未传递给子组件
  const handleClick = useCallback(() => setCount(c => c + 1), []);

  return <button onClick={handleClick}>{double}</button>;
}`}
        </pre>
      </div>

      <div>
        <h4>需要优化的场景</h4>
        <pre style={{ background: '#e8f5e9', padding: '15px', borderRadius: '4px', fontSize: '12px' }}>
{`// 需要优化的场景
function Parent() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);

  // 1. 大型列表需要缓存
  const filteredItems = useMemo(
    () => items.filter(item => item.name.includes(query)),
    [items, query]
  );

  // 2. 传递给 memo 组件的函数需要缓存
  const handleItemClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      <ItemList items={filteredItems} onItemClick={handleItemClick} />
    </div>
  );
}

const ItemList = React.memo(({ items, onItemClick }) => {
  return items.map(item => (
    <Item key={item.id} item={item} onClick={onItemClick} />
  ));
});`}
        </pre>
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p><strong>性能优化原则:</strong></p>
        <ul>
          <li>先测量，再优化 - 使用 React DevTools Profiler</li>
          <li>避免过早优化</li>
          <li>优先优化渲染次数多的组件</li>
          <li>复杂计算和大型列表必须优化</li>
          <li>简单组件不需要过度优化</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// 主组件
// ============================================================================

export default function PerformanceOptimization() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>React 性能优化</h1>

      <p style={{ color: '#666', marginBottom: '20px' }}>
        介绍 useMemo、useCallback、React.memo 三大性能优化工具
      </p>

      {/* useMemo 基础 */}
      <UseMemoBasic />

      {/* useMemo 缓存对象 */}
      <UseMemoObject />

      {/* useCallback 基础 */}
      <UseCallbackBasic />

      {/* useCallback 与 memo */}
      <UseCallbackWithMemo />

      {/* React.memo 基础 */}
      <MemoBasic />

      {/* React.memo 自定义比较 */}
      <MemoCustomCompare />

      {/* 综合示例 */}
      <ComprehensiveOptimization />

      {/* 何时优化 */}
      <WhenToOptimize />

      {/* 总结 */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginTop: '20px' }}>
        <h3>性能优化总结</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#c8e6c9' }}>
              <th style={{ padding: '10px', border: '1px solid #81c784', textAlign: 'left' }}>API</th>
              <th style={{ padding: '10px', border: '1px solid #81c784', textAlign: 'left' }}>作用</th>
              <th style={{ padding: '10px', border: '1px solid #81c784', textAlign: 'left' }}>使用场景</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #81c784' }}>useMemo</td>
              <td style={{ padding: '10px', border: '1px solid #81c784' }}>缓存计算结果</td>
              <td style={{ padding: '10px', border: '1px solid #81c784' }}>复杂计算、过滤/排序</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #81c784' }}>useCallback</td>
              <td style={{ padding: '10px', border: '1px solid #81c784' }}>缓存函数引用</td>
              <td style={{ padding: '10px', border: '1px solid #81c784' }}>传递给子组件的回调函数</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #81c784' }}>React.memo</td>
              <td style={{ padding: '10px', border: '1px solid #81c784' }}>缓存组件</td>
              <td style={{ padding: '10px', border: '1px solid #81c784' }}>纯展示组件、频繁渲染的子组件</td>
            </tr>
          </tbody>
        </table>

        <h4>优化流程图</h4>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`发现问题
   │
   ▼
使用 React DevTools Profiler 测量
   │
   ├── 找到渲染瓶颈
   │
   ▼
选择合适的优化策略
   │
   ├── 组件频繁渲染 → React.memo
   │
   ├── 计算复杂 → useMemo
   │
   └── 传递函数给子组件 → useCallback
   │
   ▼
验证优化效果
   │
   └── 再次测量确认改善`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// 导出
// ============================================================================

export {
  UseMemoBasic,
  UseMemoObject,
  UseCallbackBasic,
  UseCallbackWithMemo,
  MemoBasic,
  MemoCustomCompare,
  ComprehensiveOptimization,
  WhenToOptimize
};
