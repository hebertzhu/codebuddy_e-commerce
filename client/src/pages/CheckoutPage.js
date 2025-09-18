import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items: cart,
        totalAmount: calculateTotal(),
        shippingAddress,
        userId: user?._id
      };

      const response = await fetch('http://localhost:5002/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        localStorage.removeItem('cart');
        alert('订单提交成功！');
        navigate('/');
      } else {
        throw new Error('订单提交失败');
      }
    } catch (error) {
      console.error('订单提交错误:', error);
      alert('订单提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>购物车为空</h2>
          <p>请先添加商品到购物车</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>结算</h1>
      
      <div className="checkout-container">
        <div className="order-summary">
          <h2>订单摘要</h2>
          {cart.map(item => (
            <div key={item.id} className="order-item">
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>¥{item.price} × {item.quantity}</p>
              </div>
              <p className="item-total">¥{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="order-total">
            <h3>总计: ¥{calculateTotal().toFixed(2)}</h3>
          </div>
        </div>

        <form className="shipping-form" onSubmit={handleSubmit}>
          <h2>收货信息</h2>
          
          <div className="form-group">
            <label>收货人姓名:</label>
            <input
              type="text"
              required
              value={shippingAddress.fullName}
              onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>详细地址:</label>
            <input
              type="text"
              required
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>城市:</label>
            <input
              type="text"
              required
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>邮政编码:</label>
            <input
              type="text"
              required
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>联系电话:</label>
            <input
              type="tel"
              required
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-order-btn">
            {loading ? '提交中...' : '提交订单'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
