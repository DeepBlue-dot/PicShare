import { useForm } from "react-hook-form";
import { useState } from "react";
import PostService from "../services/PostService";

export default function CreatePostPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverErrors, setServerErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("tags", data.tags?.split(","));
      formData.append("postImage", data.image[0]);

      // Replace this with your actual API call
      await PostService.createPost(formData);
      setImagePreview(null);
      setServerErrors({});
      alert("Post created successfully!");
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data) {
        const { errors } = err.response.data;
        if (errors) {
          setServerErrors(errors);
        } 
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Post
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto mb-4 rounded-lg"
                  />
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      {...register("image", { required: "Image is required" })}
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {errors.image && (
              <p className="mt-2 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
            {serverErrors.image && (
              <p className="mt-2 text-sm text-red-600">{serverErrors.image}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <div className="mt-1">
              <input
                id="title"
                name="title"
                type="text"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.title || serverErrors.title ? "border-red-600" : ""
                }`}
                {...register("title", {
                  required: "Title is required",
                  maxLength: { value: 100, message: "Max 100 characters" },
                })}
              />
            </div>
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
            {serverErrors.title && (
              <p className="mt-2 text-sm text-red-600">{serverErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (optional)
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.description || serverErrors.description
                    ? "border-red-600"
                    : ""
                }`}
                {...register("description", {
                  maxLength: { value: 1000, message: "Max 1000 characters" },
                })}
              />
            </div>
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
            {serverErrors.description && (
              <p className="mt-2 text-sm text-red-600">
                {serverErrors.description}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags (comma-separated, max 10)
            </label>
            <div className="mt-1">
              <input
                id="tags"
                name="tags"
                type="text"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.tags || serverErrors.tags ? "border-red-600" : ""
                }`}
                {...register("tags", {
                  validate: (value) => {
                    if (!value) return true;
                    const tags = value.split(",");
                    if (tags.length > 10) return "Max 10 tags allowed";
                    if (tags.some((tag) => tag.length > 20))
                      return "Each tag max 20 characters";
                    return true;
                  },
                })}
              />
            </div>
            {errors.tags && (
              <p className="mt-2 text-sm text-red-600">{errors.tags.message}</p>
            )}
            {serverErrors.tags && (
              <p className="mt-2 text-sm text-red-600">{serverErrors.tags}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
