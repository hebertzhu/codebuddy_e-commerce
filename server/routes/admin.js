const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// 管理员数据统计
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { 'payment.paymentStatus': 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.find()
        .populate('userId', 'username email')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderNumber totalAmount status createdAt')
    ]);

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders,
      salesData: await getSalesData(),
      userGrowth: await getUserGrowthData()
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 用户管理
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const filter = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 更新用户状态
router.put('/users/:id/status', adminAuth, [
  body('isActive').isBoolean().withMessage('状态必须是布尔值')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({ message: '用户状态更新成功', user });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 商品管理
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      filter.category = category;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 创建/更新商品
router.post('/products', adminAuth, [
  body('name').notEmpty().withMessage('商品名称不能为空'),
  body('price').isFloat({ min: 0 }).withMessage('价格必须大于0'),
  body('stock').isInt({ min: 0 }).withMessage('库存必须大于等于0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = req.body;
    let product;

    if (productData._id) {
      // 更新商品
      product = await Product.findByIdAndUpdate(
        productData._id,
        productData,
        { new: true, runValidators: true }
      );
    } else {
      // 创建新商品
      product = new Product(productData);
      await product.save();
    }

    res.json({ message: '商品保存成功', product });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 订单管理
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 更新订单状态
router.put('/orders/:id/status', adminAuth, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'username email');

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    res.json({ message: '订单状态更新成功', order });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 辅助函数
async function getSalesData() {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  return Order.aggregate([
    {
      $match: {
        createdAt: { $gte: last30Days },
        'payment.paymentStatus': 'completed'
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalSales: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
}

async function getUserGrowthData() {
  const last6Months = new Date();
  last6Months.setMonth(last6Months.getMonth() - 6);

  return User.aggregate([
    {
      $match: {
        createdAt: { $gte: last6Months }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        userCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
}

module.exports = router;