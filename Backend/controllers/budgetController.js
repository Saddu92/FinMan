const Budget = require('../models/Budget');


const setBudget = async (req, res) => {
  const { category, amount, month } = req.body;
  try {
    let budget = await Budget.findOne({ category, month });
    if (budget) {
      budget.amount = amount;
    } else {
      budget = new Budget({ category, amount, month });
    }
    await budget.save();
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to set budget' });
  }
};

const getBudgets = async (req, res) => {
  const { month } = req.query;
  try {
    const budgets = await Budget.find({ month });
    res.status(200).json(budgets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

const deleteBudget = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Budget.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};

module.exports = {
  setBudget,
  getBudgets,
  deleteBudget
};
