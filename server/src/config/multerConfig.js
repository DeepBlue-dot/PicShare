import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import AppError from "../utils/appError.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/profilePictures");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });

  const fileFilter= (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new AppError("Only image files are allowed!", 404), false);
      }
    }
  
  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter
  });

  export default upload;
