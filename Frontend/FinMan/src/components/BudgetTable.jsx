import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DELETE_BUDGET, GET_BUDGET } from '@/utils/constant';

export default function BudgetTable({ transactions, month }) {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchBudgets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${GET_BUDGET}?month=${month}`);
      setBudgets(res.data);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError('Failed to load budgets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`${DELETE_BUDGET}/${id}`);
      setSuccess('Budget deleted successfully!');
      fetchBudgets();
    } catch (err) {
      console.error('Failed to delete budget', err);
      setError('Failed to delete budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month]);

  const getActualSpending = (category) => {
    return transactions
      .filter((t) => t.category === category && t.date.startsWith(month))
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ease-in-out">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span aria-hidden="true">📊</span> Budget vs Actual – {month}
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div
            className="text-red-600 bg-red-50 p-4 rounded-md text-sm mb-4"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        ) : success ? (
          <div
            className="text-green-600 bg-green-50 p-4 rounded-md text-sm mb-4"
            role="status"
            aria-live="polite"
          >
            {success}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-700 dark:text-gray-300">Category</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Budgeted</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Spent</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.length > 0 ? (
                budgets.map((b) => {
                  const spent = getActualSpending(b.category);
                  const isOver = spent > b.amount;
                  return (
                    <TableRow
                      key={b._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <TableCell className="text-gray-900 dark:text-gray-100">
                        {b.category}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100">
                        ₹{b.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100">
                        ₹{spent.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isOver ? 'destructive' : 'default'}
                          className={isOver ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}
                        >
                          {isOver ? 'Over Budget' : 'Within Budget'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                              aria-label={`Delete budget for ${b.category}`}
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
                                Are you sure you want to delete the budget for {b.category} ({month})? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-300 dark:border-gray-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                onClick={() => handleDelete(b._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 dark:text-gray-400 py-6"
                    aria-live="polite"
                  >
                    No budgets set for this month.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}