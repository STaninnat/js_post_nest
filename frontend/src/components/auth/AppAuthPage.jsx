import { useState } from "react";

import "./AppAuthPage.css";
import LoginForm from "./LoginForm";
import Popup from "../templates/Popup";
import ApiFunctions from "../ApiFunctions";
import CreateUserForm from "./CreateUserForm";

function AppAuthPage() {
  const [popupType, setPopupType] = useState({ type: null, error: null });
  const [message, setMessage] = useState("");

  const closePopup = () => {
    setPopupType({ type: null, error: null });
    setMessage("");
  };

  const handleCreateUserSubmit = (userData) => {
    ApiFunctions.handleCreateUserSubmit(userData, setMessage, setPopupType);
  };

  const handleLoginSubmit = (userData) => {
    ApiFunctions.handleLoginSubmit(userData, setMessage, setPopupType);
  };

  const formClass =
    popupType?.type === "createUser"
      ? "form-container-create"
      : popupType?.type === "login"
      ? "form-container-login"
      : "form-container-default";

  return (
    <div className="app-home-section">
      <div className="app-home-left">
        <img className="app-home-ghost" src="/images/ghost.png" alt="ghost" />
      </div>
      <div className="app-home-right">
        <div className="app-home-container">
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
            data-testid="home-signin-button"
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
