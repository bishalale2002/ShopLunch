import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layouts from "../components/layout/Layouts";
import { useCart } from "../components/context/cart";
import toast from "react-hot-toast";
const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const params = useParams();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.product || []);
      setCategory(data?.category || {});
    } catch (error) {
      console.log("Error fetching category products:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [params.slug]);

  return (
    <Layouts title={`${category.name} Products`}>
      <div className="container my-5">
        <h2 className="text-center mb-4">
          {category.name || "Category"} Products
        </h2>

        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="col-12 col-sm-6 col-md-4 d-flex justify-content-center mb-4"
              >
                <div className="card" style={{ width: "18rem" }}>
                  <img
                    src={`/api/v1/product/product-photo/${product._id}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">
                      {product.description.substring(0, 60)}...
                    </p>
                    <p className="card-text">Price: ${product.price}</p>
                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => {
                        navigate(`/product-details/${product.slug}`);
                      }}
                    >
                      More Details
                    </button>
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
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </Layouts>
  );
};

export default CategoryProduct;
