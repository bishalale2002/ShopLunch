import React from "react";
import { NavLink } from "react-router-dom";

function SellerMenu() {
  return (
    <div className="text-center">
      <div className="list-group">
        <h4>Seller Panel</h4>
        <NavLink
          to="/dashboard/seller/addTOListing"
          className="list-group-item list-group-item-action"
        >
          Add To Listing
        </NavLink>
        <NavLink
          to="/dashboard/seller/yourListing"
          className="list-group-item list-group-item-action"
        >
          Your Listings
        </NavLink>
       
        
      </div>
    </div>
  );
}

export default SellerMenu;
