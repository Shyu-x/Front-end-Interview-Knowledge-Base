# React Hooks 进阶完全指南

> 本文档详细讲解 React Hooks 的进阶用法，从入门到精通，涵盖 useReducer、useMemo、useCallback、自定义 Hooks 及最佳实践。

---

## 一、useReducer 复杂状态逻辑管理

### 1.1 基本语法

`useReducer` 是 React 提供的另一个状态管理 Hook，它比 `useState` 更适合处理复杂的状态逻辑。`useReducer` 基于 Reducer 模式，类似于 Redux 的工作方式。

```jsx
const [state, dispatch] = useReducer(reducer, initialState, init?);
```

**参数说明：**

| 参数 | 说明 |
|------|------|
| `reducer` | 一个纯函数，接收当前状态和 action，返回新状态 |
| `initialState` | 初始状态值 |
| `init` | 可选的初始化函数，用于延迟初始化状态 |

**返回值：**

| 返回值 | 说明 |
|--------|------|
| `state` | 当前状态值 |
| `dispatch` | 分发 action 的函数，用于触发状态更新 |

**Reducer 函数的基本结构：**

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'ACTION_TYPE':
      return { ...state, /* 新状态 */ };
    default:
      return state;
  }
}
```

---

### 1.2 useReducer 的基本使用示例

```jsx
import React, { useReducer } from 'react';

// 定义初始状态
const initialState = {
  count: 0,
  username: '',
  isLoading: false
};

// 定义 reducer 函数
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Username: {state.username}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        +1
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>
        -1
      </button>
      <button onClick={() => dispatch({ type: 'RESET' })}>
        Reset
      </button>
      <input
        type="text"
        value={state.username}
        onChange={(e) => dispatch({ type: 'SET_USERNAME', payload: e.target.value })}
        placeholder="Enter username"
      />
    </div>
  );
}
```

---

### 1.3 useReducer 与 useState 的对比

| 特性 | useState | useReducer |
|------|----------|------------|
| **适用场景** | 简单独立的状态 | 复杂相互依赖的状态 |
| **代码组织** | 状态分散在各处 | 状态逻辑集中管理 |
| **更新方式** | 直接设置新值 | 通过 action 分发 |
| **调试能力** | 难以追踪状态变化 | 可配合 Redux DevTools |
| **性能** | 轻量级 | 略重但可控 |
| **测试性** | 组件内部测试 | reducer 可单独测试 |

**useState 适用场景：**
- 简单的 UI 状态（开关、计数）
- 不与其他状态相互依赖
- 状态更新逻辑简单

**useReducer 适用场景：**
- 复杂的状态逻辑（多个状态相互影响）
- 状态更新逻辑复杂或重复
- 需要"撤销/重做"功能
- 深层组件需要触发状态更新

---

### 1.4 useState vs useReducer 实际对比

**使用 useState 的计数器（复杂逻辑版本）：**

```jsx
function CounterWithState() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);

  const increment = () => {
    const newCount = count + step;
    setCount(newCount);
    setHistory([...history, { action: 'increment', value: newCount, step }]);
  };

  const decrement = () => {
    const newCount = count - step;
    setCount(newCount);
    setHistory([...history, { action: 'decrement', value: newCount, step }]);
  };

  const setStepValue = (newStep) => {
    setStep(newStep);
    setHistory([...history, { action: 'setStep', value: newStep }]);
  };

  const undo = () => {
    if (history.length > 0) {
      const lastAction = history[history.length - 1];
      setCount(lastAction.value);
      setHistory(history.slice(0, -1));
    }
  };

  return (
    <div>
      {/* UI 代码... */}
    </div>
  );
}
```

**使用 useReducer 的同一组件：**

```jsx
// 定义状态和操作的类型
const initialState = {
  count: 0,
  step: 1,
  history: []
};

// 定义 reducer
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': {
      const newCount = state.count + state.step;
      return {
        ...state,
        count: newCount,
        history: [...state.history, { action: 'increment', value: newCount, step: state.step }]
      };
    }
    case 'DECREMENT': {
      const newCount = state.count - state.step;
      return {
        ...state,
        count: newCount,
        history: [...state.history, { action: 'decrement', value: newCount, step: state.step }]
      };
    }
    case 'SET_STEP':
      return {
        ...state,
        step: action.payload,
        history: [...state.history, { action: 'setStep', value: action.payload }]
      };
    case 'UNDO':
      if (state.history.length === 0) return state;
      const newHistory = state.history.slice(0, -1);
      const previousValue = newHistory.length > 0
        ? newHistory[newHistory.length - 1].value
        : 0;
      return {
        ...state,
        count: previousValue,
        history: newHistory
      };
    default:
      return state;
  }
}

