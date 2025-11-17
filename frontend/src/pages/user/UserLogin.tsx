import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title } = Typography;

const UserLogin: React.FC = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    // Clear any previous errors
    clearError();

    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/user/profile');
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2} className="text-2xl font-bold text-blue-600">
            User Login
          </Title>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <span>Don't have an account? </span>
          <Link to="/user/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default UserLogin;