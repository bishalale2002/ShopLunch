import React from "react";
import Layouts from "../../components/layout/Layouts";
import AdminMenu from "../../components/layout/AdminMenu";
function Users() {
  return (
    <div>
      <Layouts title="Users">
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <div className="card w-50 p-3">
                <h2>All Users</h2>
              </div>
            </div>
          </div>
        </div>
      </Layouts>
    </div>
  );
}

export default Users;
