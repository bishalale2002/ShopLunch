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

//for tesing

route.get("/test", requireSignIn, isAdmin, testController);

//protected user

route.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

export default route;
