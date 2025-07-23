import fs from "fs";
import slugify from "slugify";
import biddingModel from "../models/biddingModel.js";

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

    if (!bidding) {
      return res.status(404).send({ success: false, message: "Bidding not found" });
    }

    const now = new Date();
    if (new Date(bidding.expirationTime) < now) {
      return res.status(400).send({ success: false, message: "Bidding has expired" });
    }

    if (amount <= bidding.currentAmount || amount <= bidding.startingAmount) {
      return res.status(400).send({
        success: false,
        message: "Bid must be higher than current and starting bid",
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
