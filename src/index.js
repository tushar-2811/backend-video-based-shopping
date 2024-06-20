import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({
    path : './env'
})

const port = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(port , () => {
        console.log(`Server is Running on port : ${port}`);
    })
})
.catch((error) => {
    console.log("Error in connecting to db::" , err);
    throw error;
})