function CounterWithReducer() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>Set Step to 2</button>
      <button onClick={() => dispatch({ type: 'UNDO' })}>Undo</button>
    </div>
  );
}
```

---

### 1.5 实际应用示例：表单处理

useReducer 非常适合处理复杂的表单逻辑：

```jsx
import React, { useReducer } from 'react';

// 表单状态类型
const initialFormState = {
  values: {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  errors: {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  touched: {
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  },
  isSubmitting: false,
  isValid: false
};

// 表单 reducer
function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD_VALUE': {
      const { field, value } = action.payload;
      return {
        ...state,
        values: { ...state.values, [field]: value },
        errors: {
          ...state.errors,
          [field]: validateField(field, value, state.values)
        }
      };
    }
    case 'SET_FIELD_TOUCHED': {
      const { field } = action.payload;
      return {
        ...state,
        touched: { ...state.touched, [field]: true }
      };
    }
    case 'SET_ALL_TOUCHED':
      return {
        ...state,
        touched: {
          username: true,
          email: true,
          password: true,
          confirmPassword: true
        }
      };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_END':
      return { ...state, isSubmitting: false };
    case 'RESET_FORM':
      return initialFormState;
    case 'SET_VALID':
      return { ...state, isValid: action.payload };
    default:
      return state;
  }
}

// 字段验证函数
function validateField(field, value, allValues) {
  switch (field) {
    case 'username':
      if (!value) return '用户名不能为空';
      if (value.length < 3) return '用户名至少3个字符';
      return '';
    case 'email':
      if (!value) return '邮箱不能为空';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '邮箱格式不正确';
      return '';
    case 'password':
      if (!value) return '密码不能为空';
      if (value.length < 6) return '密码至少6位';
      return '';
    case 'confirmPassword':
      if (!value) return '请确认密码';
      if (value !== allValues.password) return '两次密码不一致';
      return '';
    default:
      return '';
  }
}

// 验证整个表单
function validateForm(values) {
  return {
    username: validateField('username', values.username, values),
    email: validateField('email', values.email, values),
    password: validateField('password', values.password, values),
    confirmPassword: validateField('confirmPassword', values.confirmPassword, values)
  };
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const handleChange = (field) => (e) => {
    dispatch({
      type: 'SET_FIELD_VALUE',
      payload: { field, value: e.target.value }
    });
  };

  const handleBlur = (field) => () => {
    dispatch({ type: 'SET_FIELD_TOUCHED', payload: { field } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_ALL_TOUCHED' });

    const errors = validateForm(state.values);
    const isValid = Object.values(errors).every((error) => error === '');

    if (isValid) {
      dispatch({ type: 'SUBMIT_START' });
      // 模拟 API 调用
      setTimeout(() => {
        console.log('Form submitted:', state.values);
        dispatch({ type: 'SUBMIT_END' });
      }, 1000);
    }
  };

  const { values, errors, touched, isSubmitting } = state;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={values.username}
          onChange={handleChange('username')}
          onBlur={handleBlur('username')}
          placeholder="用户名"
        />
        {touched.username && errors.username && <span>{errors.username}</span>}
      </div>

      <div>
        <input
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          placeholder="邮箱"
        />
        {touched.email && errors.email && <span>{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          placeholder="密码"
        />
        {touched.password && errors.password && <span>{errors.password}</span>}
      </div>

      <div>
        <input
          type="password"
          value={values.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          placeholder="确认密码"
        />
        {touched.confirmPassword && errors.confirmPassword && <span>{errors.confirmPassword}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : '注册'}
      </button>
    </form>
  );
}
```

---

### 1.6 useReducer 配合 Context 实现全局状态管理

```jsx
import React, { createContext, useContext, useReducer } from 'react';

// 创建 Context
const AppContext = createContext();

// 初始状态
const appInitialState = {
  user: null,
  theme: 'light',
  notifications: [],
  isAuthenticated: false
};

// App 级别的 reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload)
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'LOGOUT':
      return { ...appInitialState };
    default:
      return state;
  }
}

// Provider 组件
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, appInitialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// 自定义 Hook：使用全局状态
function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

// 使用示例
function Header() {
  const { state, dispatch } = useAppState();

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      payload: state.theme === 'light' ? 'dark' : 'light'
    });
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <header>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Current: {state.theme}
      </button>
      {state.user && <button onClick={logout}>Logout</button>}
    </header>
  );
}

