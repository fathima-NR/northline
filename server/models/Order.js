const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    qty: Number,
    unit: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shipping: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      area: String,
      notes: String
    },
    paymentMethod: { type: String, enum: ['cod', 'card'], default: 'cod' },
    itemsPrice: Number,
    deliveryFee: Number,
    total: Number,
    status: {
      type: String,
      enum: ['Processing', 'Out for delivery', 'Delivered'],
      default: 'Processing'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
