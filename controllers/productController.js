import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validate required fields
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "photo should be less than 1MB" });
    }

    // Create the product
    const products = new productModel({ ...req.fields, slug: slugify(name) });

    // Handle photo if present
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    // Save product to the database
    await products.save();

    // Respond with success
    res
      .status(201)
      .send({ success: true, message: "Product Created", products });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Creating Product",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createAt: -1 });
    res.status(201).send({
      success: true,
      count: products.length,
      message: "showing all Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Getting Product",
    });
  }
};

//for single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photo");
    res
      .status(200)
      .send({ success: true, message: "single Product ", product });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single product ",
    });
  }
};
//produc t photo

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);

      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting  product photo ",
    });
  }
};
//delete

export const deleteProductController = async (req, res) => {
  try {
    // Find the product by ID and delete it
    const product = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");

    // If product not found, return a 404 error
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    // Send success response after deletion
    res
      .status(200)
      .send({ success: true, message: "Product Deleted", product });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting product",
    });
  }
};
//update

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validate required fields
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "Photo should be less than 1MB" });
    }

    // Update the product
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        name,
        slug: slugify(name),
        description,
        price,
        category,
        quantity,
        shipping,
      },
      { new: true } // to return the updated product
    );

    // Handle photo if present
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    // Save the updated product
    await product.save();

    // Respond with success
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating product",
    });
  }
};

//filter

export const productFilterController = async (req, res) => {
  try {
    const { radio, checked } = req.body;
    const args = {};
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    if (checked.length > 0) args.category = checked;
    const product = await productModel.find(args);

    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Featching Filter ",
      error,
    });
  }
};

//product Counter

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();

    res.status(200).send({
      success: true,
      message: "Date is Featched ",
      total,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      success: false,
      message: "Error while Counting Product",
      error,
    });
  }
};

//product list
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1; // Ensure `page` is a number and default to 1
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "6 products per page",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product list",
      error,
    });
  }
};
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
      return res.status(400).send({
        success: false,
        message: "Invalid keyword for search",
      });
    }

    const product = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    res.json(product);
  } catch (error) {
    console.error("Error in searchProductController:", error);
    res.status(400).send({
      success: false,
      message: "Error while searching",
      error,
    });
  }
};
//related product
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo")
      .limit(4)
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Successfully fetched related products",
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in fetching related products",
      error: error.message, // Sending the error message for debugging
    });
  }
};
