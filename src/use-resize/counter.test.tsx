// Counter.test.tsx
import "@testing-library/jest-dom"; // Import custom matchers
import { act, renderHook } from "@testing-library/react";
import { useCounter } from "./use-counter";

test("'initializes counter with default value'", () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);
});

test("increments counter", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});

test("decrements counter", () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.decrement();
  });

  expect(result.current.count).toBe(-1);
});

test("initializes counter with custom initial value", () => {
  const { result } = renderHook(() => useCounter(5));
  expect(result.current.count).toBe(5);
});
