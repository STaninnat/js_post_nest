import PropTypes from "prop-types";
import "./PostLists.css";
import dayjs from "dayjs";

function PostLists(props) {
  const { posts, message } = props;

  return (
    <div className="home-post-list">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="home-post-item">
            <div className="home-post-user">
              <span className="home-post-username">{post.username}</span>
            </div>
            <p className="home-post-meta">
              <span>{dayjs(post.created_at).format("D MMM YYYY - H:mm")}</span>
            </p>
            <p className="home-post-content">{post.post}</p>
          </div>
        ))
      ) : (
        <p>{message || "No posts available"}</p>
      )}
    </div>
  );
}

PostLists.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      post: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  message: PropTypes.string,
};

export default PostLists;
