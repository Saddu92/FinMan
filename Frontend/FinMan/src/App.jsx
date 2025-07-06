"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Navbar from "./components/Navbar.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import TransactionList from "./components/TransactionList.jsx";
import MonthlyChart from "./components/MonthlyChart.jsx";
import Dashboard from "./components/Dashboard.jsx";
import BudgetForm from "./components/BudgetForm.jsx";
import BudgetTable from "./components/BudgetTable.jsx";
import BudgetComparisonChart from "./components/BudgetComparisonChart.jsx";
import { GET_TRANSACTION, DELETE_TRANSACTION } from "./utils/constant.js";
import { Toaster } from "react-hot-toast";

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [transactionVersion, setTransactionVersion] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(GET_TRANSACTION);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAdd = (tx) => {
    setTransactions([tx, ...transactions]);
    setTransactionVersion((v) => v + 1);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${DELETE_TRANSACTION}/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
      setTransactionVersion((v) => v + 1);
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError("Failed to delete transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetSet = () => {
    setTransactionVersion((v) => v + 1); // Trigger re-render for budget-related components
  };

  // Generate month options (last 12 months)
  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleString("default", { month: "long", year: "numeric" });
      options.push({ value, label });
    }
    return options;
  };
<div><Toaster/></div>

  return (
    
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-all duration-300 ease-in-out">
      <Navbar />

      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-indigo-600 animate-pulse" aria-hidden="true" />
      )}
      {error && (
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-red-600 bg-red-50 p-4 rounded-md text-sm"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <section
        id="landing"
        className="py-12 text-center bg-gradient-to-b from-indigo-50 dark:from-indigo-900 to-gray-100 dark:to-gray-900"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex justify-center items-center gap-2">
          <span aria-hidden="true">💸</span> Welcome to FinMan
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and visualize your expenses in one place.
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section id="add" className="py-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span aria-hidden="true">➕</span> Add a Transaction
          </h2>
          <TransactionForm onAdd={handleAdd} />
        </section>

        <section id="list" className="py-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span aria-hidden="true">📄</span> Transaction History
          </h2>
          <TransactionList transactions={transactions} onDelete={handleDelete} month={selectedMonth} />
        </section>

        <section id="dashboard" className="py-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span aria-hidden="true">📊</span> Dashboard
          </h2>
          <Dashboard
            transactions={transactions}
            month={selectedMonth}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onBudgetSet={handleBudgetSet}
          />
        </section>

        <section id="chart" className="py-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span aria-hidden="true">📈</span> Monthly Chart
          </h2>
          <MonthlyChart transactions={transactions} month={selectedMonth} />
        </section>

        <section id="budgeting" className="py-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span aria-hidden="true">💡</span> Budgeting
          </h2>
          <div className="mb-6">
            <label
              htmlFor="month-selector"
              className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
            >
              Select Month
            </label>
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
              aria-label="Select month for data filtering"
            >
              <SelectTrigger
                id="month-selector"
                className="w-full sm:w-[200px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
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
          </div>
          <BudgetForm onBudgetSet={handleBudgetSet} month={selectedMonth} />
          <div className="mt-6">
            <BudgetTable transactions={transactions} month={selectedMonth} />
          </div>
          <div className="mt-6">
            <BudgetComparisonChart
              transactions={transactions}
              month={selectedMonth}
              version={transactionVersion}
            />
          </div>
        </section>
      </main>
    </div>
  );
}