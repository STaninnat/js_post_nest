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
      setPopupType({ type: null, error: null });
      setMessage("");
      navigate("/home");
    }, 1500);
  } catch (error) {
    setMessage("");
    setPopupType({
      type: "createUser",
      error: error.message || "Unknown error",
    });
  }
}

async function handleLoginSubmit(userData, setMessage, setPopupType, navigate) {
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
      setPopupType({ type: null, error: null });
      setMessage("");
      navigate("/home");
    }, 1500);
  } catch (error) {
    setMessage("");
    setPopupType({
      type: "login",
      error: error.message || "Unknown error",
    });
  }
}

async function handleCreatePost(postContent) {
  try {
    const url = "/v1/user/auth/posts";
    const response = await FetchWithAlert(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ post: postContent }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Unexpected error.");
    }

    return response;
  } catch (error) {
    console.error("Error in createPost:", error);
    throw error;
  }
}

export default { handleCreateUserSubmit, handleLoginSubmit, handleCreatePost };
