/**
 * 第4章 - Hooks进阶 教学代码索引
 *
 * 本章涵盖以下内容:
 * 1. useReducer - 复杂状态管理
 * 2. useMemo - 计算结果缓存/性能优化
 * 3. useCallback - 函数实例缓存
 * 4. 自定义Hooks - 可复用的状态逻辑
 */

// 导出所有示例组件
export { default as ShoppingCart } from './01-useReducer-购物车组件';
export { default as ProductList } from './02-useMemo-产品列表';
export { default as UserManagement } from './03-useCallback-回调函数传递';
export { default as CustomHooksDemo } from './04-自定义Hooks示例';

/**
 * 使用说明:
 *
 * 1. useReducer 购物车组件
 *    文件: 01-useReducer-购物车组件.jsx
 *    演示: 复杂状态管理，添加/删除商品，修改数量，计算总价，折扣应用
 *
 * 2. useMemo 产品列表
 *    文件: 02-useMemo-产品列表.jsx
 *    演示: 搜索过滤，分类筛选，价格排序，性能优化
 *
 * 3. useCallback 回调函数传递
 *    文件: 03-useCallback-回调函数传递.jsx
 *    演示: 父组件向子组件传递回调函数，避免不必要的重渲染
 *
 * 4. 自定义Hooks
 *    文件: 04-自定义Hooks示例.jsx
 *    包含:
 *    - useLocalStorage: 本地存储持久化
 *    - useDebounce: 防抖处理
 *    - useWindowSize: 窗口尺寸监听
 *
 * ------------------------------------------------------------
 *
 * 核心概念总结:
 *
 * useReducer:
 * - 适合复杂的状态逻辑
 * - 将相关联的状态和操作集中管理
 * - 使用 dispatch 触发状态变更
 *
 * useMemo:
 * - 缓存计算结果
 * - 只有依赖项变化时才重新计算
 * - 适合复杂计算和性能优化
 *
 * useCallback:
 * - 缓存函数实例
 * - 只有依赖项变化时才创建新函数
 * - 与 React.memo 配合防止子组件重渲染
 *
 * 自定义Hooks:
 * - 以 "use" 开头的函数
 * - 封装可复用的状态逻辑
 * - 内部可使用其他Hooks
 *
 * ------------------------------------------------------------
 *
 * 学习建议:
 * 1. 先理解每个Hook的基本用法
 * 2. 运行示例代码，观察控制台输出
 * 3. 尝试修改代码，验证理解
 * 4. 思考在实际项目中的应用场景
 */
