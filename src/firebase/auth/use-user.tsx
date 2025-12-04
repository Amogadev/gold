'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '@/firebase';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, []);

  return { user, loading };
}
