const express = require('express');
const {
  setBudget,
  getBudgets,
  deleteBudget
} = require('../controllers/budgetController');

const budgetRoutes = express.Router();

budgetRoutes.post('/setBudget', setBudget);
budgetRoutes.get('/getBudgets', getBudgets);
budgetRoutes.delete('/deleteBudget/:id', deleteBudget);

module.exports = budgetRoutes;
