import { describe, it, expect, vi } from "vitest";

import FetchWithAlert from "../components/FetchWithAlert";

globalThis.fetch = vi.fn();

describe("FetchWithAlert", () => {
  let navigate;

  beforeEach(() => {
    fetch.mockClear();
    navigate = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return response when fetch is successful", async () => {
    const mockResponse = { ok: true, json: () => ({ data: "test" }) };
    fetch.mockResolvedValueOnce(mockResponse);

    const response = await FetchWithAlert("https://api.example.com", {});
    expect(response).toEqual(mockResponse);
  });

  it("should throw an error when fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("fetch error"));

    await expect(FetchWithAlert("https://api.example.com", {})).rejects.toThrow(
      "fetch error"
    );
  });

  it("should handle 401 status and refresh session", async () => {
    const mockResponse = { ok: true, json: () => ({ data: "test" }) };
    const refreshResponse = { ok: true };

    fetch.mockResolvedValueOnce({ status: 401, ok: false });
    fetch.mockResolvedValueOnce(refreshResponse);
    fetch.mockResolvedValueOnce(mockResponse);

    const response = await FetchWithAlert(
      "https://api.example.com",
      {},
      navigate
    );
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("should navigate to home and throw error when refresh fails", async () => {
    fetch.mockResolvedValueOnce({ status: 401 });
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(
      FetchWithAlert("https://api.example.com", {}, navigate)
    ).rejects.toThrow("session expired, please log in again");
    expect(navigate).toHaveBeenCalledWith("/");
  });
});
