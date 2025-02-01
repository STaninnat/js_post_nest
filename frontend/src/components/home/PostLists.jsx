import dayjs from "dayjs";
import { useState } from "react";
import PropTypes from "prop-types";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";

import "./PostLists.css";
import Popup from "../templates/Popup";
import CommentLists from "./CommentLists";
import ApiFunctions from "../ApiFunctions";
import ConfirmationPopup from "../templates/ConfirmationPopup";

function PostLists(props) {
  const { posts, comments, refreshComments, refreshPosts } = props;

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [openPopupPostId, setOpenPopupPostId] = useState(null);
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  const handleOpenPopup = (postID) => {
    setOpenPopupPostId(postID);
  };

  const handleClosePopup = () => {
    setOpenPopupPostId(null);
  };

  const handleSettingsClick = (postID) => {
    setSelectedPostId(postID);
    setSettingsMenuVisible(!settingsMenuVisible);
  };

  const handleEditClick = (post) => {
    setIsEditing(true);
    setSelectedPostId(post.id);
    setEditedContent(post.post);
    setSettingsMenuVisible(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedPostId(null);
    setEditedContent(editedContent);
  };

  const handleEditPost = async (postID, newPostContent) => {
    try {
      const response = await ApiFunctions.handleEditPost(
        postID,
        {
          post: newPostContent,
        },
        navigate
      );
      if (response.ok) {
        setSettingsMenuVisible(false);
        setIsEditing(false);
        setSelectedPostId(null);
        refreshPosts();
      } else {
        alert("failed to edit post");
      }
    } catch (error) {
      console.error("error editing post:", error);
    }
  };

  const handleDeleteClick = (postID) => {
    setSelectedPostId(postID);
    setSettingsMenuVisible(false);
    setIsDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    ApiFunctions.handleDeletePost(selectedPostId, navigate)
      .then((response) => {
        if (response.ok) {
          refreshPosts();
          setIsDeleteConfirmVisible(false);
        } else {
          alert("failed to delete post");
        }
      })
      .catch((error) => {
        console.error("error deleting post:", error);
        setIsDeleteConfirmVisible(false);
      });
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmVisible(false);
  };

  return (
    <div className="home-post-list">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="home-post-item">
            <div className="home-post-user">
              <span className="home-post-username">{post.username}</span>

              <span className="home-post-meta">
                {dayjs(post.updated_at).format("D MMM YYYY - H:mm")}
              </span>
            </div>

            <div className="home-post-settings">
              <i
                className="ri-settings-5-fill home-post-settings-icon"
                onClick={() => handleSettingsClick(post.id)}
              ></i>

              {settingsMenuVisible && selectedPostId === post.id && (
                <div className="settings-menu">
                  <span onClick={() => handleEditClick(post)}>Edit</span>
                  <span onClick={() => handleDeleteClick(post.id)}>Delete</span>
                </div>
              )}
            </div>

            {selectedPostId === post.id && isEditing ? (
              <div className="home-post-edit">
                <textarea
                  className="home-post-textarea"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <div className="home-post-edit-buttons">
                  <button
                    className="save-btn"
                    onClick={() => handleEditPost(post.id, editedContent)}
                    disabled={!editedContent.trim()}
                  >
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="home-post-content">{post.post}</p>
            )}

            <span
              className="home-post-comments"
              onClick={() => handleOpenPopup(post.id)}
            >
              {`${comments[post.id] ? comments[post.id].length : 0} comments`}
            </span>

            <Popup
              isVisible={openPopupPostId === post.id}
              onClose={handleClosePopup}
            >
              <CommentLists
                postID={post.id}
                comments={comments[post.id] || []}
                refreshComments={refreshComments}
              />
            </Popup>
          </div>
        ))
      ) : (
        <p className="home-error-message">No posts available</p>
      )}

      <ConfirmationPopup
        isVisible={isDeleteConfirmVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

PostLists.propTypes = {
  posts: PropTypes.array.isRequired,
  comments: PropTypes.object.isRequired,
  refreshComments: PropTypes.func.isRequired,
  refreshPosts: PropTypes.func,
};

export default PostLists;
