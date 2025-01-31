import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";

import PostLists from "../components/home/PostLists";
// import Popup from "../templates/Popup";
// import CommentLists from "../components/home/CommentLists";

vi.mock("../templates/Popup", () => ({
  __esModule: true,
  default: ({ isVisible, onClose, children }) =>
    isVisible ? (
      <div>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("../components/home/CommentLists", () => ({
  __esModule: true,
  default: ({ comments }) => (
    <div>
      {comments.length === 0
        ? "No comments"
        : comments.map((comment) => <div key={comment.id}>{comment.text}</div>)}
    </div>
  ),
}));

describe("PostLists Component", () => {
  const mockRefreshComments = vi.fn();

  const posts = [
    {
      id: "post1",
      username: "user1",
      post: "Test Post 1",
      updated_at: "2025-01-31T12:00:00Z",
    },
  ];

  const comments = {
    post1: [
      { id: "comment1", comment: "Test Comment 1" },
      { id: "comment2", comment: "Test Comment 2" },
    ],
  };

  it("should display posts and comments count", async () => {
    render(
      <PostLists
        posts={posts}
        comments={comments}
        refreshComments={mockRefreshComments}
      />
    );

    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.getByText("2 comments")).toBeInTheDocument();
  });

  it("should open and close the popup when clicking on comments", async () => {
    render(
      <PostLists
        posts={posts}
        comments={comments}
        refreshComments={mockRefreshComments}
      />
    );

    const commentsLink = screen.getByText("2 comments");
    fireEvent.click(commentsLink);

    await waitFor(() => {
      expect(screen.getByRole("popup-dialog")).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("popup-close-btn");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("popup-dialog")).not.toBeInTheDocument();
    });
  });

  it("should display a message when no posts are available", async () => {
    render(
      <PostLists
        posts={[]}
        comments={{}}
        refreshComments={mockRefreshComments}
      />
    );

    expect(screen.getByText("No posts available")).toBeInTheDocument();
  });
});
