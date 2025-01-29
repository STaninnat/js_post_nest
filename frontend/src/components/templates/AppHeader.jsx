import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";

import "./AppHeader.css";

function AppHeader() {
  const navigate = useNavigate();

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
        onClick={() => navigate("/home")}
      ></i>
      <div className="proflie-logout-group">
        <i
          className="ri-account-circle-fill header-user-icon"
          role="header-user-btn"
          alt="User Profile"
          title="View your profile"
        ></i>
        <i
          className="ri-logout-circle-r-line header-logout-icon"
          role="header-logout-btn"
          alt="Logout"
          title="Logout"
          onClick={() => navigate("/")}
        ></i>
      </div>
    </nav>
  );
}

export default AppHeader;
