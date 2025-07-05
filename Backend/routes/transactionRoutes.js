const express = require('express');
// const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const tranRoutes= express.Router();

tranRoutes.get('/get', getTransactions);
tranRoutes.post('/create', createTransaction);
tranRoutes.delete('/delete/:id', deleteTransaction);

module.exports = tranRoutes;
