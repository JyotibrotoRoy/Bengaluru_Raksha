import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.route.js"
import sosRouter from "./routes/sos.route.js"
import vehicleRouter from "./routes/vehicle.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/sos", sosRouter)
app.use("/api/v1", vehicleRouter)

export {app}