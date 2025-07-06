const Transaction = require('../models/Transaction');

// @desc    Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// @desc    Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { amount, description, date ,category} = req.body;

    // Basic validation
    if (!amount || !date) {
      return res.status(400).json({ error: 'Amount and date are required' });
    }

    const transaction = await Transaction.create({
      amount,
      description,
      date,
      category
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Error in createTransaction:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// @desc    Delete transaction
    const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Transaction.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(204).end();
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};


module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
};
