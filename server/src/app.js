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

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/public/", express.static(path.join(process.env.PWD, "public")));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.sendFile(path.join(process.env.PWD, "public", "index.html"));
});

app.all("*", unknownURL);
app.use(errorHandler);

export default app;
