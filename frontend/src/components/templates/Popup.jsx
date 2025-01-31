import PropTypes from "prop-types";
import "remixicon/fonts/remixicon.css";

import "./Popup.css";

function Popup(props) {
  const { isVisible, onClose, children } = props;
  if (!isVisible) return null;

  return (
    <div className="popup">
      <div className="popup-bg" onClick={onClose} />
      <div className="popup-content" role={"popup-dialog"}>
        <i
          className="ri-close-circle-fill close-icon"
          onClick={onClose}
          role="popup-close-btn"
          aria-label="Close"
        ></i>
        {children}
      </div>
    </div>
  );
}

Popup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Popup;
