const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Rent', 'Bills', 'Shopping', 'Travel', 'Health', 'Other']
  },
  amount: {
    type: Number,
    required: true
  },
  month: {
    type: String, // Format: "2025-07"
    required: true
  }
});

module.exports = mongoose.model('Budget', budgetSchema);
