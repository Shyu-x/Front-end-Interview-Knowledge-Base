# HTML 核心原理

## 一、HTML 核心原理

### 1.1 HTML5 新增特性详解

**参考答案：**

HTML5 引入了一系列重磅特性，极大推动了 Web 应用的发展：

1. **语义化标签**：`<article>`、`<section>`、`<nav>`、`<header>`、`<footer>`、`<aside>` 等，提升文档结构可读性和 SEO 效果。

2. **表单增强**：
   - 新增 input 类型：`email`、`url`、`tel`、`number`、`range`、`date`、`time`、`datetime-local`、`color` 等
   - 新增属性：`placeholder`、`required`、`pattern`、`autofocus`、`autocomplete`、`novalidate`
   - 新增表单元素：`<datalist>`、`<output>`、`<keygen>`（已废弃）、`<meter>`

3. **多媒体标签**：
   - `<video>`：支持 MP4、WebM、Ogg 格式，具备 controls、autoplay、loop、muted、poster 等属性
   - `<audio>`：支持 MP3、Wav、Ogg 格式
   - 视频编解码：H.264（Safari/IE）、VP8/VP9（Chrome/Firefox）、Ogg Theora

4. **Canvas 与 SVG**：
   - `<canvas>`：基于位图的 2D 绘图 API，支持动画、游戏渲染、数据可视化
   - `<svg>`：矢量图形语言，支持 DOM 操作、事件绑定、动画

5. **本地存储**：
   - `localStorage`：持久化存储，容量约 5-10MB，同源策略
   - `sessionStorage`：会话级存储，页面关闭后清除
   - `IndexedDB`：浏览器内置的 NoSQL 数据库，支持大容量结构化数据存储

6. **Web Worker**：后台线程，不阻塞主线程，用于复杂计算
7. **WebSocket**：全双工通信协议
8. **Geolocation API**：地理定位
9. **Drag and Drop API**：拖拽接口
10. **History API**：history.pushState、history.replaceState、popstate 事件

---

### 1.2 DOCTYPE 的作用与类型

**参考答案：**

`<!DOCTYPE>` 声明位于 HTML 文档第一行，告知浏览器使用哪种 HTML 或 XHTML 规范。该标签可声明三种 DTD（文档类型定义）类型：

| DOCTYPE | 规范 | 说明 |
| :--- | :--- | :--- |
| `HTML5` | HTML5 | `<!DOCTYPE html>` 简洁声明，现代标准 |
| `HTML4.01 Strict` | HTML4.01 严格版 | 不包含废弃元素和框架集 |
| `HTML4.01 Transitional` | HTML4.01 过渡版 | 包含废弃元素，但不包含框架集 |
| `HTML4.01 Frameset` | HTML4.01 框架版 | 允许使用框架集 |

**关键作用**：
- 触发标准模式（Standards Mode）渲染，避免混杂模式（Quirks Mode）
- 混杂模式模拟非标准行为以兼容旧网站
- HTML5 使用简洁声明，不再需要 DTD 引用

---

### 1.3 浏览器渲染过程详解

**参考答案：**

