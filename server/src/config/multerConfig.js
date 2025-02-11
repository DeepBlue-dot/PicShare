import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/appError.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



function uploadMiddleware(folderName) {
  const sanitizedFolderName = folderName.trim();
  const uploadPath = path.join(__dirname, "..", "..", "public", "uploads", sanitizedFolderName);

  // Set up disk storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath); 
    },
    filename: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname); 
      const uniqueName = `${uuidv4()}${fileExtension}`; 
      cb(null, uniqueName);
    },
  });

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
