'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TransactionList({ transactions = [], onDelete }) {
  const [visible, setVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const recentLimit = 5;
  const displayedTransactions = showAll
    ? sortedTransactions
    : sortedTransactions.slice(0, recentLimit);

  return (
    <Card className="mt-4">
      <CardContent className="space-y-3 p-4">
        {!visible ? (
          <div className="text-center">
            <Button variant="default" onClick={() => setVisible(true)}>
              Show Transactions
            </Button>
          </div>
        ) : transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <>
            {displayedTransactions.map((tx) => (
              <div key={tx._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">₹{tx.amount}</p>
                  <p className="text-sm text-muted-foreground">
                    {tx.description || 'No description'} • {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => onDelete(tx._id)}>
                  Delete
                </Button>
              </div>
            ))}
            {transactions.length > recentLimit && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Less' : 'Show Previous Transactions'}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
