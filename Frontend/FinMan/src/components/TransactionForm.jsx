"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { CREATE_TRANSACTION } from "@/utils/constant";
import toast from "react-hot-toast";

const categories = ["Food", "Rent", "Bills", "Shopping", "Travel", "Health", "Other"];

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: "",
    type: "expense", // Default to expense
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
    if (!form.amount || Number(form.amount) <= 0) return "Please enter a valid amount greater than 0.";
    if (!form.date) return "Please select a valid date.";
    if (!form.category) return "Please select a category.";
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
      const res = await axios.post(CREATE_TRANSACTION, {
        amount: form.type === "expense" ? -Number(form.amount) : Number(form.amount), // Negative for expenses
        description: form.description || "No description",
        date: form.date,
        category: form.category,
      });
      toast.success("Transaction Created Successfully");
      setSuccess("Transaction added successfully!");
      onAdd(res.data);
      setForm({ amount: "", description: "", date: "", category: "", type: "expense" });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed To Add Transaction");
      setError("Failed to add transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out mb-6">
      <CardContent className="p-0">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span aria-hidden="true">➕</span> Add Transaction
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end">
          <div>
            <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="Enter amount"
              required
              min="0.01"
              step="0.01"
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              aria-describedby={error && (!form.amount || Number(form.amount) <= 0) ? "amount-error" : undefined}
            />
          </div>
          <div>
            <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
              Category
            </Label>
            <Select
              value={form.category}
              onValueChange={(value) => handleChange("category", value)}
              required
              aria-describedby={error && !form.category ? "category-error" : undefined}
            >
              <SelectTrigger
                id="category"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                aria-label="Select transaction category"
              >
                <SelectValue placeholder="Select a category" />
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
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g., Grocery shopping, Uber ride"
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              aria-describedby={error && !form.date ? "date-error" : undefined}
            />
          </div>
          <div>
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">
              Type
            </Label>
            <Select
              value={form.type}
              onValueChange={(value) => handleChange("type", value)}
              aria-label="Select transaction type"
            >
              <SelectTrigger
                id="type"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                <SelectItem
                  value="expense"
                  className="text-gray-900 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                >
                  Expense
                </SelectItem>
                <SelectItem
                  value="income"
                  className="text-gray-900 dark:text-gray-100 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                >
                  Income
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="col-span-1 md:col-span-2 lg:col-span-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors duration-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                Adding...
              </span>
            ) : (
              "Add Transaction"
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
      </CardContent>
    </Card>
  );
}