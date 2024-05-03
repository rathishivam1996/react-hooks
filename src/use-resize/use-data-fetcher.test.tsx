import { renderHook, waitFor } from "@testing-library/react";
import useDataFetcher from "./use-data-fetcher";

describe("useDataFetcher", () => {
  it("should init with loading", async () => {
    const { result } = renderHook(() =>
      useDataFetcher("www://api.example.com"),
    );

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(true);
  });

  it("should fetch data and update state", async () => {
    const mockData = { id: 1, name: "jhon" };
    global.fetch = jest
      .fn()
      .mockReturnValue({ json: () => Promise.resolve(mockData) });

    const { result } = renderHook(() =>
      useDataFetcher("www://api.example.com"),
    );

    waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toEqual(mockData);
    });
  });
});
