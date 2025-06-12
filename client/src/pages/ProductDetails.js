import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layouts from "../components/layout/Layouts";
import { useParams } from "react-router-dom";
import { useCart } from "../components/context/cart";
import toast from "react-hot-toast";
const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const params = useParams();
  const [cart, setCart] = useCart();
  const getProduct = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      if (data?.product) {
        setProduct(data.product);
        getRelatedProduct(data.product._id, data.product.category._id);
      }
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  }, [params.slug]);

  const getRelatedProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProduct(data?.products || []);
    } catch (error) {
      console.log("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params.slug, getProduct]);

  return (
    <Layouts title="Product Details">
      <div className="container mt-4 mb-5">
        <h1 className="text-center mb-4">Product Details</h1>

        {/* Product Details */}
        <div className="row g-4">
          <div className="col-md-6">
            {product._id ? (
              <img
                src={`/api/v1/product/product-photo/${product._id}`}
                alt={product.name || "Product image"}
                className="img-fluid rounded shadow product-image"
                style={{ objectFit: "cover", maxHeight: "400px" }}
              />
            ) : (
              <p>Loading product image...</p>
            )}
          </div>

          <div className="col-md-6 d-flex flex-column">
            <h5 className="mb-3">
              <strong>Name:</strong> {product.name || "Product Name"}
            </h5>
            <p className="mb-3">
              <strong>Description:</strong>{" "}
              {product.description || "Description not available"}
            </p>
            <p className="mb-3">
              <strong>Price:</strong> ${product.price || "N/A"}
            </p>
            <p className="mb-3">
              <strong>Category:</strong> {product.category?.name || "N/A"}
            </p>
            <p className="mb-3">
              <strong>Quantity:</strong> {product.quantity || "N/A"}
            </p>
            <p className="mb-3">
              <strong>Shipping:</strong>{" "}
              {product.shipping ? "Available" : "Not Available"}
            </p>
            <div className="mt-auto">
              <button
                className="btn btn-secondary ms-1"
                onClick={() => {
                  // Set quantity to 1 for the item
                  const productWithQuantity = {
                    ...product,
                    quantity: 1,
                  };

                  // Update the cart state with the new product
                  setCart([...cart, productWithQuantity]);

                  // Save the updated cart to localStorage with quantity set to 1
                  localStorage.setItem(
                    "cart",
                    JSON.stringify([...cart, productWithQuantity])
                  );

                  toast.success("Item Added to Cart");
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Line to Separate Sections */}
        <hr className="my-5" />

        {/* Related Products Section */}
        <div className="row mt-5">
          <h3 className="mb-4">You May Also Like</h3>
          <div className="row">
            {relatedProduct.length > 0 ? (
              relatedProduct.map((product) => (
                <div
                  key={product._id}
                  className="col-12 col-sm-6 col-md-4 d-flex justify-content-center mb-4"
                >
                  <div className="card shadow" style={{ width: "18rem" }}>
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

                      <button className="btn btn-secondary ms-1">
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No related products found</p>
            )}
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default ProductDetails;
