import fs from "fs";
import slugify from "slugify";
import biddingModel from "../models/biddingModel.js";
import { sendEmail } from "../utils/emailSender.js";

// CREATE BID ITEM

export const createBiddingController = async (req, res) => {
  try {
    const {
      name,
      description,
      startingAmount,
      expirationTime,
      sellerGmail,
    } = req.fields;

    if (!name || !description || !startingAmount || !expirationTime || !sellerGmail) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    const bidding = new biddingModel({
      name,
      description,
      startingAmount: Number(startingAmount),
      currentAmount: Number(startingAmount), // initial current amount = starting amount
      expirationTime: new Date(expirationTime),
      sellerGmail,
      highestBidderGmail: "", // no highest bidder initially
    });

    if (req.files?.photo) {
      bidding.photo = {
        data: fs.readFileSync(req.files.photo.path),
        contentType: req.files.photo.type,
      };
    }

    await bidding.save();
    res.status(201).send({ success: true, message: "Bidding item created", bidding });
  } catch (error) {
    console.error("Create bidding error:", error);
    res.status(500).send({ success: false, message: "Error creating bidding", error });
  }
};


// GET ALL BIDS
export const getAllBiddingsController = async (req, res) => {
  try {
    const biddings = await biddingModel.find({}).select("-photo").sort({ createdAt: -1 });
    res.status(200).send({ success: true, count: biddings.length, biddings });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching biddings", error });
  }
};

// GET SINGLE BID
export const getSingleBiddingController = async (req, res) => {
  try {
    const bidding = await biddingModel.findById(req.params.id).select("-photo");
    res.status(200).send({ success: true, bidding });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching bidding", error });
  }
};

// DELETE BID
export const deleteBiddingController = async (req, res) => {
  try {
    const bidding = await biddingModel.findByIdAndDelete(req.params.id).select("-photo");
    if (!bidding) return res.status(404).send({ success: false, message: "Not found" });
    res.status(200).send({ success: true, message: "Bidding deleted", bidding });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error deleting bidding", error });
  }
};

// UPDATE BID ITEM INFO (not placing a bid, just updating info)
export const updateBiddingController = async (req, res) => {
  try {
    const { name, description, startingPrice, expirationTime, sellerGmail } = req.fields;
    const { photo } = req.files;

    const bidding = await biddingModel.findByIdAndUpdate(
      req.params.id,
      { name, description, startingPrice, expirationTime, sellerGmail },
      { new: true }
    );

    if (photo) {
      bidding.photo.data = fs.readFileSync(photo.path);
      bidding.photo.contentType = photo.type;
    }

    await bidding.save();
    res.status(200).send({ success: true, message: "Bidding updated", bidding });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error updating bidding", error });
  }
};

// PLACE NEW BID
export const placeBidController = async (req, res) => {
  try {
    const { amount, bidderGmail } = req.body;
    const bidding = await biddingModel.findById(req.params.id);
console.log("Current amount in DB:", bidding.currentAmount);
console.log("Type of currentAmount:", typeof bidding.currentAmount);

    if (!bidding) {
      return res.status(404).send({ success: false, message: "Bidding not found" });
    }

    const now = new Date();
    if (new Date(bidding.expirationTime) < now) {
      return res.status(400).send({ success: false, message: "Bidding has expired" });
    }

    // Adaptive minimum increment rate (Dijkstra-Inspired)
    const currentBid = bidding.currentAmount || bidding.startingAmount;
    let incrementRate;
    if (currentBid < 100) {
      incrementRate = 0.05; // 5%
    } else if (currentBid < 1000) {
      incrementRate = 0.03; // 3%
    } else {
      incrementRate = 0.01; // 1%
    }

    const minAllowedBid = currentBid * (1 + incrementRate);

    if (amount < minAllowedBid) {
      return res.status(400).send({
        success: false,
        message: `Bid must be at least ${(incrementRate * 100).toFixed(0)}% higher than current bid ($${minAllowedBid.toFixed(2)})`,
      });
    }

    bidding.currentAmount = amount;
    bidding.highestBidderGmail = bidderGmail;
    await bidding.save();

    res.status(200).send({ success: true, message: "Bid placed successfully", bidding });
  } catch (error) {
    console.error("Place bid error:", error);
    res.status(500).send({ success: false, message: "Error placing bid", error });
  }
};



// GET PHOTO
export const biddingPhotoController = async (req, res) => {
  try {
    const bidding = await biddingModel.findById(req.params.id).select("photo");
    if (bidding?.photo?.data) {
      res.set("Content-type", bidding.photo.contentType);
      return res.status(200).send(bidding.photo.data);
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Error fetching photo", error });
  }
};


export const getBiddingsBySeller = async (req, res) => {
  try {
    const email = req.params.email;
    const biddings = await biddingModel.find({ sellerGmail: email }).sort({ createdAt: -1 });
    res.status(200).send({ success: true, biddings });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to fetch biddings", error });
  }
};



export const updateExpiredBiddingsStatus = async (req, res) => {
  try {
    const now = new Date();

    const expiredBiddings = await biddingModel.find({
      status: "available",
      expirationTime: { $lte: now },
    });

    let updatedCount = 0;

    for (const bidding of expiredBiddings) {
      let message = "";

      if (bidding.highestBidderGmail && bidding.highestBidderGmail.trim() !== "") {
        bidding.status = "sold";
        message = `🎉 Your bid for "${bidding.name}" has won at $${bidding.currentAmount}. The seller will contact you soon.`;

        // Notify buyer
        await sendEmail(
          bidding.highestBidderGmail,
          `You won the bid for "${bidding.name}"`,
          message
        );

        // Notify seller
        await sendEmail(
          bidding.sellerGmail,
          `Your product "${bidding.name}" has been sold!`,
          `Your product has been sold to ${bidding.highestBidderGmail} for $${bidding.currentAmount}.`
        );
      } else {
        bidding.status = "unsold";

        // Notify seller only
        await sendEmail(
          bidding.sellerGmail,
          `Your product "${bidding.name}" was unsold`,
          `Unfortunately, your product received no bids before expiration.`
        );
      }

      await bidding.save();
      updatedCount++;
    }

    res.status(200).send({
      success: true,
      message: `Updated ${updatedCount} expired bidding(s) status and sent emails`,
      updatedCount,
    });
  } catch (error) {
    console.error("❌ Error updating expired biddings:", error);
    res.status(500).send({ success: false, message: "Failed to update expired biddings", error });
  }
};


// get bid by id 

export  const getBidById = async (req, res) => {
  try {
    const bid = await biddingModel.findById(req.params.id);
    if (!bid) {
      return res.status(404).send({ success: false, message: "Bid not found" });
    }
    res.send({ success: true, bid });
  } catch (err) {
    console.error("Error fetching bid by ID:", err);
    res.status(500).send({ success: false, message: "Error fetching bid" });
  }
};

