/**
 * ============================================
 * flushSync 强制同步更新
 * Chapter 10 - ReactDOM Deep Understanding
 * ============================================
 *
 * 本文件介绍React DOM中的flushSync API和强制同步更新机制
 *
 * [目录]
 * 1. flushSync 简介
 * 2. 批量更新 vs 同步更新
 * 3. 实际应用场景
 * 4. 注意事项
 */

import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

// ============================================================================
// 1. flushSync 简介
// ============================================================================

/*
 * flushSync 是 React DOM 提供的一个API，用于强制同步更新状态
 *
 * 默认情况下，React使用批量更新（ batching ）来优化性能：
 * - 多个 setState 调用会被合并为一次渲染
 * - 在事件处理函数中异步执行
 *
 * flushSync 可以打破这种行为，强制立即更新：
 *
 *    ┌─────────────────────────────────────────────┐
 *    │              普通 setState                   │
 *    │  setCount(1) ──┐                            │
 *    │  setText('a') ─┼──→ 批量更新 → 1次渲染       │
 *    │  setFlag(true) ─┘                            │
 *    └─────────────────────────────────────────────┘
 *
 *    ┌─────────────────────────────────────────────┐
 *    │           flushSync 强制同步                 │
 *    │  setCount(1) ──→ 立即渲染                   │
 *    │  setText('a') ──→ 立即渲染                   │
 *    │  setFlag(true) ──→ 立即渲染                  │
 *    └─────────────────────────────────────────────┘
 *
 * 语法:
 * flushSync(() => {
 *   setState(newValue);
 * });
 */

// ============================================================================
// 2. 批量更新 vs 同步更新对比
// ============================================================================

/**
 * 展示批量更新和同步更新的区别
 */
function BatchingVsSync() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [flag, setFlag] = useState(false);
  const renderLog = useRef([]);

  // 记录渲染
  useEffect(() => {
    renderLog.current.push(`渲染: count=${count}, text="${text}", flag=${flag}`);
  }, [count, text, flag]);

  // 批量更新 - 多次setState只触发一次渲染
  const handleBatchUpdate = () => {
    setCount(1);
    setText('hello');
    setFlag(true);
    // 此时组件只渲染一次，所有状态一起更新
  };

  // 强制同步更新 - 每次setState都触发渲染
  const handleSyncUpdate = () => {
    flushSync(() => {
      setCount(2);
    });
    // 此时已经触发了一次渲染
    flushSync(() => {
      setText('world');
    });
    // 又触发了一次渲染
    flushSync(() => {
      setFlag(false);
    });
    // 再触发一次渲染
  };

  const reset = () => {
    setCount(0);
    setText('');
    setFlag(false);
    renderLog.current = [];
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>批量更新 vs 同步更新</h3>

      <div style={{ marginBottom: '15px' }}>
        <p>计数: <strong>{count}</strong></p>
        <p>文本: <strong>{text}</strong></p>
        <p>标志: <strong>{flag ? '是' : '否'}</strong></p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={handleBatchUpdate} style={{ padding: '8px 16px' }}>
          批量更新
        </button>
        <button onClick={handleSyncUpdate} style={{ padding: '8px 16px' }}>
          强制同步更新
        </button>
        <button onClick={reset} style={{ padding: '8px 16px' }}>
          重置
        </button>
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        <p>渲染日志（点击按钮后查看）:</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '150px', overflow: 'auto' }}>
          {renderLog.current.join('\n') || '点击按钮查看日志'}
        </pre>
      </div>

      <p style={{ fontSize: '12px', color: '#888' }}>
        提示：批量更新点击一次后查看日志只有1条记录，同步更新有3条记录
      </p>
    </div>
  );
}

// ============================================================================
// 3. 实际应用场景 - DOM引用同步
// ============================================================================

/**
 * 场景1: 在状态更新后同步获取DOM
 *
 * 常见问题：setState后立即获取DOM尺寸，DOM还是旧的值
 * 解决方案：使用flushSync强制同步更新
 */
