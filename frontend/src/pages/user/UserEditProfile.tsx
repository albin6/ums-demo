import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Avatar, Upload, message, Spin } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../../services/api';

const { Title } = Typography;

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

const UserEditProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getProfile();
      setUser(response.data);
      form.setFieldsValue({
        name: response.data.name,
        email: response.data.email
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      message.error(error.response?.data?.message || 'Failed to fetch profile');
      navigate('/user/profile');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: { name: string; email: string }) => {
    setSubmitting(true);
    try {
      const response = await userApi.updateProfile(values);
      message.success('Profile updated successfully!');
      navigate('/user/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isImage && isLt2M;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="shadow-lg">
        <div className="text-center mb-6">
          <Title level={2} className="text-2xl font-bold text-blue-600">
            Edit Profile
          </Title>
        </div>

        <div className="flex justify-center mb-6">
          <Avatar
            size={128}
            icon={<UserOutlined />}
            src={user?.profileImage}
            className="border-4 border-blue-200"
          />
        </div>

        <Form
          form={form}
          name="edit-profile"
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
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item label="Profile Image">
            <Upload
              name="profileImage"
              customRequest={async ({ file, onSuccess, onError }) => {
                try {
                  const response = await userApi.uploadProfileImage(file as File);
                  onSuccess?.(response.data);
                  message.success(`${(file as File).name || 'File'} file uploaded successfully`);
                } catch (error: any) {
                  onError?.(error);
                  message.error(`${(file as File).name || 'File'} file upload failed.`);
                }
              }}
              beforeUpload={beforeUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <div className="flex gap-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="flex-1"
              >
                Update Profile
              </Button>
              <Link to="/user/profile">
                <Button className="flex-1">Cancel</Button>
              </Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserEditProfile;