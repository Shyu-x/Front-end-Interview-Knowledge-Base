# 第7章：Ant Design 组件库

> 本章将详细介绍 Ant Design（蚂蚁金服设计体系）React 组件库的使用

---

## 7.1 Ant Design 简介

### 什么是 Ant Design？

Ant Design（简称 antd）是一个基于 React 的企业级 UI 组件库，具有以下特点：

| 特点 | 说明 |
|------|------|
| **企业级** | 经过大量项目验证，稳定可靠 |
| **组件丰富** | 提供 70+ 基础组件 |
| **设计一致** | 统一的视觉规范 |
| ** TypeScript** | 完整的类型支持 |
| **响应式** | 支持移动端适配 |
| **国际化** | 支持多语言 |

### 安装 Ant Design

```bash
# 使用 npm
npm install antd

# 使用 yarn
yarn add antd

# 使用 pnpm
pnpm add antd
```

### 安装图标库

```bash
npm install @ant-design/icons
```

### 基础使用

```jsx
import { Button } from 'antd'
import 'antd/dist/reset.css' // 引入样式（React 18+）

function App() {
  return <Button type="primary">主要按钮</Button>
}
```

---

## 7.2 布局组件

### Layout - 布局容器

```jsx
import { Layout, Header, Sider, Content, Footer } from 'antd'

const { Header, Sider, Content, Footer } = Layout

function MyLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', color: '#fff' }}>
        顶部导航
      </Header>

      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          侧边栏
        </Sider>

        <Content style={{ padding: '20px', background: '#f0f2f5' }}>
          <div style={{ background: '#fff', padding: '20px', minHeight: 280 }}>
            主内容区域
          </div>
        </Content>
      </Layout>

      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2024 Created by Ant
      </Footer>
    </Layout>
  )
}
```

### Grid - 栅格系统

```jsx
import { Row, Col } from 'antd'

function GridDemo() {
  return (
    <div>
      {/* 基础栅格 */}
      <Row>
        <Col span={12}>
          <div style={{ background: '#00a0e9', padding: '20px', textAlign: 'center' }}>
            col-12
          </div>
        </Col>
        <Col span={12}>
          <div style={{ background: '#00a0e9', padding: '20px', textAlign: 'center' }}>
            col-12
          </div>
        </Col>
      </Row>

      {/* 响应式栅格 */}
      <Row>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div style={{ background: '#00a0e9', padding: '20px', textAlign: 'center' }}>
            响应式
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div style={{ background: '#00a0e9', padding: '20px', textAlign: 'center' }}>
            响应式
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div style={{ background: '#00a0e9', padding: '20px', textAlign: 'center' }}>
            响应式
          </div>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div style={{ background: '#00a0e9', padding: '20px', textAlign: 'center' }}>
            响应式
          </div>
        </Col>
      </Row>

      {/* 栅格间距 */}
      <Row gutter={16}>
        <Col span={8}>
          <div style={{ background: '#00a0e9', padding: '20px', textAlign: 'center' }}>
            gutter-16
          </div>
        </Col>
        <Col span={8}>
          <div style={{ background: '#00a0e9', padding: '20px', textAlign: 'center' }}>
            gutter-16
          </div>
        </Col>
        <Col span={8}>
          <div style={{ background: '#00a0e9', padding: '20px', textAlign: 'center' }}>
            gutter-16
          </div>
        </Col>
      </Row>
    </div>
  )
}
```

---

## 7.3 基础组件

### Button - 按钮

```jsx
import { Button, Space } from 'antd'
import {
  SearchOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons'

function ButtonDemo() {
  return (
    <Space direction="vertical">
      {/* 按钮类型 */}
      <Space>
        <Button>Default</Button>
        <Button type="primary">Primary</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="text">Text</Button>
        <Button type="link">Link</Button>
      </Space>

      {/* 按钮图标 */}
      <Space>
        <Button icon={<SearchOutlined />}>搜索</Button>
        <Button icon={<DownloadOutlined />} />
        <Button icon={<LeftOutlined />} />
        <Button icon={<RightOutlined />} iconPosition="end">下一步</Button>
      </Space>

      {/* 按钮状态 */}
      <Space>
        <Button disabled>禁用</Button>
        <Button loading>加载中</Button>
        <Button danger>Danger</Button>
      </Space>

      {/* 按钮尺寸 */}
      <Space>
        <Button size="small">小</Button>
        <Button>中</Button>
        <Button size="large">大</Button>
      </Space>

      {/* 按钮组 */}
      <Button.Group>
        <Button icon={<LeftOutlined />} />
        <Button icon={<RightOutlined />} />
      </Button.Group>
    </Space>
  )
}
```

### Icon - 图标

