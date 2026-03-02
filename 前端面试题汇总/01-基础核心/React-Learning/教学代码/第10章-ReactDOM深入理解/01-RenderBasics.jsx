/**
 * ============================================
 * React DOM 渲染基础
 * Chapter 10 - ReactDOM Deep Understanding
 * ============================================
 *
 * 本文件介绍React DOM的基本渲染原理和工作流程
 *
 * [目录]
 * 1. React DOM 简介
 * 2. render() 方法详解
 * 3. 重新渲染机制
 * 4. 渲染流程图解
 */

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// 1. React DOM 简介
// ============================================================================

/*
 * React DOM 是React的渲染器之一，负责将React组件渲染到浏览器DOM中
 *
 *                    ┌─────────────────────────────────────┐
 *                    │           React Component           │
 *                    │         (React 元素/组件)           │
 *                    └─────────────────┬───────────────────┘
 *                                      │
 *                                      ▼
 *                    ┌─────────────────────────────────────┐
 *                    │         React DOM Renderer         │
 *                    │    (创建 React 元素 -> 真实DOM)     │
 *                    └─────────────────┬───────────────────┘
 *                                      │
 *                                      ▼
 *                    ┌─────────────────────────────────────┐
 *                    │              Browser DOM            │
 *                    │           (真实DOM节点)             │
 *                    └─────────────────────────────────────┘
 */

// ============================================================================
// 2. 基础渲染示例
// ============================================================================

/**
 * 最简单的React DOM渲染示例
 *
 * ReactDOM.render() 是React 18之前的核心渲染方法
 * React 18+ 推荐使用 createRoot() API
 */
function BasicRender() {
  // 使用 useState 管理组件内部状态
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>基础渲染示例</h3>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加计数
      </button>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        提示: 点击按钮会触发重新渲染，React会高效地更新DOM
      </p>
    </div>
  );
}

// ============================================================================
// 3. 渲染流程详解
// ============================================================================

/**
 * 展示React渲染的各个阶段
 *
 *                    ┌──────────────────────────────────────────┐
 *                    │           Render Phase (渲染阶段)        │
 *                    │  ┌────────────┐  ┌────────────┐        │
 *                    │  │  Commit    │  │  Render    │        │
 *                    │  │  Phase     │──│  Component │        │
 *                    │  │ (提交阶段) │  │ (渲染组件)  │        │
 *                    │  └────────────┘  └──────┬───────┘        │
 *                    └──────────────────────────┼───────────────┘
 *                                                │
 *                                                ▼
 *                    ┌──────────────────────────────────────────┐
 *                    │         Diff Algorithm (Diff算法)        │
 *                    │  ┌────────────────────────────────────┐  │
 *                    │  │   比较新旧虚拟DOM，找出差异        │  │
 *                    │  └────────────────────────────────────┘  │
 *                    └──────────────────────────┬───────────────┘
 *                                                │
 *                                                ▼
 *                    ┌──────────────────────────────────────────┐
 *                    │         Commit Phase (提交阶段)          │
 *                    │  ┌────────────────────────────────────┐  │
 *                    │  │   将变化应用到真实DOM              │  │
 *                    │  └────────────────────────────────────┘  │
 *                    └──────────────────────────────────────────┘
 */

function RenderPhasesDemo() {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    // 模拟渲染阶段
    setPhase('render');
    const timer1 = setTimeout(() => setPhase('diff'), 100);
    const timer2 = setTimeout(() => setPhase('commit'), 200);
    const timer3 = setTimeout(() => setPhase('idle'), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const phaseColors = {
    idle: '#90EE90',
    render: '#87CEEB',
    diff: '#FFD700',
    commit: '#FFA07A'
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>渲染阶段演示</h3>
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        margin: '20px 0'
      }}>
        {['render', 'diff', 'commit'].map((p) => (
          <div
            key={p}
            style={{
              padding: '10px 20px',
              backgroundColor: phase === p ? phaseColors[p] : '#eee',
              borderRadius: '4px',
              transition: 'background-color 0.3s'
            }}
          >
            {p === 'render' && '渲染阶段'}
            {p === 'diff' && 'Diff算法'}
            {p === 'commit' && '提交DOM'}
          </div>
        ))}
      </div>
      <p>当前阶段: <strong>{phase === 'idle' ? '空闲' : phase}</strong></p>
    </div>
  );
}

