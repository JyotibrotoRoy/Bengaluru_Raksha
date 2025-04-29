import { Router } from "express";
import { sendSoS } from "../controllers/sos.controller.js";

const router = Router();

router.route("/send-sos").post(sendSoS)

export default router;