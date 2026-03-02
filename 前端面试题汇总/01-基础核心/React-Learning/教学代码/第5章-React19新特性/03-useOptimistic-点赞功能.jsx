/**
 * 示例3: useOptimistic - 点赞功能（乐观更新）
 *
 * 本示例展示如何使用 useOptimistic 来实现乐观更新。
 * 乐观更新是一种提升用户体验的技术：当用户执行某个操作时，
 * 立即更新 UI 显示预期的结果，而不是等待服务器响应完成。
 *
 * 核心概念:
 * - useOptimistic(state, updateFn)
 * - 乐观状态会在实际状态变化时自动替换
 * - 失败时自动回滚到实际状态
 */

import { useState, useOptimistic } from 'react'

// ============================================
// 1. 模拟后端 API
// ============================================
const api = {
  /**
   * 点赞帖子
   * @param {string} postId - 帖子ID
   * @returns {Promise<Object>} - 点赞结果
   */
  async likePost(postId) {
    // 模拟网络延迟 (1秒)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟随机失败 (10%概率)
    if (Math.random() < 0.1) {
      throw new Error('点赞失败，请稍后重试')
    }

    return { likes: 1 }
  },

  /**
   * 取消点赞
   * @param {string} postId - 帖子ID
   * @returns {Promise<Object>} - 取消结果
   */
  async unlikePost(postId) {
    // 模拟网络延迟 (1秒)
    await new Promise(resolve => setTimeout(resolve, 1000))

    return { likes: -1 }
  }
}

// ============================================
// 2. 点赞按钮组件
// ============================================
/**
 * 点赞按钮 - 展示乐观更新
 *
 * @param {Object} props - 组件属性
 * @param {number} props.initialLikes - 初始点赞数
 * @param {string} props.postId - 帖子ID
 */
function LikeButton({ initialLikes, postId }) {
  // 实际状态 - 从服务器获取的真实数据
  const [likes, setLikes] = useState(initialLikes)

  // 乐观状态 - 立即显示给用户的状态
  // 参数1: 当前实际状态
  // 参数2: 更新函数，接收 (当前状态, 更新参数) 返回新状态
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    // 更新函数: 接收当前状态和增量，返回新状态
    (currentLikes, delta) => currentLikes + delta
  )

  // 处理点赞
  async function handleLike() {
    // 步骤1: 立即触发乐观更新 (+1)
    // 用户立即看到点赞数增加
    addOptimisticLike(1)

    // 步骤2: 发送请求到服务器
    try {
      const result = await api.likePost(postId)

      // 步骤3: 服务器响应后更新实际状态
      setLikes(prev => prev + result.likes)
    } catch (error) {
      // 失败时，React 会自动回滚到实际状态
      // 用户界面会恢复到真实状态
      console.error('点赞失败:', error.message)
      alert('点赞失败，请稍后重试')
    }
  }

  // 处理取消点赞
  async function handleUnlike() {
    // 立即乐观更新 (-1)
    addOptimisticLike(-1)

    try {
      const result = await api.unlikePost(postId)
      setLikes(prev => prev + result.likes)
    } catch (error) {
      console.error('取消点赞失败:', error.message)
      alert('操作失败，请稍后重试')
    }
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>点赞示例</h3>

      <div style={styles.buttonGroup}>
        {/* 点赞按钮 */}
        <button
          onClick={handleLike}
          style={styles.likeButton}
        >
          👍 点赞
        </button>

        {/* 取消点赞按钮 */}
        <button
          onClick={handleUnlike}
          style={styles.unlikeButton}
        >
          👎 取消
        </button>
      </div>

      {/* 显示点赞数 - 使用乐观状态 */}
      <div style={styles.countDisplay}>
        <span style={styles.countLabel}>当前点赞数:</span>
        <span style={styles.countValue}>{optimisticLikes}</span>
        {optimisticLikes !== likes && (
          <span style={styles.optimisticBadge}>乐观更新中</span>
        )}
      </div>

      {/* 状态说明 */}
      <div style={styles.explanation}>
        <p><strong>实际状态 (服务器):</strong> {likes}</p>
        <p><strong>乐观状态 (显示):</strong> {optimisticLikes}</p>
        <p style={styles.hint}>
          {optimisticLikes !== likes
            ? '正在等待服务器响应...'
            : '状态同步'}
        </p>
      </div>
    </div>
  )
}

