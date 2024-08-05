import React, { useState } from "react";
import Layouts from "../../components/layout/Layouts";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, email, password, phone, address, answer }); // Log form data
    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer, // Include the answer field
      });

      if (res && res.data.success) {
        setAlertMessage(res.data.message);
        setAlertType("success");
        setTimeout(() => {
          setAlertMessage("");
          navigate("/login");
        }, 3000);
      } else {
        setAlertMessage(res.data.message);
        setAlertType("danger");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
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
      <Layouts title="Register">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-4">
              {alertMessage && (
                <div
                  className={`alert alert-${alertType} alert-dismissible fade show`}
                  role="alert"
                >
                  {alertMessage}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              )}
              <div className="card shadow">
                <div className="card-body">
                  <h1 className="card-title text-center">Register</h1>
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
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="What's your pet name"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary w-100">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layouts>
    </div>
  );
}

export default Register;
