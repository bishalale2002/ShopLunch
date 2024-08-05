import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middelwares/authMiddleware.js";
const route = express.Router();

//routing register ||post MEthod
route.post("/register", registerController);

//LOGIN || POST

route.post("/login", loginController);
//forgot password || POST

route.post("/forgot-password", forgotPasswordController);

//for tesing

route.get("/test", requireSignIn, isAdmin, testController);

//protected user

route.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected admin

route.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default route;
