import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";

import Popup from "../components/Popup";

describe("Popup Component", () => {
  it("should render correctly when visible", () => {
    const onClose = vi.fn();

    const { getByText } = render(
      <Popup isVisible={true} onClose={onClose} title="Test Popup">
        <div>Content inside popup</div>
      </Popup>
    );

    expect(getByText("Test Popup")).toBeInTheDocument();
    expect(getByText("Content inside popup")).toBeInTheDocument();
  });

  it("should not render when not visible", () => {
    const { container } = render(
      <Popup isVisible={false} onClose={() => {}} title="Test Popup">
        <div>Content inside popup</div>
      </Popup>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn();

    const { getByRole } = render(
      <Popup isVisible={true} onClose={onClose} title="Test Popup">
        <div>Content inside popup</div>
      </Popup>
    );

    fireEvent.click(getByRole("popup-close-btn"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when background is clicked", () => {
    const onClose = vi.fn();

    const { container } = render(
      <Popup isVisible={true} onClose={onClose} title="Test Popup">
        <div>Content inside popup</div>
      </Popup>
    );

    fireEvent.click(container.querySelector(".popup-bg"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
