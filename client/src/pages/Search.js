import React from "react";
import Layouts from "./../components/layout/Layouts";
import { useSearch } from "../components/context/search";

import toast from "react-hot-toast";
import { useCart } from "../components/context/cart";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  return (
    <div>
      <Layouts title={"Search"}>
        <div className="container">
          <div className="text-center">
            <h1>Search Results</h1>

            <h6>
              {values?.results.length < 1
                ? "Product Not found"
                : `Found ${values?.results.length}`}
            </h6>
            <div className="mt-4">
              {values.results.length > 0 ? (
                values.results.map((product) => (
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
        </div>
      </Layouts>
    </div>
  );
};

export default Search;
