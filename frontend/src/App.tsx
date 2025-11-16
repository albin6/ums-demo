import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

import HomePage from './pages/HomePage';
import UserSignup from './pages/user/UserSignup';
import UserLogin from './pages/user/UserLogin';
import UserProfile from './pages/user/UserProfile';
import UserEditProfile from './pages/user/UserEditProfile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout min-h-screen">
        <Content style={{ padding: '0 50px' }}>
          <div className="bg-white min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/user/signup" element={<UserSignup />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/user/profile/edit" element={<UserEditProfile />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;