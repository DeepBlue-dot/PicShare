import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import Profile from "./pages/Profile";
import Boards from "./pages/Boards";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import NotFound from "./pages/NotFound";
import AccountUpdatePage from "./pages/UpdateProfilePage";
import { useAuth } from "./context/AuthContext";
import UserProfile from "./pages/UserProfile";

// Layout component to wrap pages with navbar
const Layout = () => {
  return (
    <>
      <Sidebar />
      <TopBar />
      <main className="pt-16 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </>
  );
};

// ProtectedRoute component that checks if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:postId" element={<PostDetails />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/profile/:id" element={<UserProfile />} />

          {/* Protected Routes */}
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateProfile"
            element={
              <ProtectedRoute>
                <AccountUpdatePage />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Auth routes without navbar */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
