const express = require('express');
const router = express.Router();

// Dummy Admin Messages
router.get('/admin-messages', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, sender: 'Admin', subject: 'Welcome!', body: 'Welcome to the portal.' },
      { id: 2, sender: 'Admin', subject: 'System Update', body: 'Platform update scheduled for next week.' }
    ]
  });
});

// Dummy Support Tickets
router.get('/support-tickets', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 101, user: 'John Doe', issue: 'Order not delivered', status: 'Open' },
      { id: 102, user: 'Jane Smith', issue: 'Refund pending', status: 'Closed' }
    ]
  });
});

// Dummy Notifications
router.get('/notifications', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 201, title: 'New Product Added', read: false },
      { id: 202, title: 'Support ticket update', read: true }
    ]
  });
});

// Dummy Chat with Customers
router.get('/chat-customers', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 301, customer: 'John Doe', message: 'Can I change my address?' },
      { id: 302, customer: 'Jane Smith', message: 'Thank you for your help!' }
    ]
  });
});

// Dummy Email Responses
router.get('/email-responses', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 401, email: 'john@example.com', subject: 'Order Query', response: 'We are looking into your order.' },
      { id: 402, email: 'jane@example.com', subject: 'Invoice Request', response: 'Invoice sent to your email.' }
    ]
  });
});

module.exports = router;