function DOMRefSync() {
  const [width, setWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const boxRef = useRef(null);
  const containerRef = useRef(null);

  // 错误方式：状态更新后立即读取DOM（可能获取到旧值）
  const handleWrong = () => {
    // 设置新宽度
    setWidth(300);
    // 立即读取 - 可能是旧值（因为React批量更新）
    if (boxRef.current) {
      console.log('错误方式 - 读取到的宽度:', boxRef.current.offsetWidth);
    }
  };

  // 正确方式：使用flushSync
  const handleCorrect = () => {
    flushSync(() => {
      setWidth(300);
    });
    // 现在DOM已经更新，可以获取正确值
    if (boxRef.current) {
      console.log('正确方式 - 读取到的宽度:', boxRef.current.offsetWidth);
      setContainerWidth(boxRef.current.offsetWidth);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>场景1: DOM引用同步</h3>
      <p>在状态更新后同步获取DOM尺寸</p>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '15px'
        }}
      >
        <div
          ref={boxRef}
          style={{
            width: width || 100,
            height: '50px',
            backgroundColor: '#007bff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.3s ease'
          }}
        >
          宽度: {width}px
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={handleWrong}>
          错误方式（批量更新）
        </button>
        <button onClick={handleCorrect}>
          正确方式（flushSync）
        </button>
      </div>

      <p style={{ fontSize: '12px', color: '#666' }}>
        同步读取到的容器宽度: <strong>{containerWidth}px</strong>
      </p>

      <p style={{ fontSize: '12px', color: '#888' }}>
        提示：打开控制台查看日志，错误方式可能显示旧值（100），正确方式显示新值（300）
      </p>
    </div>
  );
}

// ============================================================================
// 4. 实际应用场景 - 表单验证
// ============================================================================

/**
 * 场景2: 表单验证与错误提示同步显示
 */
function FormValidation() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const validateEmail = (value) => {
    if (!value) return '邮箱不能为空';
    if (!/\S+@\S+\.\S+/.test(value)) return '邮箱格式不正确';
    return '';
  };

  // 提交表单 - 需要同步验证并显示错误
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitCount(c => c + 1);

    // 使用 flushSync 确保错误立即显示
    flushSync(() => {
      setTouched(true);
    });

    const validationError = validateEmail(email);
    flushSync(() => {
      setError(validationError);
    });

    if (!validationError) {
      alert('表单提交成功！');
    }
  };

  const handleBlur = () => {
    flushSync(() => {
      setTouched(true);
    });
    setError(validateEmail(email));
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>场景2: 表单验证同步显示</h3>
      <p>使用flushSync确保验证错误立即显示</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            邮箱:
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched) {
                  flushSync(() => {
                    setError(validateEmail(e.target.value));
                  });
                }
              }}
              onBlur={handleBlur}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                border: error && touched ? '1px solid red' : '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </label>
          {error && touched && (
            <span style={{ color: 'red', fontSize: '12px' }}>
              {error}
            </span>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          提交表单 (提交次数: {submitCount})
        </button>
      </form>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
        提示：输入无效邮箱后点击提交，错误会立即显示
      </p>
    </div>
  );
}

// ============================================================================
// 5. 实际应用场景 - 滚动到元素
// ============================================================================

/**
 * 场景3: 平滑滚动到指定元素
 */
function ScrollToElement() {
  const [activeId, setActiveId] = useState(0);
  const itemRefs = useRef([]);

  const scrollToItem = (index) => {
    const element = itemRefs.current[index];
    if (!element) return;

    // 先更新状态
    flushSync(() => {
      setActiveId(index);
    });

    // 然后滚动到元素
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const items = ['第一项', '第二项', '第三项', '第四项', '第五项'];

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>场景3: 滚动到指定元素</h3>
      <p>状态更新后同步滚动到目标元素</p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => scrollToItem(index)}
            style={{
              padding: '8px 16px',
              background: activeId === index ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            滚动到 {item}
          </button>
        ))}
      </div>

      <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #ddd', padding: '10px' }}>
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            style={{
              padding: '15px',
              margin: '10px 0',
              background: activeId === index ? '#e7f1ff' : '#f8f9fa',
              border: activeId === index ? '1px solid #007bff' : '1px solid #ddd',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            }}
          >
            {item} - 这是第 {index + 1} 项内容
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. 实际应用场景 - 焦点管理
// ============================================================================

/**
 * 场景4: 焦点管理与输入验证
 */
