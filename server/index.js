const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 数据库连接
console.log('正在连接MongoDB:', process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5秒超时
  socketTimeoutMS: 45000, // 45秒socket超时
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => {
  console.error('MongoDB连接失败:', err.message);
  console.error('请确保MongoDB服务已启动，将使用模拟数据');
  // 设置标志表示使用模拟数据
  process.env.USE_MOCK_DATA = 'true';
});

// Middleware
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

// 商品路由（保持向后兼容）
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // 如果MongoDB连接失败，使用模拟数据
    if (process.env.USE_MOCK_DATA === 'true') {
      const mockProducts = [
        {
          _id: '1',
          name: '智能手机',
          description: '高性能智能手机，配备最新处理器和优秀摄像头',
          price: 2999,
          category: '电子产品',
          stock: 50,
          image: '/images/phone.jpg',
          isActive: true
        },
        {
          _id: '2',
          name: '笔记本电脑',
          description: '轻薄便携笔记本电脑，适合办公和学习',
          price: 4999,
          category: '电子产品',
          stock: 30,
          image: '/images/laptop.jpg',
          isActive: true
        },
        {
          _id: '3',
          name: '运动鞋',
          description: '舒适的运动鞋，适合各种运动场合',
          price: 399,
          category: '服装鞋帽',
          stock: 100,
          image: '/images/shoes.jpg',
          isActive: true
        }
      ];

      // 简单的过滤逻辑
      let filteredProducts = mockProducts;
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }

      return res.json(filteredProducts);
    }

    let filter = { isActive: true };
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await require('./models/Product').find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await require('./models/Product').findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '商品未找到' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 订单路由（更新版）
app.post('/api/orders', async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, userId } = req.body;
    
    if (!items || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: '订单信息不完整' });
    }

    const order = new (require('./models/Order'))({
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '服务器运行正常',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});