function App() {
  return (
    <AppProvider>
      <Header />
      <MainContent />
    </AppProvider>
  );
}
```

---

## 二、useMemo 性能优化

### 2.1 基本语法

`useMemo` 用于缓存计算结果，避免在每次渲染时重新计算昂贵的操作。

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

**参数说明：**

| 参数 | 说明 |
|------|------|
| `create` | 产生所需值的函数（通常是计算函数） |
| `dependencies` | 依赖项数组，当依赖项变化时重新计算 |

**返回值：** 返回一个 memoized（记忆化）的值

---

### 2.2 缓存计算结果

**没有 useMemo 的情况：**

```jsx
function ExpensiveComponent({ data, filter }) {
  // 每次渲染都会重新执行这个昂贵的计算
  const processedData = data.filter(item => item.name.includes(filter))
                           .sort((a, b) => a.value - b.value)
                           .map(item => ({ ...item, displayValue: item.value * 2 }));

  return (
    <ul>
      {processedData.map(item => (
        <li key={item.id}>{item.displayValue}</li>
      ))}
    </ul>
  );
}
```

**使用 useMemo 的情况：**

```jsx
function ExpensiveComponent({ data, filter }) {
  // 只有当 data 或 filter 改变时，才会重新计算
  const processedData = useMemo(() => {
    console.log('Computing processed data...');

    return data
      .filter(item => item.name.includes(filter))
      .sort((a, b) => a.value - b.value)
      .map(item => ({ ...item, displayValue: item.value * 2 }));
  }, [data, filter]);

  return (
    <ul>
      {processedData.map(item => (
        <li key={item.id}>{item.displayValue}</li>
      ))}
    </ul>
  );
}
```

---

### 2.3 依赖数组的工作原理

**依赖数组是 useMemo 的核心：**

```jsx
function Component({ a, b, c }) {
  // 场景 1: 依赖项为空数组 - 只计算一次
  const value1 = useMemo(() => {
    return a * 2;
  }, []); // 永远只计算一次

  // 场景 2: 有依赖项 - 依赖变化时重新计算
  const value2 = useMemo(() => {
    return a + b;
  }, [a, b]); // 当 a 或 b 变化时重新计算

  // 场景 3: 依赖项包含对象/数组 - 需要注意
  const value3 = useMemo(() => {
    return computeSomething(a);
  }, [a, b, c]); // a, b, 或 c 任意一个变化都会重新计算
}
```

**重要提示：依赖数组中的值必须是稳定的：**

```jsx
function Component({ items, config }) {
  // ❌ 错误：每次渲染时 config 都是新对象，导致不必要的重新计算
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.value - b.value);
  }, [items, config]); // config 是新对象！

  // ✅ 正确：只依赖实际使用的属性
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.value - b.value);
  }, [items, config.sortBy]); // 只依赖实际使用的属性
}
```

---

### 2.4 适用场景

**场景一：复杂计算**

```jsx
function ProductList({ products, category, sortBy }) {
  // 筛选和排序是昂贵操作
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // 筛选
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // 排序
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [products, category, sortBy]);

  return (
    <ul>
      {filteredAndSortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
```

**场景二：避免子组件不必要的渲染**

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');

  // user 对象如果不 memoize，每次 count 变化都会导致 UserProfile 重新渲染
  const user = useMemo(() => ({
    name,
    email: `${name.toLowerCase()}@example.com`
  }), [name]);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <input value={name} onChange={e => setName(e.target.value)} />
      <UserProfile user={user} />
    </div>
  );
}

function UserProfile({ user }) {
  // UserProfile 只在 user 变化时重新渲染
  console.log('UserProfile rendered');
  return <div>{user.name} - {user.email}</div>;
}
```

**场景三：React.memo 配合 useMemo**

```jsx
const MemoizedChild = React.memo(function ChildComponent({ data, onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>{data.label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // ✅ 正确：memoize 对象
  const data = useMemo(() => ({
    label: 'Click me',
    value: 42
  }), []); // 空依赖，永远是同一个对象

  // ✅ 正确：memoize 函数
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // 空依赖，永远是同一个函数

  return (
    <div>
      <p>Count: {count}</p>
      <MemoizedChild data={data} onClick={handleClick} />
    </div>
  );
}
```

**场景四：多级计算依赖**

```jsx
function AnalyticsDashboard({ rawData, dateRange, metrics }) {
  // 第一层：数据清洗
  const cleanedData = useMemo(() => {
    return rawData.filter(item =>
      item.date >= dateRange.start && item.date <= dateRange.end
    );
  }, [rawData, dateRange]);

  // 第二层：按维度聚合
  const aggregatedData = useMemo(() => {
    return cleanedData.reduce((acc, item) => {
      const key = item.category;
      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 };
      }
      acc[key].total += item.value;
      acc[key].count += 1;
      return acc;
    }, {});
  }, [cleanedData]);

  // 第三层：计算最终指标
  const metricsData = useMemo(() => {
    return metrics.map(metric => ({
      ...metric,
      value: calculateMetric(aggregatedData, metric)
    }));
  }, [aggregatedData, metrics]);

  return <Dashboard data={metricsData} />;
}
```

---

### 2.5 useMemo 注意事项

**不要这样做：**

```jsx
function BadExample() {
  // ❌ 错误 1: 用 useMemo 缓存 JSX
  const element = useMemo(() => (
    <div>
      <ExpensiveComponent />
    </div>
  ), []);

  // ❌ 错误 2: 依赖数组为空但引用外部变量
  const value = useMemo(() => {
    return someExternalVariable * 2; // 不会响应 someExternalVariable 的变化
  }, []);

  // ❌ 错误 3: 简单的计算也用 useMemo（过度使用）
  const doubled = useMemo(() => a * 2, [a]); // 简单的乘法不需要 memoize
}
```

**应该这样做：**

```jsx
function GoodExample() {
  // ✅ 正确 1: 缓存计算结果
  const expensiveResult = useMemo(() => computeExpensiveValue(a, b), [a, b]);

  // ✅ 正确 2: 缓存对象引用（用于子组件优化）
  const config = useMemo(() => ({
    theme: 'dark',
    language: 'zh-CN'
  }), []);

  // ✅ 正确 3: 简单计算不需要 useMemo
  const doubled = a * 2; // 现代 JS 引擎已经优化了简单计算

  return <div>{expensiveResult}</div>;
}
```

---

## 三、useCallback 函数缓存

### 3.1 基本语法

`useCallback` 用于缓存函数引用，避免在每次渲染时创建新的函数实例。

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

**参数说明：**

| 参数 | 说明 |
|------|------|
| `callback` | 需要缓存的函数 |
| `dependencies` | 依赖项数组，当依赖项变化时返回新的函数引用 |

**返回值：** 返回一个 memoized（记忆化）的回调函数

---

### 3.2 缓存函数引用

**没有 useCallback 的问题：**

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);

  // ❌ 每次渲染都创建新函数
  const handleClick = () => {
    console.log('Click', count);
  };

  return <ChildComponent onClick={handleClick} />;
}

