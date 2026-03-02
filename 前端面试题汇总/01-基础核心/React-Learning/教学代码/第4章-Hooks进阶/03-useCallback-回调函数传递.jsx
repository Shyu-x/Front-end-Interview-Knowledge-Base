/**
 * useCallback 示例 - 父组件传递回调函数给子组件
 * 展示函数缓存 - 避免子组件不必要的重渲染
 *
 * useCallback 用途:
 * - 缓存函数实例，避免每次渲染都创建新函数
 * - 当依赖项改变时才创建新函数
 * - 与 React.memo 配合使用，防止子组件不必要的重渲染
 */

import React, { useState, useCallback } from 'react';

// ============================================
// 1. 类型定义
// ============================================

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

interface LogEntry {
  id: number;
  action: string;
  timestamp: Date;
}

// 模拟用户数据
const MOCK_USERS: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'guest' },
];

// ============================================
// 2. 子组件 - 用户卡片
// ============================================

/**
 * 用户卡片组件
 * 使用 React.memo 包装，只有 props 变化时才重渲染
 *
 * 关键点：如果父组件传入的 onEdit, onDelete 函数每次都创建新实例，
 *        那么即使使用 React.memo 也会导致子组件重渲染
 *        useCallback 可以解决这个问题
 */
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onViewDetails: (user: User) => void;
}

const UserCard = React.memo(({ user, onEdit, onDelete, onViewDetails }: UserCardProps) => {
  // 用于追踪渲染次数
  const [renderCount, setRenderCount] = useState(0);

  // 模拟一些渲染延迟
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRenderCount(c => c + 1);
    }, 0);
    return () => clearTimeout(timer);
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#e53935';
      case 'user': return '#43a047';
      case 'guest': return '#fb8c00';
      default: return '#999';
    }
  };

  return (
    <div style={styles.userCard}>
      <div style={styles.userHeader}>
        <div style={styles.avatar}>
          {user.name.charAt(0)}
        </div>
        <div style={styles.userInfo}>
          <h3 style={styles.userName}>{user.name}</h3>
          <span style={{ ...styles.role, backgroundColor: getRoleColor(user.role) }}>
            {user.role}
          </span>
        </div>
      </div>

      <p style={styles.email}>{user.email}</p>

      <div style={styles.actions}>
        <button
          style={styles.viewButton}
          onClick={() => onViewDetails(user)}
        >
          查看详情
        </button>
        <button
          style={styles.editButton}
          onClick={() => onEdit(user)}
        >
          编辑
        </button>
        <button
          style={styles.deleteButton}
          onClick={() => onDelete(user.id)}
        >
          删除
        </button>
      </div>

      <div style={styles.renderInfo}>
        UserCard 渲染次数: {renderCount}
      </div>
    </div>
  );
});

// ============================================
// 3. 子组件 - 操作日志显示
// ============================================

/**
 * 日志组件 - 显示操作记录
 * 展示 useCallback 如何影响子组件渲染
 */
interface LogDisplayProps {
  logs: LogEntry[];
  onClear: () => void;
}

