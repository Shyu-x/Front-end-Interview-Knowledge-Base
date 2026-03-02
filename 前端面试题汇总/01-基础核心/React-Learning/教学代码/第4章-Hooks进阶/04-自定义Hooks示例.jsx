/**
 * 自定义 Hooks 示例
 * 展示三个实用的自定义 Hook:
 * 1. useLocalStorage - 本地存储 Hook
 * 2. useDebounce - 防抖 Hook
 * 3. useWindowSize - 窗口尺寸 Hook
 *
 * 自定义 Hook:
 * - 以 "use" 开头的函数
 * - 内部可以使用其他 Hooks
 * - 用于封装可复用的状态逻辑
 */

import React, { useState, useEffect } from 'react';

// ============================================
// 1. useLocalStorage Hook
// ============================================

/**
 * useLocalStorage - 本地存储 Hook
 *
 * 功能:
 * - 自动从 localStorage 读取数据
 * - 当值变化时自动保存到 localStorage
 * - 支持序列化/反序列化复杂对象
 *
 * @param key - localStorage 的键名
 * @param initialValue - 初始值
 * @returns [值, 设置值的函数]
 *
 * 使用示例:
 * const [name, setName] = useLocalStorage('name', '默认值');
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // 状态: 存储的值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 从 localStorage 读取
      const item = window.localStorage.getItem(key);
      // 解析 JSON，如果失败则返回初始值
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // 读取失败时返回初始值
      console.error(`读取 localStorage 失败 (${key}):`, error);
      return initialValue;
    }
  });

  // 设置值的函数
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // 支持函数式更新
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // 更新状态
      setStoredValue(valueToStore);

      // 保存到 localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`保存 localStorage 失败 (${key}):`, error);
    }
  };

  // 监听其他标签页的变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`解析 localStorage 失败 (${key}):`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// ============================================
// 2. useDebounce Hook
// ============================================

/**
 * useDebounce - 防抖 Hook
 *
 * 功能:
 * - 延迟更新值
 * - 常用于搜索输入、窗口调整等频繁触发的事件
 *
 * @param value - 需要防抖的值
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的值
 *
 * 使用示例:
 * const debouncedSearch = useDebounce(searchTerm, 300);
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 创建防抖定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数: 如果 value 变化，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// 3. useWindowSize Hook
// ============================================

/**
 * useWindowSize - 窗口尺寸 Hook
 *
 * 功能:
 * - 监听窗口尺寸变化
 * - 返回当前的窗口宽度和高度
 *
 * @returns { width: number, height: number }
 *
 * 使用示例:
 * const { width, height } = useWindowSize();
 */
function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // 处理尺寸变化的函数
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 监听 resize 事件
    window.addEventListener('resize', handleResize);

    // 初始化时执行一次
    handleResize();

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}

// ============================================
// 4. 演示组件 - useLocalStorage
// ============================================

