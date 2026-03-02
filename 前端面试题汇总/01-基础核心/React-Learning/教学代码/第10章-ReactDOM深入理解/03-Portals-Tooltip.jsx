/**
 * ============================================
 * Portal 实现工具提示 (Tooltip)
 * Chapter 10 - ReactDOM Deep Understanding
 * ============================================
 *
 * 本文件介绍使用React Portal实现各种类型的工具提示
 *
 * [目录]
 * 1. 工具提示简介
 * 2. 基础工具提示
 * 3. 复杂定位工具提示
 * 4. 气泡确认框
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ============================================================================
// 1. 工具提示简介
// ============================================================================

/*
 * 工具提示(Tooltip)是一种常见的UI模式，用于展示额外信息
 *
 * 使用Portal实现工具提示的优势:
 * - 避免被父容器的overflow: hidden裁剪
 * - 避免被父容器的z-index影响层叠顺序
 * - 可以精确控制定位
 * - 更好的可访问性支持
 *
 *                    ┌────────────────────────┐
 *                    │    父容器 (overflow:   │
 *                    │    hidden 或 relative)│
 *                    │  ┌──────────────────┐  │
 *                    │  │   触发元素       │──┼──┐
 *                    │  │                  │  │  │
 *                    │  └──────────────────┘  │  │
 *                    │                         │  ▼
 *                    │                    ╔═══════════╗
 *                    │                    ║  Tooltip  ║ ← Portal渲染到body
 *                    │                    ║  (不被裁剪) ║
 *                    │                    ╚═══════════╝
 *                    └─────────────────────────────────
 */

// ============================================================================
// 2. 基础工具提示组件
// ============================================================================

/**
 * 基础工具提示组件
 *
 * 功能:
 * - 鼠标悬停显示提示
 * - 鼠标移出隐藏提示
 * - 支持不同位置
 */
function Tooltip({ children, content, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);

  // 计算工具提示位置
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // 根据位置计算坐标
    switch (position) {
      case 'top':
        setCoords({
          x: rect.left + scrollX + rect.width / 2,
          y: rect.top + scrollY - 10
        });
        break;
      case 'bottom':
        setCoords({
          x: rect.left + scrollX + rect.width / 2,
          y: rect.bottom + scrollY + 10
        });
        break;
      case 'left':
        setCoords({
          x: rect.left + scrollX - 10,
          y: rect.top + scrollY + rect.height / 2
        });
        break;
      case 'right':
        setCoords({
          x: rect.right + scrollX + 10,
          y: rect.top + scrollY + rect.height / 2
        });
        break;
      default:
        break;
    }
  }, [position]);

  // 位置映射
  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }
  };

  // 箭头位置映射
  const arrowPositionStyles = {
    top: { bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    bottom: { top: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    left: { right: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    right: { left: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' }
  };

  useEffect(() => {
    if (visible) {
      updatePosition();
    }
  }, [visible, updatePosition]);

  // 工具提示内容
  const tooltipContent = visible ? (
    createPortal(
      <div
        style={{
          position: 'absolute',
          ...positionStyles[position],
          backgroundColor: '#333',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 9999,
          pointerEvents: 'none', // 避免阻挡鼠标事件
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        {content}
        {/* 箭头 */}
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            backgroundColor: '#333',
            ...arrowPositionStyles[position]
          }}
        />
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        style={{ cursor: 'help' }}
      >
        {children}
      </span>
      {tooltipContent}
    </>
  );
}

// ============================================================================
// 3. 复杂定位工具提示
// ============================================================================

/**
 * 复杂定位工具提示 - 自动调整位置避免溢出
 *
 * 功能:
 * - 自动检测视口边界
 * - 智能切换显示位置
 * - 支持更多位置选项
 */
function SmartTooltip({ children, content, preferredPosition = 'top' }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(preferredPosition);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // 计算最佳位置
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // 间距
    const gap = 8;

    // 检查各个位置是否会溢出
    const positions = ['top', 'right', 'bottom', 'left'];
    let bestPosition = preferredPosition;

    for (const pos of positions) {
      let wouldOverflow = false;

      switch (pos) {
        case 'top':
          wouldOverflow = triggerRect.top < tooltipRect.height + gap;
          break;
        case 'bottom':
          wouldOverflow = triggerRect.bottom + tooltipRect.height + gap > viewportHeight;
          break;
        case 'left':
          wouldOverflow = triggerRect.left < tooltipRect.width + gap;
          break;
        case 'right':
          wouldOverflow = triggerRect.right + tooltipRect.width + gap > viewportWidth;
          break;
        default:
          break;
      }

      if (!wouldOverflow) {
        bestPosition = pos;
        break;
      }
    }

    setPosition(bestPosition);

    // 计算坐标
    let x, y;
    switch (bestPosition) {
      case 'top':
        x = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top + scrollY - tooltipRect.height - gap;
        break;
      case 'bottom':
        x = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + scrollY + gap;
        break;
      case 'left':
        x = triggerRect.left + scrollX - tooltipRect.width - gap;
        y = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + scrollX + gap;
        y = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      default:
        break;
    }

    // 确保不超出视口
    x = Math.max(gap, Math.min(x, viewportWidth - tooltipRect.width - gap));
    y = Math.max(gap, Math.min(y, viewportHeight - tooltipRect.height - gap));

    setCoords({ x, y });
  }, [preferredPosition]);

  useEffect(() => {
    if (visible) {
      // 延迟计算，等待DOM渲染
      const timer = setTimeout(calculatePosition, 0);
      return () => clearTimeout(timer);
    }
  }, [visible, calculatePosition]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (visible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visible, calculatePosition]);

  const tooltipContent = visible ? (
    createPortal(
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          left: coords.x,
          top: coords.y,
          backgroundColor: '#333',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'opacity 0.2s ease'
        }}
      >
        {content}
        <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px' }}>
          位置: {position}
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{ cursor: 'help', display: 'inline-block' }}
      >
        {children}
      </span>
      {tooltipContent}
    </>
  );
}

