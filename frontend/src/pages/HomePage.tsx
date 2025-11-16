import React from 'react';
import { Button, Typography, Card, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { adminApi } from '../services/api';
import { LogoutOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Check if user is logged in as either user or admin
  const isUserLoggedIn = !!localStorage.getItem('token');
  const isAdminLoggedIn = !!localStorage.getItem('adminToken');

  const handleLogout = async () => {
    if (isUserLoggedIn) {
      await userApi.logout();
    }
    if (isAdminLoggedIn) {
      await adminApi.logout();
    }
    // No need for message here as the logout from individual pages provides feedback
    navigate(0); // Refresh the page to update the UI
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center">
          <Title level={2} className="text-3xl font-bold text-blue-600 mb-4">
            User Management System
          </Title>

          {isUserLoggedIn || isAdminLoggedIn ? (
            <>
              <Paragraph className="text-gray-600 mb-6">
                You are currently logged in.
              </Paragraph>

              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  size="large"
                  className="w-full"
                  onClick={() => navigate('/user/profile')}
                  disabled={!isUserLoggedIn}
                >
                  Go to User Profile
                </Button>

                <Button
                  type="default"
                  size="large"
                  className="w-full"
                  onClick={() => navigate('/admin/dashboard')}
                  disabled={!isAdminLoggedIn}
                >
                  Go to Admin Dashboard
                </Button>

                <Button
                  type="default"
                  size="large"
                  className="w-full"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Space>
            </>
          ) : (
            <>
              <Paragraph className="text-gray-600 mb-8">
                Welcome to the User Management System. Please register or login to continue.
              </Paragraph>

              <div className="space-y-4">
                <Link to="/user/login">
                  <Button type="primary" size="large" className="w-full">
                    Login as User
                  </Button>
                </Link>

                <Link to="/user/signup">
                  <Button size="large" className="w-full">
                    Sign Up as User
                  </Button>
                </Link>

                <div className="pt-4">
                  <Link to="/admin/login">
                    <Button size="large" className="w-full" danger>
                      Login as Admin
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomePage;