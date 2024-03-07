import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserRouter from "./routes/UserRouter";
import TutorRouter from "./routes/TutorRouter";
import AdminRoutes from "./routes/AdminRoutes";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRouter />} />
        <Route path="/vendor/*" element={<TutorRouter />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