// ============================================
// 3. 评论组件 - 展示列表乐观更新
// ============================================
function CommentSection({ postId, initialComments }) {
  // 实际评论列表
  const [comments, setComments] = useState(initialComments)

  // 乐观评论列表
  // 这里的更新函数是添加新评论到列表
  const [displayedComments, addOptimisticComment] = useOptimistic(
    comments,
    // 更新函数: 接收当前评论列表和新评论，返回合并后的列表
    (state, newComment) => [...state, newComment]
  )

  // 提交评论
  async function handleSubmit(formData) {
    const author = formData.get('author')
    const text = formData.get('comment')

    // 创建临时评论
    const tempComment = {
      id: `temp-${Date.now()}`, // 临时 ID
      author,
      text,
      timestamp: new Date().toISOString(),
      status: 'pending' // 标记为待确认
    }

    // 立即显示新评论（乐观更新）
    addOptimisticComment(tempComment)

    try {
      // 发送到服务器
      const savedComment = await submitCommentToServer(postId, {
        ...tempComment,
        status: 'confirmed'
      })

      // 服务器响应后更新实际列表
      setComments(prev => [...prev, savedComment])
    } catch (error) {
      // 失败时，评论会自动消失
      // 因为 displayedComments 会恢复为 comments
      console.error('评论失败:', error)
      alert('评论失败，请重试')
    }
  }

  // 模拟提交到服务器
  async function submitCommentToServer(postId, comment) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { ...comment, id: `real-${Date.now()}` }
  }

  return (
    <div style={styles.commentSection}>
      <h3 style={styles.commentTitle}>评论 ({displayedComments.length})</h3>

      {/* 评论列表 */}
      <div style={styles.commentList}>
        {displayedComments.map(comment => (
          <div
            key={comment.id}
            style={{
              ...styles.comment,
              opacity: comment.status === 'pending' ? 0.6 : 1
            }}
          >
            <div style={styles.commentHeader}>
              <strong>{comment.author}</strong>
              {comment.status === 'pending' && (
                <span style={styles.pending}>发送中...</span>
              )}
            </div>
            <p style={styles.commentText}>{comment.text}</p>
          </div>
        ))}
      </div>

      {/* 评论表单 */}
      <form action={handleSubmit} style={styles.commentForm}>
        <input
          name="author"
          placeholder="你的名字"
          required
          style={styles.commentInput}
        />
        <textarea
          name="comment"
          placeholder="写下你的评论..."
          required
          style={styles.commentTextarea}
        />
        <button type="submit" style={styles.commentSubmit}>
          发表评论
        </button>
      </form>
    </div>
  )
}

// ============================================
// 4. 样式对象
// ============================================
const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '25px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  likeButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600'
  },
  unlikeButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600'
  },
  countDisplay: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  countLabel: {
    marginRight: '8px',
    color: '#666'
  },
  countValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#007bff'
  },
  optimisticBadge: {
    marginLeft: '10px',
    padding: '4px 8px',
    backgroundColor: '#ffc107',
    color: '#000',
    borderRadius: '4px',
    fontSize: '12px'
  },
  explanation: {
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    fontSize: '13px'
  },
  hint: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: '8px'
  },
  commentSection: {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '25px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  commentTitle: {
    marginBottom: '20px',
    color: '#333'
  },
  commentList: {
    marginBottom: '20px'
  },
  comment: {
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  pending: {
    color: '#007bff',
    fontSize: '12px'
  },
  commentText: {
    margin: 0,
    color: '#333'
  },
  commentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  commentInput: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px'
  },
  commentTextarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  commentSubmit: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  }
}

// 导出组件
export { LikeButton, CommentSection }

// 默认导出
export default function OptimisticDemo() {
  return (
    <div>
      <LikeButton initialLikes={42} postId="post-123" />
      <CommentSection
        postId="post-123"
        initialComments={[
          { id: 1, author: '张三', text: '这篇文章写得真好！', timestamp: '2024-01-15T10:00:00Z', status: 'confirmed' },
          { id: 2, author: '李四', text: '学到了很多', timestamp: '2024-01-15T11:00:00Z', status: 'confirmed' }
        ]}
      />
    </div>
  )
}
