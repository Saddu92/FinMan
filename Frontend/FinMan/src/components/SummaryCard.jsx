"use client";

import { Card, CardContent } from '@/components/ui/card';

export default function SummaryCard({ transactions, month }) {
  const filteredTransactions = month
    ? transactions.filter((tx) => tx.date.startsWith(month))
    : transactions;

  const totalIncome = filteredTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ease-in-out">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span aria-hidden="true">💵</span> Financial Summary {month && `– ${new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
        </h2>
        {filteredTransactions.length === 0 ? (
          <p
            className="text-sm text-gray-500 dark:text-gray-400 text-center py-4"
            aria-live="polite"
          >
            No transactions {month ? `for ${new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}` : 'yet'}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Income</span>
              <p className="text-xl font-bold text-green-500 dark:text-green-400">
                ₹{totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</span>
              <p className="text-xl font-bold text-red-500 dark:text-red-400">
                ₹{totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-400">Net Balance</span>
              <p
                className={`text-xl font-bold ${netBalance >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}
              >
                ₹{Math.abs(netBalance).toFixed(2)} {netBalance >= 0 ? '' : '(Deficit)'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}