function FocusManagement() {
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const handleValidateAndFocus = () => {
    if (!name.trim()) {
      // 使用 flushSync 确保错误状态和焦点同时生效
      flushSync(() => {
        setError('名称不能为空');
      });
      inputRef.current?.focus();
    } else {
      flushSync(() => {
        setError('');
      });
      alert('验证通过！');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>场景4: 焦点管理与验证</h3>
      <p>验证失败时同步设置错误并聚焦输入框</p>

      <div style={{ marginBottom: '15px' }}>
        <label>
          名称:
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) {
                flushSync(() => {
                  setError('');
                });
              }
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: error ? '1px solid red' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
      </div>

      <button
        onClick={handleValidateAndFocus}
        style={{
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        验证并聚焦
      </button>
    </div>
  );
}

// ============================================================================
// 7. 与 useEffect 的对比
// ============================================================================

/**
 * flushSync vs useEffect
 *
 * useEffect: 在渲染后异步执行，用于副作用
 * flushSync: 同步执行，用于需要立即更新的场景
 */
function SyncVsEffect() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState([]);

  const addLog = (message) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // 使用 flushSync - 同步执行
  const handleFlushSync = () => {
    addLog('开始 flushSync');
    flushSync(() => {
      setCount(1);
    });
    addLog('flushSync 完成后');
  };

  // 使用 useEffect - 异步执行
  const handleEffect = () => {
    addLog('开始 setState');
    setCount(2);
    addLog('setState 调用后');
  };

  // useEffect 在渲染后执行
  useEffect(() => {
    if (count !== 0) {
      addLog(`useEffect 执行 - count = ${count}`);
    }
  }, [count]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>flushSync vs useEffect 执行顺序</h3>

      <p>当前计数: <strong>{count}</strong></p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={handleFlushSync}>flushSync 方式</button>
        <button onClick={handleEffect}>useEffect 方式</button>
        <button onClick={() => { setCount(0); setLog([]); }}>重置</button>
      </div>

      <div style={{ fontSize: '12px' }}>
        <p>执行日志:</p>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '200px', overflow: 'auto' }}>
          {log.join('\n') || '点击按钮查看日志'}
        </pre>
      </div>

      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        <p><strong>flushSync:</strong> 同步执行，setCount后立即执行后续代码</p>
        <p><strong>useEffect:</strong> 异步执行，在渲染完成后执行</p>
      </div>
    </div>
  );
}

// ============================================================================
// 8. 完整流程图
// ============================================================================

/*
 * React 更新流程与 flushSync
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │                         React 渲染流程                                 │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 *  1. 触发更新
 *     │
 *     ├── 用户交互 (setState)
 *     │
 *     ▼
 *  2. Render Phase
 *     │
 *     ├── 创建新的React元素树
 *     ├── Diff算法比较差异
 *     │
 *     ▼
 *  3. Commit Phase (普通setState - 批量更新)
 *     │
 *     ├── React 18: 自动批量更新
 *     ├── 多个setState合并为一次渲染
 *     │
 *     ▼
 *  4. 渲染完成 ──────────────────────────────────────────┐
 *                                                          │
 *  ┌──────────────────────────────────────────────────────┘
 *  │
 *  ▼
 * 5. Commit Phase (flushSync - 同步更新)
 *     │
 *     ├── 立即执行状态更新
 *     ├── 立即触发渲染
 *     ├── 立即更新DOM
 *     └── 立即执行后续代码
 *
 *                    ┌─────────────────────────────────────┐
 *                    │           使用建议                  │
 *                    └─────────────────────────────────────┘
 *
 *  优先使用普通setState:
 *  - 性能更好
 *  - React会自动优化
 *
 *  使用flushSync的场景:
 *  - 需要同步读取DOM
 *  - 需要同步聚焦/滚动
 *  - 需要同步显示验证错误
 *  - 外部库需要同步更新
 */

// ============================================================================
// 主组件
// ============================================================================

export default function FlushSyncDemo() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>flushSync 强制同步更新</h1>

      <p style={{ color: '#666', marginBottom: '20px' }}>
        flushSync 是React DOM提供的API，用于强制同步更新状态
      </p>

      {/* 示例1: 批量更新 vs 同步更新 */}
      <BatchingVsSync />

      {/* 示例2: DOM引用同步 */}
      <DOMRefSync />

      {/* 示例3: 表单验证 */}
      <FormValidation />

      {/* 示例4: 滚动到元素 */}
      <ScrollToElement />

      {/* 示例5: 焦点管理 */}
      <FocusManagement />

      {/* 示例6: 执行顺序对比 */}
      <SyncVsEffect />

      {/* 总结 */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginTop: '20px' }}>
        <h3>flushSync 使用总结</h3>
        <ul>
          <li><strong>作用</strong> - 强制同步执行状态更新和DOM渲染</li>
          <li><strong>语法</strong> - flushSync(() => { })</li>
          <li><strong>适用场景</strong>:
            <ul>
              <li>状态更新后需要立即读取DOM</li>
              <li>需要同步显示验证错误</li>
              <li>需要同步滚动或聚焦</li>
              <li>与外部非React库集成时</li>
            </ul>
          </li>
          <li><strong>注意事项</strong>:
            <ul>
              <li>会破坏React的性能优化</li>
              <li>应仅在必要时使用</li>
              <li>尽量使用useEffect代替</li>
            </ul>
          </li>
        </ul>

        <h4>性能考虑</h4>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// 推荐：使用 useEffect 读取DOM
useEffect(() => {
  // DOM已更新，可以安全读取
  console.log(boxRef.current.offsetWidth);
}, [width]);

// 备选：使用 flushSync（仅在必要时）
flushSync(() => {
  setWidth(300);
});
console.log(boxRef.current.offsetWidth); // 同步读取`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// 导出
// ============================================================================

export { BatchingVsSync, DOMRefSync, FormValidation, ScrollToElement, FocusManagement };
