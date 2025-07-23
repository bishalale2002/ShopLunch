import React, { useState } from "react";
import Layouts from "../../components/layout/Layouts";
import SellerMenu from "../../components/layout/SellerMenu";
import { useAuth } from "../../components/context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateBidding() {
  const navigate = useNavigate();
  const [auth] = useAuth();

  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingAmount, setStartingAmount] = useState("");
  const [expirationTime, setExpirationTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !startingAmount || !expirationTime) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("startingAmount", startingAmount);
      formData.append("expirationTime", expirationTime);
      formData.append("sellerGmail", auth?.user?.email); // send seller email automatically
      if (photo) formData.append("photo", photo);

      const { data } = await axios.post("/api/v1/bidding/create-bid", formData);

      if (data.success) {
        toast.success("Bidding item created successfully!");
        navigate("/dashboard/seller/yourListing"); // Adjust route as needed
      } else {
        toast.error(data.message || "Failed to create bidding item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layouts title="Create Bidding Item">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <SellerMenu />
          </div>
          <div className="col-md-9">
            <h2>Create Bidding Item</h2>
            <div className="m-1 w-75">
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {photo && (
                <div className="text-center mb-3">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Bidding"
                    height="200px"
                    className="img img-responsive"
                  />
                </div>
              )}

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                className="form-control mb-3"
                placeholder="Enter Description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="number"
                className="form-control mb-3"
                placeholder="Enter Starting Amount"
                value={startingAmount}
                onChange={(e) => setStartingAmount(e.target.value)}
              />

              <input
                type="datetime-local"
                className="form-control mb-3"
                value={expirationTime}
                onChange={(e) => setExpirationTime(e.target.value)}
              />

              <button className="btn btn-primary" onClick={handleSubmit}>
                Create Bidding
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}

export default CreateBidding;
