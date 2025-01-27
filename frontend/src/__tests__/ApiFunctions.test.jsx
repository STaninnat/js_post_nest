import { describe, it, expect, vi, beforeEach } from "vitest";

import ApiFunctions from "../components/ApiFunctions";
import FetchWithAlert from "../components/FetchWithAlert";

vi.mock("../components/FetchWithAlert");

describe("ApiFunctions", () => {
  let setMessage, setPopupType;

  beforeEach(() => {
    setMessage = vi.fn();
    setPopupType = vi.fn();
    vi.useFakeTimers();
  });

  describe("handleCreateUserSubmit", () => {
    it("should handle user creation successfully", async () => {
      const userData = { username: "test", password: "password" };
      const mockResponse = {
        ok: true,
        json: () => ({ message: "User created successfully!" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await ApiFunctions.handleCreateUserSubmit(
        userData,
        setMessage,
        setPopupType
      );

      expect(setMessage).toHaveBeenCalledWith("User created successfully!");
      expect(setPopupType).toHaveBeenCalledWith({
        type: "createUser",
        error: null,
      });

      vi.runAllTimers();
      expect(setPopupType).toHaveBeenCalledWith({ type: null, error: null });
      expect(setMessage).toHaveBeenCalledWith("");
    });

    it("should handle error when user creation fails", async () => {
      const userData = { username: "test", password: "password" };
      const mockResponse = {
        ok: false,
        json: () => ({ error: "user already exists" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await ApiFunctions.handleCreateUserSubmit(
        userData,
        setMessage,
        setPopupType
      );

      expect(setPopupType).toHaveBeenCalledWith({
        type: "createUser",
        error: "user already exists",
      });
    });
  });

  describe("handleLoginSubmit", () => {
    it("should handle login successfully", async () => {
      const userData = { username: "test", password: "password" };
      const mockResponse = {
        ok: true,
        json: () => ({ message: "Logged in successfully!" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await ApiFunctions.handleLoginSubmit(userData, setMessage, setPopupType);

      expect(setMessage).toHaveBeenCalledWith("Logged in successfully!");
      expect(setPopupType).toHaveBeenCalledWith({
        type: "login",
        error: null,
      });
    });

    it("should handle error when login fails", async () => {
      const userData = { username: "test", password: "password" };
      const mockResponse = {
        ok: false,
        json: () => ({ error: "invalid credentials" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await ApiFunctions.handleLoginSubmit(userData, setMessage, setPopupType);

      expect(setPopupType).toHaveBeenCalledWith({
        type: "login",
        error: "invalid credentials",
      });
    });
  });
});
