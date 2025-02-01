import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";

import "./AppHeader.css";
import ApiFunctions from "../ApiFunctions";

function AppHeader() {
  const navigate = useNavigate();

  const goToHome = () => {
    setTimeout(() => {
      navigate("/home");
    }, 500);
  };

  const goToProfile = () => {
    setTimeout(() => {
      navigate("/profile");
    }, 500);
  };

  const handleSignout = async () => {
    try {
      await ApiFunctions.handleSignout(navigate);
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("signout error:", error);
    }
  };

  return (
    <nav>
      <img
        className="app-header-ghost"
        src="/images/ghost.png"
        alt="header-ghost"
      />
      <i
        className="ri-home-9-fill header-home-icon"
        role="header-home-btn"
        alt="Home"
        title="Go to Homepage"
        onClick={goToHome}
      ></i>
      <div className="proflie-logout-group">
        <i
          className="ri-account-circle-fill header-user-icon"
          role="header-user-btn"
          alt="User Profile"
          title="View your profile"
          onClick={goToProfile}
        ></i>
        <i
          className="ri-logout-circle-r-line header-logout-icon"
          role="header-logout-btn"
          alt="Logout"
          title="Logout"
          onClick={handleSignout}
        ></i>
      </div>
    </nav>
  );
}

export default AppHeader;
