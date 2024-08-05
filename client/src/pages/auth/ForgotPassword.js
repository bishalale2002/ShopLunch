import Layouts from "../../components/layout/Layouts";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email,
        newPassword,
        answer,
      });

      if (res && res.data.success) {
        setAlertMessage(res.data.message);
        setAlertType("success");

        setTimeout(() => {
          setAlertMessage("");
          navigate("/login");
        }, 2000);
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
    <Layouts title="forgot-password">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-4 ">
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
                <h1 className="card-title text-center">Forgot Password</h1>
                <form onSubmit={handleSubmit}>
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
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What's Your Pet Name"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                  </div>
                  <div className="mt-3">
                    <button type="submit" className="btn btn-secondary w-100">
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}

export default ForgotPassword;
