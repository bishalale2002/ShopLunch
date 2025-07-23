import express from "express";
import formidable from "express-formidable";
import { requireSignIn } from "../middelwares/authMiddleware.js";
import {
  createBiddingController,
  getAllBiddingsController,
  getSingleBiddingController,
  deleteBiddingController,
  updateBiddingController,
  placeBidController,
  biddingPhotoController,
  getBiddingsBySeller,
} from "../controllers/biddingController.js";

const router = express.Router();

router.post("/create-bid", requireSignIn, formidable(), createBiddingController);
router.get("/all-bids", getAllBiddingsController);
router.get("/single-bid/:id", getSingleBiddingController);
router.get("/bid-photo/:id", biddingPhotoController);
router.delete("/delete-bid/:id", requireSignIn, deleteBiddingController);
router.put("/update-bid/:id", requireSignIn, formidable(), updateBiddingController);
router.put("/place-bid/:id", requireSignIn, placeBidController);

// Correct function and route path here
router.get("/seller-products/:email", getBiddingsBySeller);

export default router;
