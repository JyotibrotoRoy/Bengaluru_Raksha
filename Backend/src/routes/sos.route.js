import { Router } from "express";
import { sendSoS } from "../controllers/sos.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/send-sos").post(verifyJWT,sendSoS)

export default router;