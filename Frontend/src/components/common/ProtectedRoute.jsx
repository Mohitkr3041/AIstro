import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAuthenticated, children }) {
  if (isAuthenticated === null) {
    return (
      <div className="aistro-page flex min-h-screen items-center justify-center text-foreground/70">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
