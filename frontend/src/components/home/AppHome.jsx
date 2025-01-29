import { useState, useEffect } from "react";

import AppHeader from "../templates/AppHeader";
import AppLayout from "../templates/AppLayout";
import ApiFunctions from "../ApiFunctions";
import PostLists from "./PostLists";

import "./AppHome.css";

function AppHome() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [postContent, setPostContent] = useState("");
  const [messageType, setMessageType] = useState("");

  const getPosts = async () => {
    try {
      const response = await ApiFunctions.handleGetPosts();
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        setMessage("failed to get post");
      }
    } catch (error) {
      console.error("error fetching posts: ", error);
      setMessage("an error occurred while loading posts");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

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
        getPosts();
        setTimeout(() => {
          setMessage("");
        }, 1000);
      } else {
        setMessage("failed to create post");
        setMessageType("error");
      }
    } catch (error) {
      console.error("error creating post:", error);
      setMessage("an error occurred");
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

          <div className="home-message-container">
            {message && (
              <p
                className={`home-message ${messageType}`}
                data-testid="home-message"
              >
                {message}
              </p>
            )}
          </div>

          <hr className="home-seperator" />
        </div>

        <PostLists posts={posts || []} message={message} />
      </AppLayout>
    </div>
  );
}

export default AppHome;
