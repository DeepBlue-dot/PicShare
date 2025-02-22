import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import Profile from "./pages/Profile";
import Boards from "./pages/Boards";
import { Outlet } from "react-router-dom";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import NotFound from "./pages/NotFound";

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

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public routes with navbar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/boards" element={<Boards />} />
          </Route>
          {/* Auth route without navbar */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify/:token" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
