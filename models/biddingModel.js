import mongoose from "mongoose";

const biddingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startingAmount: {
      type: Number,
      required: true,
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    expirationTime: {
      type: Date,
      required: true,
    },
    sellerGmail: {
      type: String,
      required: true,
    },
    highestBidderGmail: {
      type: String,
      default: null,
    },

    // Add this photo field for storing image data and type
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bidding", biddingSchema);
