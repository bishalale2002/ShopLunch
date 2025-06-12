import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer">
      <h4 className="p-3">ALL RIGHTS RESERVED &copy; SHOPLUNCH</h4>

      <p className="text-center mt-3">
        <Link to="/about"> About</Link>|<Link to="/policy">Privacy Policy</Link>
        |<Link to="/contact">Contact</Link>
      </p>
    </div>
  );
}
