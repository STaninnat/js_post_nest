import dayjs from "dayjs";
import { useState } from "react";
import PropTypes from "prop-types";

import "./PostLists.css";
import Popup from "../templates/Popup";
import CommentLists from "./CommentLists";

function PostLists(props) {
  const { posts, comments, refreshComments } = props;

  const [openPopupPostId, setOpenPopupPostId] = useState(null);

  const handleOpenPopup = (postId) => {
    setOpenPopupPostId(postId);
  };

  const handleClosePopup = () => {
    setOpenPopupPostId(null);
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

            <p className="home-post-content">{post.post}</p>

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
    </div>
  );
}

PostLists.propTypes = {
  posts: PropTypes.array.isRequired,
  comments: PropTypes.object.isRequired,
  refreshComments: PropTypes.func.isRequired,
};

export default PostLists;
