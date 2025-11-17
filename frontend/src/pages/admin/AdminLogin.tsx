import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const { Title } = Typography;

const AdminLogin: React.FC = () => {
  const { loginAdmin, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    clearError();

    try {
      await loginAdmin(values.email, values.password);
      message.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin login error:", error);
      message.error(error || "Admin login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2} className="text-2xl font-bold text-red-600">
            Admin Login
          </Title>
        </div>

        <Form
          name="admin-login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter admin email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter admin password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Login as Admin
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
