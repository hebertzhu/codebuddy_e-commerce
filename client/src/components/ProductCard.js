import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { id, name, price, image, description, stock } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 添加到购物车逻辑
    console.log('添加到购物车:', product);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${id}`} className="product-link">
        <div className="product-image">
          <img src={image || '/images/placeholder.jpg'} alt={name} />
          <div className="product-overlay">
            <button className="quick-view-btn">
              <FiEye />
            </button>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-description">{description}</p>
          
          <div className="product-meta">
            <span className="product-price">¥{price}</span>
            <span className="product-stock">{stock}件 available</span>
          </div>
          
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FiShoppingCart />
            加入购物车
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
