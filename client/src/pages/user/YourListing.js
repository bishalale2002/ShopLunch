import React from 'react'
import Layouts from '../../components/layout/Layouts'
import SellerMenu from '../../components/layout/SellerMenu'

export default function YourListing() {
  return (
  <Layouts title="Your Listings">
    <div className='container-fluid m-3 p-3'>
        <div className='row'> 
            <div className='col md-3'>
                <SellerMenu />
                </div> 
                
                <div className='col md-9'>

                    </div>
                
                </div>
    </div>
      
    </Layouts>
  )
}
