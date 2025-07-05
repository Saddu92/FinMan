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
} from "@/components/ui/select";

const COLORS = [
  "#f97316",
  "#34d399",
  "#60a5fa",
  "#f87171",
  "#a78bfa",
  "#10b981",
];

const formatLabel = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default function MonthlyChart({ transactions }) {
  const [view, setView] = useState("bar"); // 'bar' or 'pie'
  const [selectedCategory, setSelectedCategory] = useState("");

  // Group all expenses by description
  const groupedByDescription = {};
  transactions.forEach((tx) => {
    const rawDesc = tx.description?.trim() || "Uncategorized";
    const normalizedDesc = rawDesc.toLowerCase();
    groupedByDescription[normalizedDesc] =
      (groupedByDescription[normalizedDesc] || 0) + tx.amount;
  });

  const barChartData = Object.entries(groupedByDescription).map(
    ([desc, total]) => ({
      description: formatLabel(desc),
      total,
    })
  );

  // Get list of unique descriptions (capitalized)
  const allCategories = Object.keys(groupedByDescription).map(formatLabel);

  // Group by month for selected category
  const pieChartData = [];
  if (view === "pie" && selectedCategory) {
    const filteredTx = transactions.filter(
      (tx) =>
        (tx.description?.trim()?.toLowerCase() || "uncategorized") ===
        selectedCategory.toLowerCase()
    );

    const monthly = {};
    filteredTx.forEach((tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthly[month] = (monthly[month] || 0) + tx.amount;
    });

    for (const [month, total] of Object.entries(monthly)) {
      pieChartData.push({ name: month, value: total });
    }
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold">Expenses Visualization</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "bar" ? "default" : "outline"}
              onClick={() => setView("bar")}
            >
              All Categories (Bar)
            </Button>
            <Button
              variant={view === "pie" ? "default" : "outline"}
              onClick={() => setView("pie")}
            >
              Monthly Breakdown (Pie)
            </Button>
          </div>
        </div>

        {view === "bar" ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
            >
              <XAxis
                dataKey="description"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <>
            <div className="mb-4">
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  {selectedCategory || "Select a Category"}
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && pieChartData.length > 0 ? (
              <div className="w-full h-[320px] flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
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
                        backgroundColor: "#f9fafb",
                        borderRadius: "0.5rem",
                        borderColor: "#d1d5db",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
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
              <p className="text-sm text-muted-foreground">
                No data found for selected category.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Please select a category.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
