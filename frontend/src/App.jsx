import "./global.css";
import { Route, Routes } from "react-router-dom";

import AppAuthPage from "./components/auth/AppAuthPage";
import AppHome from "./components/home/AppHome";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppAuthPage />} />
        <Route path="home/" element={<AppHome />} />
      </Routes>
    </div>
  );
}

export default App;