```jsx
import { Icon } from 'antd'
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined
} from '@ant-design/icons'

function IconDemo() {
  return (
    <Space size="large" wrap>
      <HomeOutlined style={{ fontSize: 24 }} />
      <SettingFilled style={{ fontSize: 24, color: '#1890ff' }} />
      <SmileOutlined style={{ fontSize: 24 }} />
      <SyncOutlined spin style={{ fontSize: 24 }} />
      <LoadingOutlined style={{ fontSize: 24 }} />
    </Space>
  )
}

// 使用 Icon 组件
function CustomIcon() {
  return (
    <Icon
      component={() => (
        <svg>
          <path d="..." />
        </svg>
      )}
    />
  )
}
```

### Typography - 排版

```jsx
import { Typography } from 'antd'

const { Title, Text, Paragraph, Link } = Typography

function TypographyDemo() {
  return (
    <Typography>
      <Title level={1}>标题 1</Title>
      <Title level={2}>标题 2</Title>
      <Title level={3}>标题 3</Title>
      <Title level={4}>标题 4</Title>
      <Title level={5}>标题 5</Title>

      <Text>默认文本</Text>
      <br />

      <Text type="secondary">次要文本</Text>
      <br />

      <Text type="success">成功文本</Text>
      <br />

      <Text type="warning">警告文本</Text>
      <br />

      <Text type="danger">危险文本</Text>
      <br />

      <Text strong>加粗</Text>
      <br />

      <Text italic>斜体</Text>
      <br />

      <Text underline>下划线</Text>
      <br />

      <Text delete>删除线</Text>
      <br />

      <Text code>代码</Text>
      <br />

      <Text mark>标记</Text>

      <Paragraph>
        这是一段文字，可以包含<Link href="https://ant.design">链接</Link>，
        也可以<Text strong>加粗</Text>或<Text italic>斜体</Text>。
      </Paragraph>
    </Typography>
  )
}
```

---

## 7.4 表单组件

### Form - 表单

```jsx
import { Form, Input, Button, Select, DatePicker, Radio, Checkbox } from 'antd'
import { useState } from 'react'

function FormDemo() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = (values) => {
    console.log('表单值:', values)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('验证失败:', errorInfo)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{ gender: 'male', remember: true }}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, message: '用户名至少3个字符' }
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6个字符' }
        ]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item
        label="性别"
        name="gender"
      >
        <Radio.Group>
          <Radio value="male">男</Radio>
          <Radio value="female">女</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="城市"
        name="city"
      >
        <Select placeholder="请选择城市">
          <Select.Option value="beijing">北京</Select.Option>
          <Select.Option value="shanghai">上海</Select.Option>
          <Select.Option value="guangzhou">广州</Select.Option>
          <Select.Option value="shenzhen">深圳</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="出生日期"
        name="birthday"
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="简介"
        name="bio"
      >
        <Input.TextArea rows={4} placeholder="请输入个人简介" />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
```

### Input - 输入框

```jsx
import { Input, Space } from 'antd'
import { SearchOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'

function InputDemo() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* 基本输入框 */}
      <Input placeholder="基本输入框" />

      {/* 带前缀图标 */}
      <Input prefix={<UserOutlined />} placeholder="用户名" />
      <Input prefix={<LockOutlined />} suffix={<span>😀</span>} placeholder="密码" />

      {/* 带后缀图标 */}
      <Input suffix="RMB" placeholder="金额" />

      {/* 密码输入框 */}
      <Input.Password placeholder="密码输入框" />
      <Input.Password placeholder="可见密码" visibilityToggle />

      {/* 搜索输入框 */}
      <Input.Search
        placeholder="搜索"
        enterButton="搜索"
        onSearch={(value) => console.log(value)}
      />

      {/* 带按钮的输入框 */}
      <Input.Group compact>
        <Input style={{ width: '30%' }} defaultValue="0571" />
        <Input style={{ width: '70%' }} defaultValue="12345678" />
      </Input.Group>

      {/* 文本域 */}
      <Input.TextArea rows={4} placeholder="多行文本" />

      {/* 计数文本域 */}
      <Input.TextArea
        rows={4}
        showCount
        maxLength={200}
        placeholder="最多200字符"
      />
    </Space>
  )
}
```

### Select - 选择器

