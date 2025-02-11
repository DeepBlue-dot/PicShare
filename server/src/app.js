import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, unknownURL } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/public/profilePics", express.static(path.join(process.env.PWD, "public", "uploads", "profile_pictures")));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/auth", authRoutes);
app.all('*', unknownURL)
app.use(errorHandler)

export default app;
