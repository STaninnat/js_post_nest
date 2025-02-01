import PropTypes from "prop-types";

import "./ConfirmationPopup.css";

function ConfirmationPopup(props) {
  const { isVisible, onConfirm, onCancel } = props;
  if (!isVisible) return null;

  return (
    <div className="confirmation-popup-overlay">
      <div className="popup-bg" />
      <div className="confirmation-popup">
        <p>Are you sure you want to delete this post?</p>
        <div className="confirmation-buttons">
          <button className="delete-confirm" onClick={onConfirm}>
            Confirm
          </button>
          <button className="delete-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationPopup;
