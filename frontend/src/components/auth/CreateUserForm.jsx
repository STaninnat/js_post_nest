import { useState } from "react";
import PropTypes from "prop-types";

import "../templates/Popup.css";

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
    setPopupType({ type: popupType?.type, error: null });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPopupType({ type: popupType?.type, error: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      data-testid="create-user-form"
      onSubmit={handleSubmit}
      className={`form-container ${formClass}`}
      autoComplete="off"
    >
      <h2>Create your account</h2>
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

      <div className="form-create-message">
        {externalError && <p className="error-message">{externalError}</p>}
        {message && <p className="complete-message">{message}</p>}
      </div>

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
