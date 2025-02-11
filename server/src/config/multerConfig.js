import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/appError.js";

// Set up memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new AppError("Only image files are allowed!", 400), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB file size limit
  fileFilter,
});

export default upload;
