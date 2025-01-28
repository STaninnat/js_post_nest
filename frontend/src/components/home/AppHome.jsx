import { useState } from "react";

import AppHeader from "../templates/AppHeader";
import AppLayout from "../templates/AppLayout";
import ApiFunctions from "../ApiFunctions";

import "./AppHome.css";

function AppHome() {
  const [postContent, setPostContent] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handlePost = async () => {
    if (!postContent.trim()) {
      setMessage("post content cannot be empty");
      return;
    }

    try {
      const response = await ApiFunctions.handleCreatePost(postContent);
      if (response.ok) {
        setMessage("Post created successfully");
        setMessageType("success");
        setPostContent("");
        setTimeout(() => {
          setMessage("");
        }, 1000);
      } else {
        setMessage("failed to create post");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage("An error occurred");
      setMessageType("error");
    }
  };

  const handleTextareaFocus = () => {
    if (message && message !== "Post created successfully") {
      setMessage("");
    }
  };

  return (
    <div className="app-home">
      <AppHeader />
      <AppLayout>
        <div className="home-post-container">
          <textarea
            className="home-post-textarea"
            placeholder="What is happening?..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onFocus={handleTextareaFocus}
          />

          <button
            className="home-post-btn"
            data-testid="home-post-btn"
            onClick={handlePost}
            disabled={postContent.trim() === ""}
          >
            Post
          </button>

          {message && (
            <p
              className={`home-message ${messageType}`}
              data-testid="home-message"
            >
              {message}
            </p>
          )}

          <hr className="home-seperator" />
        </div>
      </AppLayout>
    </div>
  );
}

export default AppHome;
