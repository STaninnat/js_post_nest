import "./global.css";
import { Route, Routes } from "react-router-dom";

import AppAuthPage from "./components/auth/AppAuthPage";
import AppHome from "./components/home/AppHome";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

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
