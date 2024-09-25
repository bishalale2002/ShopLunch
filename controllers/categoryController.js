import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(401).send({ message: "Name is Required" });
    }

    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res
        .status(200)
        .send({ success: true, message: "Category Already Exists" });
    }

    const category = await new CategoryModel({
      name,
      slug: slugify(name),
    }).save();

    res
      .status(201)
      .send({ success: true, message: "New Category Created", category });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

//update
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    res
      .status(201)
      .send({ success: true, message: "Category Updated", category });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error While Updating",
    });
  }
};
//get alll category
export const categoryController = async (req, res) => {
  try {
    const category = await CategoryModel.find({});

    res.status(200).send({
      success: true,
      message: "All category List",
      category, // Include the category data in the response object
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting Category",
    });
  }
};

//get single categgory

export const singleCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });

    res.status(200).send({
      success: true,
      message: "single Category",
      category, // Include the category data in the response object
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single Category",
    });
  }
};
//delete
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Deleted",
      category, // Include the category data in the response object
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while delleting single Category",
    });
  }
};
