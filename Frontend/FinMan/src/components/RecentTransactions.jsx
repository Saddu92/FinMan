"use client";

import { Card, CardContent } from '@/components/ui/card';

export default function RecentTransactions({ transactions, month }) {
  const recent = [...transactions]
    .filter((tx) => !month || tx.date.startsWith(month)) // Filter by month if provided
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ease-in-out">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span aria-hidden="true">🕒</span> Recent Transactions
        </h2>
        {recent.length === 0 ? (
          <p
            className="text-sm text-gray-500 dark:text-gray-400 text-center py-4"
            aria-live="polite"
          >
            No transactions {month ? `for ${new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}` : 'yet'}.
          </p>
        ) : (
          <ul role="list" className="space-y-3">
            {recent.map((tx) => (
              <li
                key={tx._id}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 transition-colors duration-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    ₹{Number(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tx.description || 'No description'} •{' '}
                    {new Date(tx.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className="text-sm text-gray-500 dark:text-gray-400"
                  aria-label={`Category: ${tx.category || 'Uncategorized'}`}
                >
                  {tx.category || 'Uncategorized'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}