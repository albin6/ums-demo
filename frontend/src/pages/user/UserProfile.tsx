import React, { useState, useEffect } from "react";
import { Card, Typography, Avatar, Button, Space, Spin, message } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { userApi } from "../../services/api";

const { Title, Text } = Typography;

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getProfile();
      setUser(response.data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      message.error(error.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
            <Avatar
              size={128}
              icon={<UserOutlined />}
              src={`${process.env.REACT_APP_API_BASE_URL}${user.profileImage}`}
              className="border-4 border-blue-200"
            />
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
              </Space>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
