const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, topic, body } = req.body;
    if (!name || !email || !body) {
      return res.status(400).json({ message: 'Name, email, and a message are required' });
    }
    const message = await Message.create({
      name,
      email,
      topic: topic || 'Order help',
      body
    });
    res.status(201).json({ id: message._id, message: 'Message received. We reply within one business day.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not send your message' });
  }
});

module.exports = router;
