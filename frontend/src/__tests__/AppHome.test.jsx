import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";

import AppHome from "../components/home/AppHome";
import ApiFunctions from "../components/ApiFunctions";

vi.mock("../components/ApiFunctions");

describe("AppHome Component", () => {
  beforeEach(() => {
    ApiFunctions.handleGetPosts.mockResolvedValue({
      ok: true,
      json: () => ({ posts: [{ id: "post1", post: "Test Post" }] }),
    });
    ApiFunctions.handleGetCommentsForPost.mockResolvedValue({
      ok: true,
      json: () => ({ comments: [] }),
    });
    ApiFunctions.handleCreatePost.mockResolvedValue({ ok: true });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should fetch and display posts", async () => {
    render(
      <MemoryRouter>
        <AppHome />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Post")).toBeInTheDocument();
    });
  });

  it("should show a success message when a post is created", async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <AppHome />
      </MemoryRouter>
    );

    fireEvent.change(getByTestId("home-post-textarea"), {
      target: { value: "New Post" },
    });

    fireEvent.click(getByTestId("home-post-btn"));

    await waitFor(() => getByText("Post created successfully"));

    expect(getByText("Post created successfully")).toBeInTheDocument();
  });

  it("should clear message when textarea is focused", async () => {
    const { getByTestId, queryByTestId } = render(
      <MemoryRouter>
        <AppHome />
      </MemoryRouter>
    );

    fireEvent.change(getByTestId("home-post-textarea"), {
      target: { value: "Some content" },
    });

    fireEvent.click(getByTestId("home-post-btn"));

    await waitFor(() =>
      expect(queryByTestId("home-message")).toHaveTextContent(
        "Post created successfully"
      )
    );

    fireEvent.focus(getByTestId("home-post-textarea"));

    await waitFor(() => {
      expect(queryByTestId("home-message")).toBeNull();
    });
  });
});
