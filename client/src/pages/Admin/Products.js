import React, { useEffect, useState } from "react";
import Layouts from "../../components/layout/Layouts";
import AdminMenu from "../../components/layout/AdminMenu";
import axios from "axios";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/v1/product/get-product");
        setProducts(response.data.products);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h2>Loading Products...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <Layouts>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="row gx-1 gy-1">
            {" "}
            {/* Adjusted spacing classes */}
            {products.map((product) => (
              <div className="col-6 col-sm-4 col-md-3" key={product._id}>
                <Link to={`/dashboard/admin/product/${product.slug}`}>
                  <div className="card h-100" style={{ width: "75%" }}>
                    <img
                      src={`/api/v1/product/product-photo/${product._id}`}
                      alt={product.name}
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: "150px", // Fixed height
                        objectFit: "cover", // Ensure the image covers the area without distortion
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <p className="card-text">${product.price}</p>
                      <div className="mt-auto">
                        <button className="btn btn-primary">
                          View Product
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Products;
