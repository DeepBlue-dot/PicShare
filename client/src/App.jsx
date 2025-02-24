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

const Layout = () => {
  return (
    <div className="grid grid-rows-[auto,1fr,auto] md:grid-rows-[auto,1fr] grid-cols-1 md:grid-cols-[64px,1fr] h-screen">
      {/* TopBar spans all columns */}
      <div className="col-span-1 md:col-span-2">
        <TopBar />
      </div>

      {/* Main Content - Comes BEFORE sidebar in DOM order */}
      <main className="bg-gray-50 overflow-auto pb-16 md:pb-0">
          <Outlet />
      </main>

      {/* BottomBar (mobile) / Sidebar (desktop) */}
      <div className="fixed md:relative bottom-0 w-full md:w-auto bg-white shadow-lg md:shadow-none border-t md:border-0 z-10">
        <Sidebar />
      </div>
    </div>
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
