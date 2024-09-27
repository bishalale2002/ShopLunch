import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 w-50">
          <input
            type="test"
            className="form-control"
            id="exampleInputEmail1"
            value={value}
            placeholder="Enter New Category"
            onChange={(e) => {
              setValue(e.target.value);
            }}
            aria-describedby="emailHelp"
          />
        </div>
        <button type="submit" className="btn btn-primary ms-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
