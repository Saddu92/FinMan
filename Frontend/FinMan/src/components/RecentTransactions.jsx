import { Card, CardContent } from '@/components/ui/card';

export default function RecentTransactions({ transactions }) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h2 className="text-lg font-semibold mb-1">Recent Transactions</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          recent.map((tx) => (
            <div key={tx._id} className="flex justify-between border-b pb-2">
              <div>
                <p className="font-medium">₹{tx.amount}</p>
                <p className="text-sm text-muted-foreground">
                  {tx.description || 'No description'} • {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
