import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const AccountUpdatePage = () => {
  const { user, isAuthenticated, isLoading, updateUser, deleteAccount } =
    useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const [avatar, setAvatar] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        password: "",
        oldPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteAccount();
      } catch (err) {
        setError(err.message || "Failed to delete account. Please try again.");
      }
    }
  };

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    setServerErrors({});

    const formDataToSend = new FormData();

    if (data.username !== user.username)
      formDataToSend.append("username", data.username);
    if (data.email !== user.email) formDataToSend.append("email", data.email);

    if (data.password) {
      formDataToSend.append("password", data.password);
      formDataToSend.append("oldPassword", data.oldPassword);
      formDataToSend.append("confirmPassword", data.confirmPassword);
    }

    if (avatar) formDataToSend.append("profilePicture", avatar);

    try {
      await updateUser(formDataToSend);
      setSuccess("Account updated successfully!");
      reset({
        ...data,
        password: "",
        oldPassword: "",
        confirmPassword: "",
      });
      setAvatar(null);
      setFileInputKey((prev) => prev + 1);
    } catch (err) {
      if (err.response && err.response.data) {
        const { errors, message } = err.response.data;
        if (errors) {
          setServerErrors(errors);
        } else if (message) {
          setError(message);
        } else {
          setError("Failed to update account. Please try again.");
        }
      } else {
        setError(err.message || "Failed to update account. Please try again.");
      }
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (!isAuthenticated)
    return (
      <div className="text-center p-8">Please log in to view this page</div>
    );

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Update Account</h1>

      {/* Profile Preview Section */}
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-100">
              <span className="text-2xl font-bold text-indigo-600">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          {user.username}
        </h2>
        <p className="text-gray-600">{user.email}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <input
            key={fileInputKey}
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {serverErrors.profilePicture && (
            <p className="text-red-500 text-sm mt-1">
              {serverErrors.profilePicture}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
          {serverErrors.username && (
            <p className="text-red-500 text-sm mt-1">{serverErrors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          {serverErrors.email && (
            <p className="text-red-500 text-sm mt-1">{serverErrors.email}</p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
            {serverErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {serverErrors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              {...register("oldPassword", {
                validate: (value) =>
                  watch("password") && !value
                    ? "Current password is required"
                    : true,
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
            {serverErrors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {serverErrors.oldPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
            {serverErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {serverErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            transition-colors duration-200"
        >
          Update Account
        </button>
      </form>

      {/* Delete Account Section */}
      <div className="mt-12 pt-8 border-t border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Permanently delete your account and all associated data. This action
          is irreversible.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg
            hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            transition-colors duration-200"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountUpdatePage;
