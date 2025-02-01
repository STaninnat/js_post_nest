import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";

import ApiFunctions from "../components/ApiFunctions";
import CommentLists from "../components/home/CommentLists";

vi.mock("../components/ApiFunctions");

describe("CommentLists Component", () => {
  // let navigate;
  const mockRefreshComments = vi.fn();
  const postID = "post1";

  beforeEach(() => {
    ApiFunctions.handleCreateComments.mockResolvedValue({ ok: true });
    vi.spyOn(console, "error").mockImplementation(() => {});
    // navigate = vi.fn();
  });

  it("should display comments when available", () => {
    const comments = [
      {
        id: "comment1",
        username: "user1",
        updated_at: "2025-01-01T10:00:00Z",
        comment: "Test Comment 1",
      },
      {
        id: "comment2",
        username: "user2",
        updated_at: "2025-01-02T12:00:00Z",
        comment: "Test Comment 2",
      },
    ];

    render(
      <MemoryRouter>
        <CommentLists
          postID={postID}
          comments={comments}
          refreshComments={mockRefreshComments}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Comment 1")).toBeInTheDocument();
    expect(screen.getByText("Test Comment 2")).toBeInTheDocument();
  });

  it("should display 'No comments yet' if there are no comments", () => {
    render(
      <MemoryRouter>
        <CommentLists
          postID={postID}
          comments={[]}
          refreshComments={mockRefreshComments}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("No comments yet.")).toBeInTheDocument();
  });

  it("should add a new comment when clicking the send button", async () => {
    const comments = [];

    render(
      <MemoryRouter>
        <CommentLists
          postID={postID}
          comments={comments}
          refreshComments={mockRefreshComments}
        />
      </MemoryRouter>
    );

    const commentInput = screen.getByPlaceholderText("Write a comment...");
    fireEvent.change(commentInput, { target: { value: "New Comment" } });

    const sendButton = screen.getByRole("comment-send-btn");
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(ApiFunctions.handleCreateComments).toHaveBeenCalledWith(
        postID,
        "New Comment",
        expect.any(Function)
      );
      expect(mockRefreshComments).toHaveBeenCalled();
    });
  });
});
