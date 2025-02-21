import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await forgotPassword(data.email);
      setMessage("Password reset instructions sent to your email");
      reset();
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Enter your email"
              type="email"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-500 text-sm text-center" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/auth")}
            className="text-primary hover:text-primary-dark text-sm focus:outline-none"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