```jsx
import { Select, Space, Tag } from 'antd'

const { Option } = Select

function SelectDemo() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* 基本选择器 */}
      <Select placeholder="请选择" style={{ width: 200 }}>
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="yiminghe">yiminghe</Option>
      </Select>

      {/* 多选 */}
      <Select
        mode="multiple"
        placeholder="请选择多个"
        style={{ width: '100%' }}
        defaultValue={['a10', 'c12']}
      >
        <Option value="a10">Option 10</Option>
        <Option value="b11">Option 11</Option>
        <Option value="c12">Option 12</Option>
      </Select>

      {/* 可搜索 */}
      <Select
        showSearch
        placeholder="可搜索"
        optionFilterProp="children"
        style={{ width: 200 }}
      >
        <Option value="1">Not 找到</Option>
        <Option value="2">海澜之家</Option>
        <Option value="3">动画城</Option>
      </Select>

      {/* 带标签 */}
      <Select
        mode="multiple"
        placeholder="显示标签"
        tokenSeparators={[',']}
      >
        <Option value="react">React</Option>
        <Option value="vue">Vue</Option>
        <Option value="angular">Angular</Option>
      </Select>

      {/* 禁用选项 */}
      <Select placeholder="禁用选项" style={{ width: 200 }} disabled>
        <Option value="1">选项1</Option>
      </Select>

      {/* 自定义渲染 */}
      <Select
        placeholder="自定义渲染"
        style={{ width: 200 }}
      >
        <Option value="china">
          <span>🇨🇳</span> China
        </Option>
        <Option value="usa">
          <span>🇺🇸</span> USA
        </Option>
      </Select>
    </Space>
  )
}
```

---

## 7.5 数据展示组件

### Table - 表格

```jsx
import { Table, Tag, Space, Button } from 'antd'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    )
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type="link">编辑</Button>
        <Button type="link" danger>删除</Button>
      </Space>
    )
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

function TableDemo() {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
      rowSelection={{
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        }
      }}
    />
  )
}
```

### Card - 卡片

```jsx
import { Card, Row, Col, Avatar, Rate } from 'antd'

const { Meta } = Card

function CardDemo() {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="基本卡片" extra={<a href="#">更多</a>}>
          <p>卡片内容</p>
          <p>卡片内容</p>
        </Card>
      </Col>

      <Col span={8}>
        <Card
          hoverable
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOQIbyYdq.png"
            />
          }
        >
          <Meta
            title="Europe Street beat"
            description="www.instagram.com"
          />
        </Card>
      </Col>

      <Col span={8}>
        <Card>
          <Meta
            avatar={
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
            }
            title="Card title"
            description="This is the description"
          />
        </Card>
      </Col>

      <Col span={8} style={{ marginTop: 16 }}>
        <Card loading={true} title="加载中">
          <p>内容</p>
        </Card>
      </Col>
    </Row>
  )
}
```

### List - 列表

```jsx
import { List, Avatar, Button } from 'antd'

const data = [
  {
    title: 'Ant Design Title 1',
    description: 'Ant Design description 1'
  },
  {
    title: 'Ant Design Title 2',
    description: 'Ant Design description 2'
  },
  {
    title: 'Ant Design Title 3',
    description: 'Ant Design description 3'
  },
  {
    title: 'Ant Design Title 4',
    description: 'Ant Design description 4'
  }
]

function ListDemo() {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button key="list-loadmore-edit">编辑</Button>,
            <Button key="list-loadmore-more" danger>删除</Button>
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
            }
            title={<a href="#">{item.title}</a>}
            description={item.description}
          />
        </List.Item>
      )}
    />
  )
}
```

---

## 7.6 反馈组件

### Modal - 对话框

```jsx
import { Modal, Button, Space } from 'antd'
import { useState } from 'react'

function ModalDemo() {
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('确认删除这条记录吗？')

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setModalText('正在删除...')
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }

  return (
    <Space>
      <Button type="primary" onClick={showModal}>
        打开对话框
      </Button>

      <Modal
        title="确认操作"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </Space>
  )
}
```

### Message - 全局提示

```jsx
import { Button, Space } from 'antd'
import { Message } from 'antd/es/message'

function MessageDemo() {
  return (
    <Space direction="vertical">
      <Button onClick={() => Message.success('成功信息')}>成功</Button>
      <Button onClick={() => Message.error('错误信息')}>错误</Button>
      <Button onClick={() => Message.warning('警告信息')}>警告</Button>
      <Button onClick={() => Message.info('普通信息')}>信息</Button>
      <Button onClick={() => Message.loading('加载中...', 2)}>加载</Button>

      {/* 自定义时长 */}
      <Button onClick={() => Message.success('5秒后消失', 5)}>
        自定义时长
      </Button>
    </Space>
  )
}

// 函数式使用
import { useMessage } from 'antd/es/message'

function Component() {
  const [message, contextHolder] = useMessage()

  return (
    <>
      {contextHolder}
      <Button onClick={() => message.success('成功')}>显示消息</Button>
    </>
  )
}
```

### Notification - 通知提醒

