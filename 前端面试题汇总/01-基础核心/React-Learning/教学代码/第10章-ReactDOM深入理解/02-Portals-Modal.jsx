/**
 * ============================================
 * Portal 实现模态框
 * Chapter 10 - ReactDOM Deep Understanding
 * ============================================
 *
 * 本文件介绍React Portal的原理和模态框实现
 *
 * [目录]
 * 1. Portal 简介
 * 2. createPortal API
 * 3. 模态框实现
 * 4. 事件冒泡处理
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// ============================================================================
// 1. Portal 简介
// ============================================================================

/*
 * Portal（端口）允许将子组件渲染到DOM节点的不同位置
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │              原始DOM结构               │
 *                    │  ┌─────────────────────────────────┐   │
 *                    │  │         #root (App组件)         │   │
 *                    │  │  ┌─────────────────────────┐    │   │
 *                    │  │  │     Modal组件          │    │   │
 *                    │  │  │  (正常渲染位置)        │    │   │
 *                    │  │  └─────────────────────────┘    │   │
 *                    │  └─────────────────────────────────┘   │
 *                    └─────────────────────────────────────────┘
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │           使用Portal后                   │
 *                    │  ┌─────────────────────────────────┐   │
 *                    │  │         #root (App组件)         │   │
 *                    │  └─────────────────────────────────┘   │
 *                    │  ┌─────────────────────────────────┐   │
 *                    │  │      #modal-root (Portal)       │   │
 *                    │  │  ┌─────────────────────────┐    │   │
 *                    │  │  │     Modal组件          │    │   │
 *                    │  │  │  (Portal渲染位置)       │    │   │
 *                    │  │  └─────────────────────────┘    │   │
 *                    │  └─────────────────────────────────┘   │
 *                    └─────────────────────────────────────────┘
 *
 * Portal的优势:
 * - 解决CSS层叠上下文问题（z-index、overflow等）
 * - 避免父组件样式影响（如overflow: hidden）
 * - 更语义化的DOM结构
 * - 更好的可访问性支持
 */

// ============================================================================
// 2. createPortal API
// ============================================================================

/**
 * createPortal 语法
 *
 * createPortal(child, container)
 *
 * 参数:
 * - child: 要渲染的React节点（元素、字符串、片段等）
 * - container: DOM元素，组件将被渲染到这个容器中
 *
 * 返回值:
 * - 返回一个React Portal节点
 */

// ============================================================================
// 3. 模态框组件 - 使用Portal
// ============================================================================

/**
 * 基础模态框组件
 *
 * 使用createPortal将模态框渲染到document.body
 */
