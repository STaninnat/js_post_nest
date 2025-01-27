import { describe, it, expect, vi } from "vitest";

import FetchWithAlert from "../components/FetchWithAlert";

globalThis.fetch = vi.fn();

describe("FetchWithAlert", () => {
  beforeEach(() => {
    fetch.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return response when fetch is successful", async () => {
    const mockResponse = { ok: true, json: () => ({ data: "test" }) };
    fetch.mockResolvedValueOnce(mockResponse);

    const response = await FetchWithAlert("https://api.example.com", {});
    expect(response).toEqual(mockResponse);
  });

  it("should throw an error when fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Fetch error"));

    await expect(FetchWithAlert("https://api.example.com", {})).rejects.toThrow(
      "Fetch error"
    );
  });
});
