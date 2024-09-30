import express from "express";
import formiddable from "express-formidable";
import { isAdmin, requireSignIn } from "../middelwares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCountController,
  productFilterController,
  productListController,
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

//product filter

router.post("/product-filter", productFilterController);

//product count to display limited product helps to reduce load in api

router.get("/product-count/", productCountController);

//product per page

router.get("/product-list/:page", productListController);
export default router;
