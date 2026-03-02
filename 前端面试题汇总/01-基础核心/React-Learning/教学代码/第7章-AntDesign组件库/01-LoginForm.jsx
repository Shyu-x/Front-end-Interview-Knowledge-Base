// Ant Design - 完整登录表单示例
// 第7章-AntDesign组件库教学代码
import { useState } from 'react'
import { Form, Input, Button, Checkbox, Card, message, Divider } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = (values) => {
    setLoading(true)

    // 模拟登录请求
    setTimeout(() => {
      console.log('登录信息:', values)

      if (values.username === 'admin' && values.password === '123456') {
        message.success('登录成功！')
        navigate('/dashboard')
      } else {
        message.error('用户名或密码错误')
      }

      setLoading(false)
    }, 1000)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('验证失败:', errorInfo)
    message.error('请检查输入的信息')
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card
        style={{ width: 400 }}
        title={
          <div style={{ textAlign: 'center' }}>
            <SafetyOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            <h2 style={{ marginTop: 10 }}>用户登录</h2>
          </div>
        }
      >
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名: admin"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码: 123456"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a href="#">忘记密码？</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>

          <Divider>或</Divider>

          <div style={{ textAlign: 'center' }}>
            还没有账号？<a href="#">立即注册</a>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default LoginForm
