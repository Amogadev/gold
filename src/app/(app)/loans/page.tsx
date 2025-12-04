'use client';

import { useState } from 'react';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore } from '@/firebase';

export type Loan = {
  id: string;
  customerName: string;
  mobileNumber: string;
  itemName: string;
  itemWeight: number;
  loanAmount: number;
  interestPercentage: number;
  loanStartDate: string;
  loanDueDate: string;
  imageUrl: string;
  status: 'Active' | 'Closed';
  paidAmount: number;
  pendingBalance: number;
};

function LoanCard({ loan }: { loan: Loan }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{loan.customerName}</CardTitle>
            <CardDescription>{loan.mobileNumber}</CardDescription>
          </div>
          <Badge variant={loan.status === 'Active' ? 'default' : 'secondary'}>
            {loan.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative h-40 w-full">
          <Image
            src={loan.imageUrl || '/placeholder.svg'}
            alt={loan.itemName}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Item</p>
            <p className="font-medium">{loan.itemName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Weight</p>
            <p className="font-medium">{loan.itemWeight}g</p>
          </div>
          <div>
            <p className="text-muted-foreground">Loan Amount</p>
            <p className="font-medium">${loan.loanAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Due Date</p>
            <p className="font-medium">{loan.loanDueDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ActiveLoansPage() {
  const { db: firestore } = useFirestore();
  const { data: loans, loading } = useCollection(
    firestore ? collection(firestore, 'loans') : null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredLoans = (loans as Loan[] | null)
    ?.filter((loan) => {
      const term = searchTerm.toLowerCase();
      return (
        loan.customerName.toLowerCase().includes(term) ||
        loan.mobileNumber.includes(term)
      );
    })
    .filter((loan) => {
      if (filterStatus === 'all') return true;
      return loan.status.toLowerCase() === filterStatus;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Active Loans</h1>
        <p className="mt-1 text-muted-foreground">
          Browse and manage all current loan records.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by name or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={filterStatus}
          onValueChange={setFilterStatus}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p>Loading loans...</p>
      ) : filteredLoans && filteredLoans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium">No loans found</h3>
          <p className="text-muted-foreground mt-2">
            There are no loans matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
