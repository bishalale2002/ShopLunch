import React from 'react'
import Layouts from '../../components/layout/Layouts'
import SellerMenu from '../../components/layout/SellerMenu'

export default function Listings() {
  return (
  <Layouts title="Add Listing">
 <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
           <SellerMenu />
          </div>
          <div className="col-md-9">
           <div className="card w-75 p-4 shadow-sm">
  <h3 className="mb-3"></h3>
  <p className="lead">
   Your Listings.
  </p>
  <hr />
  
</div>

          </div>
        </div>
      </div>
    </Layouts>
  )
}