function LocalStorageDemo() {
  // 使用 useLocalStorage
  const [username, setUsername] = useLocalStorage('demo_username', '访客');
  const [theme, setTheme] = useLocalStorage('demo_theme', 'light');
  const [tasks, setTasks] = useLocalStorage<string[]>('demo_tasks', ['学习 React', '完成任务']);

  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.demoCard}>
      <h3 style={styles.demoTitle}>useLocalStorage 示例</h3>

      <div style={styles.formGroup}>
        <label>用户名:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <p style={styles.hint}>刷新页面后，用户名会保留</p>
      </div>

      <div style={styles.formGroup}>
        <label>主题:</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={styles.select}
        >
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label>任务列表:</label>
        <div style={styles.taskInput}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="添加新任务..."
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addButton}>添加</button>
        </div>
        <ul style={styles.taskList}>
          {tasks.map((task, index) => (
            <li key={index} style={styles.taskItem}>
              {task}
              <button
                onClick={() => removeTask(index)}
                style={styles.deleteButton}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p style={styles.storageInfo}>
        当前 localStorage 内容:<br />
        <code>{'{'}"demo_username": "{username}", "demo_theme": "{theme}"{'}'}</code>
      </p>
    </div>
  );
}

// ============================================
// 5. 演示组件 - useDebounce
// ============================================

function DebounceDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 使用 useDebounce，延迟 500ms
  const debouncedSearch = useDebounce(searchTerm, 500);

  // 模拟搜索 API
  useEffect(() => {
    if (debouncedSearch) {
      setIsSearching(true);
      // 模拟异步搜索
      const timer = setTimeout(() => {
        const mockResults = [
          `${debouncedSearch} - 结果 1`,
          `${debouncedSearch} - 结果 2`,
          `${debouncedSearch} - 结果 3`,
        ];
        setResults(mockResults);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [debouncedSearch]);

  return (
    <div style={styles.demoCard}>
      <h3 style={styles.demoTitle}>useDebounce 示例</h3>

      <div style={styles.formGroup}>
        <label>搜索:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="输入搜索内容..."
          style={styles.input}
        />
        <p style={styles.hint}>
          输入停止后 500ms 才触发搜索（观察控制台日志）
        </p>
      </div>

      <div style={styles.searchInfo}>
        <p>原始值: <strong>{searchTerm}</strong></p>
        <p>防抖值: <strong>{debouncedSearch || '(空)'}</strong></p>
        <p>状态: {isSearching ? '🔍 搜索中...' : '✅ 完成'}</p>
      </div>

      <div style={styles.results}>
        <h4>搜索结果:</h4>
        {results.length === 0 ? (
          <p style={styles.noResults}>暂无结果</p>
        ) : (
          <ul style={styles.resultList}>
            {results.map((result, index) => (
              <li key={index} style={styles.resultItem}>{result}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ============================================
// 6. 演示组件 - useWindowSize
// ============================================

function WindowSizeDemo() {
  const { width, height } = useWindowSize();

  // 根据窗口大小返回响应式样式
  const getDeviceType = () => {
    if (width < 768) return '手机';
    if (width < 1024) return '平板';
    return '桌面';
  };

  const deviceType = getDeviceType();

  return (
    <div style={styles.demoCard}>
      <h3 style={styles.demoTitle}>useWindowSize 示例</h3>

      <div style={styles.sizeDisplay}>
        <div style={styles.sizeItem}>
          <span style={styles.sizeLabel}>宽度:</span>
          <span style={styles.sizeValue}>{width}px</span>
        </div>
        <div style={styles.sizeItem}>
          <span style={styles.sizeLabel}>高度:</span>
          <span style={styles.sizeValue}>{height}px</span>
        </div>
        <div style={styles.sizeItem}>
          <span style={styles.sizeLabel}>设备类型:</span>
          <span style={styles.deviceType}>{deviceType}</span>
        </div>
      </div>

      <p style={styles.hint}>
        调整浏览器窗口大小，观察数值变化
      </p>

      {/* 响应式布局演示 */}
      <div style={styles.responsiveDemo}>
        <div style={{
          ...styles.responsiveBox,
          backgroundColor: width < 768 ? '#ffcdd2' : '#c8e6c9',
        }}>
          {width < 768 ? '窄屏布局' : '宽屏布局'}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 7. 主组件 - 自定义 Hooks 演示
// ============================================

export default function CustomHooksDemo() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>自定义 Hooks 示例</h1>
      <p style={styles.subtitle}>
        展示三个实用的自定义 Hook 的实现和使用方法
      </p>

      <div style={styles.hooksGrid}>
        <LocalStorageDemo />
        <DebounceDemo />
        <WindowSizeDemo />
      </div>

      {/* 代码实现展示 */}
      <div style={styles.codeSection}>
        <h2>代码实现</h2>

        <div style={styles.codeBlock}>
          <h4>useLocalStorage</h4>
          <pre style={styles.code}>
{`function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function
        ? value(storedValue)
        : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`}
          </pre>
        </div>

        <div style={styles.codeBlock}>
          <h4>useDebounce</h4>
          <pre style={styles.code}>
{`function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`}
          </pre>
        </div>

        <div style={styles.codeBlock}>
          <h4>useWindowSize</h4>
          <pre style={styles.code}>
{`function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}`}
          </pre>
        </div>
      </div>

      {/* 使用说明 */}
      <div style={styles.explanation}>
        <h3>📚 自定义 Hooks 核心概念</h3>
        <ul>
          <li><strong>命名规范</strong>: 必须以 "use" 开头，如 useXxx</li>
          <li><strong>可复用性</strong>: 封装可复用的状态逻辑</li>
          <li><strong>内部实现</strong>: 可以使用任何其他 Hooks</li>
          <li><strong>使用方式</strong>: 在函数组件中直接调用</li>
        </ul>

        <h3>💡 使用场景</h3>
        <ul>
          <li><strong>useLocalStorage</strong>: 需要持久化状态时</li>
          <li><strong>useDebounce</strong>: 搜索输入、表单验证等需要防抖的场景</li>
          <li><strong>useWindowSize</strong>: 响应式布局、条件渲染</li>
        </ul>

        <h3>⚠️ 注意事项</h3>
        <ul>
          <li>自定义 Hooks 是普通的 JavaScript 函数</li>
          <li>每次使用自定义 Hook 都是独立的状态</li>
          <li>确保自定义 Hooks 只在 React 函数组件或自定义 Hooks 中调用</li>
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
    marginBottom: '10px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
  },
  hooksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  demoCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  },
  demoTitle: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#1976d2',
    borderBottom: '2px solid #1976d2',
    paddingBottom: '10px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formGroup label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  hint: {
    fontSize: '12px',
    color: '#999',
    marginTop: '5px',
  },
  taskInput: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  storageInfo: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    fontSize: '12px',
    wordBreak: 'break-all',
  },
  searchInfo: {
    padding: '15px',
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  searchInfo p: {
    margin: '5px 0',
    fontSize: '14px',
  },
  results: {
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  results h4: {
    marginTop: 0,
  },
  resultList: {
    listStyle: 'none',
    padding: 0,
  },
  resultItem: {
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  noResults: {
    color: '#999',
    fontStyle: 'italic',
  },
  sizeDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  sizeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sizeLabel: {
    fontSize: '16px',
    color: '#666',
  },
  sizeValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  deviceType: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4caf50',
  },
  responsiveDemo: {
    marginTop: '20px',
  },
  responsiveBox: {
    padding: '30px',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  codeSection: {
    marginBottom: '40px',
  },
  codeSection h2: {
    marginBottom: '20px',
    color: '#333',
  },
  codeBlock: {
    marginBottom: '20px',
    backgroundColor: '#263238',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  codeBlock h4: {
    margin: 0,
    padding: '15px 20px',
    backgroundColor: '#37474f',
    color: '#fff',
  },
  code: {
    margin: 0,
    padding: '20px',
    color: '#aed581',
    fontSize: '13px',
    lineHeight: '1.6',
    overflow: 'auto',
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
  },
  explanation: {
    padding: '20px',
    backgroundColor: '#fff3e0',
    borderRadius: '10px',
  },
  explanation h3: {
    marginTop: 0,
    color: '#e65100',
  },
  explanation ul: {
    lineHeight: '1.8',
  },
};
