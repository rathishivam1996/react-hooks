// Counter.tsx
import { useState } from "react";

const Counter = (): JSX.Element => {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <p data-testid="count">{count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
