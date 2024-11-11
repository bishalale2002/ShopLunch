import React from "react";
import { Link } from "react-router-dom";
import Layouts from "../components/layout/Layouts";
import useCategory from "./../hooks/useCategory";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layouts title={"All Categories"}>
      <div className="container my-5">
        <h2 className="text-center mb-4">Categories</h2>
        <div className="row justify-content-center">
          {categories.map((c) => (
            <div key={c._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card shadow-sm h-100 text-center border-0">
                <div className="card-body d-flex flex-column justify-content-center">
                  <h5 className="card-title">{c.name}</h5>
                  <Link
                    to={`/categories/${c.slug}`}
                    className="btn btn-primary mt-3"
                  >
                    Explore {c.name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layouts>
  );
};

export default Categories;
