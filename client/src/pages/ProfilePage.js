import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiMap, FiSave, FiLock } from 'react-icons/fi';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser, getToken } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: {
          street: user.profile?.address?.street || '',
          city: user.profile?.address?.city || '',
          state: user.profile?.address?.state || '',
          zipCode: user.profile?.address?.zipCode || '',
          country: user.profile?.address?.country || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = getToken();
      const response = await fetch('http://localhost:5002/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('个人信息更新成功');
        updateUser(data.user);
      } else {
        setError(data.message || '更新失败');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="not-logged-in">
          <h2>请先登录</h2>
          <p>您需要登录后才能查看个人资料</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>个人资料</h1>
        <p>管理您的个人信息和设置</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <FiUser />
            <h3>基本信息</h3>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FiUser />
                  姓氏
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="请输入姓氏"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiUser />
                  名字
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="请输入名字"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <FiMail />
                  邮箱地址
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiPhone />
                  手机号码
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="请输入手机号码"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <FiMap />
                <h4>收货地址</h4>
              </div>

              <div className="form-group">
                <label>街道地址</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="请输入街道地址"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>城市</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="请输入城市"
                  />
                </div>

                <div className="form-group">
                  <label>省份</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="请输入省份"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>邮政编码</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    placeholder="请输入邮政编码"
                  />
                </div>

                <div className="form-group">
                  <label>国家</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="请输入国家"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              <FiSave />
              {loading ? '保存中...' : '保存更改'}
            </button>
          </form>
        </div>

        <div className="profile-sidebar">
          <div className="sidebar-card">
            <h3>账户信息</h3>
            <div className="account-info">
              <p><strong>用户名:</strong> {user.username}</p>
              <p><strong>用户角色:</strong> {user.role === 'admin' ? '管理员' : '普通用户'}</p>
              <p><strong>注册时间:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>快速操作</h3>
            <div className="quick-actions">
              <button className="action-btn">
                <FiLock />
                修改密码
              </button>
              <button className="action-btn">
                <FiUser />
                查看订单
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
