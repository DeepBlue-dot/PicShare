import { useForm } from "react-hook-form";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";
import { useState } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function LoginForm({ onSubmit, switchToSignup }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      await onSubmit(data);
      navigate("/");
    } catch (error) {
      setFormError(
        error.response?.data?.message || error.message || "Invalid credentials"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md transition-all">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <FiMail className="absolute top-3 left-3 text-gray-400" />
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Email address"
              type="email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute top-3 left-3 text-gray-400" />
            <input
              {...register("password", { required: "Password is required" })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Password"
              type="password"
            />
          </div>
        </div>

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:text-primary-dark"
          >
            Forgot Password?
          </Link>
        </div>

        {formError && (
          <p className="text-red-500 text-sm text-center">{formError}</p>
        )}

        <button
          type="submit"
          className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Login
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <button
          onClick={switchToSignup}
          className="text-primary hover:text-primary-dark font-medium"
        >
          Sign Up
        </button>
      </div>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <GoogleLoginButton
            onClick={() => {}}
            className="hover:transform hover:scale-105 transition-transform"
          />
          <FacebookLoginButton
            onClick={() => {}}
            className="hover:transform hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </div>
  );
}

export function SignupForm({ onSubmit, switchToLogin }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [formError, setFormError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const validatePassword = (value) => {
    if (value.length < 8) return "Password must be at least 8 characters";
    return true;
  };

  const handleSignup = async (data) => {
    try {
      await onSubmit(data);
      setIsPopupOpen(true);
    } catch (error) {
      setFormError(
        error.response?.data?.errors ||
          error.response?.data?.message ||
          error.message ||
          "Registration failed"
      );
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md transition-all">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute top-3 left-3 text-gray-400" />
              <input
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Choose a username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
            {formError.username && (
              <p className="text-red-500 text-sm mt-1">{formError.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-gray-400" />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Email address"
                type="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
            {formError.email && (
              <p className="text-red-500 text-sm mt-1">{formError.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-400" />
              <input
                {...register("password", {
                  required: "Password is required",
                  validate: validatePassword,
                })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Create password"
                type="password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
            {formError.password && (
              <p className="text-red-500 text-sm mt-1">{formError.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-400" />
              <input
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Confirm password"
                type="password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
            {formError.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formError.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={switchToLogin}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Login
          </button>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <GoogleLoginButton
              onClick={() => {}}
              className="hover:transform hover:scale-105 transition-transform"
            />
            <FacebookLoginButton
              onClick={() => {}}
              className="hover:transform hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => {
              setIsPopupOpen(false);
              switchToLogin();
            }}
          ></div>
          {/* Modal Content */}
          <div className="bg-white p-6 rounded shadow-md text-center z-10">
            <p className="text-lg font-bold">Account created successfully!</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => {
                setIsPopupOpen(false);
                switchToLogin();
              }}
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm onSubmit={login} switchToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSubmit={signup} switchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}
