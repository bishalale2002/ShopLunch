import React, { useState, useEffect } from "react";
import Layouts from "../../components/layout/Layouts";
import AdminMenu from "../../components/layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;
const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState("");

  //get single product

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );

      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setCategory(data.product.category._id);
      setShipping(data.product.shipping);
      setPhoto(data.product.photo);
    } catch (error) {}
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  //handel Sublit

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("shipping", shipping);
      formData.append("category", category);
      photo && formData.append("photo", photo); // Attach the photo file

      // API call to update the product
      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        formData
      );

      if (data?.success) {
        navigate("/dashboard/admin/products");
        toast.success("Product updated successfully!");
      } else {
        toast.error(data?.message || "Failed to add product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while adding the product");
    }
  };

  //handle delete
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${id}`
      );

      if (data.success) {
        toast.success("Product Deleted");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error While Deleting Product");
      toast.error(error);
    }
  };
  return (
    <Layouts title="Update product">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h2>Update Product</h2>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                size="large"
                value={category}
                placeholder="Select Category"
                onChange={(value) => {
                  setCategory(value);
                }}
                showSearch
                className="form-select mb-3 custom-select" // Custom class for styling
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => {
                      setPhoto(e.target.files[0]);
                    }}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Product Photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`/api/v1/product/product-photo/${id}`}
                      alt="Product Photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter Name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <textarea
                  placeholder="Enter Description"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  value={description}
                  className="form-control"
                  rows="4" // You can adjust the number of rows as needed
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter Price"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  value={price}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter Quantity"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                  value={quantity}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping"
                  onChange={(e) => {
                    setShipping(e);
                  }}
                  showSearch
                  className="form-select mb-3"
                  value={shipping ? "YES" : "No"}
                >
                  <Option value="0">Yes</Option>
                  <Option value="1">No</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Update Product{" "}
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete Product{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default UpdateProduct;
