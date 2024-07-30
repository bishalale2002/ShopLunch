import React from "react";
import Layouts from "../components/layout/Layouts";
import {
  BsEnvelope,
  BsTelephone,
  BsInfoCircle,
  BsLinkedin,
  BsInstagram,
} from "react-icons/bs";
import "../App.css"; // Ensure you import the CSS file for custom styles

export default function Contact() {
  return (
    <Layouts>
      <div className="container mt-5">
        <h1>Contact Us</h1>
        <div className="row mt-4">
          <div className="col-md-6">
            <h3>
              <BsEnvelope className="me-2" />
              Email
            </h3>

            <a
              href="https://www.linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              info@sastodeal.com
            </a>
          </div>
          <div className="col-md-6">
            <h3>
              <BsTelephone className="me-2" />
              Phone
            </h3>
            <a
              href="tel:9818366470"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              9818366470
            </a>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <h3>
              <BsLinkedin className="me-2" />
              LinkedIn
            </h3>
            <a
              href="https://www.linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              linkedin.com/in/your-profile
            </a>
          </div>
          <div className="col-md-6">
            <h3>
              <BsInstagram className="me-2" />
              Instagram
            </h3>
            <a
              href="https://www.instagram.com/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              instagram.com/your-profile
            </a>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <h3>
              <BsInfoCircle className="me-2" />
              About Sasto Deal
            </h3>
            <p>
              Sasto Deal is your go-to platform for buying and selling
              second-hand items. We offer a unique auction-based sales system to
              ensure you get the best deals. Whether you're looking to buy or
              sell, Sasto Deal makes it easy and convenient.
            </p>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
