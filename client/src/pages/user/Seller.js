import React from 'react';
import Layouts from '../../components/layout/Layouts';
import SellerMenu from '../../components/layout/SellerMenu';
import { useAuth } from '../../components/context/auth';

export default function Seller() {
  const [auth] = useAuth();

  return (
    <Layouts title="Seller Dashboard">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <SellerMenu />
          </div>
          <div className="col-md-9">
           <div className="card w-75 p-4 shadow-sm">
  <h3 className="mb-3">Welcome, {auth?.user?.name}!</h3>
  <p className="lead">
    You’re now part of the ShopLunch Seller community. Keep pushing forward — your products could be the next big thing online!
  </p>
  <hr />
  <p><strong>Email:</strong> {auth?.user?.email}</p>
  <p><strong>Phone:</strong> {auth?.user?.phone}</p>
</div>

          </div>
        </div>
      </div>
    </Layouts>
  );
}
