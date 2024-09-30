import React, { useState, useEffect } from "react";
import Layouts from "./../components/layout/Layouts";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { prices } from "../components/Prices";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  //get total

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter function
  const handleFilter = (value, id) => {
    let updatedChecked = [...checked];

    if (value) {
      updatedChecked.push(id); // Push the category ID when checked
    } else {
      updatedChecked = updatedChecked.filter((c) => c !== id); // Remove it when unchecked
    }

    setChecked(updatedChecked); // Update the checked state
  };

  // Fetching categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Fetch products from API
  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      if (data?.success) {
        setProducts(data?.products);
      } else {
        console.log("Failed to fetch products");
      }
    } catch (error) {
      setLoading(false);
      console.log("Error fetching products", error);
    }
  };

  //load more
  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);

      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log("Error fetching products", error);
      setLoading(false);
    }
  };

  // Fetch products when component mounts
  useEffect(() => {
    if (!radio.length || !checked.length) getProducts();
  }, [radio.length, checked.length]);
  // eslint-disable-next-line
  useEffect(() => {
    if (radio.length || checked.length) filterProduct();
  }, [radio, checked]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filter", {
        radio,
        checked,
      });
      setProducts(data.product);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layouts title={"All Products Best-offer"}>
      <div className="row mt-3">
        <div className="col-md-3 ">
          <h6 className="text-center">Filter By Category</h6>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                checked={checked.includes(c._id)} // Check if the checkbox should be checked
                onChange={(e) => handleFilter(e.target.checked, c._id)} // Pass the correct ID
              >
                {c.name}{" "}
              </Checkbox>
            ))}
          </div>
          <h6 className="text-center">Filter By Price</h6>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {prices?.map((m) => (
                <div key={m._id}>
                  <Radio value={m.array}>{m.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          <div className="flex-column ">
            <button
              className="btn btn-danger mt-3 w-50 ms-3"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="col-md-9">
          <h2 className="text-center">All Products</h2>

          {/* Display checked category IDs for debugging */}
          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="col-12 col-sm-6 col-md-4 d-flex justify-content-center mb-4"
                >
                  <div className="card" style={{ width: "18rem" }}>
                    <img
                      src={`/api/v1/product/product-photo/${product._id}`} // Display product photo
                      className="card-img-top"
                      alt={product.name}
                      style={{
                        height: "200px",
                        objectFit: "cover", // Ensures the image covers the card without distortion
                        objectPosition: "center", // Centers the image inside the card
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">
                        {product.description.substring(0, 60)}...
                      </p>
                      <p className="card-text">Price: ${product.price}</p>
                      <button className="btn btn-primary ms-1">
                        More Details
                      </button>
                      <button className="btn btn-secondary ms-1">
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading.." : "LoadMore"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layouts>
  );
}