function ChildComponent({ onClick }) {
  // ❌ 因为 onClick 每次都是新函数，所以这里总是重新渲染
  return <button onClick={onClick}>Click me</button>;
}
```

**使用 useCallback 解决问题：**

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);

  // ✅ 只有当 count 变化时，handleClick 才会是新的函数
  const handleClick = useCallback(() => {
    console.log('Click', count);
  }, [count]);

  return <ChildComponent onClick={handleClick} />;
}

function ChildComponent({ onClick }) {
  // 现在只有当 onClick 变化时才会重新渲染
  return <button onClick={onClick}>Click me</button>;
}
```

---

### 3.3 配合子组件优化

**场景一：传递给 memoized 子组件**

```jsx
const MemoizedButton = React.memo(function Button({ onClick, children }) {
  console.log('Button rendered');
  return <button onClick={onClick}>{children}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // ✅ 使用 useCallback 缓存函数
  const handleIncrement = useCallback(() => {
    setCount(c => c + 1);
  }, []); // 空依赖，函数永远不变

  // ✅ 使用 useCallback 缓存函数
  const handleDecrement = useCallback(() => {
    setCount(c => c - 1);
  }, []); // 空依赖，函数永远不变

  // ✅ 使用 useCallback 缓存函数，依赖 name
  const handleGreet = useCallback(() => {
    alert(`Hello, ${name}!`);
  }, [name]); // name 变化时才创建新函数

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>Count: {count}</p>

      {/* 这些按钮不会因为 count 变化而重新渲染 */}
      <MemoizedButton onClick={handleIncrement}>Increment</MemoizedButton>
      <MemoizedButton onClick={handleDecrement}>Decrement</MemoizedButton>
      <MemoizedButton onClick={handleGreet}>Greet</MemoizedButton>
    </div>
  );
}
```

**场景二：传递给 useMemo 中的子组件**

```jsx
function Parent() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');

  // 缓存过滤后的列表
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]);

  // 缓存删除函数
  const handleDelete = useCallback((id) => {
    setItems(items => items.filter(item => item.id !== id));
  }, []); // 使用函数式更新，依赖空数组

  return (
    <div>
      <ItemList items={filteredItems} onDelete={handleDelete} />
    </div>
  );
}

function ItemList({ items, onDelete }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

---

### 3.4 useCallback vs useMemo 对比

| 特性 | useCallback | useMemo |
|------|--------------|---------|
| **用途** | 缓存函数 | 缓存值 |
| **返回值** | 函数本身 | 计算后的值 |
| **等价形式** | `useCallback(fn, deps)` = `useMemo(() => fn, deps)` | - |
| **使用场景** | 回调函数传递给子组件 | 昂贵计算、对象引用 |

```jsx
// 两者等价的情况
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
const memoizedCallback2 = useMemo(() => () => doSomething(a, b), [a, b]);

// 但 useCallback 更语义化
```

---

### 3.5 实际应用示例

**示例一：表单提交回调**

```jsx
function FormComponent() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 缓存提交函数
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitForm(formData);
      alert('提交成功！');
    } catch (error) {
      alert('提交失败：' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.username}
        onChange={e => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="password"
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : '提交'}
      </button>
    </form>
  );
}
```

**示例二：定时器和事件监听**

```jsx
function TimerComponent() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // ✅ 缓存回调函数，用于清除定时器
  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
  }, []);

  // 使用 useEffect 配合 useCallback
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
```

**示例三：避免过度使用 useCallback**

```jsx
function EfficientComponent() {
  const [count, setCount] = useState(0);

  // ✅ 正确：需要传递给子组件的回调函数
  const handleChildClick = useCallback(() => {
    console.log('Child clicked');
  }, []);

  // ✅ 正确：依赖于可能会变化的变量
  const handleClickWithDep = useCallback((id) => {
    console.log('Clicked item', id, count);
  }, [count]);

  // ❌ 错误：只在组件内部使用的简单函数，不需要 useCallback
  const internalHelper = (a, b) => {
    return a + b;
  };

  // ❌ 错误：传递给非 memoized 的子组件
  const normalFunction = useCallback(() => {
    console.log('normal');
  }, []);

  // ✅ 正确：简单计算不需要 useMemo
  const doubled = count * 2;

  return (
    <div>
      <p>{doubled}</p>
      <ChildComponent onClick={handleChildClick} />
    </div>
  );
}

// ✅ 正确：使用 React.memo 优化子组件
const ChildComponent = React.memo(function ChildComponent({ onClick }) {
  return <button onClick={onClick}>Click</button>;
});
```

---

## 四、自定义 Hooks

### 4.1 创建自定义 Hook

自定义 Hook 是一个函数，其名称以 "use" 开头，可以在内部调用其他 Hook。通过自定义 Hook，可以抽离和复用组件逻辑。

**基本结构：**

```jsx
function useCustomHook(initialValue) {
  const [state, setState] = useState(initialValue);

  // 添加你的逻辑...

  return [state, setState];
}
```

---

### 4.2 抽离逻辑

**示例一：本地存储 Hook**

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // 读取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  // 存储值变化时更新 localStorage
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  // 返回状态和 setter
  return [storedValue, setValue];
}

// 使用示例
function App() {
  const [name, setName] = useLocalStorage('name', 'John');
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Theme: {theme}
      </button>
    </div>
  );
}
```

**示例二：窗口尺寸 Hook**

```jsx
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // 处理窗口大小变化的回调函数
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 清理函数：组件卸载时移除监听
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空依赖，只在挂载时添加监听

  return windowSize;
}

// 使用示例
function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <p>Window: {width} x {height}</p>
      {width < 768 ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

**示例三：异步数据获取 Hook**

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 重置状态
    setLoading(true);
    setError(null);

    // 创建取消控制器（用于清理）
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        // 忽略取消请求的错误
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setError(error.message);
          setLoading(false);
        }
      });

    // 清理函数：组件卸载时取消请求
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// 使用示例
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

---

### 4.3 实际示例

**示例一：表单验证 Hook**

```jsx
import { useState, useCallback } from 'react';

// 验证规则类型
// rules: { fieldName: [rule1, rule2, ...] }
// rule: { validate: (value) => boolean, message: string }

