
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
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
