// components/TransactionForm.jsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CREATE_TRANSACTION } from '@/utils/constant';

export default function TransactionForm({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !date) return;

    try {
      const res = await axios.post( CREATE_TRANSACTION, {
        amount: parseFloat(amount),
        description,
        date,
      });

      onAdd(res.data);
      setAmount('');
      setDescription('');
      setDate('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Grocery"
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Add Transaction</Button>
        </form>
      </CardContent>
    </Card>
  );
}
