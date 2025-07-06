import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { GET_BUDGET } from "@/utils/constant";

export default function BudgetComparisonChart({ transactions, month, version }) {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBudgets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${GET_BUDGET}?month=${month}`);
      const budgets = res.data;

      const data = budgets.map((b) => {
        const spent = transactions
          .filter(
            (t) =>
              t.category?.toLowerCase().trim() ===
                b.category?.toLowerCase().trim() &&
              t.date?.slice(0, 7) === month
          )
          .reduce((sum, t) => sum + Number(t.amount), 0);
        return {
          category: b.category,
          Budgeted: b.amount,
          Spent: spent,
        };
      });

      setChartData(data);
    } catch (err) {
      console.error("Error fetching budgets for chart:", err);
      setError("Failed to load budget data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [transactions, month, version]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-8 transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span aria-hidden="true">📊</span> Budget vs. Spent
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
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
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            role="img"
            aria-label={`Bar chart comparing budgeted and spent amounts for ${month}`}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="category"
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
            />
            <Legend
              wrapperStyle={{
                fontSize: "14px",
                paddingTop: "10px",
              }}
            />
            <Bar
              dataKey="Budgeted"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
            <Bar
              dataKey="Spent"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center" aria-live="polite">
          No budget data available for this month.
        </p>
      )}
    </div>
  );
}