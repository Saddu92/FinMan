'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import MonthlyChart from './components/MonthlyChart.jsx';
import { GET_TRANSACTION, DELETE_TRANSACTION } from './utils/constant.js';
import Dashboard from './components/Dashboard.jsx';



export default function HomePage() {
  const [transactions, setTransactions] = useState([]);

  
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(GET_TRANSACTION);
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };


  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAdd = (tx) => {
    setTransactions([tx, ...transactions]);
  };

 const handleDelete = async (id) => {
  try {
    await axios.delete(`${DELETE_TRANSACTION}/${id}`);
    setTransactions(transactions.filter((t) => t._id !== id));
  } catch (err) {
    console.error('Failed to delete transaction:', err);
  }
};


  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Personal Finance Visualizer</h1>
      <TransactionForm onAdd={handleAdd} />
      <TransactionList transactions={transactions} onDelete={handleDelete} />
      {/* <MonthlyChart transactions={transactions} /> */}
            <Dashboard />

    </main>
  );
}
