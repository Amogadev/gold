
'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

// Mock user for demo purposes since Firebase is removed.
const mockUser = {
  uid: 'mock-user-id',
  email: 'demo@example.com',
  displayName: 'Demo User',
  photoURL: '',
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching a user
    setTimeout(() => {
      setUser(mockUser as User);
      setLoading(false);
    }, 500);
  }, []);

  return { user, loading };
}
