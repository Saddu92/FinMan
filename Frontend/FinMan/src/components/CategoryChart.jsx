"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const COLORS = [
  "#4f46e5", // Indigo
  "#10b981", // Green
  "#f43f5e", // Rose
  "#60a5fa", // Blue
  "#a78bfa", // Purple
  "#f97316", // Orange
];

const formatLabel = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default function CategoryChart({ transactions }) {
  const [view, setView] = useState("bar");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Group expenses by category
  const groupedByCategory = {};
  transactions.forEach((tx) => {
    const rawCat = tx.category?.trim() || "Uncategorized";
    const normalizedCat = rawCat.toLowerCase();
    groupedByCategory[normalizedCat] =
      (groupedByCategory[normalizedCat] || 0) + Number(tx.amount);
  });

  const barChartData = Object.entries(groupedByCategory).map(([cat, total]) => ({
    category: formatLabel(cat),
    total,
  }));

  const allCategories = Object.keys(groupedByCategory).map(formatLabel);

  // Calculate pie chart data
  const totalExpense = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const pieChartData = [];

  if (view === "pie" && selectedCategory) {
    const filteredTx = transactions.filter(
      (tx) =>
        (tx.category?.trim()?.toLowerCase() || "uncategorized") ===
        selectedCategory.toLowerCase()
    );

    const monthlyTotals = {};
    filteredTx.forEach((tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(tx.amount);
    });

    for (const [month, value] of Object.entries(monthlyTotals)) {
      const percent = totalExpense ? ((value / totalExpense) * 100).toFixed(1) : 0;
      pieChartData.push({ name: month, value, percent });
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ease-in-out mt-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span aria-hidden="true">📊</span> Expenses Visualization
          </h2>
          <div className="flex items-center gap-3">
            <Button
              variant={view === "bar" ? "default" : "outline"}
              onClick={() => {
                setView("bar");
                setSelectedCategory(""); // Reset category when switching to bar view
              }}
              className={
                view === "bar"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                  : "border-gray-300 dark:border-gray-600"
              }
              aria-label="View all categories as bar chart"
            >
              All Categories (Bar)
            </Button>
            <Button
              variant={view === "pie" ? "default" : "outline"}
              onClick={() => setView("pie")}
              className={
                view === "pie"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                  : "border-gray-300 dark:border-gray-600"
              }
              aria-label="View category as pie chart"
            >
              Category (Pie)
            </Button>
          </div>
        </div>
      </CardContent>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6" aria-live="polite">
          No transaction data available.
        </p>
      ) : view === "bar" ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
            role="img"
            aria-label="Bar chart of expenses by category"
          >
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={100}
              tick={{ fontSize: 12, fill: "#4b5563" }}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#4b5563" }}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`₹${value.toFixed(2)}`, "Total"]}
            />
            <Bar
              dataKey="total"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <>
          <div className="mb-4">
            <Select
              onValueChange={(value) => setSelectedCategory(value)}
              value={selectedCategory}
            >
              <SelectTrigger
                className="w-full sm:w-[250px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                aria-label="Select category for pie chart"
              >
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                {allCategories.map((cat) => (
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

          {selectedCategory && pieChartData.length > 0 ? (
            <div className="w-full h-[320px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart
                  role="img"
                  aria-label={`Pie chart of monthly expenses for ${selectedCategory}`}
                >
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${percent}%)`}
                    animationDuration={800}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [`₹${value.toFixed(2)}`, "Total"]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                {pieChartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedCategory ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6" aria-live="polite">
              No data found for selected category.
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6" aria-live="polite">
              Please select a category.
            </p>
          )}
        </>
      )}
    </Card>
  );
}