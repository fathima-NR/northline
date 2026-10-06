require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedIfEmpty = require('./seed/seed');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const port = process.env.PORT || 5000;
const localOrigins = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost:4280',
  'http://127.0.0.1:4280'
];

function allowedOrigin(origin) {
  if (!origin) return true;
  if (localOrigins.includes(origin)) return true;
  const extra = (process.env.CLIENT_ORIGIN || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (extra.includes(origin)) return true;
  try {
    return new URL(origin).hostname.endsWith('.vercel.app');
  } catch (error) {
    return false;
  }
}

app.use(cors({
  origin(origin, callback) {
    callback(null, allowedOrigin(origin));
  }
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'northline' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

async function start() {
  await connectDB();
  await seedIfEmpty();
  app.listen(port, () => {
    console.log(`Northline API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
