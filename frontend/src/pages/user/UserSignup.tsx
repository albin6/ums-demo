import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { userApi } from '../../services/api';

const { Title } = Typography;

const UserSignup: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await userApi.signup(values);
      message.success('Account created successfully!');
      // Redirect to login page
      window.location.href = '/user/login';
    } catch (error: any) {
      console.error('Signup error:', error);
      message.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2} className="text-2xl font-bold text-blue-600">
            Create Account
          </Title>
        </div>

        <Form
          name="signup"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }, { min: 2, message: 'Name must be at least 2 characters!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
          </Form.Item>

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
            rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <span>Already have an account? </span>
          <Link to="/user/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default UserSignup;