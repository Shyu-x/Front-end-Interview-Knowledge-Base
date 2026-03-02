// Ant Design - 用户管理系统示例
// 第7章-AntDesign组件库教学代码
import { useState } from 'react'
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic
} from 'antd'

const { Option } = Select

// 初始数据
const initialData = [
  { key: '1', name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active', age: 28 },
  { key: '2', name: '李四', email: 'lisi@example.com', role: 'user', status: 'active', age: 32 },
  { key: '3', name: '王五', email: 'wangwu@example.com', role: 'editor', status: 'inactive', age: 25 },
  { key: '4', name: '赵六', email: 'zhaoliu@example.com', role: 'user', status: 'active', age: 35 },
  { key: '5', name: '孙七', email: 'sunqi@example.com', role: 'editor', status: 'active', age: 29 },
]

function UserManagement() {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '编辑', value: 'editor' },
        { text: '用户', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        const colorMap = {
          admin: 'red',
          editor: 'blue',
          user: 'green'
        }
        const labelMap = {
          admin: '管理员',
          editor: '编辑',
          user: '用户'
        }
        return <Tag color={colorMap[role]}>{labelMap[role]}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '激活', value: 'active' },
        { text: '未激活', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '激活' : '未激活'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description="此操作不可恢复"
            onConfirm={() => handleDelete(record.key)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 添加用户
  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 编辑用户
  const handleEdit = (record) => {
    setEditingUser(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  // 删除用户
  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key))
    message.success('删除成功')
  }

  // 批量删除
  const handleBatchDelete = () => {
    setData(data.filter(item => !selectedRowKeys.includes(item.key)))
    message.success(`已删除 ${selectedRowKeys.length} 条记录`)
    setSelectedRowKeys([])
  }

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingUser) {
        // 编辑
        setData(data.map(item =>
          item.key === editingUser.key ? { ...item, ...values } : item
        ))
        message.success('更新成功')
      } else {
        // 新增
        const newUser = {
          key: Date.now().toString(),
          ...values
        }
        setData([...data, newUser])
        message.success('添加成功')
      }

      setModalVisible(false)
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  // 统计信息
  const activeCount = data.filter(item => item.status === 'active').length
  const adminCount = data.filter(item => item.role === 'admin').length

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总用户数" value={data.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="活跃用户" value={activeCount} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="管理员" value={adminCount} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均年龄" value={Math.round(data.reduce((sum, item) => sum + item.age, 0) / data.length)} />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" onClick={handleAdd}>
            添加用户
          </Button>
          <Button
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchDelete}
          >
            批量删除 ({selectedRowKeys.length})
          </Button>
        </Space>
      </div>

      {/* 用户表格 */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />

      {/* 添加/编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <Input type="number" placeholder="请输入年龄" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="editor">编辑</Option>
              <Option value="user">用户</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            initialValue="active"
          >
            <Select placeholder="请选择状态">
              <Option value="active">激活</Option>
              <Option value="inactive">未激活</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement
