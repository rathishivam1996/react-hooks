// Counter.test.tsx
import "@testing-library/jest-dom"; // Import custom matchers
import { fireEvent, render, screen } from "@testing-library/react";
import Counter from "./counter";

test("counter increments and decrements correctly", () => {
  render(<Counter />);

  // Initial count should be 0
  expect(screen.getByTestId("count")).toHaveTextContent("0");

  // Click the increment button and verify count increases
  fireEvent.click(screen.getByText("Increment"));
  expect(screen.getByTestId("count")).toHaveTextContent("1");

  // Click the decrement button and verify count decreases
  fireEvent.click(screen.getByText("Decrement"));
  expect(screen.getByTestId("count")).toHaveTextContent("0");
});
