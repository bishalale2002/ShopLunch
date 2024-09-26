import express from "express";
import formiddable from "express-formidable";
import { isAdmin, requireSignIn } from "../middelwares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();
//create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formiddable(),
  createProductController
); //update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formiddable(),
  updateProduct
);
//get product
router.get("/get-product", getProductController);
router.get("/get-Product/:slug", getSingleProductController);
router.get("/product-photo/:pid", productPhotoController);
router.delete("/delete-product/:pid", deleteProductController);

export default router;
