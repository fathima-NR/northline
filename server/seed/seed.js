const Product = require('../models/Product');
const User = require('../models/User');
const products = require('./products');

const brands = {
  Bags: 'Northline Carry',
  Audio: 'Northline Audio',
  Watches: 'Northline Time',
  Cameras: 'Northline Optics',
  Home: 'Northline Living',
  Accessories: 'Northline Atelier'
};

const highlights = {
  Bags: ['Padded laptop compartment', 'Adjustable straps', 'Ships in 1–2 business days'],
  Audio: ['Bluetooth 5.3', 'Up to 24 hours with the case', 'USB-C charging'],
  Watches: ['Stainless steel or leather strap', 'Two-year movement warranty', 'Gift box included'],
  Cameras: ['Includes battery and strap', 'Ships insured', '14-day price match'],
  Home: ['Packed for fragile delivery', 'Ready to use on arrival', '30-day returns'],
  Accessories: ['Everyday carry size', 'One-year warranty', 'Gift-ready packaging']
};

function withStoreDetails(items) {
  return items.map((item, index) => ({
    ...item,
    brand: brands[item.category] || 'Northline',
    sku: `NL-${2400 + index}`,
    highlights: highlights[item.category] || []
  }));
}

async function seedIfEmpty() {
  const catalog = withStoreDetails(products);
  const sample = await Product.findOne({ slug: 'trail-backpack' });
  const count = await Product.countDocuments();
  if (sample?.brand !== 'Northline Carry' || count !== catalog.length) {
    await Product.deleteMany({});
    await Product.insertMany(catalog);
    console.log(`Seeded ${catalog.length} products`);
  }

  const demo = await User.findOne({ email: 'demo@famsworld.com' });
  if (!demo) {
    await User.create({
      name: 'Demo Shopper',
      email: 'demo@famsworld.com',
      password: 'demo123',
      phone: '+1 202 555 0148'
    });
    console.log('Demo account ready: demo@famsworld.com / demo123');
  }
}

module.exports = seedIfEmpty;
