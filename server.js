import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import ConnectDB from "./config/ConnectDB.js";
import authRoutes from "./routes/authRoute.js";
// Configure dotenv
dotenv.config();

// Connect to the database
ConnectDB();

// Create an express application
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

//routes

app.use("/api/v1/auth", authRoutes);

// API endpoint
app.get("/", (req, res) => {
  res.send("<h1>Welcome To Sasto Deal</h1>");
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server is Running in ${process.env.DEV_MODE} mode on PORT: ${PORT}`.bgCyan
      .white
  );
});
