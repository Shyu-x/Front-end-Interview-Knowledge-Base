/**
 * 第5章-React19新特性 教学代码索引
 *
 * 本文件导出本章所有教学示例，方便在项目中引入和使用。
 */

// 示例1: useActionState - 联系表单
export { default as ContactForm } from './01-useActionState-联系表单.jsx'

// 示例2: useFormStatus - 自定义提交按钮
export { default as FeedbackForm } from './02-useFormStatus-自定义提交按钮.jsx'

// 示例3: useOptimistic - 点赞功能
export { default as OptimisticDemo, LikeButton, CommentSection } from './03-useOptimistic-点赞功能.jsx'

// 示例4: use() - 数据获取
export { default as DataFetchingDemo } from './04-use-数据获取.jsx'

// 示例5: use() 替代 useContext
export { default as ContextDemo } from './05-use-替代Context.jsx'

// 示例6: 综合示例 - 任务管理
export { default as TaskManager } from './06-综合示例-任务管理.jsx'

/**
 * 示例使用说明:
 *
 * 1. useActionState-联系表单.jsx
 *    - 展示如何使用 useActionState 管理表单状态
 *    - 包含完整的验证逻辑和错误处理
 *
 * 2. useFormStatus-自定义提交按钮.jsx
 *    - 展示如何使用 useFormStatus 获取表单状态
 *    - 包含自定义提交按钮和状态面板
 *
 * 3. useOptimistic-点赞功能.jsx
 *    - 展示如何使用 useOptimistic 实现乐观更新
 *    - 包含点赞和评论两个场景
 *
 * 4. use-数据获取.jsx
 *    - 展示如何使用 use() 进行数据获取
 *    - 包含 Suspense 集成和并行请求
 *
 * 5. use-替代Context.jsx
 *    - 展示如何使用 use() 替代 useContext
 *    - 展示条件性使用 Context 的能力
 *
 * 6. 综合示例-任务管理.jsx
 *    - 综合使用 useActionState、useOptimistic、useFormStatus
 *    - 展示完整的 CRUD 操作
 */

/**
 * 快速开始
 *
 * 在 React 19 项目中导入单个示例:
 *
 * import ContactForm from './教学代码/第5章-React19新特性/01-useActionState-联系表单'
 *
 * 或导入所有示例:
 *
 * import { ContactForm, FeedbackForm, TaskManager } from './教学代码/第5章-React19新特性'
 */
