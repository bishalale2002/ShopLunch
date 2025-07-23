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
} from "../controllers/biddingController.js";

const router = express.Router();

// ✅ Create a new bidding item (with photo upload)
router.post(
  "/create-bid",
  requireSignIn,
  formidable(),
  createBiddingController
);

// ✅ Get all bidding items
router.get("/all-bids", getAllBiddingsController);

// ✅ Get a single bidding item by ID
router.get("/single-bid/:id", getSingleBiddingController);

// ✅ Get photo for a bid item
router.get("/bid-photo/:id", biddingPhotoController);

// ✅ Delete a bidding item
router.delete("/delete-bid/:id", requireSignIn, deleteBiddingController);

// ✅ Update a bidding item
router.put(
  "/update-bid/:id",
  requireSignIn,
  formidable(),
  updateBiddingController
);

// ✅ Place a new bid
router.put("/place-bid/:id", requireSignIn, placeBidController);

export default router;
