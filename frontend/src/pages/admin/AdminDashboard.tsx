import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  message,
  Tag,
  Spin,
  Pagination,
  Form,
  Input as AntInput,
} from "antd";
import {
  SearchOutlined,
  BlockOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import type { ColumnsType } from "antd/es/table";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [userToAction, setUserToAction] = useState<{
    id: string;
    action: "block" | "unblock";
  } | null>(null);
  const [createUserModalVisible, setCreateUserModalVisible] = useState(false);
  const [createUserForm] = Form.useForm();
  const { logoutAdmin, createUserByAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(currentPage, pageSize, searchText);
  }, [currentPage, pageSize, searchText]);

  const handleCreateUser = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await createUserByAdmin(values.name, values.email, values.password);
      message.success("User created successfully!");
      setCreateUserModalVisible(false);
      createUserForm.resetFields();
      fetchUsers(currentPage, pageSize, searchText);
    } catch (error: any) {
      console.error("Error creating user:", error);
      message.error(error || "Failed to create user");
    }
  };

  const fetchUsers = async (page: number, limit: number, search?: string) => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers(page, limit, search);
      setUsers(response.data.data);
      setTotalUsers(response.data.total);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      message.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblock = async () => {
    if (!userToAction) return;

    try {
      if (userToAction.action === "block") {
        await adminApi.blockUser(userToAction.id);
        message.success("User blocked successfully");
      } else {
        await adminApi.unblockUser(userToAction.id);
        message.success("User unblocked successfully");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userToAction.id
            ? { ...user, isBlocked: userToAction.action === "block" }
            : user
        )
      );
    } catch (error: any) {
      console.error("Error updating user:", error);
      message.error(
        error.response?.data?.message || `Failed to ${userToAction.action} user`
      );
    } finally {
      setConfirmModalVisible(false);
      setUserToAction(null);
    }
  };

  const showBlockModal = (userId: string, action: "block" | "unblock") => {
    setUserToAction({ id: userId, action });
    setConfirmModalVisible(true);
  };

  const columns: ColumnsType<User> = [
    {
      title: "Profile",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (image, record) => (
        <div className="flex items-center">
          {record.profileImage ? (
            <img
              src={record.profileImage}
              alt={record.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="gray">${record.name
                  .charAt(0)
                  .toUpperCase()}</text></svg>`;
              }}
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
              {record.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      key: "isBlocked",
      dataIndex: "isBlocked",
      render: (_, { isBlocked }) => (
        <>
          {isBlocked ? (
            <Tag color="error">Blocked</Tag>
          ) : (
            <Tag color="success">Active</Tag>
          )}
        </>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.isBlocked ? (
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => showBlockModal(record._id, "unblock")}
            >
              Unblock
            </Button>
          ) : (
            <Button
              danger
              size="small"
              icon={<BlockOutlined />}
              onClick={() => showBlockModal(record._id, "block")}
            >
              Block
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setCurrentPage(1);
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard - User Management
        </h1>
        <Space>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setCreateUserModalVisible(true)}
          >
            Add New User
          </Button>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              logoutAdmin();
              message.success("Logged out successfully");
              navigate("/");
            }}
          >
            Logout
          </Button>
        </Space>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search by name or email"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-64"
              onPressEnter={() => fetchUsers(currentPage, pageSize, searchText)}
            />
          </div>
          {searchText && (
            <Button onClick={handleClearSearch} className="w-full sm:w-auto">
              Clear Search
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="_id"
              pagination={false}
              onChange={handleTableChange}
            />
            <div className="flex justify-end p-4">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalUsers}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size || pageSize);
                }}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Total ${total} users`}
              />
            </div>
          </>
        )}
      </div>

      <Modal
        title={`Confirm ${
          userToAction?.action === "block" ? "Block" : "Unblock"
        } User`}
        open={confirmModalVisible}
        onOk={handleBlockUnblock}
        onCancel={() => setConfirmModalVisible(false)}
        okText={
          userToAction?.action === "block" ? "Block User" : "Unblock User"
        }
        okButtonProps={{ danger: userToAction?.action === "block" }}
      >
        <p>
          Are you sure you want to {userToAction?.action} this user? This will{" "}
          {userToAction?.action === "block" ? "prevent" : "allow"} them from
          accessing their account.
        </p>
      </Modal>

      <Modal
        title="Create New User"
        open={createUserModalVisible}
        onCancel={() => {
          setCreateUserModalVisible(false);
          createUserForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={createUserForm}
          name="createUser"
          onFinish={handleCreateUser}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Please input the user name!" },
              { min: 2, message: "Name must be at least 2 characters!" },
            ]}
          >
            <AntInput placeholder="Enter user's full name" />
          </Form.Item>

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
            <AntInput placeholder="Enter user's email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
          >
            <AntInput.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm the password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <AntInput.Password placeholder="Confirm password" />
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setCreateUserModalVisible(false);
                  createUserForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={authLoading}>
                Create User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