function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // 验证单个字段
  const validateField = useCallback((name, value) => {
    const fieldRules = rules[name];
    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return '';
  }, [rules]);

  // 处理字段变化
  const handleChange = useCallback((name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues(prev => ({ ...prev, [name]: value }));

    // 如果字段已经被触摸，则验证
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  // 处理字段失焦
  const handleBlur = useCallback((name) => () => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  // 验证整个表单
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    for (const name in rules) {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouched(
      Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    return isValid;
  }, [values, validateField, rules]);

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
}

// 使用示例
function LoginForm() {
  const validationRules = {
    email: [
      { validate: (v) => v.length > 0, message: '邮箱不能为空' },
      { validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: '邮箱格式不正确' }
    ],
    password: [
      { validate: (v) => v.length >= 6, message: '密码至少6位' }
    ]
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm
  } = useFormValidation({ email: '', password: '' }, validationRules);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      console.log('Form submitted:', values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          placeholder="邮箱"
        />
        {touched.email && errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          placeholder="密码"
        />
        {touched.password && errors.password && <span>{errors.password}</span>}
      </div>
      <button type="submit">登录</button>
      <button type="button" onClick={resetForm}>重置</button>
    </form>
  );
}
```

**示例二：媒体查询 Hook**

```jsx
import { useState, useEffect } from 'react';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 创建媒体查询列表
    const mediaQuery = window.matchMedia(query);

    // 设置初始值
    setMatches(mediaQuery.matches);

    // 定义变化处理函数
    const handler = (event) => {
      setMatches(event.matches);
    };

    // 监听变化
    mediaQuery.addEventListener('change', handler);

    // 清理
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

// 使用示例
function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {!isMobile && !isTablet && <DesktopLayout />}
    </div>
  );
}
```

**示例三：debounced 状态 Hook**

```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：value 变化时清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用示例：搜索自动补全
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 防抖后的搜索词
  const debouncedQuery = useDebounce(query, 300);

  // 当防抖后的搜索词变化时执行搜索
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // 模拟 API 调用
    const searchAPI = async () => {
      try {
        const response = await fetch(`/api/search?q=${debouncedQuery}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(searchAPI, 500);

    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <span>Loading...</span>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### 4.4 自定义 Hook 的最佳实践

**命名规范：**

```jsx
// ✅ 正确：以 "use" 开头
function useUserData(userId) { }
function useLocalStorage(key, initialValue) { }
function useWindowSize() { }

// ❌ 错误：没有以 "use" 开头
function getUserData(userId) { }
function windowSize() { }
```

**抽离逻辑的原则：**

```jsx
// ✅ 好的自定义 Hook：单一职责
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset };
}

// ✅ 好的自定义 Hook：组合多个 Hook
function useCounterWithStorage(key, initialValue = 0) {
  const [count, setCount] = useLocalStorage(key, initialValue);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  return { count, increment, decrement };
}

// ❌ 避免：Hook 内部直接渲染 UI
function useBadExample() {
  const [count, setCount] = useState(0);
  // 错误：不应该在 Hook 里返回 JSX
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## 五、Hooks 规则与最佳实践

### 5.1 只在顶层调用 Hook

**规则：** 不要在循环、条件语句或嵌套函数中调用 Hook。

**错误示例：**

```jsx
function BadComponent() {
  const [name, setName] = useState('John');

  // ❌ 错误：在条件语句中调用 Hook
  if (name) {
    const [age, setAge] = useState(25);
  }

  // ❌ 错误：在循环中调用 Hook
  for (let i = 0; i < 3; i++) {
    const [item, setItem] = useState(null);
  }

  // ❌ 错误：在嵌套函数中调用 Hook
  const handleClick = () => {
    const [clicked, setClicked] = useState(true);
  };

  return <div>{name}</div>;
}
```

**正确示例：**

```jsx
function GoodComponent() {
  // ✅ 正确：在组件顶层调用所有 Hook
  const [name, setName] = useState('John');
  const [age, setAge] = useState(25);
  const [clicked, setClicked] = useState(false);

  // 条件渲染组件，但不渲染 Hook
  const shouldShowAge = someCondition;

  return (
    <div>
      {name}
      {shouldShowAge && <span>{age}</span>}
      <button onClick={() => setClicked(true)}>Click</button>
    </div>
  );
}
```

**为什么有这个规则？**

React 依赖 Hook 的调用顺序来正确保存状态。如果在条件语句中调用 Hook，调用顺序会发生变化，导致状态混乱。

```jsx
// 错误示例：条件会导致调用顺序错误
function Component() {
  const [item, setItem] = useState(null);

  if (someCondition) {
    // 第一次渲染时可能不执行
    const [loading, setLoading] = useState(false);
  }

  // 如果 someCondition 在第二次渲染时变为 false
  // Hook 数量不匹配，导致状态错误
}
```

---

### 5.2 只在 React 函数中调用 Hook

**规则：** 只在 React 函数组件或自定义 Hook 中调用 Hook。

**错误示例：**

```jsx
// ❌ 错误：普通函数中调用 Hook
function regularFunction() {
  const [value, setValue] = useState(0); // 错误！
  return value;
}

// ❌ 错误：类组件中调用 Hook
class ClassComponent extends React.Component {
  render() {
    const [value, setValue] = useState(0); // 错误！
    return <div>{value}</div>;
  }
}
```

**正确示例：**

```jsx
// ✅ 正确：在函数组件中调用
function FunctionComponent() {
  const [value, setValue] = useState(0);
  return <div>{value}</div>;
}

// ✅ 正确：在自定义 Hook 中调用
function useCustomHook() {
  const [value, setValue] = useState(0);
  return value;
}
```

---

### 5.3 常见错误与解决方案

**错误一：无限循环**

```jsx
// ❌ 错误：useEffect 依赖项包含 setter
function BadComponent() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    // 每次渲染都会执行，因为 setValue 总是新的
    setValue(v => v + 1);
  }, [setValue]); // setValue 在每次渲染时都是新的！

  return <div>{value}</div>;
}

// ✅ 正确：使用函数式更新
function GoodComponent() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(v => v + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // 空依赖，只执行一次

  return <div>{value}</div>;
}
```

**错误二：闭包陷阱**

```jsx
// ❌ 错误：闭包捕获了过期的状态
function BadComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Count:', count); // count 永远是 0！
    }, 1000);

    return () => clearInterval(timer);
  }, []); // 空依赖，count 不会更新

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// ✅ 正确 1：使用函数式更新
function GoodComponent1() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1); // 使用函数式更新
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div>{count}</div>;
}

// ✅ 正确 2存储最新值
function GoodComponent2() {
  const [count, setCount] = useState(：使用 ref 0);
  const countRef = useRef(count);

  // 保持 ref 与 state 同步
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Count:', countRef.current); // 总是最新值
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**错误三：依赖项遗漏**

```jsx
// ❌ 错误：遗漏依赖项
function BadComponent() {
  const [result, setResult] = useState(0);

  const calculate = () => {
    // 使用了 a 和 b，但没有添加到依赖数组
    return a + b;
  };

  useEffect(() => {
    setResult(calculate());
  }, []); // 缺少依赖！

  return <div>{result}</div>;
}

// ✅ 正确：添加所有使用的变量到依赖数组
function GoodComponent({ a, b }) {
  const [result, setResult] = useState(0);

  const calculate = useCallback(() => {
    return a + b;
  }, [a, b]);

  useEffect(() => {
    setResult(calculate());
  }, [calculate]); // 依赖 calculate

  return <div>{result}</div>;
}
```

**错误四：使用 State 而不是 Ref 的场景**

```jsx
// ❌ 错误：不需要触发重新渲染的值用 useState
function BadComponent() {
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      // 定时器逻辑
    }, 1000);
    setTimerId(id); // 触发不必要的重新渲染

    return () => clearInterval(id);
  }, []);

  return <div>Timer</div>;
}

