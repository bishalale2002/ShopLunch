import React from "react";
import Layouts from "../../components/layout/Layouts";
import AdminMenu from "../../components/layout/AdminMenu";

function Createcategory() {
  return (
    <Layouts title="Create category">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-50 p-3">
              <h2>Create Category</h2>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}

export default Createcategory;
