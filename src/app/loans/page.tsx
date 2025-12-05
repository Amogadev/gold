
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from '@/components/ui/button';
import { FilePenLine } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';

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

export const mockLoans: Loan[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    mobileNumber: '123-456-7890',
    itemName: 'Gold Bangle',
    itemWeight: 25.5,
    loanAmount: 1500,
    interestPercentage: 8.5,
    loanStartDate: '2023-05-10',
    loanDueDate: '2024-05-10',
    imageUrl: 'https://images.unsplash.com/photo-1606293926249-ed22e446d476?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNnx8Z29sZCUyMGJhbmdsZXxlbnwwfHx8fDE3NjQ5MTk0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'Active',
    paidAmount: 500,
    pendingBalance: 1000,
    imageHint: 'gold bangle'
  },
  {
    id: '2',
    customerName: 'Bob Williams',
    mobileNumber: '234-567-8901',
    itemName: 'Gold Bangle',
    itemWeight: 5.2,
    loanAmount: 2200,
    interestPercentage: 9.0,
    loanStartDate: '2023-08-20',
    loanDueDate: '2024-08-20',
    imageUrl: 'https://images.unsplash.com/photo-1664506061150-ffc206b8bfd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxnb2xkJTIwYmFuZ2xlfGVufDB8fHx8MTc2NDkxOTQzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'Active',
    paidAmount: 1000,
    pendingBalance: 1200,
    imageHint: 'gold bangle'
  },
  {
    id: '3',
    customerName: 'Charlie Brown',
    mobileNumber: '345-678-9012',
    itemName: 'Gold Chain',
    itemWeight: 50.0,
    loanAmount: 3000,
    interestPercentage: 8.0,
    loanStartDate: '2022-11-01',
    loanDueDate: '2023-11-01',
    imageUrl: 'https://images.unsplash.com/photo-1659708701940-e60893ef03d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxnb2xkJTIwY2hhaW58ZW58MHx8fHwxNzY0OTE5Mzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'Closed',
    paidAmount: 3000,
    pendingBalance: 0,
    imageHint: 'gold chain'
  },
];


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
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/loans/${loan.id}/edit`}>
            <FilePenLine className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ActiveLoansPage() {
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // This effect runs only once on the client when the component mounts.
    try {
      const newLoanJson = sessionStorage.getItem('newLoan');
      if (newLoanJson) {
        const newLoan = JSON.parse(newLoanJson) as Loan;
        // Prepend the new loan to the existing list of loans
        setLoans(prevLoans => [newLoan, ...prevLoans]);
        // Clear the item from sessionStorage to prevent re-adding on refresh
        sessionStorage.removeItem('newLoan');
      }
    } catch (error) {
      console.error("Could not parse new loan from sessionStorage", error);
    }
    setLoading(false);
  }, []);

  const filteredLoans = loans
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
