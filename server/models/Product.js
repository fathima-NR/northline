const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    comparePrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    brand: { type: String, default: 'Northline' },
    sku: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    image: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 20 },
    deal: { type: Boolean, default: false },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
