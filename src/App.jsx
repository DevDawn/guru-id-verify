import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
// import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Verify from "./Pages/Verify";
import Scan from "./Pages/Scan";
import Staff from "./Pages/Staff";
import Login from "./Pages/Login";
import AdminPanel from "./Pages/AdminPanel";
import ProtectedRoute from "./Components/ProtectedRoute";
import StaffProfile from "./Pages/StaffProfile";
import StaffEdit from "./Components/AdminComponents/StaffEdit";
// import Footer from "./Components/Footer";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/staff/:guruID" element={<StaffProfile />} />
        <Route path="/edit/:guruID" element={<StaffEdit />} />

        {/* Protected Route for Admin Panel */}
        <Route
  path="/admin"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>

        {/* Redirect to Home for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* <Footer /> */}
      </>
  );
};

export default App;
