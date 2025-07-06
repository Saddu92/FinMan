
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: String,
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Rent', 'Bills', 'Shopping', 'Travel', 'Health', 'Other']
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
