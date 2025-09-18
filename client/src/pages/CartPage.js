import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: '智能手机',
      price: 2999,
      image: '/images/phone.jpg',
      quantity: 1
    },
    {
      id: 2,
      name: '无线耳机',
      price: 499,
      image: '/images/earphones.jpg',
      quantity: 2
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>购物车为空</h2>
            <p>快去添加一些商品吧！</p>
            <Link to="/" className="btn btn-primary">
              继续购物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">购物车</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="item-image" />
                
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">¥{item.price}</p>
                </div>
                
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    <FiMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <FiPlus />
                  </button>
                </div>
                
                <div className="item-total">
                  ¥{(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>订单摘要</h3>
            
            <div className="summary-row">
              <span>商品总价</span>
              <span>¥{getTotalPrice().toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>运费</span>
              <span>¥0.00</span>
            </div>
            
            <div className="summary-row total">
              <span>总计</span>
              <span>¥{getTotalPrice().toFixed(2)}</span>
            </div>
            
            <Link to="/checkout" className="btn btn-primary checkout-btn">
              去结算
            </Link>
            
            <Link to="/" className="continue-shopping">
              继续购物
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
