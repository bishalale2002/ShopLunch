import React from "react";
import Layouts from "../components/layout/Layouts";
import { FaInfoCircle, FaHandHoldingUsd, FaTag } from "react-icons/fa";

export default function About() {
  return (
    <Layouts title={"About us-Sasto Deal"}>
      <div className="container mt-5">
        <h1 className="text-center mb-4">About Sasto Deal</h1>

        <div className="row mb-4">
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <div className="d-flex flex-column flex-lg-row align-items-start mb-4">
              <FaInfoCircle className="icon-lg mb-3 mb-lg-0 me-lg-4" />
              <div>
                <h3 className="mb-3">Our Mission</h3>
                <p>
                  At Sasto Deal, we are dedicated to providing a reliable
                  platform for buying and selling second-hand items through an
                  efficient auction-based system. Our mission is to offer a
                  marketplace where users can find great deals on quality
                  products while contributing to sustainability.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column flex-lg-row align-items-start mb-4">
              <FaHandHoldingUsd className="icon-lg mb-3 mb-lg-0 me-lg-4" />
              <div>
                <h3 className="mb-3">Our Values</h3>
                <p>
                  We believe in transparency, fairness, and customer
                  satisfaction. Our platform ensures that every auction is
                  conducted in a transparent manner and that all transactions
                  are secure, providing a trustworthy environment for our users.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-column flex-lg-row align-items-start mb-4">
              <FaTag className="icon-lg mb-3 mb-lg-0 me-lg-4" />
              <div>
                <h3 className="mb-3">Why Choose Us?</h3>
                <p>
                  Sasto Deal stands out by offering a unique auction-based
                  approach to second-hand goods. Whether you're looking to buy
                  or sell, our platform provides an engaging and user-friendly
                  experience with a focus on excellent customer support and an
                  extensive range of products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
