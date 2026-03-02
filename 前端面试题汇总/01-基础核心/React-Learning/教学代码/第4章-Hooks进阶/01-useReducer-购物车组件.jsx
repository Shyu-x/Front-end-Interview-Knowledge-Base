/**
 * useReducer 购物车示例
 * 展示复杂状态管理 - 添加商品、移除商品、修改数量、计算总价
 *
 * useReducer vs useState:
 * - useState: 适合简单的单一状态
 * - useReducer: 适合复杂的状态逻辑，多个子操作，或者需要状态变更有条理时
 */

import React, { useReducer, useState } from 'react';

// ============================================
// 1. 定义状态和操作的类型
// ============================================

// 商品类型
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

// 购物车项类型
interface CartItem extends Product {
  quantity: number;
}

// 购物车状态类型
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// 操作类型
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: number }; // 折扣比例 (0-1)

// 初始商品数据
const AVAILABLE_PRODUCTS: Product[] = [
  { id: 1, name: 'iPhone 15 Pro', price: 8999, image: '📱' },
  { id: 2, name: 'MacBook Pro 14"', price: 14999, image: '💻' },
  { id: 3, name: 'AirPods Pro 2', price: 1899, image: '🎧' },
  { id: 4, name: 'iPad Pro 12.9"', price: 9999, image: '📲' },
  { id: 5, name: 'Apple Watch Ultra', price: 4999, image: '⌚' },
  { id: 6, name: 'Magic Keyboard', price: 1399, image: '⌨️' },
];

// ============================================
// 2. Reducer 函数 - 处理所有状态变更逻辑
// ============================================

