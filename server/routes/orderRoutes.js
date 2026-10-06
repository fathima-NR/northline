const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { items, shipping, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }
    if (!shipping?.fullName || !shipping?.phone || !shipping?.address || !shipping?.city) {
      return res.status(400).json({ message: 'Please complete the delivery details' });
    }

    const ids = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: ids } });
    const byId = new Map(products.map((product) => [String(product._id), product]));

    const orderItems = [];
    for (const item of items) {
      const product = byId.get(String(item.product));
      if (!product) {
        return res.status(400).json({ message: 'A product in your cart is no longer available' });
      }
      const qty = Math.max(1, Number(item.qty) || 1);
      if (qty > product.stock) {
        return res.status(400).json({ message: `Only ${product.stock} ${product.unit} of ${product.name} left` });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
        unit: product.unit
      });
    }

    const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = itemsPrice >= 50 || itemsPrice === 0 ? 0 : 10;
    const total = Number((itemsPrice + deliveryFee).toFixed(2));

    for (const item of orderItems) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.qty } });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shipping,
      paymentMethod: paymentMethod === 'card' ? 'card' : 'cod',
      itemsPrice: Number(itemsPrice.toFixed(2)),
      deliveryFee,
      total
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Could not place order' });
  }
});

router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Could not load orders' });
  }
});

module.exports = router;
