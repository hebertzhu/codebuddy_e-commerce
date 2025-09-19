import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign, 
  FiPackage,
  FiBarChart2,
  FiSettings,
  FiHome
} from 'react-icons/fi';
import AdminStats from './components/AdminStats';
import UserManagement from './components/UserManagement';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (user && isAdmin()) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin()) {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>访问被拒绝</h2>
          <p>您需要管理员权限才能访问此页面</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminStats stats={stats} />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return <AdminStats stats={stats} />;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>管理后台</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiBarChart2 />
            <span>仪表板</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FiUsers />
            <span>用户管理</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FiPackage />
            <span>商品管理</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingCart />
            <span>订单管理</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings />
            <span>系统设置</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="nav-item"
            onClick={() => window.location.href = '/'}
          >
            <FiHome />
            <span>返回网站</span>
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="content-header">
          <h1>
            {activeTab === 'dashboard' && '仪表板'}
            {activeTab === 'users' && '用户管理'}
            {activeTab === 'products' && '商品管理'}
            {activeTab === 'orders' && '订单管理'}
            {activeTab === 'settings' && '系统设置'}
          </h1>
          <p>欢迎回来，{user.username}</p>
        </div>

        <div className="content-main">
          {loading ? (
            <div className="loading">加载中...</div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
