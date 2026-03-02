/**
 * ============================================
 * 虚拟DOM与Diff算法演示
 * Chapter 10 - ReactDOM Deep Understanding
 * ============================================
 *
 * 本文件深入介绍React的虚拟DOM和Diff算法原理
 *
 * [目录]
 * 1. 虚拟DOM概念
 * 2. Diff算法原理
 * 3. 协调过程演示
 * 4. Key的作用
 * 5. 性能优化技巧
 */

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// 1. 虚拟DOM概念
// ============================================================================

/*
 * 虚拟DOM (Virtual DOM) 是真实DOM的JavaScript对象表示
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │              真实DOM                    │
 *                    │  <div class="container">              │
 *                    │    <h1>标题</h1>                      │
 *                    │    <p>内容</p>                         │
 *                    │  </div>                               │
 *                    └─────────────────────────────────────────┘
 *                              │
 *                              │ 映射
 *                              ▼
 *                    ┌─────────────────────────────────────────┐
 *                    │            虚拟DOM                      │
 *                    │  {                                     │
 *                    │    type: 'div',                       │
 *                    │    props: { className: 'container' }, │
 *                    │    children: [                        │
 *                    │      { type: 'h1', children: ['标题'] }, │
 *                    │      { type: 'p', children: ['内容'] }  │
 *                    │    ]                                   │
 *                    │  }                                     │
 *                    └─────────────────────────────────────────┘
 *
 * 虚拟DOM的优势:
 * 1. 减少真实DOM操作次数
 * 2. 批量更新，提高性能
 * 3. 跨平台渲染（React Native, SSR等）
 */

// ============================================================================
// 虚拟DOM结构可视化组件
// ============================================================================

/**
 * 展示虚拟DOM结构
 */
function VirtualDOMStructure() {
  const [showTree, setShowTree] = useState(false);

  // 模拟一个React元素的内部结构
  const reactElement = {
    $$typeof: Symbol('react.element'),
    type: 'div',
    key: null,
    ref: null,
    props: {
      className: 'container',
      children: [
        {
          type: 'h1',
          props: { style: { color: 'blue' }, children: '欢迎学习React' }
        },
        {
          type: 'p',
          props: { children: '虚拟DOM是React的核心概念' }
        }
      ]
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>1. 虚拟DOM结构</h3>
      <p>React元素是包含type、props等属性的JavaScript对象</p>

      <button onClick={() => setShowTree(!showTree)} style={{ marginBottom: '15px' }}>
        {showTree ? '隐藏' : '显示'}虚拟DOM结构
      </button>

      {showTree && (
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(reactElement, (key, value) => {
            if (key === '$$typeof') return 'Symbol(react.element)';
            return value;
          }, 2)}
        </pre>
      )}
    </div>
  );
}

// ============================================================================
// 2. Diff算法原理
// ============================================================================

/*
 * React的Diff算法用于找出新旧虚拟DOM之间的差异
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │              Diff算法                    │
 *                    └─────────────────────────────────────────┘
 *
 *  React使用两大假设来优化Diff算法:
 *  ┌──────────────────────────────────────────────────────────┐
 *  │  假设1: 不同类型的元素产生不同的树                          │
 *  │  假设2: 开发者可以通过key暗示哪些元素稳定                   │
 *  └──────────────────────────────────────────────────────────┘
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │           Diff算法流程                   │
 *                    └─────────────────────────────────────────┘
 *
 *  1. 对比根元素
 *     ├── 类型不同 → 卸载旧树，重建新树
 *     └── 类型相同 → 继续对比属性
 *
 *  2. 对比子元素 (递归)
 *     ├── 同层级对比 (逐层比较)
 *     ├── key的作用 (识别移动元素)
 *     └── 优化策略 (首尾对比)
 *
 *  3. 属性对比
 *     ├── style → 智能合并
 *     ├── className → 直接替换
 *     └── 事件处理 → 更新处理函数
 */

// ============================================================================
// Diff算法演示组件
// ============================================================================

