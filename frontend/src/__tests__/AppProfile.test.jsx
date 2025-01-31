import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ApiFunctions from "../components/ApiFunctions";
import AppProfile from "../components/home/AppProfile";

vi.mock("../components/ApiFunctions");

describe("AppProfile Component", () => {
  beforeEach(() => {
    ApiFunctions.handleGetUser.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ userInfo: { username: "JohnDoe" } }),
    });
    ApiFunctions.handleGetPostsForUser.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        posts: [{ id: "post1", post: "Post 1" }],
      }),
    });
    ApiFunctions.handleGetCommentsForPost.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ comments: [] }),
    });
  });

  it("should display the username when user info is fetched successfully", async () => {
    render(
      <MemoryRouter>
        {" "}
        <AppProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("JohnDoe")).toBeInTheDocument();
    });
  });

  it("should display posts after fetching user posts", async () => {
    render(
      <MemoryRouter>
        {" "}
        <AppProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Post 1")).toBeInTheDocument();
    });
  });

  it("should handle errors when fetching posts", async () => {
    ApiFunctions.handleGetPostsForUser.mockResolvedValueOnce({
      ok: false,
    });

    render(
      <MemoryRouter>
        {" "}
        <AppProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No posts available")).toBeInTheDocument();
    });
  });
});
