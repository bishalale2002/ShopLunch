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

      const { data } = await axios.get(
        `/api/v1/bidding/seller-products/${auth.user.email}`
      );

      if (data?.success) {
        setBiddings(data.biddings);
      } else {
        console.log("Data received but success false");
      }
    } catch (error) {
      console.error("Error fetching seller biddings:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this bidding item?"
      );
      if (!confirmDelete) return;

      await axios.delete(`/api/v1/bidding/delete-bid/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      // Refresh the list after deletion
      getSellerBiddings();
    } catch (error) {
      console.error("Error deleting bidding item:", error.message);
      alert("Failed to delete bidding item.");
    }
  };

  useEffect(() => {
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
            <h4>Your Listed Biddings</h4>
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
                        <p className="card-text">
                          {b.description.substring(0, 60)}...
                        </p>
                        <p className="card-text">
                          <strong>Starting Amount:</strong> ${b.startingAmount}
                        </p>
                        <p className="card-text">
                          <strong>Current Amount:</strong> ${b.currentAmount}
                        </p>
                        <p className="card-text">
                          <strong>Expiration Time:</strong>{" "}
                          {new Date(b.expirationTime).toLocaleString()}
                        </p>
                        <p className="card-text">
                          <strong>Highest Bidder Email:</strong>{" "}
                          {b.highestBidderGmail || "No bids yet"}
                        </p>
                        <p
                          className="card-text"
                          style={{
                            color: b.status === "sold" ? "red" : "green",
                            fontWeight: "bold",
                          }}
                        >
                          Status: {b.status}
                        </p>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(b._id)}
                        >
                          Delete
                        </button>
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
