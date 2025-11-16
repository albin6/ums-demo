import React from 'react';
import { Button, Typography, Card } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center">
          <Title level={2} className="text-3xl font-bold text-blue-600 mb-4">
            User Management System
          </Title>
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
        </div>
      </Card>
    </div>
  );
};

export default HomePage;