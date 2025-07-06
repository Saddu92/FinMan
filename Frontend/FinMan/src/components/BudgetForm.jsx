import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SET_BUDGET } from '@/utils/constant';
import toast from 'react-hot-toast';

const categories = ["Food", "Rent", "Bills", "Shopping", "Travel", "Health", "Other"];

export default function BudgetForm({ onBudgetSet }) {
  const [form, setForm] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7), // default: current month "YYYY-MM"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError(null); // Clear error on input change
    setSuccess(null); // Clear success message on input change
  };

  const validateForm = () => {
    if (!form.category) return 'Please select a category.';
    if (!form.amount || Number(form.amount) <= 0) return 'Please enter a valid amount greater than 0.';
    if (!form.month) return 'Please select a valid month.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(SET_BUDGET, {
        ...form,
        amount: Number(form.amount), // Ensure amount is a number
      });
      toast.success("Budget Added Successfully");
      setSuccess('Budget saved successfully!');
      onBudgetSet(); // Refresh budget list
      setForm({ ...form, category: '', amount: '' }); // Reset form fields
    } catch (err) {
      console.error('Error setting budget:', err);
      toast.error("Failed to save budget");
      setError('Failed to save budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span aria-hidden="true">💰</span> Set Budget
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3 items-end">
        <div>
          <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
            Category
          </Label>
          <Select
            value={form.category}
            onValueChange={(val) => handleChange('category', val)}
            required
            aria-describedby={error && form.category === '' ? 'category-error' : undefined}
          >
            <SelectTrigger
              id="category"
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700">
              {categories.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className="text-gray-900 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">
            Budget Amount
          </Label>
          <Input
            id="amount"
            type="number"
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="Enter amount"
            required
            min="0.01"
            step="0.01"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            aria-describedby={error && (!form.amount || Number(form.amount) <= 0) ? 'amount-error' : undefined}
          />
        </div>

        <div>
          <Label htmlFor="month" className="text-gray-700 dark:text-gray-300">
            Month
          </Label>
          <Input
            id="month"
            type="month"
            value={form.month}
            onChange={(e) => handleChange('month', e.target.value)}
            required
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            aria-describedby={error && !form.month ? 'month-error' : undefined}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="col-span-full md:col-span-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors duration-200"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
              Saving...
            </span>
          ) : (
            'Save Budget'
          )}
        </Button>
      </form>

      {error && (
        <div
          className="mt-4 text-red-600 bg-red-50 p-3 rounded-md text-sm"
          role="alert"
          aria-live="assertive"
          id="form-error"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="mt-4 text-green-600 bg-green-50 p-3 rounded-md text-sm"
          role="status"
          aria-live="polite"
          id="form-success"
        >
          {success}
        </div>
      )}
    </div>
  );
}