```
┌─────────────────────────────────────────────────────────────────┐
│                        浏览器渲染流程                            │
├─────────────────────────────────────────────────────────────────┤
│  1. HTML 解析 ──→ 2. DOM 树构建 ──→ 3. CSS 解析 ──→ 4. 渲染树   │
│         │                │                │              │       │
│         ▼                ▼                ▼              ▼       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐   ┌─────────┐   │
│  │  网络进程 │───▶│  HTML    │───▶│  CSS     │──▶│ Render  │   │
│  │  下载资源 │    │  Parser  │    │  Parser  │   │ Tree    │   │
│  └──────────┘    └──────────┘    └──────────┘   └────┬────┘   │
│                                                      │         │
│                                                      ▼         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐   ┌─────────┐   │
│  │  布局    │◀───│  绘制    │◀───│ 分层     │◀──│ 合成    │   │
│  │ Layout   │    │  Paint   │    │  Layer   │   │ Composite│   │
│  └──────────┘    └──────────┘    └──────────┘   └─────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**详细步骤**：

1. **HTML 解析**：浏览器通过网络获取 HTML 文档，解析为 DOM 节点，构建 DOM 树。

2. **CSS 解析**：同时解析 CSS，包括内联样式、外链样式、内嵌样式，生成 CSSOM（CSS Object Model）树。

3. **渲染树（Render Tree）**：DOM 树 + CSSOM 树 = 渲染树，只包含可见节点。

4. **布局（Layout）**：计算每个节点的几何位置和尺寸，得到布局树。

5. **分层（Layer）**：
   - 拥有**层叠上下文**的元素（position: absolute/fixed、opacity < 1、transform、filter 等）独立分层
   - 特殊元素（`<video>`、`<canvas>`、`<iframe>`）也会分层
   - 分层有助于优化渲染性能

6. **绘制（Paint）**：将每个图层拆分为绘制指令，绘制到位图。

7. **合成（Composite）**：将各图层提交给 GPU 合成，最终显示在屏幕上。

**性能优化关键点**：
- 避免强制同步布局（forced reflow）
- 减少重绘（repaint）和重排（reflow）
- 使用 `transform` 和 `opacity` 实现动画（触发合成而非重排）

---

### 1.4 src 与 href 的区别

**参考答案：**

| 属性 | 作用 | 适用标签 | 加载行为 |
| :--- | :--- | :--- | :--- |
| `src` | **引入资源**，资源是页面必需的一部分 | `<script>`、`<img>`、`<iframe>`、`<video>`、`<audio>` | 阻塞 HTML 解析，资源加载完成才继续 |
| `href` | **建立关联**，表示语义上的链接关系 | `<a>`、`<link>` | 并行下载，不阻塞 HTML 解析 |

**本质区别**：
- `src` 会替代当前元素内容，浏览器需要立即加载该资源
- `href` 只是建立链接关系，浏览器可以并行处理

---

### 1.5 meta 标签全面解析

**参考答案：**

`<meta>` 标签位于 `<head>` 区域，提供页面元数据。

**常见用法**：

```html
<!-- 字符编码 -->
<meta charset="UTF-8">

<!-- 搜索引擎 SEO -->
<meta name="description" content="页面描述，控制在 150 字符内">
<meta name="keywords" content="关键词1,关键词2">
<meta name="author" content="作者名称">
<meta name="robots" content="index,follow">

<!-- 视口配置（移动端适配） -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<!-- 缓存控制 -->
<meta http-equiv="Cache-Control" content="no-cache">
<meta http-equiv="Expires" content="0">

<!-- 兼容性设置 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<!-- 刷新与重定向 -->
<meta http-equiv="Refresh" content="5;url=https://example.com">

<!-- CSP 内容安全策略 -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">

<!-- 主题颜色（移动端 PWA） -->
<meta name="theme-color" content="#ffffff">
```

---

### 1.6 HTML 语义化的重要性

**参考答案：**

1. **SEO 优化**：搜索引擎爬虫更好地理解页面结构，提升关键词排名
2. **可访问性（a11y）**：屏幕阅读器正确解析，便于视障用户浏览
3. **代码可读性**：便于开发者维护和团队协作
4. **结构清晰**：DOM 树更加规范，便于样式绑定

**最佳实践**：
- 使用 `<header>`、`<nav>`、`<main>`、`<article>`、`<section>`、`<aside>`、`<footer>` 代替大量 `<div>`
- 列表使用 `<ul>`、`<ol>`、`<li>`
- 表格使用 `<table>`、`<thead>`、`<tbody>`、`<th>`、`<td>`
- 表单使用 `<form>`、`<label>`、`<input>`、`<button>`
