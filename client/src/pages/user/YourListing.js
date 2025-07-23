import React, { useEffect, useState } from "react";
import Layouts from "../../components/layout/Layouts";
import SellerMenu from "../../components/layout/SellerMenu";
import { useAuth } from "../../components/context/auth";
import axios from "axios";

export default function YourListing() {
  const [auth] = useAuth();
  const [biddings, setBiddings] = useState([]);

  const getSellerBiddings = async () => {
    try {
      if (!auth?.user?.email) {
        console.log("No user email found");
        return;
      }

      console.log("Sending request to:", `/api/v1/bidding/seller-biddings/${auth.user.email}`);
     const { data } = await axios.get(`/api/v1/bidding/seller-products/${auth.user.email}`);

      console.log("Response from server:", data);

      if (data?.success) {
        setBiddings(data.biddings);
      } else {
        console.log("Data received but success false");
      }
    } catch (error) {
      console.error("Error fetching seller biddings:", error.message);
    }
  };

  useEffect(() => {
    console.log("Current user email:", auth?.user?.email);
    getSellerBiddings();
  }, [auth?.user?.email]);

  return (
    <Layouts title="Your Listings">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <SellerMenu />
          </div>

          <div className="col-md-9">
            <h4>Your Listed Biddings </h4>
            <div className="row">
              {biddings.length === 0 ? (
                <p>No bidding items listed yet.</p>
              ) : (
                biddings.map((b) => (
                  <div key={b._id} className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={`/api/v1/bidding/bid-photo/${b._id}`}
                        className="card-img-top"
                        alt={b.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{b.name}</h5>
                        <p className="card-text">{b.description.substring(0, 60)}...</p>
                        <p className="card-text">
                          <strong>Starting Amount:</strong> ${b.startingAmount}
                        </p>
                        <p className="card-text">
                          <strong>Current Amount:</strong> ${b.currentAmount}
                        </p>
                        <p className="card-text">
                          <strong>Expiration Time:</strong> {new Date(b.expirationTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
