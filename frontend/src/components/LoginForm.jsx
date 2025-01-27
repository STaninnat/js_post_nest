import PropTypes from "prop-types";
import "./Popup.css";
import { useState } from "react";

function LoginForm(props) {
  const {
    onSubmit,
    formClass,
    message,
    error: externalError,
    setPopupType,
    popupType,
  } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError("");
    setPopupType({ type: popupType?.type, error: null });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
    setPopupType({ type: popupType?.type, error: null });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill out all fields.");
      return;
    }

    setError("");

    const formData = {
      username,
      password,
      rememberMe,
    };

    onSubmit(formData);
    setRememberMe(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`form-container ${formClass}`}
      autoComplete="off"
    >
      <label>
        <h3>Username:</h3>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={username}
          onChange={handleUsernameChange}
          required
        />
      </label>

      <label>
        <h3>Password:</h3>
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </label>

      <label className="rememberme-conditions">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={handleRememberMeChange}
        />
        <span>Remember me?</span>
      </label>

      {(error || externalError) && (
        <p className="error-message">{error || externalError}</p>
      )}
      {message && <p className="complete-message">{message}</p>}

      <button type="submit" disabled={!username || !password}>
        Sign In
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formClass: PropTypes.string,
  message: PropTypes.string,
  error: PropTypes.string,
  setPopupType: PropTypes.func.isRequired,
  popupType: PropTypes.object.isRequired,
};

export default LoginForm;
