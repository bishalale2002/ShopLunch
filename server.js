import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import ConnectDB from "./config/ConnectDB.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import biddingRoutes from "./routes/biddingRoutes.js";

// Load environment variables
dotenv.config();

// DB connection
ConnectDB();

// App initialization
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // ✅ Use JSON parsing for incoming requests

// ⚠️ REMOVE this if you're not handling file uploads:
// app.use(formidable()); ❌

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/bidding", biddingRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome To ShopLunch</h1>");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});
