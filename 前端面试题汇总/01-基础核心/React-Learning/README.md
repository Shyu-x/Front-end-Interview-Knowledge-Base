# React 19 全栈学习指南

> 从零开始的 React 函数式组件开发完整教程，包含 React 19 新特性、Zustand 状态管理、Ant Design 组件库的深入学习

---

## 目录结构

```
React-Learning/
├── README.md                          # 学习路线总览
├── 教学文档/
│   ├── 第1章-环境搭建与项目配置.md
│   ├── 第2章-React函数式组件基础.md
│   ├── 第3章-React Hooks入门.md
│   ├── 第4章-React Hooks进阶.md
│   ├── 第5章-React19新特性.md
│   ├── 第6章-Zustand状态管理.md
│   ├── 第7章-AntDesign组件库.md
│   ├── 第8章-实战项目开发.md
│   ├── 第9章-ReactRouter7路由系统.md
│   └── 第10章-ReactDOM深入理解.md
├── 教学代码/
│   ├── 第1章-环境搭建/
│   ├── 第2章-React基础/
│   ├── 第3章-Hooks入门/           # 5个示例
│   ├── 第4章-Hooks进阶/           # 4个示例
│   ├── 第5章-React19新特性/       # 6个示例
│   ├── 第6章-Zustand状态管理/     # 11个示例
│   ├── 第7章-AntDesign组件库/     # 3个示例
│   ├── 第8章-实战项目/            # 10个文件
│   ├── 第9章-ReactRouter7路由系统/ # 7个示例
│   └── 第10章-ReactDOM深入理解/    # 8个示例
└── 教学资源/
    ├── 学习路线图.md
    ├── 常用命令速查.md
    ├── 面试题汇总.md
    └── 示例代码运行指南.md
```

---

## 技术栈版本（2025年最新）

| 技术 | 版本 | 说明 |
|------|------|------|
| **Node.js** | 25.x LTS | 最新LTS版本，性能大幅提升 |
| **React** | 19.2.x | 2025年10月最新稳定版 |
| **Vite** | 6.5.x | 2025年5月最新版本 |
| **Zustand** | 5.x | 轻量级状态管理 |
| **Ant Design** | 5.25.x | 企业级UI组件库 |
| **TypeScript** | 5.x | 类型支持 |
| **pnpm** | 9.x | 高性能包管理器 |

---

## 学习路线

### 阶段一：环境搭建（第1章）
- [ ] 1.1 Node.js 25.x 安装与配置
- [ ] 1.2 pnpm 包管理器安装
- [ ] 1.3 创建 React 19 + Vite 6 项目
- [ ] 1.4 项目目录结构解析
- [ ] 1.5 VS Code 开发工具配置
- [ ] 1.6 ESLint + Prettier 配置

### 阶段二：React 基础（第2章）
- [ ] 2.1 函数式组件定义与原理
- [ ] 2.2 JSX 语法详解与底层原理
- [ ] 2.3 组件通信：props 深度理解
- [ ] 2.4 事件处理与合成事件
- [ ] 2.5 条件渲染与列表渲染优化

### 阶段三：Hooks 入门（第3章）
- [ ] 3.1 useState 状态管理详解
- [ ] 3.2 useEffect 副作用深度理解
- [ ] 3.3 useRef DOM引用与变量持久化
- [ ] 3.4 useContext 跨组件通信
- [ ] 3.5 Hooks 渲染原理

### 阶段四：Hooks 进阶（第4章）
- [ ] 4.1 useReducer 复杂状态逻辑
- [ ] 4.2 useMemo 性能优化原理
- [ ] 4.3 useCallback 函数缓存
- [ ] 4.4 自定义 Hooks 开发
- [ ] 4.5 Hooks 规则与最佳实践
- [ ] 4.6 性能优化技巧

### 阶段五：React 19 新特性（第5章）
- [ ] 5.1 useActionState 表单状态管理
- [ ] 5.2 useFormStatus 表单状态
- [ ] 5.3 useOptimistic 乐观更新
- [ ] 5.4 use() 通用数据获取
- [ ] 5.5 React 19.2 新特性
- [ ] 5.6 服务器组件 (RSC) 基础

### 阶段六：Zustand 状态管理（第6章）
- [ ] 6.1 Zustand 5.x 简介与安装
- [ ] 6.2 创建 Store 与状态设计
- [ ] 6.3 组件中使用 Store
- [ ] 6.4 中间件系统（persist、devtools）
- [ ] 6.5 异步操作与最佳实践
- [ ] 6.6 TypeScript 集成

### 阶段七：Ant Design 组件库（第7章）
- [ ] 7.1 Ant Design 5.25.x 简介与安装
- [ ] 7.2 布局组件（Layout、Grid、Space）
- [ ] 7.3 基础组件（Button、Icon、Typography）
- [ ] 7.4 表单组件（Form、Input、Select）
- [ ] 7.5 数据展示（Table、Card、List）
- [ ] 7.6 反馈组件（Modal、Message、Notification）
- [ ] 7.7 导航组件（Menu、Tabs、Pagination）
- [ ] 7.8 主题定制与CSS变量

