
'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, BookOpen, HandCoins, PiggyBank } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Loan } from '@/app/loans/page';

export default function DashboardPage() {
  const db = useFirestore();

  const activeLoansQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'loans'), where('status', '==', 'Active'));
  }, [db]);

  const { data: activeLoans, loading } = useCollection(activeLoansQuery);

  const dashboardStats = useMemo(() => {
    if (!activeLoans) {
      return {
        totalActiveLoans: 0,
        totalGoldPledged: 0,
        totalLoanAmount: 0,
      };
    }
    const loans = activeLoans as Loan[];
    const totalGoldPledged = loans.reduce(
      (acc, loan) => acc + (loan.itemWeight || 0),
      0
    );
    const totalLoanAmount = loans.reduce(
      (acc, loan) => acc + (loan.loanAmount || 0),
      0
    );

    return {
      totalActiveLoans: loans.length,
      totalGoldPledged: totalGoldPledged,
      totalLoanAmount: totalLoanAmount,
    };
  }, [activeLoans]);

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Welcome to your Gold Loan Management dashboard.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Active Loans
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : dashboardStats.totalActiveLoans}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active loan agreements
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Gold Pledged
              </CardTitle>
              <HandCoins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : `${dashboardStats.totalGoldPledged.toFixed(2)}g`}
              </div>
              <p className="text-xs text-muted-foreground">
                from active loans
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Loan Amount
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading
                  ? '...'
                  : `$${dashboardStats.totalLoanAmount.toLocaleString()}`}
              </div>
              <p className="text-xs text-muted-foreground">
                from active loans
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/loans/new">
              <FilePlus className="mr-2 h-5 w-5" /> Create New Loan
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/loans">
              <BookOpen className="mr-2 h-5 w-5" /> View Active Loans
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
