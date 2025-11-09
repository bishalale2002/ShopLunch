import express from "express";
import { khaltiPaymentController } from "../controllers/paymentController.js";
import { requireSignIn } from "../middelwares/authMiddleware.js"; // make sure path is correct

const router = express.Router();

// Protected Khalti QR payment route
router.post("/manual", requireSignIn, khaltiPaymentController);

export default router;
