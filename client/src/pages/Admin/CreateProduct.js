import React, { useState, useEffect } from "react";
import Layouts from "../../components/layout/Layouts";
import AdminMenu from "../../components/layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
function CreateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const [description, setDescription] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("shipping", shipping);
      formData.append("category", category);
      formData.append("photo", photo); // Attach the photo file

      // API call to create the product
      const { data } = await axios.post(
        "/api/v1/product/create-product",
        formData
      );

      if (data?.success) {
        navigate("/dashboard/admin/products");
        toast.success("Product added successfully!");
      } else {
        toast.error(data?.message || "Failed to add product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while adding the product");
    }
  };

  return (
    <div>
      <Layouts title="Create product">
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h2>Create Product</h2>
              <div className="m-1 w-75">
                <Select
                  bordered={false}
                  size="large"
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
                  {photo && (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
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
                  >
                    <Option value="true">Yes</Option>
                    <Option value="false">No</Option>
                  </Select>
                </div>
                <div className="mb-3">
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Add Product{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layouts>
    </div>
  );
}

export default CreateProduct;
