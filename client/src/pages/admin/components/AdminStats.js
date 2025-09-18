import React from 'react';
import { FiUsers, FiShoppingCart, FiDollarSign, FiPackage } from 'react-icons/fi';
import './AdminStats.css';

const AdminStats = ({ stats }) => {
  const statCards = [
    {
      title: '总用户数',
      value: stats.totalUsers,
      icon: <FiUsers />,
      color: '#3498db',
      change: '+12%'
    },
    {
      title: '商品总数',
      value: stats.totalProducts,
      icon: <FiPackage />,
      color: '#2ecc71',
      change: '+5%'
    },
    {
      title: '总订单数',
      value: stats.totalOrders,
      icon: <FiShoppingCart />,
      color: '#e74c3c',
      change: '+18%'
    },
    {
      title: '总收入',
      value: `¥${stats.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: '#f39c12',
      change: '+22%'
    }
  ];

  return (
    <div className="admin-stats">
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <span className="stat-change" style={{ color: stat.change.startsWith('+') ? '#2ecc71' : '#e74c3c' }}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>销售趋势</h3>
          <div className="chart-placeholder">
            <p>销售图表将在这里显示</p>
            <small>（需要集成图表库如Chart.js）</small>
          </div>
        </div>

        <div className="chart-card">
          <h3>用户增长</h3>
          <div className="chart-placeholder">
            <p>用户增长图表将在这里显示</p>
            <small>（需要集成图表库如Chart.js）</small>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>最近活动</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <FiUsers />
            </div>
            <div className="activity-content">
              <p>新用户注册</p>
              <span className="activity-time">2分钟前</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">
              <FiShoppingCart />
            </div>
            <div className="activity-content">
              <p>新订单创建</p>
              <span className="activity-time">5分钟前</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">
              <FiDollarSign />
            </div>
            <div className="activity-content">
              <p>支付成功</p>
              <span className="activity-time">10分钟前</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
