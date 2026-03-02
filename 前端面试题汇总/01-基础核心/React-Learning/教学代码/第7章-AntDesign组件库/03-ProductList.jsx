// Ant Design - 产品列表与卡片展示
// 第7章-AntDesign组件库教学代码
import { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Tag,
  Rate,
  Space,
  Pagination,
  Affix,
  message
} from 'antd'
import {
  ShoppingCartOutlined,
  HeartOutlined,
  StarFilled,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'

const { Option } = Select

// 产品数据
const productsData = [
  { id: 1, name: 'iPhone 15 Pro', price: 999, category: '手机', rating: 4.8, sales: 5200, image: '📱' },
  { id: 2, name: 'MacBook Pro 14"', price: 1999, category: '电脑', rating: 4.9, sales: 3200, image: '💻' },
  { id: 3, name: 'iPad Air', price: 599, category: '平板', rating: 4.7, sales: 2100, image: '📱' },
  { id: 4, name: 'AirPods Pro', price: 249, category: '耳机', rating: 4.6, sales: 8900, image: '🎧' },
  { id: 5, name: 'Apple Watch', price: 399, category: '手表', rating: 4.5, sales: 4500, image: '⌚' },
  { id: 6, name: 'iMac 24"', price: 1299, category: '电脑', rating: 4.8, sales: 1800, image: '🖥️' },
  { id: 7, name: 'Magic Mouse', price: 99, category: '配件', rating: 4.3, sales: 3200, image: '🖱️' },
  { id: 8, name: 'iPhone 15', price: 799, category: '手机', rating: 4.7, sales: 6800, image: '📱' },
  { id: 9, name: 'AirPods Max', price: 549, category: '耳机', rating: 4.5, sales: 1500, image: '🎧' },
  { id: 10, name: 'iPad Pro', price: 999, category: '平板', rating: 4.8, sales: 2800, image: '📱' },
  { id: 11, name: 'MacBook Air', price: 1099, category: '电脑', rating: 4.7, sales: 4100, image: '💻' },
  { id: 12, name: 'Apple Pencil', price: 129, category: '配件', rating: 4.6, sales: 2500, image: '✏️' },
]

const categoryOptions = ['全部', '手机', '电脑', '平板', '耳机', '手表', '配件']
const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'sales', label: '销量优先' },
  { value: 'rating', label: '评分优先' },
]

function ProductList() {
  const [viewMode, setViewMode] = useState('grid')
  const [products, setProducts] = useState(productsData)
  const [category, setCategory] = useState('全部')
  const [sortBy, setSortBy] = useState('default')
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  // 筛选和排序
  const getFilteredProducts = () => {
    let result = [...productsData]

    // 搜索筛选
    if (searchText) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    // 分类筛选
    if (category !== '全部') {
      result = result.filter(p => p.category === category)
    }

    // 排序
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'sales':
        result.sort((a, b) => b.sales - a.sales)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return result
  }

  const filteredProducts = getFilteredProducts()
  const totalProducts = filteredProducts.length

  // 分页
  const getPaginatedProducts = () => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }

  const paginatedProducts = getPaginatedProducts()

  // 添加购物车
  const handleAddToCart = (product) => {
    message.success(`已将 ${product.name} 添加到购物车`)
  }

  // 收藏
  const handleFavorite = (product) => {
    message.info(`收藏 ${product.name}`)
  }

  // 产品卡片组件
  const ProductCard = ({ product }) => (
    <Card
      hoverable
      cover={
        <div style={{
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
          background: '#fafafa'
        }}>
          {product.image}
        </div>
      }
      actions={[
        <Button
          type="text"
          icon={<HeartOutlined />}
          onClick={() => handleFavorite(product)}
        >
          收藏
        </Button>,
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => handleAddToCart(product)}
        >
          加入购物车
        </Button>,
      ]}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span>{product.name}</span>
            <Tag color="blue">{product.category}</Tag>
          </div>
        }
        description={
          <div>
            <div style={{ fontSize: 24, color: '#ff4d4f', fontWeight: 'bold' }}>
              ${product.price}
            </div>
            <div style={{ marginTop: 8 }}>
              <Rate disabled defaultValue={product.rating} allowHalf />
              <span style={{ marginLeft: 8, color: '#888' }}>
                ({product.sales} 销量)
              </span>
            </div>
          </div>
        }
      />
    </Card>
  )

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 搜索和筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="搜索产品..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value)
                setCurrentPage(1)
              }}
              allowClear
            />
          </Col>
          <Col>
            <Space>
              <Select
                value={category}
                onChange={(value) => {
                  setCategory(value)
                  setCurrentPage(1)
                }}
                style={{ width: 120 }}
              >
                {categoryOptions.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                style={{ width: 150 }}
              >
                {sortOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
              <Button
                icon={<AppstoreOutlined />}
                type={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewMode('grid')}
              />
              <Button
                icon={<UnorderedListOutlined />}
                type={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => setViewMode('list')}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 产品列表 */}
      <Row gutter={[16, 16]}>
        {paginatedProducts.map(product => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {/* 空状态 */}
      {paginatedProducts.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ color: '#888' }}>没有找到相关产品</p>
        </Card>
      )}

      {/* 分页 */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Pagination
          current={currentPage}
          total={totalProducts}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrentPage(page)
            setPageSize(size)
          }}
          showSizeChanger
          showTotal={(total) => `共 ${total} 个产品`}
        />
      </div>

      {/* 回到顶部 */}
      <Affix style={{ position: 'fixed', bottom: 50, right: 50 }}>
        <Button type="primary" shape="circle" size="large" icon="↑" />
      </Affix>
    </div>
  )
}

export default ProductList
