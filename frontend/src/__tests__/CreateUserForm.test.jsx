import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";

import CreateUserForm from "../components/CreateUserForm";

describe("CreateUserForm", () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    formClass: "",
    message: "",
    error: "",
    setPopupType: vi.fn(),
    popupType: {},
  };

  it("should disable the submit button if required fields are not filled", () => {
    const { getByRole } = render(<CreateUserForm {...defaultProps} />);
    const submitButton = getByRole("button", { name: /Create account/i });

    expect(submitButton).toBeDisabled();
  });

  it("should update gender when a valid option is selected", () => {
    const { getByRole } = render(<CreateUserForm {...defaultProps} />);
    const genderSelect = getByRole("combobox");

    fireEvent.change(genderSelect, { target: { value: "male" } });
    expect(genderSelect.value).toBe("male");
  });

  it("should call onSubmit with form data when the form is submitted", () => {
    const onSubmitMock = vi.fn();
    const props = { ...defaultProps, onSubmit: onSubmitMock };
    const { getByTestId, getByRole, getByLabelText } = render(
      <CreateUserForm {...props} />
    );

    fireEvent.change(getByLabelText(/username/i), {
      target: { value: "user123" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(getByRole("checkbox"));

    fireEvent.submit(getByTestId("create-user-form"));

    expect(onSubmitMock).toHaveBeenCalledWith({
      username: "user123",
      password: "password123",
      gender: "",
    });
  });

  it("should display error message when externalError is passed", async () => {
    const { getByText } = render(
      <CreateUserForm {...defaultProps} error={"invalid username format"} />
    );

    expect(getByText(/invalid username format/i)).toBeInTheDocument();
  });

  it("should display success message when message is passed", () => {
    const { getByText } = render(
      <CreateUserForm
        {...defaultProps}
        message={"User created successfully!"}
      />
    );

    expect(getByText(/User created successfully!/i)).toBeInTheDocument();
  });
});
