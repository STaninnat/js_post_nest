import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";

import ApiFunctions from "../components/ApiFunctions";
import AppAuthPage from "../components/auth/AppAuthPage";

vi.mock("../components/ApiFunctions");

describe("AppAuthPage", () => {
  it('should open Create Account popup when the "Create account" button is clicked', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AppAuthPage />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/Create account/i));
    expect(getByText(/Create your account/i)).toBeInTheDocument();
  });

  it('should open Sign In popup when the "Sign in" button is clicked', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <AppAuthPage />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("auth-signin-button"));

    const form = document.querySelector(".form-container-login");
    expect(form).toBeInTheDocument();
  });

  it("should close the popup when the close button is clicked", () => {
    const { getByText, getByRole, getByLabelText } = render(
      <MemoryRouter>
        <AppAuthPage />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/Create account/i));
    fireEvent.click(getByLabelText(/close/i));

    expect(() => getByRole("popup-close-btn")).toThrow();
  });

  it("should call handleCreateUserSubmit when form is submitted with valid data", () => {
    ApiFunctions.handleCreateUserSubmit.mockResolvedValueOnce({});
    const { getByText, getByLabelText, getByRole } = render(
      <MemoryRouter>
        <AppAuthPage />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/Create account/i));

    fireEvent.change(getByLabelText(/username/i), {
      target: { value: "user123" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(getByLabelText(/I agree to the terms/i));

    const popup = getByRole("popup-dialog");
    const buttonInPopup = within(popup).getByText(/Create account/i);
    fireEvent.click(buttonInPopup);

    expect(ApiFunctions.handleCreateUserSubmit).toHaveBeenCalledWith(
      { username: "user123", password: "password123", gender: "" },
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should call handleLoginSubmit when form is submitted with valid data", () => {
    ApiFunctions.handleLoginSubmit.mockResolvedValueOnce({});
    const { getByText, getByLabelText, getByRole } = render(
      <MemoryRouter>
        <AppAuthPage />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/Sign in/i));

    fireEvent.change(getByLabelText(/username/i), {
      target: { value: "user123" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    const popup = getByRole("popup-dialog");
    const buttonInPopup = within(popup).getByTestId("loginform-signin-button");
    fireEvent.click(buttonInPopup);

    expect(ApiFunctions.handleLoginSubmit).toHaveBeenCalledWith(
      { username: "user123", password: "password123", rememberMe: false },
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });
});
