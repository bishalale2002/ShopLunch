import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Changed 'require' to 'required'
      trim: true,
    },
    email: {
      type: String,
      required: true, // Changed 'require' to 'required'
      unique: true,
    },
    password: {
      type: String,
      required: true, // Changed 'require' to 'required'
    },
    phone: {
      type: String,
      required: true, // Changed 'require' to 'required'
    },
    address: {
      type: String,
      required: true, // Changed 'require' to 'required'
    },
    answer: {
      type: String,
      required: true, // Changed 'require' to 'required'
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
