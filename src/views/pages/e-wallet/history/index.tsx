'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import Link from 'next/link';

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const [transactions] = useState([
    {
      id: 'TXN001',
      type: 'received',
      amount: 150.0,
      from: 'Sarah Johnson',
      to: 'You',
      date: '2024-01-15T10:30:00',
      status: 'completed',
      category: 'Transfer',
    },
    {
      id: 'TXN002',
      type: 'sent',
      amount: 75.5,
      from: 'You',
      to: 'Amazon',
      date: '2024-01-14T15:45:00',
      status: 'completed',
      category: 'Shopping',
    },
    {
      id: 'TXN003',
      type: 'received',
      amount: 200.0,
      from: 'Payroll',
      to: 'You',
      date: '2024-01-13T09:00:00',
      status: 'completed',
      category: 'Salary',
    },
    {
      id: 'TXN004',
      type: 'sent',
      amount: 45.0,
      from: 'You',
      to: 'Netflix',
      date: '2024-01-12T20:15:00',
      status: 'completed',
      category: 'Subscription',
    },
    {
      id: 'TXN005',
      type: 'sent',
      amount: 120.0,
      from: 'You',
      to: 'Electric Company',
      date: '2024-01-11T14:20:00',
      status: 'completed',
      category: 'Bills',
    },
    {
      id: 'TXN006',
      type: 'received',
      amount: 50.0,
      from: 'John Doe',
      to: 'You',
      date: '2024-01-10T11:30:00',
      status: 'completed',
      category: 'Transfer',
    },
    {
      id: 'TXN007',
      type: 'sent',
      amount: 89.99,
      from: 'You',
      to: 'Uber',
      date: '2024-01-09T18:45:00',
      status: 'completed',
      category: 'Transportation',
    },
    {
      id: 'TXN008',
      type: 'received',
      amount: 300.0,
      from: 'Freelance Client',
      to: 'You',
      date: '2024-01-08T16:00:00',
      status: 'completed',
      category: 'Income',
    },
    {
      id: 'TXN009',
      type: 'sent',
      amount: 25.0,
      from: 'You',
      to: 'Starbucks',
      date: '2024-01-07T08:30:00',
      status: 'pending',
      category: 'Food',
    },
    {
      id: 'TXN010',
      type: 'sent',
      amount: 199.99,
      from: 'You',
      to: 'Best Buy',
      date: '2024-01-06T13:15:00',
      status: 'failed',
      category: 'Shopping',
    },
  ]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || transaction.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Transaction History</h1>
              <p className="text-sm text-muted-foreground">
                View and filter all your transactions
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your transaction search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {dateFrom ? format(dateFrom, 'PP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={clearFilters}
                size="sm"
                className="bg-transparent"
              >
                Clear Filters
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                  Showing {filteredTransactions.length} of {transactions.length}{' '}
                  transactions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        transaction.type === 'received'
                          ? 'bg-accent/10'
                          : 'bg-muted'
                      }`}
                    >
                      {transaction.type === 'received' ? (
                        <svg
                          className="w-6 h-6 text-accent"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">
                          {transaction.type === 'received'
                            ? transaction.from
                            : transaction.to}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.id} •{' '}
                        {format(
                          new Date(transaction.date),
                          "MMM dd, yyyy 'at' hh:mm a",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-4">
                    <p
                      className={`font-semibold text-lg mb-1 ${
                        transaction.type === 'received'
                          ? 'text-accent'
                          : 'text-foreground'
                      }`}
                    >
                      {transaction.type === 'received' ? '+' : '-'}$
                      {transaction.amount.toFixed(2)}
                    </p>
                    <Badge
                      variant={
                        transaction.status === 'completed'
                          ? 'default'
                          : transaction.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No transactions found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
