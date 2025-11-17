import React, { useEffect } from "react";
import { Card, Typography, Avatar, Button, Space, Spin, message } from "antd";
import { EditOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const { user, fetchProfile, loading, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    logoutUser();
    message.success("Logged out successfully");
    navigate("/");
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Text>No user data found. Please login again.</Text>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                onError={(e) => {
                  // Fallback to initial if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="gray">${user.name
                    .charAt(0)
                    .toUpperCase()}</text></svg>`;
                }}
              />
            ) : (
              <Avatar
                size={128}
                icon={<UserOutlined />}
                className="border-4 border-blue-200"
              />
            )}
          </div>

          <div className="flex-grow text-center md:text-left">
            <Title level={2} className="mb-2">
              {user.name}
            </Title>
            <div className="space-y-2">
              <div>
                <Text strong className="text-gray-600">
                  Email:{" "}
                </Text>
                <Text>{user.email}</Text>
              </div>
              <div>
                <Text strong className="text-gray-600">
                  Member Since:{" "}
                </Text>
                <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
              </div>
            </div>

            <div className="mt-6">
              <Space>
                <Link to="/user/profile/edit">
                  <Button type="primary" icon={<EditOutlined />}>
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  type="default"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
