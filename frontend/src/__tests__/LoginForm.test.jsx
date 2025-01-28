import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";

import LoginForm from "../components/Auth/LoginForm";

describe("LoginForm", () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    formClass: "",
    message: "",
    error: "",
    setPopupType: vi.fn(),
    popupType: {},
  };

  it("should disable the submit button if username or password is not filled", () => {
    const { getByRole } = render(<LoginForm {...defaultProps} />);
    const submitButton = getByRole("button", { name: /Sign In/i });

    expect(submitButton).toBeDisabled();
  });

  it("should update rememberMe when checkbox is toggled", () => {
    const { getByLabelText } = render(<LoginForm {...defaultProps} />);
    const rememberMeCheckbox = getByLabelText(/Remember me?/i);

    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox.checked).toBe(true);
  });

  it("should call onSubmit with correct form data when the form is submitted", () => {
    const onSubmitMock = vi.fn();
    const props = { ...defaultProps, onSubmit: onSubmitMock };
    const { getByTestId, getByLabelText } = render(<LoginForm {...props} />);

    fireEvent.change(getByLabelText(/username/i), {
      target: { value: "user123" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(getByTestId("login-form"));

    expect(onSubmitMock).toHaveBeenCalledWith({
      username: "user123",
      password: "password123",
      rememberMe: false,
    });
  });

  it("should display error message when externalError is passed", () => {
    const { getByText } = render(
      <LoginForm {...defaultProps} error={"username not found"} />
    );

    expect(getByText(/username not found/i)).toBeInTheDocument();
  });

  it("should display success message when message is passed", () => {
    const { getByText } = render(
      <LoginForm {...defaultProps} message={"Login successful!"} />
    );

    expect(getByText(/Login successful!/i)).toBeInTheDocument();
  });
});
