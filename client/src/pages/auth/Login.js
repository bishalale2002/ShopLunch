import React, { useState } from "react";
import Layouts from "../../components/layout/Layouts";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../components/context/auth";
function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (res && res.data.success) {
        setAlertMessage(res.data.message);
        setAlertType("success");
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        setTimeout(() => {
          setAlertMessage("");
          navigate(location.state || "/");
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
    <div>
      <Layouts title="Login">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-4 ">
              {" "}
              {/* Apply custom width class */}
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
                  <h1 className="card-title text-center">Login</h1>
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
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/forgot-password");
                        }}
                        className="btn btn-danger w-100"
                      >
                        Forgot Password ?
                      </button>
                    </div>

                    <div className="mt-3">
                      <button type="submit" className="btn btn-secondary w-100">
                        Login
                      </button>
                    </div>
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

export default Login;
