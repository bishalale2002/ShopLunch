import React from "react";
import Layouts from "../components/layout/Layouts";
import { Link } from "react-router-dom";

export default function Pagenotfound() {
  return (
    <Layouts title={"Go Back - page not found"}>
      <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h2 className="pnf-heading">Oops ! Page Not Found</h2>
        <Link to="/">GO Back</Link>
      </div>
    </Layouts>
  );
}
