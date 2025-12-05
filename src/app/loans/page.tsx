'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { Button } from '@/components/ui/button';
import { FilePenLine, Trash2 } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { useFirestore } from '@/firebase/provider';
import { collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';

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
  imageHint?: string;
};

function LoanCard({ loan }: { loan: Loan }) {

  const handleDelete = async () => {
    const db = useFirestore();
    if (db) {
      await deleteDoc(doc(db, 'loans', loan.id));
    }
  };

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
            fill
            className="object-cover rounded-md"
            data-ai-hint={loan.imageHint}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Item</p>
            <p className="font-medium">{loan.itemName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gold Weight</p>
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
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/loans/${loan.id}/edit`}>
            <FilePenLine className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the loan
                for {loan.customerName}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

export default function ActiveLoansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const db = useFirestore();

  const loansQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'loans'), orderBy('loanStartDate', 'desc'));
  }, [db]);
  
  const { data: loans, loading } = useCollection(loansQuery);

  const filteredLoans = (loans as Loan[])
    ?.filter((loan) => {
      if (!loan.customerName || !loan.mobileNumber) return false;
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
    <>
      <SiteHeader />
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
    </>
  );
}
