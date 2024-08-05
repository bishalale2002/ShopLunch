import userModel from "../models/userModel.js";
import { compatePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//REGISTER || POST
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Name is Empty" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is Empty" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is Empty" });
    }
    if (!phone) {
      return res.status(400).send({ message: "Phone is Empty" });
    }
    if (!address) {
      return res.status(400).send({ message: "Address is Empty" });
    }
    if (!answer) {
      return res.status(400).send({ message: "Answer is Empty" });
    }

    // Check user
    const existingUser = await userModel.findOne({ email });

    // For existing users
    if (existingUser) {
      return res.status(409).send({ error: "User Already Exists" });
    }

    // Register user
    const hashedPassword = await hashPassword(password);

    // Saving data to DB
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer, // Include the answer field here
    }).save();

    res
      .status(201)
      .send({ success: true, message: "User Registered Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register",
      error,
    });
  }
};

//LOGIN || POSR

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Empty Field",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not found",
      });
    }

    const match = await compatePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "wrong password",
      });
    }

    // Token

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Logged In ",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while login",
      error,
    });
  }
};

//forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "Password is required" });
    }

    // Check
    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    // Hashing and updating password
    const hashed = await hashPassword(newPassword);

    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.send({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Something went wrong", error });
  }
};

export const testController = async (req, res) => {
  res.send({ message: "this is test" });
};
