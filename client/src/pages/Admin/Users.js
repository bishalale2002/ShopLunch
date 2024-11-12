import React, { useState, useEffect } from "react";
import Layouts from "../../components/layout/Layouts";
import AdminMenu from "../../components/layout/AdminMenu";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/v1/auth/all-users"); // Adjust the API endpoint if necessary
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layouts title="Users">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-100 p-3">
              <h2>All Users</h2>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.address}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}

export default Users;
