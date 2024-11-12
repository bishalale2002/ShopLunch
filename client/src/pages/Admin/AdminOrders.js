import React, { useState, useEffect } from "react";
import Layouts from "../../components/layout/Layouts";
import AdminMenu from "../../components/layout/AdminMenu";
import axios from "axios";
import { useAuth } from "../../components/context/auth";
import { Select } from "antd";

const AdminOrders = () => {
  const { Option } = Select;
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // Fetch orders on component mount if the user is authenticated
  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  // Get the orders from the API
  const getOrders = async () => {
    try {
      const response = await axios.get("/api/v1/auth/all-orders");
      setOrders(response.data.orders); // Directly access data.orders from the response
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders(); // No need to store the response in a variable
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layouts>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All orders</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Buyer</th>
                  <th>Quantity</th>
                  <th>Payment</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <React.Fragment key={order._id}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <Select
                            border={false}
                            onChange={(value) => handleChange(order._id, value)}
                            defaultValue={order?.status}
                          >
                            {[
                              "Not Process",
                              "Processing",
                              "Shipped",
                              "Delivered",
                              "cancel",
                            ].map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{order.buyer?.name || "N/A"}</td>
                        <td>{order.products.length}</td>
                        <td>{order.payment ? "Paid" : "Not Paid"}</td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>

                      {/* Ordered Products Section */}
                      <tr>
                        <td colSpan="6">
                          <div className="mb-4">
                            <h4>Order #{index + 1} - Products</h4>
                            <div className="row">
                              {order.products.map((product) => (
                                <div
                                  key={product._id}
                                  className="col-md-4 mb-3"
                                >
                                  <div
                                    className="card"
                                    style={{ padding: "10px" }}
                                  >
                                    <img
                                      src={`/api/v1/product/product-photo/${product._id}`}
                                      className="card-img-top"
                                      alt={product.name}
                                      style={{
                                        maxHeight: "150px",
                                        objectFit: "cover",
                                        padding: "5px",
                                      }}
                                    />
                                    <div className="card-body p-2">
                                      <h6 className="card-title mb-1">
                                        {product.name}
                                      </h6>
                                      <p className="card-text">
                                        Price: ${product.price}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default AdminOrders;