// ============================================================================
// 4. 气泡确认框 (Popover)
// ============================================================================

/**
 * 气泡确认框 - 带操作按钮的工具提示
 *
 * 功能:
 * - 显示更多操作选项
 * - 支持点击交互
 * - 可作为确认对话框
 */
function Popover({ children, content, onConfirm, onCancel }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // 在触发元素下方显示
    setCoords({
      x: rect.left + scrollX + rect.width / 2,
      y: rect.bottom + scrollY + 8
    });
  }, [visible]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) &&
          triggerRef.current && !triggerRef.current.contains(e.target)) {
        setVisible(false);
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible]);

  const popoverContent = visible ? (
    createPortal(
      <div
        ref={popoverRef}
        style={{
          position: 'absolute',
          left: coords.x,
          top: coords.y,
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          padding: '16px',
          minWidth: '200px',
          zIndex: 10000,
          border: '1px solid #eee'
        }}
      >
        <div style={{ marginBottom: '12px', color: '#333' }}>
          {content}
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              onCancel?.();
              setVisible(false);
            }}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              setVisible(false);
            }}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: '#007bff',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            确认
          </button>
        </div>
        {/* 箭头 */}
        <div
          style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '12px',
            height: '12px',
            backgroundColor: 'white',
            borderLeft: '1px solid #eee',
            borderTop: '1px solid #eee'
          }}
        />
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        onClick={() => setVisible(!visible)}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </span>
      {popoverContent}
    </>
  );
}

// ============================================================================
// 5. 带有状态追踪的工具提示
// ============================================================================

/**
 * 带状态显示的工具提示
 * 展示如何在Tooltip中显示动态数据
 */
