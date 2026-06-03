import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { startTransition, useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BirthDetails from "./pages/BirthDetails";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/ReportPage";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import StaticInfo from "./pages/StaticInfo";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { getCurrentUser } from "./services/auth.service";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then(() => {
        if (isMounted) {
          startTransition(() => setIsAuthenticated(true));
        }
      })
      .catch(() => {
        if (isMounted) {
          startTransition(() => setIsAuthenticated(false));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacy" element={<StaticInfo type="privacy" />} />
        <Route path="/terms" element={<StaticInfo type="terms" />} />
        <Route path="/contact" element={<StaticInfo type="contact" />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />

        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/birth" element={<BirthDetails />} />
          <Route path="/report" element={<Report />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        <Route path="/app/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/app/report" element={<Navigate to="/report" replace />} />
        <Route path="/app/chat" element={<Navigate to="/chat" replace />} />
        <Route path="/app/settings" element={<Navigate to="/settings" replace />} />
        <Route path="/app/birth" element={<Navigate to="/birth" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
