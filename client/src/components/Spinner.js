import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Spinner({ path = "login" }) {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval); // Clear the interval when count is 0
          navigate(`/${path}`, { state: location.pathname }); // Redirect to login and state will remenber the previous path and redirect after login
          return 0; // Ensure count is set to 0
        }
        return prevCount - 1; // Decrease count
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [navigate, location, path]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="text-center mb-3">
        Redirecting you to the main page in {count}s
      </h1>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
