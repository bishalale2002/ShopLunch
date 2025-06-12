import React, { useState, useEffect } from "react";
import Layouts from "../../components/layout/Layouts";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../components/context/auth";
import axios from "axios";
import toast from "react-hot-toast";
function Profile() {
  // Context
  const [auth, setAuth] = useAuth();

  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // New state for alert message
  const [alertType, setAlertType] = useState(""); // New state for alert type
  //effect
  useEffect(() => {
    if (auth.user) {
      const { name, email, phone, address } = auth.user;
      setName(name);
      setEmail(email);
      setPhone(phone);
      setAddress(address);
    }
  }, [auth.user]);

  // Functions
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, email, password, phone, address }); // Log form data
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });

      if (data?.error) {
        toast.error(data?.error);
      } else {
        // Update auth with the new user information
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: data.updatedUser,
        }));

        // Update localStorage
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));

        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      setAlertMessage("Something went wrong");
      setAlertType("danger");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    }
  };

  return (
    <div>
      <Layouts>
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9 w-50">
            <div className="card shadow">
              <div className="card-body">
                <h1 className="card-title text-center">User Profile</h1>

                {/* Display alert if there is a message */}
                {alertMessage && (
                  <div className={`alert alert-${alertType}`} role="alert">
                    {alertMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-secondary w-100">
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layouts>
    </div>
  );
}

export default Profile;
