import React from "react";
import Layouts from "../components/layout/Layouts";
import { FaShieldAlt, FaUserShield, FaEnvelope } from "react-icons/fa";

export default function Policy() {
  return (
    <Layouts title={"Privacy policy"}>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Privacy Policy</h1>

        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row align-items-start mb-4">
              <FaShieldAlt
                size={80}
                className="text-secondary mb-3 mb-md-0 me-md-4"
              />
              <div>
                <h3 className="mb-3">Introduction</h3>
                <p>
                  Welcome to Sasto Deal. We are committed to protecting your
                  personal information and ensuring that your privacy is
                  safeguarded. This privacy policy outlines how we collect, use,
                  and protect your data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row align-items-start mb-4">
              <FaUserShield
                size={80}
                className="text-secondary mb-3 mb-md-0 me-md-4"
              />
              <div>
                <h3 className="mb-3">Data Collection</h3>
                <p>
                  We collect various types of information in connection with
                  your use of our platform, including personal details you
                  provide when creating an account, transaction data, and usage
                  information. This data helps us to provide and improve our
                  services.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row align-items-start mb-4">
              <FaEnvelope
                size={80}
                className="text-secondary mb-3 mb-md-0 me-md-4"
              />
              <div>
                <h3 className="mb-3">User Rights</h3>
                <p>
                  You have the right to access, correct, or delete your personal
                  data. If you wish to exercise these rights or have any
                  concerns about your data, please contact us using the
                  information provided below.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row align-items-start mb-4">
              <FaEnvelope
                size={80}
                className="text-secondary mb-3 mb-md-0 me-md-4"
              />
              <div>
                <h3 className="mb-3">Contact Us</h3>
                <p>
                  If you have any questions about this privacy policy or our
                  data practices, please contact us at:
                </p>
                <p>
                  Email:{" "}
                  <a href="mailto:support@sastodeal.com">
                    support@sastodeal.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
