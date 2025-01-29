import app from "./src/server";
import dotenv from "dotenv";

dotenv.config()

app.listen(process.env.PORT, ()=>{
    console.log(`server running on http://127.0.0.1:${process.env.PORT}/`)
})