function Modal({ isOpen, onClose, title, children }) {
  // 如果未打开，不渲染任何内容
  if (!isOpen) return null;

  // 使用Portal将模态框渲染到body
  // 这样可以避免父组件的CSS样式影响（如overflow: hidden）
  return createPortal(
    <>
      {/* 遮罩层 - 点击关闭 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={onClose}
      >
        {/* 模态框内容 - 阻止事件冒泡防止点击内容时关闭 */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            minWidth: '300px',
            maxWidth: '500px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            zIndex: 1001
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid #eee',
            paddingBottom: '12px'
          }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>{title}</h2>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ×
            </button>
          </div>

          {/* 内容 */}
          <div style={{ marginBottom: '16px' }}>
            {children}
          </div>

          {/* 底部按钮 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              取消
            </button>
            <button
              onClick={() => {
                alert('确认操作');
                onClose();
              }}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body  // Portal的目标容器
  );
}

// ============================================================================
// 4. 带动画的模态框
// ============================================================================

/**
 * 带动画效果的模态框
 * 展示Portal与CSS动画的结合
 */
function AnimatedModal({ isOpen, onClose, title, children }) {
  const [show, setShow] = useState(false);

  // 处理开启动画
  useEffect(() => {
    if (isOpen) {
      // 延迟显示以触发入场动画
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: show ? 'auto' : 'none'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '300px',
          maxWidth: '500px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          zIndex: 1001,
          transform: show ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 16px 0' }}>{title}</h2>
        {children}
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button onClick={onClose} style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            关闭
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================================================
// 5. 确认对话框
// ============================================================================

/**
 * 确认对话框（Confirm Dialog）
 * 展示Portal在实际应用中的使用
 */
function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '400px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
        }}
      >
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: '#dc3545',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            确认删除
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================================================
// 6. 事件冒泡处理
// ============================================================================

/*
 * Portal的一个重要特性：事件冒泡
 *
 * 虽然Portal中的元素在DOM中不在父组件内部，
 * 但在React事件系统中仍然被视为父组件的子元素
 *
 *                    ┌─────────────────────────────────────┐
 *                    │         onClick (父组件)           │
 *                    │            │                        │
 *                    │            ▼                        │
 *                    │  ┌─────────────────────────┐       │
 *                    │  │      Portal元素         │       │
 *                    │  │  (DOM中不在父组件内)     │       │
 *                    │  └─────────────────────────┘       │
 *                    │            │                        │
 *                    │            ▼                        │
 *                    │  事件会在React树中冒泡              │
 *                    └─────────────────────────────────────┘
 *
 * 这意味着：
 * - Portal中的onClick事件会冒泡到父组件
 * - 不需要担心事件处理问题
 * - 仍可以使用事件委托
 */

// ============================================================================
// 主组件 - 演示各种模态框
// ============================================================================

export default function PortalsModal() {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [animatedModalOpen, setAnimatedModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteCount, setDeleteCount] = useState(0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Portal 实现模态框</h1>

      <p style={{ color: '#666', marginBottom: '20px' }}>
        使用React Portal将组件渲染到DOM的不同位置
      </p>

      {/* 示例1: 基础模态框 */}
      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>1. 基础模态框</h3>
        <p>最简单的Portal模态框实现</p>
        <button
          onClick={() => setBasicModalOpen(true)}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          打开基础模态框
        </button>

        <Modal
          isOpen={basicModalOpen}
          onClose={() => setBasicModalOpen(false)}
          title="基础模态框"
        >
          <p>这是一个使用React Portal实现的模态框。</p>
          <p>它被渲染到document.body，而不是父组件内部。</p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            特点：避免CSS层叠问题，独立于父组件的DOM结构
          </p>
        </Modal>
      </div>

      {/* 示例2: 动画模态框 */}
      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>2. 带动画的模态框</h3>
        <p>展示Portal与CSS动画的结合</p>
        <button
          onClick={() => setAnimatedModalOpen(true)}
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          打开动画模态框
        </button>

        <AnimatedModal
          isOpen={animatedModalOpen}
          onClose={() => setAnimatedModalOpen(false)}
          title="动画模态框"
        >
          <p>这个模态框带有淡入和缩放动画效果。</p>
          <p>使用useState控制动画状态，实现平滑过渡。</p>
        </AnimatedModal>
      </div>

      {/* 示例3: 确认对话框 */}
      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>3. 确认对话框</h3>
        <p>常见的确认删除操作</p>
        <button
          onClick={() => setConfirmOpen(true)}
          style={{
            padding: '10px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          删除数据
        </button>
        <p>已删除项目数: {deleteCount}</p>

        <ConfirmDialog
          isOpen={confirmOpen}
          title="确认删除"
          message="确定要删除这项数据吗？此操作无法撤销。"
          onConfirm={() => {
            setDeleteCount(c => c + 1);
            setConfirmOpen(false);
            alert('数据已删除');
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>

      {/* 技术说明 */}
      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Portal 技术要点</h3>
        <ul>
          <li><strong>createPortal(child, container)</strong> - 创建Portal的两个参数</li>
          <li><strong>事件冒泡</strong> - Portal中的事件仍然会在React树中冒泡</li>
          <li><strong>DOM位置</strong> - Portal在DOM中独立，但仍是React组件树的子组件</li>
          <li><strong>适用场景</strong> - 模态框、工具提示、浮层、Toast等</li>
          <li><strong>CSS隔离</strong> - 避免父组件的overflow、z-index等影响</li>
        </ul>

        <h4>Portal vs 普通渲染</h4>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// 普通渲染 - 受父组件CSS影响
<div style={{ overflow: 'hidden' }}>
  <Modal />  {/* 会被隐藏 */}
</div>

// Portal渲染 - 独立于父组件
<div style={{ overflow: 'hidden' }}>
  {createPortal(<Modal />, document.body)}
  {/* 不会被隐藏，在body中渲染 */}
</div>`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// 导出独立组件
// ============================================================================

export { Modal, AnimatedModal, ConfirmDialog };
