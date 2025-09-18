import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>关于我们</h3>
            <p>提供高品质的商品和优质的购物体验</p>
          </div>
          
          <div className="footer-section">
            <h3>客户服务</h3>
            <ul>
              <li><a href="/help">帮助中心</a></li>
              <li><a href="/contact">联系我们</a></li>
              <li><a href="/returns">退换货政策</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>支付方式</h3>
            <div className="payment-methods">
              <span>支付宝</span>
              <span>微信支付</span>
              <span>银联</span>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>关注我们</h3>
            <div className="social-links">
              <a href="#" className="social-link">微信</a>
              <a href="#" className="social-link">微博</a>
              <a href="#" className="social-link">抖音</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 电商商城. 版权所有.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
