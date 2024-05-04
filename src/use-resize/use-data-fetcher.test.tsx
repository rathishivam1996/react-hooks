import { act, renderHook, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import useDataFetcher from "./use-data-fetcher";

describe("useDataFetcher", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should start with initial states", () => {
    const { result } = renderHook(() => useDataFetcher("/api/data"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should handle loading state and data state", async () => {
    const mockData = { data: "12345" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    await act(async () => {
      const { result } = renderHook(() => useDataFetcher("/api/data"));
      await waitFor(() => result.current.loading === false);

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });
  });

  it("should handle error state", async () => {
    const mockError = new Error("API error");
    fetchMock.mockReject(mockError);

    await act(async () => {
      await waitFor(() => result.current.error !== null);

      const { result } = renderHook(() => useDataFetcher("/api/data"));

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(mockError);
    });
  });

  it("should not update state if unmounted (cleanup)", async () => {
    const mockData = { data: "12345" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const { result, unmount } = renderHook(() => useDataFetcher("/api/data"));

    unmount();

    await act(async () => {
      await waitFor(
        () => result.current.data !== null || result.current.error !== null,
        { timeout: 1000 },
      ).catch(() => {});
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
