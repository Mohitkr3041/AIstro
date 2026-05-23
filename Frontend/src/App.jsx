import { BrowserRouter, Routes, Route } from "react-router-dom";
import { startTransition, useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import BirthDetails from "./pages/BirthDetails";
import Dashboard from "./pages/Dashboard";
import ReportPage from "./pages/ReportPage";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { getCurrentUser } from "./services/auth.service";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then(() => {
        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setIsAuthenticated(true);
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setIsAuthenticated(false);
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />

        <Route
          path="/birth"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BirthDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
