import React from 'react';
import Layouts from '../../components/layout/Layouts';
import { useNavigate } from 'react-router-dom';

// Dummy auth check — replace this with your actual auth logic
const isAuthenticated = () => {
  const auth = localStorage.getItem("auth");
  return auth && JSON.parse(auth).token;
};

export default function Bidding() {
  const navigate = useNavigate();

  const handleBecomeSeller = () => {
    if (isAuthenticated()) {
      navigate('/dashboard/seller');
    } else {
      navigate('/login');
    }
  };

  return (
    <Layouts title="Bidding">
      <div className="container mt-5">
        <div className="row"> 
          <div className="col-md-12">
            <h2 className="text-center">Welcome to the Bidding Page</h2>
            <p className="text-center">Here you can place your bids on various products.</p>
            
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary mb-3" onClick={handleBecomeSeller}>
                Become Seller
              </button>
            </div>
          </div>  
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <p className="text-center">
            Please check back later for available products to bid on.
          </p>
        </div>
      </div>
    </Layouts>
  );
}