function DataTooltip({ children, dataKey, data }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 60
    });
  }, [visible]);

  const tooltipContent = visible ? (
    createPortal(
      <div
        style={{
          position: 'absolute',
          left: coords.x,
          top: coords.y,
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 9999,
          minWidth: '150px'
        }}
      >
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          数据预览 ({dataKey})
        </div>
        <pre style={{
          margin: 0,
          fontSize: '11px',
          background: '#f5f5f5',
          padding: '8px',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{ cursor: 'help' }}
      >
        {children}
      </span>
      {tooltipContent}
    </>
  );
}

// ============================================================================
// 主组件 - 演示各种工具提示
// ============================================================================

export default function PortalsTooltip() {
  // 示例数据
  const userData = {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '活跃'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Portal 实现工具提示</h1>

      <p style={{ color: '#666', marginBottom: '20px' }}>
        使用React Portal实现各种类型的工具提示
      </p>

      {/* 示例1: 基础工具提示 */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>1. 基础工具提示</h3>
        <p>支持四个方向的工具提示</p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
          <Tooltip content="上方提示" position="top">
            <span style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              borderRadius: '4px',
              cursor: 'help'
            }}>
              悬停上方
            </span>
          </Tooltip>

          <Tooltip content="下方提示" position="bottom">
            <span style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              borderRadius: '4px',
              cursor: 'help'
            }}>
              悬停下方
            </span>
          </Tooltip>

          <Tooltip content="左侧提示" position="left">
            <span style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              borderRadius: '4px',
              cursor: 'help'
            }}>
              悬停左侧
            </span>
          </Tooltip>

          <Tooltip content="右侧提示" position="right">
            <span style={{
              padding: '10px 20px',
              background: '#ffc107',
              color: '#333',
              borderRadius: '4px',
              cursor: 'help'
            }}>
              悬停右侧
            </span>
          </Tooltip>
        </div>
      </div>

      {/* 示例2: 智能定位工具提示 */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>2. 智能定位工具提示</h3>
        <p>自动检测视口边界，智能切换显示位置</p>

        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
          <SmartTooltip content="我会自动调整位置来避免超出视口" preferredPosition="top">
            <span style={{
              padding: '10px 15px',
              background: '#17a2b8',
              color: 'white',
              borderRadius: '4px',
              cursor: 'help'
            }}>
              智能提示
            </span>
          </SmartTooltip>

          <SmartTooltip content="尝试调整窗口大小，我会自动适应" preferredPosition="bottom">
            <span style={{
              padding: '10px 15px',
              background: '#6c757d',
              color: 'white',
              borderRadius: '4px',
              cursor: 'help'
            }}>
              响应式提示
            </span>
          </SmartTooltip>
        </div>
      </div>

      {/* 示例3: 气泡确认框 */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>3. 气泡确认框 (Popover)</h3>
        <p>带操作按钮的工具提示</p>

        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Popover
            content="确定要执行此操作吗？"
            onConfirm={() => alert('已确认')}
            onCancel={() => console.log('已取消')}
          >
            <span style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              点击弹出
            </span>
          </Popover>

          <Popover
            content="确定要删除此项吗？此操作无法撤销。"
            onConfirm={() => alert('已删除')}
            onCancel={() => console.log('取消删除')}
          >
            <span style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              删除确认
            </span>
          </Popover>
        </div>
      </div>

      {/* 示例4: 数据预览工具提示 */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>4. 数据预览工具提示</h3>
        <p>展示复杂数据的工具提示</p>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <DataTooltip dataKey="userData" data={userData}>
            <span style={{
              padding: '10px 20px',
              background: '#6610f2',
              color: 'white',
              borderRadius: '4px',
              cursor: 'help'
            }}>
              查看用户数据
            </span>
          </DataTooltip>
        </div>
      </div>

      {/* 实际应用示例 */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>5. 实际应用示例 - 表格中的工具提示</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>姓名</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>邮箱</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>1</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>张三</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>zhangsan@example.com</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <SmartTooltip content="编辑用户信息">
                  <span style={{ marginRight: '10px', cursor: 'pointer', color: '#007bff' }}>编辑</span>
                </SmartTooltip>
                <Popover
                  content="确定要删除用户张三吗？"
                  onConfirm={() => alert('用户已删除')}
                >
                  <span style={{ cursor: 'pointer', color: '#dc3545' }}>删除</span>
                </Popover>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 技术要点 */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
        <h3>工具提示技术要点</h3>
        <ul>
          <li><strong>定位计算</strong> - 使用getBoundingClientRect获取触发元素位置</li>
          <li><strong>Portal渲染</strong> - 使用createPortal将提示渲染到body</li>
          <li><strong>边界检测</strong> - 检查视口边界，避免提示溢出</li>
          <li><strong>事件处理</strong> - 鼠标悬停/点击显示，支持焦点显示</li>
          <li><strong>点击外部关闭</strong> - 使用document事件监听实现</li>
          <li><strong>pointer-events: none</strong> - 防止Tooltip阻挡鼠标事件</li>
        </ul>

        <h4>Portal vs 绝对定位</h4>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// 问题：父容器 overflow: hidden 会裁剪提示
<div style={{ overflow: 'hidden', position: 'relative' }}>
  <Tooltip content="被裁剪了" />
</div>

// 解决方案：使用 Portal 渲染到 body
function Tooltip({ children, content }) {
  return (
    <>
      {children}
      {createPortal(
        <div className="tooltip">{content}</div>,
        document.body
      )}
    </>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// 导出组件
// ============================================================================

export { Tooltip, SmartTooltip, Popover, DataTooltip };
