import { Card, CardContent } from '@/components/ui/card';

export default function SummaryCard({ transactions }) {
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-1">Total Expenses</h2>
        <p className="text-2xl font-bold text-red-500">₹{total}</p>
      </CardContent>
    </Card>
  );
}
