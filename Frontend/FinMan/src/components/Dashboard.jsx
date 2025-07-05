'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryCard from './SummaryCard';
import RecentTransactions from './RecentTransactions';
import CategoryChart from './CategoryChart';
import { GET_TRANSACTION } from '@/utils/constant';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(GET_TRANSACTION);
      setTransactions(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Finance Dashboard</h1>
      <SummaryCard transactions={transactions} />
      <RecentTransactions transactions={transactions} />
      <CategoryChart transactions={transactions} />
    </div>
  );
}
