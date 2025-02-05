import dotenv from "dotenv";
dotenv.config()

import app from "./app.js";
import connectDB from "./config/db.js";

connectDB()


app.listen(process.env.PORT, ()=>{
    console.log(`server running on http://127.0.0.1:${process.env.PORT}/`)
})