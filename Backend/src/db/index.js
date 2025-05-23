import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();

const ConnectionDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        
        console.log(`Mongodb Connected succesfully!! ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Mongoose connection failed!!", error);
        process.exit(1);   
    }
}

export default ConnectionDB;