import PropTypes from "prop-types";
import "./Popup.css";
import { useState } from "react";

function CreateUserForm(props) {
  const {
    onSubmit,
    formClass,
    message,
    error: externalError,
    setPopupType,
    popupType,
  } = props;

  const [gender, setGender] = useState("default");
  const [termsChecked, setTermsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGenderBlur = () => {
    if (gender === "") {
      setGender("default");
    }
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleCheckboxChange = () => {
    setTermsChecked(!termsChecked);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (!termsChecked) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setError("");

    const genderValue = gender === "default" ? "" : gender;

    const formData = {
      username,
      password,
      gender: genderValue,
    };

    onSubmit(formData);
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

      <label>
        <h3>Gender:</h3>
        <select
          name="gender"
          value={gender}
          onChange={handleGenderChange}
          onBlur={handleGenderBlur}
        >
          <option value="default" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="terms-conditions">
        <input
          type="checkbox"
          checked={termsChecked}
          onChange={handleCheckboxChange}
        />
        <span>
          I agree to the terms and conditions and privacy policy (mock)
        </span>
      </label>

      {(error || externalError) && (
        <p className="error-message">{error || externalError}</p>
      )}
      {message && <p className="complete-message">{message}</p>}

      <button type="submit" disabled={!username || !password || !termsChecked}>
        Create account
      </button>
    </form>
  );
}

CreateUserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formClass: PropTypes.string,
  message: PropTypes.string,
  error: PropTypes.string,
  setPopupType: PropTypes.func.isRequired,
  popupType: PropTypes.object.isRequired,
};

export default CreateUserForm;
