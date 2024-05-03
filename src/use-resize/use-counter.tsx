// Counter.tsx
import { useState } from "react";

export function useCounter(initialValue = 0): {
  count: number;
  increment: () => void;
  decrement: () => void;
} {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return { count, increment, decrement };
}