// ============================================================================
// 4. 组件渲染与更新
// ============================================================================

/**
 * 展示组件何时会重新渲染
 *
 * 触发重新渲染的情况:
 * 1. 组件状态(state)改变
 * 2. 组件属性(props)改变
 * 3. 父组件重新渲染
 * 4. 强制渲染(forceUpdate)
 */
function RenderTriggerDemo() {
  const [counter, setCounter] = useState(0);
  const [text, setText] = useState('');
  const renderCount = useRef(0);

  // 使用 useEffect 追踪渲染次数
  useEffect(() => {
    renderCount.current += 1;
    console.log(`组件渲染次数: ${renderCount.current}`);
  });

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>渲染触发机制</h3>

      <div style={{ marginBottom: '15px' }}>
        <p>渲染计数: <strong>{renderCount.current}</strong></p>
        <p>状态值: {counter}</p>
      </div>

      {/* 按钮1: 改变state触发渲染 */}
      <button onClick={() => setCounter(c => c + 1)} style={{ marginRight: '10px' }}>
        增加计数器 (触发渲染)
      </button>

      {/* 按钮2: 设置相同值不触发渲染 */}
      <button onClick={() => setCounter(counter)} style={{ marginRight: '10px' }}>
        设置相同值 (不触发渲染)
      </button>

      {/* 按钮3: 仅改变text不触发counter渲染 */}
      <button onClick={() => setText('hello')}>
        修改文本
      </button>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p>React使用 === 比较来判断是否需要重新渲染</p>
        <p>如果新值与旧值相同 === 为true，则不会触发重新渲染</p>
      </div>
    </div>
  );
}

// ============================================================================
// 5. 虚拟DOM vs 真实DOM
// ============================================================================

/**
 * 展示虚拟DOM的概念
 *
 * 虚拟DOM是真实DOM的JavaScript对象表示
 *
 * 真实DOM:
 * <div class="container">
 *   <h1>标题</h1>
 *   <p>内容</p>
 * </div>
 *
 * 虚拟DOM (JavaScript对象):
 * {
 *   type: 'div',
 *   props: { className: 'container' },
 *   children: [
 *     { type: 'h1', props: {}, children: ['标题'] },
 *     { type: 'p', props: {}, children: ['内容'] }
 *   ]
 * }
 */
