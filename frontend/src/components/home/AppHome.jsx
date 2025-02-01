import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import "./AppHome.css";
import PostLists from "./PostLists";
import ApiFunctions from "../ApiFunctions";
import AppHeader from "../templates/AppHeader";
import AppLayout from "../templates/AppLayout";

function AppHome() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState({});
  const [postContent, setPostContent] = useState("");
  const [messageType, setMessageType] = useState("");

  const getAllComments = useCallback(
    async (posts) => {
      try {
        const allComments = {};
        for (const post of posts) {
          const response = await ApiFunctions.handleGetCommentsForPost(
            post.id,
            navigate
          );
          if (response.ok) {
            const data = await response.json();
            allComments[post.id] = data.comments.sort(
              (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
          }
        }

        setComments(allComments);
      } catch (error) {
        console.error("error fetching comments:", error);
      }
    },
    [navigate]
  );

  const getPosts = useCallback(async () => {
    try {
      const response = await ApiFunctions.handleGetPosts(navigate);
      if (response.ok) {
        const data = await response.json();
        const postsData = data.posts || [];

        setPosts(postsData);
        getAllComments(postsData);
      } else {
        setMessage("failed to get post");
      }
    } catch (error) {
      console.error("error fetching posts: ", error);
      setMessage("an error occurred while loading posts");
    }
  }, [getAllComments, navigate]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handlePost = async () => {
    if (!postContent.trim()) {
      setMessage("post content cannot be empty");
      return;
    }

    try {
      const response = await ApiFunctions.handleCreatePost(
        postContent,
        navigate
      );
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
            data-testid="home-post-textarea"
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

        <PostLists
          posts={posts || []}
          comments={comments || {}}
          refreshComments={getAllComments}
          refreshPosts={getPosts}
        />
      </AppLayout>
    </div>
  );
}

export default AppHome;
