import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import path from "path";

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.route.js"
import sosRouter from "./routes/sos.route.js"
import vehicleRouter from "./routes/vehicle.route.js"
import pageRouter from "./routes/page.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/sos", sosRouter)
app.use("/api/v1", vehicleRouter)

app.use("/", pageRouter);

export {app}