### 阶段八：React Router 7 路由系统（第9章）
- [ ] 9.1 React Router 7 概述与安装
- [ ] 9.2 基础路由配置（BrowserRouter、Routes、Route）
- [ ] 9.3 路由组件详解（Link、NavLink、Navigate、Outlet）
- [ ] 9.4 路由参数与查询参数
- [ ] 9.5 嵌套路由与布局
- [ ] 9.6 编程式导航（useNavigate）
- [ ] 9.7 路由守卫与权限控制
- [ ] 9.8 完整多页面应用实战

### 阶段九：React DOM 深入理解（第10章）
- [ ] 10.1 React DOM 概述与渲染原理
- [ ] 10.2 Portals 传送门（模态框、工具提示）
- [ ] 10.3 flushSync 强制同步更新
- [ ] 10.4 虚拟 DOM 与 Diff 算法
- [ ] 10.5 性能优化（useMemo、useCallback、React.memo）
- [ ] 10.6 代码分割与懒加载
- [ ] 10.7 SSR 服务端渲染基础

### 阶段十：项目实战与部署（第11章）
- [ ] 11.1 项目规划与架构设计
- [ ] 11.2 Zustand 状态管理设计
- [ ] 11.3 React Router 路由配置
- [ ] 11.4 Ant Design 页面开发
- [ ] 11.5 性能优化与构建
- [ ] 11.6 部署上线

---

## 如何运行示例代码

### 1. 环境准备

```bash
# 检查 Node.js 版本
node -v

# 安装 pnpm（推荐）
npm install -g pnpm
```

### 2. 创建 React 项目

```bash
# 使用 Vite 创建项目
pnpm create vite@latest react-learning-demo -- --template react

# 进入项目目录
cd react-learning-demo

# 安装依赖
pnpm install
```

### 3. 安装所需依赖

```bash
# 安装 React Router（如需要路由功能）
pnpm add react-router

# 安装 Ant Design（如需要 UI 组件库）
pnpm add antd @ant-design/icons
```

### 4. 添加示例代码

将 `教学代码/` 文件夹中的组件复制到你的项目中：

```
react-learning-demo/
├── src/
│   ├── components/          # 创建此目录并复制组件
│   │   ├── Counter.jsx
│   │   ├── TodoList.jsx
│   │   ├── CountdownTimer.jsx
│   │   └── PomodoroTimer.jsx
│   ├── App.jsx
│   └── main.jsx
```

### 5. 在 App.jsx 中使用

```jsx
// src/App.jsx
import Counter from './components/Counter'
import TodoList from './components/TodoList'
import CountdownTimer from './components/CountdownTimer'
import PomodoroTimer from './components/PomodoroTimer'

function App() {
  return (
    <div>
      <h2>计数器示例</h2>
      <Counter />

      <h2>待办事项</h2>
      <TodoList />

      <h2>倒计时器</h2>
      <CountdownTimer />

      <h2>番茄钟</h2>
      <PomodoroTimer />
    </div>
  )
}

export default App
```

### 6. 启动项目

```bash
# 启动开发服务器
pnpm dev

# 指定端口（如 3000）
pnpm dev -- --port 3000
```

然后打开浏览器访问显示的地址（通常是 http://localhost:5173）

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产版本 |

### 学习方式建议

1. **按顺序学习**：建议按照目录顺序依次学习，每个章节的代码示例都要动手实践

2. **动手实践**：教程中的代码示例都在 `教学代码/` 目录下，可以直接复制运行

3. **理论与实践结合**：每学完一章，尝试完成对应的练习题

4. **复习巩固**：定期回顾之前学过的内容，形成知识体系

### 配套资源

- **教学文档**：详细的知识讲解
- **教学代码**：可运行的示例代码
- **教学资源**：速查表、面试题等、示例代码运行指南

---

## 常见问题

### Q: 需要什么基础才能学习本教程？
A: 本教程适合 React 新手，需要具备基本的 JavaScript 和 HTML/CSS 知识。

### Q: 使用什么开发工具？
A: 推荐使用 VS Code，需要安装 React 相关扩展。

### Q: 是否需要学习 TypeScript？
A: 本教程主要使用 JavaScript，但示例代码也会提供 TypeScript 版本供参考。TypeScript 是 React 开发的趋势，建议学习。

### Q: Node.js 25 和 20 有什么区别？
A: Node.js 25 升级到 V8 14.1 引擎，JSON.stringify 性能提升显著，并内置 Uint8Array Base64/Hex 转换支持。建议开发环境使用最新版本。

### Q: 如何获取帮助？
A: 遇到问题可以查看官方文档或搜索引擎。

---

## 更新日志

- **2025-02-27**: 初始版本，包含完整的学习路径和教学大纲
- **2025-02-27**: 更新至最新技术版本（Node.js 25.x、React 19.2、Vite 6.5、Ant Design 5.25）

---

## 许可证

本教程仅供学习交流使用，禁止商业用途。
