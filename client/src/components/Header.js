import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiUser } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>电商商城</h1>
          </Link>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FiSearch />
            </button>
          </form>

          <nav className="nav">
            <Link to="/" className="nav-link">首页</Link>
            <Link to="/products" className="nav-link">商品</Link>
            <Link to="/categories" className="nav-link">分类</Link>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="action-btn">
              <FiShoppingCart />
              <span className="cart-count">0</span>
            </Link>
            <Link to="/login" className="action-btn">
              <FiUser />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
