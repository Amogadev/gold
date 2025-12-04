'use client';
import { useState, useEffect } from 'react';
import type {
  Firestore,
  CollectionReference,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

// A custom hook to listen to a collection in Firestore
export const useCollection = (
  query: CollectionReference | Query | null,
  { includeId = true } = {}
) => {
  const [data, setData] = useState<DocumentData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          if (includeId) {
            return {
              ...docData,
              id: doc.id,
            };
          }
          return docData;
        });
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, includeId]);

  return { data, loading, error };
};
