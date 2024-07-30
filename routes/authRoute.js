import express from "express";
import {
  registerController,
  loginController,
  testController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middelwares/authMiddleware.js";
const route = express.Router();

//routing register ||post MEthod
route.post("/register", registerController);

//LOGIN || POST

route.post("/login", loginController);

route.get("/test", requireSignIn, isAdmin, testController);

export default route;
