import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AppAuthPage.css";
import LoginForm from "./LoginForm";
import Popup from "../templates/Popup";
import ApiFunctions from "../ApiFunctions";
import CreateUserForm from "./CreateUserForm";

function AppAuthPage() {
  const navigate = useNavigate();

  const [popupType, setPopupType] = useState({ type: null, error: null });
  const [message, setMessage] = useState("");

  const closePopup = () => {
    setPopupType({ type: null, error: null });
    setMessage("");
  };

  const handleCreateUserSubmit = async (userData) => {
    await ApiFunctions.handleCreateUserSubmit(
      userData,
      setMessage,
      setPopupType,
      navigate
    );
  };

  const handleLoginSubmit = async (userData) => {
    await ApiFunctions.handleLoginSubmit(
      userData,
      setMessage,
      setPopupType,
      navigate
    );
  };

  const formClass =
    popupType?.type === "createUser"
      ? "form-container-create"
      : popupType?.type === "login"
      ? "form-container-login"
      : "form-container-default";

  return (
    <div className="app-auth-section">
      <div className="app-auth-left">
        <img
          className="app-auth-ghost"
          src="/images/ghost.png"
          alt="auth-ghost"
        />
      </div>
      <div className="app-auth-right">
        <div className="app-auth-container">
          <h1>Currently happening</h1>
          <h2>Be part of it today!</h2>
          <button
            id="btn-user-create"
            onClick={() => setPopupType({ type: "createUser", error: null })}
          >
            Create account
          </button>
          <h3>Already have an account?</h3>
          <button
            id="btn-user-signin"
            data-testid="auth-signin-button"
            onClick={() => setPopupType({ type: "login", error: null })}
          >
            Sign in
          </button>
        </div>
      </div>

      <Popup
        isVisible={popupType?.type !== null}
        onClose={closePopup}
        title={
          popupType?.type === "createUser" ? "Create your account" : "Sign in"
        }
      >
        {popupType?.type === "createUser" ? (
          <CreateUserForm
            onSubmit={handleCreateUserSubmit}
            formClass={formClass}
            message={message}
            error={popupType?.error}
            setPopupType={setPopupType}
            popupType={popupType}
          />
        ) : popupType?.type === "login" ? (
          <LoginForm
            onSubmit={handleLoginSubmit}
            formClass={formClass}
            message={message}
            error={popupType?.error}
            setPopupType={setPopupType}
            popupType={popupType}
          />
        ) : null}
      </Popup>
    </div>
  );
}

export default AppAuthPage;
