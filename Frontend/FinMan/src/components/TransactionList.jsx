"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TransactionList({ transactions = [], onDelete, month }) {
  const [visible, setVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const filteredTransactions = month
    ? transactions.filter((tx) => tx.date.startsWith(month))
    : transactions;

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const recentLimit = 5;
  const displayedTransactions = showAll
    ? sortedTransactions
    : sortedTransactions.slice(0, recentLimit);

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await onDelete(id);
      setSuccess("Transaction deleted successfully!");
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ease-in-out mt-6">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span aria-hidden="true">📜</span> Transaction History {month && `– ${new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div
            className="text-red-600 bg-red-50 p-4 rounded-md text-sm"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        ) : success ? (
          <div
            className="text-green-600 bg-green-50 p-4 rounded-md text-sm"
            role="status"
            aria-live="polite"
          >
            {success}
          </div>
        ) : !visible ? (
          <div className="text-center">
            <Button
              variant="default"
              onClick={() => setVisible(true)}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
              aria-label="Show transaction history"
            >
              Show Transactions
            </Button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <p
            className="text-sm text-gray-500 dark:text-gray-400 text-center py-4"
            aria-live="polite"
          >
            No transactions {month ? `for ${new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}` : 'yet'}.
          </p>
        ) : (
          <>
            <ul role="list" className="space-y-3">
              {displayedTransactions.map((tx) => (
                <li
                  key={tx._id}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ₹{Math.abs(Number(tx.amount)).toFixed(2)} {tx.amount >= 0 ? "(Income)" : "(Expense)"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tx.description || 'No description'} •{' '}
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                      aria-label={`Category: ${tx.category || 'Uncategorized'}`}
                    >
                      {tx.category || 'Uncategorized'}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                        aria-label={`Delete transaction for ${tx.description || 'No description'}`}
                        disabled={isLoading}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white dark:bg-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                          Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                          Are you sure you want to delete the transaction for{' '}
                          {tx.description || 'No description'} (₹{Math.abs(Number(tx.amount)).toFixed(2)}) on{' '}
                          {new Date(tx.date).toLocaleDateString('en-IN')}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-300 dark:border-gray-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                          onClick={() => handleDelete(tx._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
            {filteredTransactions.length > recentLimit && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                  aria-label={showAll ? "Show fewer transactions" : "Show all transactions"}
                >
                  {showAll ? 'Show Less' : 'Show All Transactions'}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}