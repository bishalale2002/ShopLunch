import React from "react";
import Layouts from "../../components/layout/Layouts";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../components/context/auth";
function DashBoard() {
  const [auth] = useAuth();
  return (
    <div>
      <Layouts title="Dashboard">
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <UserMenu />
            </div>
            <div className="col-md-9">
              <div className="card w-50 p-3">
                <h4>User Name : {auth?.user?.name}</h4>
                <h4>User Email : {auth?.user?.email}</h4>
                <h4>User Phone : {auth?.user?.phone}</h4>
              </div>
            </div>
          </div>
        </div>
      </Layouts>
    </div>
  );
}

export default DashBoard;