function VirtualDOMDemo() {
  const [showTree, setShowTree] = useState(false);

  // 模拟虚拟DOM结构
  const virtualDOMTree = {
    type: 'div',
    props: { className: 'container' },
    children: [
      {
        type: 'h1',
        props: { style: { color: '#333' } },
        children: ['欢迎学习React']
      },
      {
        type: 'p',
        props: { style: { color: '#666' } },
        children: ['React使用虚拟DOM来提高性能']
      },
      {
        type: 'button',
        props: { onClick: () => alert('点击事件') },
        children: ['点击我']
      }
    ]
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>虚拟DOM结构</h3>

      <button onClick={() => setShowTree(!showTree)} style={{ marginBottom: '15px' }}>
        {showTree ? '隐藏' : '显示'}虚拟DOM树
      </button>

      {showTree && (
        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(virtualDOMTree, null, 2)}
        </pre>
      )}

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p><strong>虚拟DOM的优势:</strong></p>
        <ul>
          <li>减少直接操作真实DOM的开销</li>
          <li>批量更新，减少重排重绘</li>
          <li>跨平台渲染（React Native, React VR等）</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// 6. 批量更新机制
// ============================================================================

/**
 * 展示React的批量更新(Batching)机制
 *
 * React 18之前: 只在事件处理函数中批量更新
 * React 18+: 所有场景都自动批量更新
 *
 * 流程图:
 *
 *    ┌─────────────────────────────────────────────┐
 *    │              状态更新1: setCount(1)         │
 *    │              状态更新2: setText('hello')     │
 *    └─────────────────────┬───────────────────────┘
 *                          │
 *                          ▼
 *    ┌─────────────────────────────────────────────┐
 *    │            React批量更新机制                 │
 *    │    (Batching - 合并多次状态更新)            │
 *    └─────────────────────┬───────────────────────┘
 *                          │
 *                          ▼
 *    ┌─────────────────────────────────────────────┐
 *    │           只触发一次重新渲染                  │
 *    └─────────────────────────────────────────────┘
 */
function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 演示批量更新 - 多个setState只触发一次渲染
  const handleBatchUpdate = () => {
    // 在React 18中，这些更新会被批量处理
    setCount(1);
    setText('Hello');
    setCount(2);
    setText('World');
    // 最终只触发一次重新渲染
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>批量更新演示</h3>

      <p>计数: {count}</p>
      <p>文本: {text}</p>

      <button onClick={handleBatchUpdate}>
        批量更新（点击查看效果）
      </button>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        点击按钮后，虽然调用了4次setState，但组件只重新渲染一次
      </p>
    </div>
  );
}

// ============================================================================
// 7. 完整的渲染流程图
// ============================================================================

/**
 * 完整的React渲染流程
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                            React 渲染流程                               │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 *  1. 触发渲染
 *     │
 *     ├── 用户交互 (点击、输入等)
 *     ├── 状态变化 (setState/useState)
 *     ├── 属性变化 (props改变)
 *     └── 父组件渲染
 *
 *  2. Render Phase (渲染阶段)
 *     │
 *     ├── 调用组件函数
 *     ├── 生成新的React元素树（虚拟DOM）
 *     └── Diff算法比较新旧虚拟DOM
 *         │
 *         ├── 同层比较
 *         ├── 元素类型相同 -> 更新属性
 *         ├── 元素类型不同 -> 替换整个子树
 *         └── key的作用 -> 优化列表diff
 *
 *  3. Commit Phase (提交阶段)
 *     │
 *     ├── 将虚拟DOM变化应用到真实DOM
 *     ├── 执行DOM操作
 *     ├── 触发useEffect (异步)
 *     └── 生命周期方法 (componentDidMount等)
 *
 *  4. 渲染完成
 */

// ============================================================================
// 主组件 - 导出所有示例
// ============================================================================

/**
 * ReactDOM渲染基础 - 主组件
 * 展示React DOM的核心概念和渲染机制
 */
export default function RenderBasics() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>React DOM 渲染基础</h1>

      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
        本章介绍React DOM的基本概念、渲染原理和核心机制
      </p>

      {/* 示例1: 基础渲染 */}
      <BasicRender />

      {/* 示例2: 渲染阶段演示 */}
      <RenderPhasesDemo />

      {/* 示例3: 渲染触发机制 */}
      <RenderTriggerDemo />

      {/* 示例4: 虚拟DOM */}
      <VirtualDOMDemo />

      {/* 示例5: 批量更新 */}
      <BatchingDemo />

      {/* 总结 */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginTop: '20px' }}>
        <h3>本章小结</h3>
        <ul>
          <li>React DOM 负责将React组件渲染到浏览器</li>
          <li>React使用虚拟DOM来提高渲染性能</li>
          <li>渲染流程分为Render Phase和Commit Phase</li>
          <li>React 18+自动批量更新状态，减少不必要的渲染</li>
          <li>使用key帮助Diff算法优化列表渲染</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// 导出各个示例组件（用于独立演示）
// ============================================================================

export {
  BasicRender,
  RenderPhasesDemo,
  RenderTriggerDemo,
  VirtualDOMDemo,
  BatchingDemo
};