const LogDisplay = React.memo(({ logs, onClear }: LogDisplayProps) => {
  const [renderCount, setRenderCount] = useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRenderCount(c => c + 1);
    }, 0);
    return () => clearTimeout(timer);
  });

  return (
    <div style={styles.logContainer}>
      <div style={styles.logHeader}>
        <h3>操作日志</h3>
        <button style={styles.clearLogButton} onClick={onClear}>
          清空日志
        </button>
      </div>

      {logs.length === 0 ? (
        <p style={styles.emptyLog}>暂无操作记录</p>
      ) : (
        <ul style={styles.logList}>
          {logs.map((log) => (
            <li key={log.id} style={styles.logItem}>
              <span style={styles.logAction}>{log.action}</span>
              <span style={styles.logTime}>
                {log.timestamp.toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div style={styles.renderInfo}>
        LogDisplay 渲染次数: {renderCount}
      </div>
    </div>
  );
});

// ============================================
// 4. 主组件 - 用户管理系统
// ============================================

export default function UserManagement() {
  // 用户列表状态
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // 日志状态
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // 计数器状态（用于演示）
  const [counter, setCounter] = useState(0);

  // 日志ID计数器
  const [logIdCounter, setLogIdCounter] = useState(0);

  // ============================================
  // 5. 使用 useCallback 缓存回调函数
  // ============================================

  /**
   * 使用 useCallback 缓存编辑函数
   * 依赖项: [] 空数组 - 函数永远不会改变
   * 如果需要访问 state，则需要将 state 加入依赖数组
   */
  const handleEdit = useCallback((user: User) => {
    const newLog: LogEntry = {
      id: logIdCounter + 1,
      action: `编辑用户: ${user.name}`,
      timestamp: new Date(),
    };
    setLogIdCounter(prev => prev + 1);
    setLogs(prevLogs => [...prevLogs, newLog]);
    alert(`编辑用户: ${user.name}\n邮箱: ${user.email}`);
  }, [logIdCounter]);

  /**
   * 使用 useCallback 缓存删除函数
   * 依赖项: [users] - 当 users 变化时函数会重新创建
   */
  const handleDelete = useCallback((id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      const newLog: LogEntry = {
        id: logIdCounter + 1,
        action: `删除用户: ${user.name}`,
        timestamp: new Date(),
      };
      setLogIdCounter(prev => prev + 1);
      setLogs(prevLogs => [...prevLogs, newLog]);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    }
  }, [users, logIdCounter]);

  /**
   * 使用 useCallback 缓存查看详情函数
   */
  const handleViewDetails = useCallback((user: User) => {
    const newLog: LogEntry = {
      id: logIdCounter + 1,
      action: `查看用户详情: ${user.name}`,
      timestamp: new Date(),
    };
    setLogIdCounter(prev => prev + 1);
    setLogs(prevLogs => [...prevLogs, newLog]);
    alert(`
      用户详情:
      姓名: ${user.name}
      邮箱: ${user.email}
      角色: ${user.role}
    `);
  }, [logIdCounter]);

  /**
   * 使用 useCallback 缓存清空日志函数
   */
  const handleClearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // ============================================
  // 6. 演示: 不使用 useCallback 的函数
  // ============================================

  /**
   * 这个函数没有使用 useCallback
   * 每次渲染都会创建新的函数实例
   * 会导致子组件不必要的重渲染
   */
  const incrementCounter = () => {
    setCounter(c => c + 1);
  };

  // ============================================
// 7. 渲染
// ============================================

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>用户管理系统 (useCallback)</h1>

      <div style={styles.content}>
        {/* 用户列表区域 */}
        <div style={styles.usersSection}>
          <h2>用户列表</h2>
          <p style={styles.hint}>
            点击按钮测试回调函数，注意观察组件渲染次数的变化
          </p>

          <div style={styles.userGrid}>
            {users.length === 0 ? (
              <p style={styles.emptyText}>没有用户了</p>
            ) : (
              users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </div>
        </div>

        {/* 日志区域 */}
        <div style={styles.logsSection}>
          <LogDisplay
            logs={logs}
            onClear={handleClearLogs}
          />
        </div>
      </div>

      {/* 演示区域 */}
      <div style={styles.demoSection}>
        <h3>useCallback 效果演示</h3>
        <p>点击下面按钮增加计数器（不传任何 props 给子组件）:</p>
        <div style={styles.counterSection}>
          <span style={styles.counter}>计数器: {counter}</span>
          <button style={styles.counterButton} onClick={incrementCounter}>
            +1
          </button>
        </div>
        <p style={styles.hint}>
          说明: 点击 +1 按钮会触发父组件重渲染，但由于使用了 useCallback，
          UserCard 和 LogDisplay 不会因为回调函数引用变化而重渲染
          （只有当依赖项变化时才会重渲染）。
        </p>
      </div>

      {/* 代码说明 */}
      <div style={styles.explanation}>
        <h3>📚 useCallback 核心概念</h3>
        <ul>
          <li><strong>useCallback</strong>: 缓存函数实例，避免每次渲染都创建新函数</li>
          <li><strong>依赖数组</strong>: 当依赖项变化时，重新创建函数</li>
          <li><strong>适用场景</strong>: 传递给子组件的回调函数，与 React.memo 配合使用</li>
          <li><strong>性能优势</strong>: 减少子组件不必要的重渲染</li>
        </ul>
        <h3>🔍 调试技巧</h3>
        <ul>
          <li>观察 UserCard 和 LogDisplay 的"渲染次数"</li>
          <li>点击编辑/删除/查看按钮，日志组件会更新</li>
          <li>点击 +1 按钮，父组件重渲染但子组件不会（因为回调函数被缓存）</li>
          <li>移除 useCallback 试试，子组件会每次都重渲染</li>
        </ul>
        <h3>⚠️ 注意事项</h3>
        <ul>
          <li>不要过度使用 useCallback，只有在需要优化性能时才使用</li>
          <li>过早优化可能增加代码复杂度</li>
          <li>只有当函数作为 props 传递给子组件，且子组件使用了 React.memo 时才有意义</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// 8. 样式对象
// ============================================

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  content: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  usersSection: {
    flex: '1 1 500px',
    minWidth: '300px',
  },
  logsSection: {
    flex: '0 1 350px',
    minWidth: '300px',
  },
  hint: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '15px',
  },
  userCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#1976d2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    margin: '0 0 5px 0',
    fontSize: '18px',
  },
  role: {
    fontSize: '12px',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '12px',
    textTransform: 'capitalize',
  },
  email: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '15px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  viewButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  editButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  renderInfo: {
    marginTop: '10px',
    fontSize: '11px',
    color: '#999',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
  },
  logContainer: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '12px',
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  logHeader h3: {
    margin: 0,
  },
  clearLogButton: {
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyLog: {
    color: '#999',
    textAlign: 'center',
  },
  logList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  logItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  logAction: {
    fontSize: '14px',
    color: '#333',
  },
  logTime: {
    fontSize: '12px',
    color: '#999',
  },
  demoSection: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#fff3e0',
    borderRadius: '12px',
  },
  demoSection h3: {
    marginTop: 0,
    color: '#e65100',
  },
  counterSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '15px',
  },
  counter: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  counterButton: {
    padding: '10px 30px',
    fontSize: '18px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  explanation: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#e1f5fe',
    borderRadius: '10px',
  },
  explanation h3: {
    marginTop: 0,
    color: '#0277bd',
  },
  explanation ul: {
    lineHeight: '1.8',
  },
};