// ✅ 正确：不需要渲染的值用 useRef
function GoodComponent() {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      // 定时器逻辑
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  return <div>Timer</div>;
}
```

---

### 5.4 Hooks 最佳实践总结

**性能优化最佳实践：**

```jsx
// 1. useMemo 用于缓存计算结果
const expensiveValue = useMemo(() => computeExpensive(a, b), [a, b]);

// 2. useCallback 用于缓存回调函数
const handleClick = useCallback(() => doSomething(id), [id]);

// 3. React.memo 配合 useCallback 避免子组件不必要渲染
const MemoizedChild = React.memo(ChildComponent);
const handleClick = useCallback(() => {}, []);

// 4. 使用 useRef 存储不需要触发渲染的值
const valueRef = useRef(initialValue);

// 5. 使用函数式更新避免依赖旧状态
setCount(c => c + 1); // 不依赖外部的 count
```

**代码组织最佳实践：**

```jsx
// 合理的 Hook 顺序
function WellOrganizedComponent({ userId }) {
  // 1. 状态 Hooks
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Ref Hooks
  const inputRef = useRef(null);

  // 3. Effect Hooks
  useEffect(() => {
    // 副作用逻辑
  }, [userId]);

  // 4. 自定义 Hooks
  const { width, height } = useWindowSize();

  // 5. 事件处理函数（使用 useCallback）
  const handleSubmit = useCallback(() => {
    // 提交逻辑
  }, [data]);

  // 6. 渲染 JSX
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**自定义 Hook 最佳实践：**

```jsx
// 1. 保持单一职责
function useUser(id) {
  // 只负责获取用户数据
}

function useUserPermissions(user) {
  // 只负责处理权限
}

// 2. 合理处理异步
function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    setState(s => ({ ...s, loading: true }));
    asyncFn()
      .then(data => setState({ loading: false, error: null, data }))
      .catch(error => setState({ loading: false, error, data: null }));
  }, deps);

  return state;
}

// 3. 清理副作用
function useEventListener(eventName, handler) {
  useEffect(() => {
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName, handler]);
}
```

---

## 六、综合示例：完整的计数器应用

以下是综合运用所有 Hooks 的完整示例：

```jsx
import React, { useState, useReducer, useMemo, useCallback, useRef, useEffect } from 'react';

// ==================== 自定义 Hooks ====================

// 本地存储 Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// 防抖 Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ==================== Reducer ====================

const initialState = {
  count: 0,
  step: 1,
  history: [],
  isPaused: false
};

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': {
      const newCount = state.count + state.step;
      return {
        ...state,
        count: newCount,
        history: [...state.history, { type: 'INCREMENT', value: newCount, timestamp: Date.now() }]
      };
    }
    case 'DECREMENT': {
      const newCount = state.count - state.step;
      return {
        ...state,
        count: newCount,
        history: [...state.history, { type: 'DECREMENT', value: newCount, timestamp: Date.now() }]
      };
    }
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'UNDO':
      if (state.history.length === 0) return state;
      const newHistory = state.history.slice(0, -1);
      const previousValue = newHistory.length > 0 ? newHistory[newHistory.length - 1].value : 0;
      return { ...state, count: previousValue, history: newHistory };
    case 'RESET':
      return initialState;
    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };
    default:
      return state;
  }
}

// ==================== 主组件 ====================

function AdvancedCounter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);
  const [localCount, setLocalCount] = useLocalStorage('counter-count', 0);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  // 防抖输入
  const debouncedInput = useDebounce(inputValue, 300);

  // Memoized: 显示文本
  const displayText = useMemo(() => {
    if (debouncedInput) {
      return `Current input: ${debouncedInput}`;
    }
    return 'Start typing...';
  }, [debouncedInput]);

  // Memoized: 统计数据
  const stats = useMemo(() => ({
    totalChanges: state.history.length,
    averageValue: state.history.length > 0
      ? state.history.reduce((sum, h) => sum + h.value, 0) / state.history.length
      : 0
  }), [state.history]);

  // Callbacks
  const handleIncrement = useCallback(() => {
    dispatch({ type: 'INCREMENT' });
    setLocalCount(c => c + state.step);
  }, [state.step, setLocalCount]);

  const handleDecrement = useCallback(() => {
    dispatch({ type: 'DECREMENT' });
    setLocalCount(c => c - state.step);
  }, [state.step, setLocalCount]);

  const handleStepChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      dispatch({ type: 'SET_STEP', payload: value });
    }
  }, []);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setLocalCount(0);
  }, [setLocalCount]);

  const handleTogglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // 自动计数
  useEffect(() => {
    if (state.isPaused) return;

    const interval = setInterval(() => {
      dispatch({ type: 'INCREMENT' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isPaused]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Advanced Counter with Hooks</h1>

      {/* 计数器显示 */}
      <div style={{ fontSize: '48px', textAlign: 'center', margin: '20px 0' }}>
        {state.count}
      </div>

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={handleDecrement} style={{ padding: '10px 20px' }}>
          - {state.step}
        </button>
        <button onClick={handleIncrement} style={{ padding: '10px 20px' }}>
          + {state.step}
        </button>
      </div>

      {/* 步骤设置 */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label>
          Step:
          <input
            type="number"
            value={state.step}
            onChange={handleStepChange}
            style={{ width: '60px', marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      {/* 其他操作 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={handleUndo} disabled={state.history.length === 0}>
          Undo
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
        <button onClick={handleTogglePause}>
          {state.isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* 统计信息 */}
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Statistics</h3>
        <p>Total Changes: {stats.totalChanges}</p>
        <p>Average Value: {stats.averageValue.toFixed(2)}</p>
        <p>LocalStorage Count: {localCount}</p>
      </div>

      {/* 输入测试 */}
      <div style={{ marginBottom: '20px' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <p>{displayText}</p>
        <button onClick={focusInput}>Focus Input</button>
      </div>

      {/* 历史记录 */}
      {state.history.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>History</h3>
          <ul style={{ maxHeight: '150px', overflow: 'auto' }}>
            {state.history.slice(-5).reverse().map((item, index) => (
              <li key={index}>
                {item.type}: {item.value} at {new Date(item.timestamp).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdvancedCounter;
```

---

## 总结

本文档详细介绍了 React Hooks 的进阶用法：

1. **useReducer**: 适合复杂的状态逻辑，提供类似 Redux 的状态管理模式，便于集中管理和调试
2. **useMemo**: 用于缓存昂贵的计算结果，避免不必要的重复计算
3. **useCallback**: 用于缓存函数引用，配合 React.memo 优化子组件渲染
4. **自定义 Hooks**: 通过抽离逻辑实现代码复用，保持组件简洁
5. **最佳实践**: 遵循 Hooks 规则，合理组织代码，避免常见错误

掌握这些技巧能够帮助你编写更高效、可维护的 React 应用。