/**
 * 展示Diff算法的工作过程
 */
function DiffAlgorithmDemo() {
  const [step, setStep] = useState(0);

  // 模拟Diff过程的各个阶段
  const steps = [
    {
      title: '原始DOM',
      oldTree: 'div → ul → li (x3)',
      newTree: null,
      action: '初始状态'
    },
    {
      title: '第一阶段: 类型对比',
      oldTree: 'div → ul → li (x3)',
      newTree: 'div → ul → li (x3)',
      action: '类型相同，继续比较'
    },
    {
      title: '第二阶段: 属性对比',
      oldTree: 'className: "list"',
      newTree: 'className: "list active"',
      action: '更新className属性'
    },
    {
      title: '第三阶段: 子元素对比',
      oldTree: 'li: "A", "B", "C"',
      newTree: 'li: "A", "B", "C"',
      action: '子元素相同，无需更新'
    }
  ];

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>2. Diff算法工作流程</h3>

      <div style={{ marginBottom: '15px' }}>
        <p>点击按钮逐步展示Diff过程:</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setStep(Math.max(0, step - 1))}>上一步</button>
          <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>下一步</button>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '4px',
        marginBottom: '15px'
      }}>
        <h4>阶段 {step + 1}: {steps[step].title}</h4>
        <p><strong>操作:</strong> {steps[step].action}</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
          <div>
            <p style={{ fontWeight: 'bold', color: '#666' }}>旧树:</p>
            <code>{steps[step].oldTree}</code>
          </div>
          {steps[step].newTree && (
            <div>
              <p style={{ fontWeight: 'bold', color: '#666' }}>新树:</p>
              <code>{steps[step].newTree}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. 协调过程演示
// ============================================================================

/*
 * 协调(Reconciliation)是React Diff算法的内部名称
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │              协调过程                    │
 *                    └─────────────────────────────────────────┘
 *
 *  组件更新流程:
 *
 *  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
 *  │  旧组件      │ ──→  │  Diff算法   │ ──→  │  新组件      │
 *  │  输出       │      │   比较差异   │      │   输出      │
 *  └─────────────┘      └─────────────┘      └─────────────┘
 *        │                    │                    │
 *        ▼                    ▼                    ▼
 *  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
 *  │  旧虚拟DOM   │      │   差异记录   │      │  新虚拟DOM   │
 *  │  (旧树)     │      │  (最小更新)  │      │  (新树)     │
 *  └─────────────┘      └─────────────┘      └─────────────┘
 *                            │
 *                            ▼
 *                    ┌─────────────┐
 *                    │  提交到DOM  │
 *                    │ (最少操作)  │
 *                    └─────────────┘
 */

// ============================================================================
// 协调过程可视化
// ============================================================================

/**
 * 展示协调过程
 */
function ReconciliationDemo() {
  const [items, setItems] = useState(['A', 'B', 'C']);
  const [renderCount, setRenderCount] = useState(0);
  const logRef = useRef([]);

  useEffect(() => {
    setRenderCount(c => c + 1);
  }, [items]);

  const addLog = (msg) => {
    logRef.current.push(msg);
  };

  // 模拟协调过程
  const simulateReconciliation = (newItems) => {
    addLog('--- 开始协调 ---');
    addLog(`旧列表: [${items.join(', ')}]`);
    addLog(`新列表: [${newItems.join(', ')}]`);

    // 模拟Diff算法
    let updates = 0;
    let moves = 0;
    let deletions = 0;

    // 1. 长度比较
    if (newItems.length > items.length) {
      addLog(`新增 ${newItems.length - items.length} 个元素`);
      updates += newItems.length - items.length;
    } else if (newItems.length < items.length) {
      addLog(`删除 ${items.length - newItems.length} 个元素`);
      deletions = items.length - newItems.length;
    }

    // 2. 元素比较
    newItems.forEach((item, index) => {
      if (items[index] === undefined) {
        addLog(`  新增: "${item}" 在位置 ${index}`);
      } else if (items[index] !== item) {
        if (items.includes(item)) {
          addLog(`  移动: "${item}" 从位置 ${items.indexOf(item)} 到 ${index}`);
          moves++;
        } else {
          addLog(`  更新: "${items[index]}" → "${item}" 在位置 ${index}`);
          updates++;
        }
      } else {
        addLog(`  保持: "${item}" 在位置 ${index} (key相同)`);
      }
    });

    addLog(`--- 协调完成: ${updates}更新, ${moves}移动, ${deletions}删除 ---`);
    setItems(newItems);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>3. 协调过程演示</h3>
      <p>点击按钮模拟不同操作，观察协调过程</p>

      <div style={{ marginBottom: '15px' }}>
        <p>当前列表: <strong>[{items.join(', ')}]</strong></p>
        <p>渲染次数: <strong>{renderCount}</strong></p>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <button onClick={() => simulateReconciliation([...items, 'D'])}>
          添加D到末尾
        </button>
        <button onClick={() => simulateReconciliation(items.slice(0, -1))}>
          删除最后一个
        </button>
        <button onClick={() => simulateReconciliation(['X', ...items])}>
          添加X到开头
        </button>
        <button onClick={() => simulateReconciliation(['A', 'B', 'C'])}>
          重置为原始值
        </button>
        <button onClick={() => simulateReconciliation(['C', 'B', 'A'])}>
          反转顺序
        </button>
        <button onClick={() => {
          setItems(['A', 'B', 'C']);
          logRef.current = [];
        }}>
          完全重置
        </button>
      </div>

      <div style={{ fontSize: '12px' }}>
        <p>协调日志:</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '200px', overflow: 'auto' }}>
          {logRef.current.join('\n') || '点击按钮查看日志'}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// 4. Key的作用
// ============================================================================

/*
 *                    ┌─────────────────────────────────────────┐
 *                    │              Key的作用                   │
 *                    └─────────────────────────────────────────┘
 *
 *  key帮助React识别哪些元素发生了变化
 *
 *  无key (错误示例):
 *  ┌─────────────────────────────────────────────────────────┐
 *  │  旧: [A, B, C]   新: [A, B, C]  (位置相同但key不稳定)   │
 *  │                                                       │
 *  │  React会认为所有元素都变了，全部重新渲染               │
 *  │  结果: 性能差，状态丢失                                │
 *  └─────────────────────────────────────────────────────────┘
 *
 *  有key (正确示例):
 *  ┌─────────────────────────────────────────────────────────┐
 *  │  旧: [A:1, B:2, C:3]   新: [A:1, B:2, C:3]           │
 *  │                                                       │
 *  │  React通过key识别元素，性能最优                        │
 *  │  结果: 性能好，状态保持                                │
 *  └─────────────────────────────────────────────────────────┘
 *
 *  移动元素时的区别:
 *
 *  无key:              有key (稳定key):
 *  [A,B,C] →           [A,B,C] →
 *  [B,C,A] (重排)      [B,C,A] (移动A)
 *
 *  React认为:          React认为:
 *  A变B               A移动到最后
 *  B变C               B移到前面
 *  C变A               C移到中间
 *  (全部更新)          (1次移动)
 */

// ============================================================================
// Key的作用演示
// ============================================================================

/**
 * 展示key的重要性和最佳实践
 */
function KeyDemo() {
  const [items, setItems] = useState([
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
  ]);

  const [showKeyInfo, setShowKeyInfo] = useState(false);

  // 移动第一个元素到末尾
  const moveFirstToEnd = () => {
    if (items.length <= 1) return;
    const newItems = [...items.slice(1), items[0]];
    setItems(newItems);
  };

  // 使用索引作为key (不推荐)
  const [itemsWithIndex, setItemsWithIndex] = useState([
    'Alice', 'Bob', 'Charlie'
  ]);

  const moveFirstWithIndex = () => {
    if (itemsWithIndex.length <= 1) return;
    setItemsWithIndex([...itemsWithIndex.slice(1), itemsWithIndex[0]]);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>4. Key的作用</h3>

      {/* 使用稳定ID作为key */}
      <div style={{ marginBottom: '20px' }}>
        <h4>使用稳定ID作为key (推荐)</h4>
        <p>每个item有唯一的id，React可以准确追踪元素</p>

        <ul style={{ background: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
          {items.map(item => (
            <li key={item.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              {item.name} - {item.age}岁 (id: {item.id})
            </li>
          ))}
        </ul>

        <button onClick={moveFirstToEnd} style={{ marginTop: '10px' }}>
          移动第一个到末尾 (使用id作为key)
        </button>
      </div>

      {/* 使用索引作为key */}
      <div style={{ marginBottom: '20px' }}>
        <h4>使用索引作为key (不推荐)</h4>
        <p>当列表项的顺序会改变时，索引会失效</p>

        <ul style={{ background: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
          {itemsWithIndex.map((name, index) => (
            <li key={index} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              {name} (索引: {index})
            </li>
          ))}
        </ul>

        <button onClick={moveFirstWithIndex} style={{ marginTop: '10px' }}>
          移动第一个到末尾 (使用索引作为key)
        </button>

        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          注意：两种方式看起来效果相同，但使用索引作为key会导致React无法准确识别元素移动，
          在有状态（如输入框内容）的情况下会造成问题
        </p>
      </div>

      {/* key信息 */}
      <button onClick={() => setShowKeyInfo(!showKeyInfo)}>
        {showKeyInfo ? '隐藏' : '显示'}Key最佳实践
      </button>

      {showKeyInfo && (
        <div style={{ marginTop: '15px', fontSize: '12px' }}>
          <ul>
            <li><strong>使用稳定的唯一标识</strong> - 如数据库ID、UUID等</li>
            <li><strong>避免使用索引</strong> - 当列表会重新排序时尤其重要</li>
            <li><strong>key只在兄弟元素间唯一</strong> - 不需要全局唯一</li>
            <li><strong>不要使用随机值</strong> - key应该在每次渲染时保持一致</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. 性能优化技巧
// ============================================================================

/*
 *                    ┌─────────────────────────────────────────┐
 *                    │           性能优化技巧                    │
 *                    └─────────────────────────────────────────┘
 *
 *  1. 减少不必要的渲染
 *     ├── 使用 React.memo 缓存组件
 *     ├── 使用 useMemo 缓存计算结果
 *     ├── 使用 useCallback 缓存函数
 *     └── 合理拆分组件
 *
 *  2. 优化列表渲染
 *     ├── 使用唯一的key
 *     ├── 使用虚拟列表
 *     └── 避免使用索引作为key
 *
 *  3. 延迟加载
 *     ├── 代码分割 (React.lazy)
 *     └── 懒加载组件
 */

// ============================================================================
// 性能优化演示
// ============================================================================

/**
 * 展示性能优化的效果
 */
function PerformanceDemo() {
  const [counter, setCounter] = useState(0);
  const [text, setText] = useState('');
  const normalRenderCount = useRef(0);
  const memoRenderCount = useRef(0);

  // 普通组件 - 每次父组件渲染都会重新渲染
  function NormalChild({ text }) {
    normalRenderCount.current++;
    return (
      <div style={{ padding: '10px', background: '#e3f2fd', borderRadius: '4px' }}>
        <p>普通子组件 - 渲染次数: {normalRenderCount.current}</p>
        <p>文本: {text}</p>
      </div>
    );
  }

  // 使用 React.memo 优化的组件
  const MemoChild = React.memo(function MemoChild({ text }) {
    memoRenderCount.current++;
    return (
      <div style={{ padding: '10px', background: '#e8f5e9', borderRadius: '4px' }}>
        <p>Memo子组件 - 渲染次数: {memoRenderCount.current}</p>
        <p>文本: {text}</p>
      </div>
    );
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>5. 性能优化演示</h3>

      <div style={{ marginBottom: '20px' }}>
        <p>计数器: <strong>{counter}</strong></p>
        <button onClick={() => setCounter(c => c + 1)} style={{ marginRight: '10px' }}>
          增加计数器（触发重新渲染）
        </button>
        <button onClick={() => setText(text + 'a')}>
          修改文本
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h4>未优化 (每次都渲染)</h4>
          <NormalChild text={text} />
        </div>
        <div>
          <h4>使用 React.memo</h4>
          <MemoChild text={text} />
        </div>
      </div>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
        提示：点击"增加计数器"时，只有普通子组件会重新渲染，
        MemoChild因为props没有变化所以不会重新渲染
      </p>
    </div>
  );
}

// ============================================================================
// Diff算法可视化 - 元素类型变化
// ============================================================================

/**
 * 展示元素类型变化时的Diff行为
 */
function ElementTypeChange() {
  const [showDiv, setShowDiv] = useState(true);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>6. 元素类型变化</h3>
      <p>当元素类型改变时，React会卸载旧树并重建新树</p>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setShowDiv(!showDiv)}>
          切换为 {showDiv ? 'span' : 'div'}
        </button>
      </div>

      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
        {showDiv ? (
          <div style={{ color: 'blue', fontWeight: 'bold' }}>
            这是一个div元素
          </div>
        ) : (
          <span style={{ color: 'green', fontWeight: 'bold' }}>
            这是一个span元素
          </span>
        )}
      </div>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        注意：切换类型会触发完整的卸载和重建过程，状态会丢失
      </p>
    </div>
  );
}

// ============================================================================
// 主组件
// ============================================================================

export default function VirtualDOMDemo() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>虚拟DOM与Diff算法</h1>

      <p style={{ color: '#666', marginBottom: '20px' }}>
        深入理解React的核心概念：虚拟DOM和Diff算法
      </p>

      {/* 虚拟DOM结构 */}
      <VirtualDOMStructure />

      {/* Diff算法工作流程 */}
      <DiffAlgorithmDemo />

      {/* 协调过程 */}
      <ReconciliationDemo />

      {/* Key的作用 */}
      <KeyDemo />

      {/* 性能优化 */}
      <PerformanceDemo />

      {/* 元素类型变化 */}
      <ElementTypeChange />

      {/* 总结 */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginTop: '20px' }}>
        <h3>本章小结</h3>

        <h4>虚拟DOM</h4>
        <ul>
          <li>虚拟DOM是真实DOM的JavaScript对象表示</li>
          <li>React通过虚拟DOM实现高效的DOM更新</li>
          <li>跨平台渲染的基础（React Native、SSR等）</li>
        </ul>

        <h4>Diff算法</h4>
        <ul>
          <li>同层比较 - 只比较同一层级的节点</li>
          <li>类型不同 - 完全替换子树</li>
          <li>key的作用 - 识别移动的元素</li>
          <li>优化策略 - 首尾对比、双向遍历等</li>
        </ul>

        <h4>性能优化</h4>
        <ul>
          <li>使用稳定的key（避免使用索引）</li>
          <li>使用React.memo减少不必要的渲染</li>
          <li>合理拆分组件，避免大组件</li>
          <li>使用useMemo和useCallback缓存计算结果和函数</li>
        </ul>

        <h4>Diff算法图解</h4>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`旧树:                    新树:
<div>                    <div>
  <ul>          Diff      <ul>
    <li>A</li>   ──────→   <li>A</li>   ← 相同，保持
    <li>B</li>            <li>B</li>   ← 相同，保持
    <li>C</li>            <li>D</li>   ← 不同，更新
  </ul>                  </ul>
</div>                  </div>

更新操作:
- 保留 <li>A</li>
- 保留 <li>B</li>
- 将 <li>C</li> 更新为 <li>D</li>
`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// 导出
// ============================================================================

export {
  VirtualDOMStructure,
  DiffAlgorithmDemo,
  ReconciliationDemo,
  KeyDemo,
  PerformanceDemo,
  ElementTypeChange
};
