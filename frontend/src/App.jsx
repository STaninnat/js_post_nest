import "./global.css";
import { Route, Routes } from "react-router-dom";

import AppAuthPage from "./components/Auth/AppAuthPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppAuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
