import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('获取商品失败');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="error">错误: {error}</div>;

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>欢迎来到电商商城</h1>
            <p>发现优质商品，享受购物乐趣</p>
            <button className="btn btn-primary">开始购物</button>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">精选商品</h2>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <h3>免费配送</h3>
              <p>订单满99元享受免费配送服务</p>
            </div>
            <div className="feature">
              <h3>品质保证</h3>
              <p>所有商品经过严格质量检测</p>
            </div>
            <div className="feature">
              <h3>7天退换</h3>
              <p>享受7天无理由退换货服务</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
