import { Router } from "express";
import { 
    rateDriver,
    getDriverDetails
    } from "../controllers/driver.controller.js";

const router = Router();

router.route("/rate-driver").post(rateDriver)
router.route("/driver/:vehicleNumber").get(getDriverDetails)

export default router;