/**
 * 购物车 reducer
 * @param state - 当前状态
 * @param action - 操作对象
 * @returns 更新后的新状态
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      let newItems: CartItem[];

      if (existingItem) {
        // 商品已存在，增加数量
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // 商品不存在，添加新项
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload);

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // 数量为0或负数时，移除商品
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }

      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    case 'APPLY_DISCOUNT': {
      // 折扣：传入折扣比例 (如 0.1 表示 9折)
      const discountedPrice = state.totalPrice * (1 - action.payload);
      return {
        ...state,
        totalPrice: discountedPrice,
      };
    }

    default:
      return state;
  }
}

// ============================================
// 3. 初始状态
// ============================================

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// ============================================
// 4. 主组件 - 购物车应用
// ============================================

export default function ShoppingCart() {
  // 使用 useReducer 管理购物车状态
  // 参数: reducer函数, 初始状态
  // 返回: [状态, dispatch函数]
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 用于折扣功能的状态
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // 添加商品到购物车
  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  // 移除商品
  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  // 更新商品数量
  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  // 清空购物车
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setAppliedDiscount(0);
    setDiscountCode('');
  };

  // 应用折扣码
  const applyDiscount = () => {
    // 模拟折扣码逻辑
    if (discountCode === 'SAVE10') {
      dispatch({ type: 'APPLY_DISCOUNT', payload: 0.1 });
      setAppliedDiscount(0.1);
    } else if (discountCode === 'SAVE20') {
      dispatch({ type: 'APPLY_DISCOUNT', payload: 0.2 });
      setAppliedDiscount(0.2);
    } else {
      alert('无效的折扣码');
    }
  };

  // 格式化价格
  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString('zh-CN')}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 购物车 (useReducer)</h1>

      <div style={styles.content}>
        {/* 商品列表区域 */}
        <div style={styles.productsSection}>
          <h2>商品列表</h2>
          <div style={styles.productGrid}>
            {AVAILABLE_PRODUCTS.map((product) => (
              <div key={product.id} style={styles.productCard}>
                <span style={styles.productImage}>{product.image}</span>
                <h3 style={styles.productName}>{product.name}</h3>
                <p style={styles.productPrice}>{formatPrice(product.price)}</p>
                <button
                  style={styles.addButton}
                  onClick={() => addItem(product)}
                >
                  加入购物车
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 购物车区域 */}
        <div style={styles.cartSection}>
          <h2>购物车</h2>

          {state.items.length === 0 ? (
            <p style={styles.emptyCart}>购物车是空的</p>
          ) : (
            <>
              {/* 购物车项列表 */}
              <div style={styles.cartItems}>
                {state.items.map((item) => (
                  <div key={item.id} style={styles.cartItem}>
                    <span style={styles.itemImage}>{item.image}</span>
                    <div style={styles.itemInfo}>
                      <h4>{item.name}</h4>
                      <p>{formatPrice(item.price)}</p>
                    </div>
                    <div style={styles.quantityControl}>
                      <button
                        style={styles.quantityButton}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span style={styles.quantity}>{item.quantity}</span>
                      <button
                        style={styles.quantityButton}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      style={styles.removeButton}
                      onClick={() => removeItem(item.id)}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>

              {/* 统计信息 */}
              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span>商品总数:</span>
                  <span>{state.totalItems} 件</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>原价:</span>
                  <span>{formatPrice(state.totalPrice / (1 - appliedDiscount))}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div style={styles.summaryRow}>
                    <span>折扣:</span>
                    <span style={styles.discount}>
                      -{formatPrice((state.totalPrice / (1 - appliedDiscount)) * appliedDiscount)}
                    </span>
                  </div>
                )}
                <div style={styles.summaryRow}>
                  <span style={styles.totalLabel}>总价:</span>
                  <span style={styles.totalPrice}>{formatPrice(state.totalPrice)}</span>
                </div>

                {/* 折扣码输入 */}
                <div style={styles.discountSection}>
                  <input
                    type="text"
                    placeholder="输入折扣码 (SAVE10/SAVE20)"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    style={styles.discountInput}
                  </input>
                  <button onClick={applyDiscount} style={styles.discountButton}>
                    应用
                  </button>
                </div>

                {/* 清空购物车按钮 */}
                <button onClick={clearCart} style={styles.clearButton}>
                  清空购物车
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 代码说明 */}
      <div style={styles.explanation}>
        <h3>📚 useReducer 核心概念</h3>
        <ul>
          <li><strong>useReducer</strong>: 用于复杂状态管理的 Hook，适合有多个子操作的状态</li>
          <li><strong>Reducer 函数</strong>: 纯函数，接收当前状态和操作，返回新状态</li>
          <li><strong>dispatch</strong>: 用于触发状态变更的操作</li>
          <li><strong>优势</strong>: 状态逻辑集中管理，便于调试和测试</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// 5. 样式对象
// ============================================

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
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
  productsSection: {
    flex: '1 1 400px',
    minWidth: '300px',
  },
  cartSection: {
    flex: '1 1 350px',
    minWidth: '300px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '12px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px',
  },
  productCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  productImage: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '10px',
  },
  productName: {
    fontSize: '14px',
    margin: '10px 0',
    color: '#333',
  },
  productPrice: {
    color: '#e53935',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  addButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
  },
  emptyCart: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 0',
  },
  cartItems: {
    marginBottom: '20px',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '10px',
    gap: '10px',
  },
  itemImage: {
    fontSize: '24px',
  },
  itemInfo: {
    flex: 1,
  },
  itemInfo h4: {
    margin: '0 0 4px 0',
    fontSize: '14px',
  },
  itemInfo p: {
    margin: 0,
    color: '#e53935',
    fontSize: '13px',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  quantityButton: {
    width: '28px',
    height: '28px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  quantity: {
    minWidth: '24px',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  summary: {
    borderTop: '1px solid #ddd',
    paddingTop: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  discount: {
    color: '#4caf50',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#e53935',
  },
  discountSection: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  discountInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
  },
  discountButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  clearButton: {
    width: '100%',
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  explanation: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#e3f2fd',
    borderRadius: '10px',
  },
  explanation h3: {
    marginTop: 0,
  },
  explanation ul: {
    lineHeight: '1.8',
  },
};
