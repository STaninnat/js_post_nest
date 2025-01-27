import "./global.css";
import { Route, Routes } from "react-router-dom";

import AppHome from "./components/AppHome";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppHome />} />
      </Routes>
    </div>
  );
}

export default App;
