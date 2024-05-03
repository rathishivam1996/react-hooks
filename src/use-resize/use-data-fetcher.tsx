import { useState, useEffect } from "react";

// Define a type for the hook's return value
type UseDataFetcherReturnType<T> = {
  loading: boolean;
  data: T | null;
  error: Error | null;
};

function useDataFetcher<T>(url: string): UseDataFetcherReturnType<T> {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = (await response.json()) as T;

        if (isMounted) {
          setData(result);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError(error as Error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to cancel the request if unmounted
    };
  }, [url]);

  return { loading, data, error };
}

export default useDataFetcher;
