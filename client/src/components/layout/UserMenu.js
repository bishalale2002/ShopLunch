import React from "react";
import { NavLink } from "react-router-dom";
function UserMenu() {
  return (
    <div className="text-center">
      <div className="list-group">
        <h4>DashBoard</h4>
        <NavLink
          to="/dashboard/user/profile"
          className="list-group-item list-group-item-action "
          aria-current="true"
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/orders"
          className="list-group-item list-group-item-action"
        >
          Orders
        </NavLink>
      </div>
    </div>
  );
}

export default UserMenu;
