import dayjs from "dayjs";
import { useState } from "react";
import PropTypes from "prop-types";
import "remixicon/fonts/remixicon.css";

import "./CommentLists.css";
import ApiFunctions from "../ApiFunctions";

function CommentLists(props) {
  const { postID, comments, refreshComments } = props;

  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await ApiFunctions.handleCreateComments(
        postID,
        newComment
      );
      if (response.ok) {
        setNewComment("");
        refreshComments([{ id: postID }]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="popup-comment">
      <h2>Comments</h2>
      <div className="comment-lists">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <p className="comment-username">{comment.username}</p>
                <span className="comment-time">
                  {dayjs(comment.updated_at).format("(D/MMM/YYYY)")}
                </span>
              </div>

              <p className="comment-content">{comment.comment}</p>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet.</p>
        )}
      </div>

      <div className="comment-input-container">
        <textarea
          className="comment-textarea"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <i
          className="ri-send-plane-2-line send-comment-icon"
          onClick={handleAddComment}
          role="comment-send-btn"
          disabled={!newComment.trim()}
        ></i>
      </div>
    </div>
  );
}

CommentLists.propTypes = {
  postID: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  refreshComments: PropTypes.func.isRequired,
};

export default CommentLists;
