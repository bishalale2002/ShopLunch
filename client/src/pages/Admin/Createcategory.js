import React, { useEffect, useState } from "react";
import Layouts from "../../components/layout/Layouts";
import AdminMenu from "../../components/layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd"; // Corrected 'Model' to 'Modal'

function Createcategory() {
  const [category, setCategory] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [selected, setSelected] = useState(null);

  const handleUpdatedSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );

      if (data.success) {
        toast.success("Category Updated");
        setSelected(null);
        setVisible(false);
        setUpdatedName("");
        getAllCategory();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error While Updating");
    }
    // Code for updating the category will go here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", {
        name,
      });
      if (data.success) {
        toast.success("New Category Created as: " + name);
        setName(""); // Reset the name field
        getAllCategory(); // Fetch updated categories
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while creating category");
    }
  };
  //fetching Category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data.success) {
        setCategory(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <Layouts title="Create category">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h2>Manage Category</h2>
            <div className="p-3">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {category?.map((c) => (
                    <tr>
                      <td key={c._id}>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button className="btn btn-danger ms-2">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Modal for editing category */}
        <Modal
          onCancel={() => setVisible(false)} // Properly close the modal
          footer={null} // No footer buttons
          visible={visible}
        >
          <CategoryForm
            handleSubmit={handleUpdatedSubmit}
            value={updatedName}
            setValue={setUpdatedName}
          />
        </Modal>
      </div>
    </Layouts>
  );
}

export default Createcategory;
