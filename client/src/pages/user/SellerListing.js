import React from 'react'
import Layouts from '../../components/layout/Layouts'
import SellerMenu from '../../components/layout/SellerMenu'

export default function SellerListing() {
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
    Please fill in the details to add a new listing. This section is under development and will be available soon.
  </p>
  <hr />
  
</div>

          </div>
        </div>
      </div>
    </Layouts>
  )
}
