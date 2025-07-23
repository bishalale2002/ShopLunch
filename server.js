import express from "express";
import formidable from "express-formidable";  // <-- Import formidable for parsing form-data
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import ConnectDB from "./config/ConnectDB.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import biddingRoutes from "./routes/biddingRoutes.js";

// Configure dotenv
dotenv.config();

// Connect to the database
ConnectDB();

// Create an express application
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(formidable());   // <-- Use formidable to parse incoming form data (e.g., for file uploads or complex forms)

// Bonus Debugging Tip:
// If you're getting a 500 Internal Server Error, try this:
// 1. Log `req.fields` and `req.files` inside your POST route to ensure data is received.
// 2. Check your MongoDB connection and schema constraints.
// 3. Validate if all required fields are present before saving to DB.
// 4. Wrap your async route handlers in try/catch and log the error properly.


// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/bidding", biddingRoutes);

// API endpoint
app.get("/", (req, res) => {
  res.send("<h1>Welcome To ShopLunch</h1>");
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server is Running in ${process.env.DEV_MODE} mode on PORT: ${PORT}`.bgCyan.white
  );
});
