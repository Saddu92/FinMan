"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import SummaryCard from './SummaryCard';
import RecentTransactions from './RecentTransactions';
import CategoryChart from './CategoryChart';
import BudgetForm from './BudgetForm';
import BudgetTable from './BudgetTable';
import BudgetComparisonChart from './BudgetComparisonChart';
import { GET_TRANSACTION } from '@/utils/constant';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default: current month (YYYY-MM)
  const [version, setVersion] = useState(0); // For forcing budget chart refresh

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(GET_TRANSACTION);
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRefresh = () => {
    setVersion((prev) => prev + 1);
    setIsLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const res = await axios.get(GET_TRANSACTION);
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  };

  const handleBudgetSet = () => {
    setVersion((prev) => prev + 1); // Trigger BudgetComparisonChart refresh
  };

  // Generate month options (last 12 months)
  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 bg-gray-100 dark:bg-gray-900 min-h-screen transition-all duration-300 ease-in-out">
      <header className="sticky top-0 bg-gray-100 dark:bg-gray-900 z-10 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span aria-hidden="true">📈</span> Finance Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Select
              value={month}
              onValueChange={setMonth}
              aria-label="Select month for data filtering"
            >
              <SelectTrigger className="w-full sm:w-[200px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                {getMonthOptions().map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-gray-900 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
              aria-label="Refresh dashboard data"
            >
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div
          className="text-red-600 bg-red-50 p-4 rounded-md text-sm"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <SummaryCard transactions={transactions} month={month} />
          </div>
          <BudgetForm onBudgetSet={handleBudgetSet} />
          <BudgetTable transactions={transactions} month={month} />
          <BudgetComparisonChart transactions={transactions} month={month} version={version} />
          <RecentTransactions transactions={transactions} month={month} />
          <CategoryChart transactions={transactions} month={month} />
        </div>
      )}
    </div>
  );
}