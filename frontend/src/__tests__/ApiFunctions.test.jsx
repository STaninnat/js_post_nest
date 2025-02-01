import { describe, it, expect, vi, beforeEach } from "vitest";

import ApiFunctions from "../components/ApiFunctions";
import FetchWithAlert from "../components/FetchWithAlert";

vi.mock("../components/FetchWithAlert");

describe("ApiFunctions", () => {
  let setMessage, setPopupType, setRememberMe, navigate;

  beforeEach(() => {
    setMessage = vi.fn();
    setPopupType = vi.fn();
    navigate = vi.fn();
    setRememberMe = vi.fn();
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => {});
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
        setPopupType,
        navigate
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

      await ApiFunctions.handleLoginSubmit(
        userData,
        setMessage,
        setPopupType,
        setRememberMe,
        navigate
      );

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

  describe("handleGetUser", () => {
    it("should handle get user info successfully", async () => {
      const mockResponse = { ok: true, json: () => ({ user: "testUser" }) };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      const result = await ApiFunctions.handleGetUser(navigate);

      expect(result).toEqual(mockResponse);
    });

    it("should handle error when getting user info fails", async () => {
      const mockResponse = {
        ok: false,
        json: () => ({ error: "Unauthorized" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await expect(ApiFunctions.handleGetUser(navigate)).rejects.toThrow(
        "Unauthorized"
      );
    });
  });

  describe("handleSignout", () => {
    it("should handle signout successfully", async () => {
      const mockResponse = { ok: true };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await ApiFunctions.handleSignout(navigate);

      expect(FetchWithAlert).toHaveBeenCalledWith(
        "/v1/user/auth/signout",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
        navigate
      );
    });

    it("should handle signout failure", async () => {
      const mockResponse = { ok: false };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await expect(ApiFunctions.handleSignout(navigate)).rejects.toThrow(
        "logout failed"
      );
    });
  });

  describe("handleCreatePost", () => {
    it("should handle post creation successfully", async () => {
      const postContent = "This is a new post!";
      const mockResponse = {
        ok: true,
        json: () => ({ message: "Post created successfully!" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await ApiFunctions.handleCreatePost(postContent, navigate);

      expect(FetchWithAlert).toHaveBeenCalledWith(
        "/v1/user/auth/posts",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ post: postContent }),
        }),
        navigate
      );
    });

    it("should handle error when post creation fails", async () => {
      const postContent = "This is a new post!";
      const mockResponse = {
        ok: false,
        json: () => ({ error: "failed to create post" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await expect(
        ApiFunctions.handleCreatePost(postContent, navigate)
      ).rejects.toThrow("failed to create post");
    });
  });

  describe("handleGetPosts", () => {
    it("should handle getting posts successfully", async () => {
      const mockResponse = { ok: true, json: () => ({ posts: [] }) };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      const result = await ApiFunctions.handleGetPosts(navigate);

      expect(result).toEqual(mockResponse);
      expect(FetchWithAlert).toHaveBeenCalledWith(
        "/v1/user/auth/allposts",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
        }),
        navigate
      );
    });

    it("should handle error when getting posts fails", async () => {
      const mockResponse = { ok: false, json: () => ({ error: "error" }) };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await expect(ApiFunctions.handleGetPosts(navigate)).rejects.toThrow(
        "error"
      );
    });
  });

  describe("handleGetPostsForUser", () => {
    it("should handle getting user posts successfully", async () => {
      const mockResponse = { ok: true, json: () => ({ posts: [] }) };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      const result = await ApiFunctions.handleGetPostsForUser(navigate);

      expect(result).toEqual(mockResponse);
      expect(FetchWithAlert).toHaveBeenCalledWith(
        "/v1/user/auth/userposts",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
        }),
        navigate
      );
    });

    it("should handle error when getting user posts fails", async () => {
      const mockResponse = { ok: false, json: () => ({ error: "error" }) };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await expect(
        ApiFunctions.handleGetPostsForUser(navigate)
      ).rejects.toThrow("error");
    });
  });

  describe("handleEditPost", () => {
    it("should handle post edit successfully", async () => {
      const postID = "123";
      const newPostContent = "Updated post content!";
      const mockResponse = {
        ok: true,
        json: () => ({ message: "Post updated successfully!" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await ApiFunctions.handleEditPost(postID, newPostContent, navigate);

      expect(FetchWithAlert).toHaveBeenCalledWith(
        `/v1/user/auth/editposts?postID=${postID}`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(newPostContent),
        }),
        navigate
      );
    });

    it("should handle error when post edit fails", async () => {
      const postID = "123";
      const newPostContent = "Updated post content!";
      const mockResponse = {
        ok: false,
        json: () => ({ error: "failed to edit post" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await expect(
        ApiFunctions.handleEditPost(postID, newPostContent, navigate)
      ).rejects.toThrow("failed to edit post");
    });
  });

  describe("handleDeletePost", () => {
    it("should handle post delete successfully", async () => {
      const postID = "123";
      const mockResponse = {
        ok: true,
        json: () => ({ message: "Post deleted successfully!" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await ApiFunctions.handleDeletePost(postID, navigate);

      expect(FetchWithAlert).toHaveBeenCalledWith(
        `/v1/user/auth/deleteposts?postID=${postID}`,
        expect.objectContaining({
          method: "DELETE",
        }),
        navigate
      );
    });

    it("should handle error when post delete fails", async () => {
      const postID = "123";
      const mockResponse = {
        ok: false,
        json: () => ({ error: "failed to delete post" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await expect(
        ApiFunctions.handleDeletePost(postID, navigate)
      ).rejects.toThrow("failed to delete post");
    });
  });

  describe("handleCreateComments", () => {
    it("should handle comment creation successfully", async () => {
      const postID = 123;
      const comment = "This is a comment!";
      const mockResponse = {
        ok: true,
        json: () => ({ message: "Comment created successfully!" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await ApiFunctions.handleCreateComments(postID, comment, navigate);

      expect(FetchWithAlert).toHaveBeenCalledWith(
        "/v1/user/auth/comments",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ postID, comment }),
          credentials: "include",
        }),
        navigate
      );
    });

    it("should handle error when comment creation fails", async () => {
      const postID = 123;
      const comment = "This is a comment!";
      const mockResponse = {
        ok: false,
        json: () => ({ error: "failed to create comment" }),
      };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await expect(
        ApiFunctions.handleCreateComments(postID, comment, navigate)
      ).rejects.toThrow("failed to create comment");
    });
  });

  describe("handleGetCommentsForPost", () => {
    it("should handle getting comments for a post successfully", async () => {
      const postID = 123;
      const mockResponse = { ok: true, json: () => ({ comments: [] }) };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      const result = await ApiFunctions.handleGetCommentsForPost(
        postID,
        navigate
      );

      expect(result).toEqual(mockResponse);
      expect(FetchWithAlert).toHaveBeenCalledWith(
        "/v1/user/auth/comments?postID=123",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
        }),
        navigate
      );
    });

    it("should handle error when getting comments fails", async () => {
      const postID = 123;
      const mockResponse = { ok: false, json: () => ({ error: "error" }) };
      FetchWithAlert.mockResolvedValueOnce(mockResponse);

      await expect(
        ApiFunctions.handleGetCommentsForPost(postID, navigate)
      ).rejects.toThrow("error");
    });
  });
});
