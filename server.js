import express from "express";
import colors from "colors";
import dotenv from "dotenv";
//configure Doteng
dotenv.config();
// rest object
const app = express();

//rest api

app.get("/", (req, res) => {
  res.send("<h1>Welcome To Sasto Deal</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server is Running ${process.env.DEV_MOD} On PORT: ${PORT}`.bgCyan.white
  );
});
