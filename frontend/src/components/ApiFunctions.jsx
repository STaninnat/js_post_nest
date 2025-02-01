import FetchWithAlert from "./FetchWithAlert";

async function handleCreateUserSubmit(
  userData,
  setMessage,
  setPopupType,
  navigate
) {
  try {
    const url = "/v1/user/signup";
    const response = await FetchWithAlert(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Unexpected error.");
    }

    const result = await response.json();

    setMessage(result.message || "User created successfully!");

    setPopupType({
      type: "createUser",
      error: null,
    });

    setTimeout(() => {
      navigate("/home");

      setMessage("");
      setPopupType({ type: null, error: null });
    }, 1500);
  } catch (error) {
    setMessage("");
    setPopupType({
      type: "createUser",
      error: error.message || "Unknown error",
    });
  }
}

async function handleLoginSubmit(
  userData,
  setMessage,
  setPopupType,
  setRememberMe,
  navigate
) {
  try {
    const url = "v1/user/signin";
    const response = await FetchWithAlert(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Unexpected error.");
    }

    const result = await response.json();

    setMessage(result.message || "Logged in successfully!");

    setPopupType({
      type: "login",
      error: null,
    });

    setTimeout(() => {
      navigate("/home");

      setMessage("");
      setRememberMe(false);
      setPopupType({ type: null, error: null });
    }, 1500);
  } catch (error) {
    setMessage("");
    setPopupType({
      type: "login",
      error: error.message || "Unknown error",
    });
  }
}

async function handleGetUser(navigate) {
  try {
    const url = "/v1/user/auth/info";
    const response = await FetchWithAlert(
      url,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      navigate
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "failed to get user info");
    }

    return response;
  } catch (error) {
    console.error("error in get user info:", error);
    throw error;
  }
}

async function handleSignout(navigate) {
  try {
    const url = "/v1/user/auth/signout";
    const response = await FetchWithAlert(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      navigate
    );

    if (!response.ok) {
      throw new Error("logout failed");
    }
  } catch (error) {
    console.error("error in signout:", error);
    throw error;
  }
}

async function handleCreatePost(postContent, navigate) {
  try {
    const url = "/v1/user/auth/posts";
    const response = await FetchWithAlert(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ post: postContent }),
      },
      navigate
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Unexpected error.");
    }

    return response;
  } catch (error) {
    console.error("error in createPost:", error);
    throw error;
  }
}

async function handleGetPosts(navigate) {
  try {
    const url = "/v1/user/auth/allposts";
    const response = await FetchWithAlert(
      url,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      navigate
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "failed to get posts");
    }

    return response;
  } catch (error) {
    console.error("error in getPost: ", error);
    throw error;
  }
}

async function handleGetPostsForUser(navigate) {
  try {
    const url = "/v1/user/auth/userposts";
    const response = await FetchWithAlert(
      url,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      navigate
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "failed to get posts for user");
    }

    return response;
  } catch (error) {
    console.error("error in getPost: ", error);
    throw error;
  }
}

async function handleEditPost(postID, newPostContent, navigate) {
  try {
    const url = `/v1/user/auth/editposts?postID=${postID}`;
    const response = await FetchWithAlert(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newPostContent),
      },
      navigate
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "failed to edit post");
    }

    return response;
  } catch (error) {
    console.error("error in editPost: ", error);
    throw error;
  }
}

async function handleDeletePost(postID, navigate) {
  try {
    const url = `/v1/user/auth/deleteposts?postID=${postID}`;
    const response = await FetchWithAlert(
      url,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      navigate
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "failed to delete post");
    }

    return response;
  } catch (error) {
    console.error("error in editPost: ", error);
    throw error;
  }
}

async function handleCreateComments(postID, comment, navigate) {
  try {
    const url = "/v1/user/auth/comments";
    const response = await FetchWithAlert(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postID, comment }),
      },
      navigate
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Unexpected error.");
    }

    return response;
  } catch (error) {
    console.error("error in createComment: ", error);
    throw error;
  }
}

async function handleGetCommentsForPost(postID, navigate) {
  try {
    const url = `/v1/user/auth/comments?postID=${postID}`;
    const response = await FetchWithAlert(
      url,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
      navigate
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "unexpected error.");
    }

    return response;
  } catch (error) {
    console.error("error in getComment: ", error);
    throw error;
  }
}

export default {
  handleCreateUserSubmit,
  handleLoginSubmit,
  handleGetUser,
  handleSignout,
  handleCreatePost,
  handleGetPosts,
  handleGetPostsForUser,
  handleEditPost,
  handleDeletePost,
  handleCreateComments,
  handleGetCommentsForPost,
};
