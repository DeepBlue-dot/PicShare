import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/appError.js";
import cloudinary from "cloudinary";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function uploadMiddleware(folderName) {
  const sanitizedFolderName = folderName.trim();

  const storage = {
    _handleFile: function (req, file, cb) {
      const publicId = uuidv4();
      const uploadOptions = {
        folder: sanitizedFolderName,
        public_id: publicId,
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        resource_type: "image",
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            const message = error.message.includes("format")
              ? "File format not allowed"
              : error.message;
            return cb(new AppError(message, 400), false); // Pass `false` to indicate failure
          }
          cb(null, {
            path: result.secure_url,
            filename: result.public_id,
          });
        }
      );

      file.stream.on("error", (err) => {
        uploadStream.destroy();
        cb(new AppError(`File upload error: ${err.message}`, 400), false); // Pass `false` to indicate failure
      });

      console.log("Starting file upload...", uploadOptions);

      file.stream.pipe(uploadStream);
    },
    _removeFile: function (req, file, cb) {
      cloudinary.uploader.destroy(file.filename, (error) => {
        if (error) console.error("Error deleting file from Cloudinary:", error);
        cb(null);
      });
    },
  };

  const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new AppError("Only image files are allowed!", 400), false);
    }
    cb(null, true);
  };

  return multer({
    storage,
    limits: { fileSize: 4 * 1024 * 1024 },
    fileFilter,
  });
}

export default uploadMiddleware;
