import React from "react";
import Footer from "./Footer";
import Header from "./Header";
export default function Layouts({ children }) {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "70vh" }}>{children}</main>

      <Footer />
    </div>
  );
}
