const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 模拟支付处理
const processPayment = async (paymentData) => {
  // 这里可以集成真实的支付网关如支付宝、微信支付等
  // 目前使用模拟支付处理
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟支付成功
      resolve({
        success: true,
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        paidAt: new Date()
      });
    }, 2000);
  });
};

// 创建支付
router.post('/create', auth, [
  body('orderId').isMongoId().withMessage('订单ID无效'),
  body('paymentMethod')
    .isIn(['alipay', 'wechat', 'credit_card', 'bank_transfer'])
    .withMessage('支付方式不支持')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentMethod } = req.body;

    // 获取订单
    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: '订单状态不允许支付' });
    }

    // 处理支付
    const paymentResult = await processPayment({
      orderId: order.orderNumber,
      amount: order.totalAmount,
      paymentMethod,
      userId: req.user._id
    });

    if (paymentResult.success) {
      // 更新订单支付状态
      order.payment = {
        paymentMethod,
        paymentStatus: 'completed',
        transactionId: paymentResult.transactionId,
        amount: order.totalAmount,
        paidAt: paymentResult.paidAt
      };
      order.status = 'confirmed';
      
      await order.save();

      res.json({
        success: true,
        message: '支付成功',
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          payment: order.payment
        }
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: '支付失败' 
      });
    }
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 查询支付状态
router.get('/status/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    res.json({
      orderId: order._id,
      orderNumber: order.orderNumber,
      paymentStatus: order.payment?.paymentStatus || 'pending',
      paymentMethod: order.payment?.paymentMethod,
      amount: order.totalAmount,
      paidAt: order.payment?.paidAt
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 退款处理
router.post('/refund', auth, [
  body('orderId').isMongoId().withMessage('订单ID无效'),
  body('reason').notEmpty().withMessage('退款原因不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, reason } = req.body;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    if (order.payment?.paymentStatus !== 'completed') {
      return res.status(400).json({ message: '订单未支付，无法退款' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: '订单已取消' });
    }

    // 模拟退款处理
    order.payment.paymentStatus = 'refunded';
    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: '退款申请已提交',
      refundId: `REF${Date.now()}`,
      amount: order.totalAmount,
      reason
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 获取支付方式列表
router.get('/methods', async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'alipay',
        name: '支付宝',
        description: '支付宝安全支付',
        icon: '/images/alipay.png',
        enabled: true
      },
      {
        id: 'wechat',
        name: '微信支付',
        description: '微信安全支付',
        icon: '/images/wechat.png',
        enabled: true
      },
      {
        id: 'credit_card',
        name: '信用卡',
        description: '支持Visa、MasterCard等',
        icon: '/images/credit-card.png',
        enabled: true
      },
      {
        id: 'bank_transfer',
        name: '银行转账',
        description: '线下银行转账',
        icon: '/images/bank.png',
        enabled: true
      }
    ];

    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

module.exports = router;