```jsx
import { Button, Space } from 'antd'
import { Notification } from 'antd/es/notification'

function NotificationDemo() {
  const [api, contextHolder] = Notification.useNotification()

  const openNotification = (placement) => {
    api.info({
      message: `通知标题`,
      description: '这是一条通知消息的内容',
      placement
    })
  }

  return (
    <>
      {contextHolder}
      <Space>
        <Button onClick={() => openNotification('topLeft')}>
          topLeft
        </Button>
        <Button onClick={() => openNotification('topRight')}>
          topRight
        </Button>
        <Button onClick={() => openNotification('bottomLeft')}>
          bottomLeft
        </Button>
        <Button onClick={() => openNotification('bottomRight')}>
          bottomRight
        </Button>
      </Space>
    </>
  )
}
```

---

## 7.7 导航组件

### Menu - 菜单

```jsx
import { Menu } from 'antd'
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { useState } from 'react'

function MenuDemo() {
  const [current, setCurrent] = useState('mail')

  const items = [
    {
      key: 'mail',
      icon: <MailOutlined />,
      label: '导航一'
    },
    {
      key: 'app',
      icon: <AppstoreOutlined />,
      label: '导航二'
    },
    {
      key: 'sub1',
      icon: <SettingOutlined />,
      label: '导航三',
      children: [
        {
          key: 'setting1',
          label: '选项1'
        },
        {
          key: 'setting2',
          label: '选项2'
        },
        {
          key: 'setting3',
          label: '选项3'
        },
        {
          key: 'setting4',
          label: '选项4'
        }
      ]
    },
    {
      key: 'alipay',
      label: (
        <a
          href="https://ant.design"
          target="_blank"
          rel="noopener noreferrer"
        >
          导航四
        </a>
      )
    }
  ]

  const onClick = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }

  return (
    <>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />

      <Menu
        onClick={onClick}
        mode="inline"
        style={{ width: 256 }}
        items={items}
      />
    </>
  )
}
```

### Tabs - 标签页

```jsx
import { Tabs, Space } from 'antd'
import { CalendarOutlined, AppstoreOutlined, RadarChartOutlined } from '@ant-design/icons'

function TabsDemo() {
  const items = [
    {
      key: '1',
      label: (
        <span>
          <CalendarOutlined />
          Tab 1
        </span>
      ),
      children: 'Tab 1 内容'
    },
    {
      key: '2',
      label: (
        <span>
          <AppstoreOutlined />
          Tab 2
        </span>
      ),
      children: 'Tab 2 内容'
    },
    {
      key: '3',
      label: (
        <span>
          <RadarChartOutlined />
          Tab 3
        </span>
      ),
      children: 'Tab 3 内容',
      disabled: true
    }
  ]

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Tabs defaultActiveKey="1" items={items} />

      <Tabs defaultActiveKey="1" type="card" items={items} />

      <Tabs defaultActiveKey="1" type="editable-card" items={items} onEdit={(targetKey, action) => console.log(action, targetKey)} />
    </Space>
  )
}
```

### Pagination - 分页

```jsx
import { Pagination } from 'antd'

function PaginationDemo() {
  const onChange = (page, pageSize) => {
    console.log('Page: ', page, 'PageSize: ', pageSize)
  }

  return (
    <Space direction="vertical">
      <Pagination defaultCurrent={1} total={50} onChange={onChange} />

      <Pagination showSizeChanger onChange={onChange} total={50} />

      <Pagination
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `共 ${total} 条`}
        total={500}
      />
    </Space>
  )
}
```

---

## 7.8 综合示例：用户管理系统

```jsx
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
  Popconfirm
} from 'antd'

const { Option } = Select

// 初始数据
const initialData = [
  { key: '1', name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
  { key: '2', name: '李四', email: 'lisi@example.com', role: 'user', status: 'active' },
  { key: '3', name: '王五', email: 'wangwu@example.com', role: 'editor', status: 'inactive' },
]

function UserManagement() {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form] = Form.useForm()

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colorMap = {
          admin: 'red',
          editor: 'blue',
          user: 'green'
        }
        return <Tag color={colorMap[role]}>{role}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '激活' : '未激活'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button type="link" danger>
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

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          添加用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
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

          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="editor">编辑</Option>
              <Option value="user">用户</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="active">
            <Select>
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
```

---

## 本章小结

本章学习了 Ant Design 组件库：

1. **Ant Design 简介**：企业级 UI 组件库
2. **布局组件**：Layout、Grid 栅格系统
3. **基础组件**：Button、Icon、Typography
4. **表单组件**：Form、Input、Select
5. **数据展示组件**：Table、Card、List
6. **反馈组件**：Modal、Message、Notification
7. **导航组件**：Menu、Tabs、Pagination

---

## 练习题

1. 使用 Ant Design 创建一个登录页面
2. 使用 Table 组件创建一个数据展示页面，支持排序和筛选
3. 创建一个带表单验证的用户管理页面
4. 结合 Zustand 和 Ant Design 创建一个完整的待办事项应用

---

## 下章预告

下一章我们将学习实战项目开发：
- 项目规划与架构
- 状态管理设计
- 页面开发
- 路由配置
- 性能优化
