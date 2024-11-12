import React, { useState } from "react"; // Removed useEffect and useCallback
import { useSearch } from "../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce"; // Debouncing library

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const [suggestions, setSuggestions] = useState([]); // Store suggestions
  const navigate = useNavigate();

  // Function to highlight matched text in suggestions
  const highlightMatch = (text, keyword) => {
    if (!keyword) return text; // No highlighting if there's no keyword
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, `<strong>$1</strong>`);
  };

  // Debounced function to fetch search suggestions
  const fetchSuggestions = debounce(async (keyword) => {
    if (keyword) {
      try {
        const { data } = await axios.get(
          `/api/v1/product/suggestions/${keyword.trim()}`
        );
        setSuggestions(data); // Set the fetched suggestions
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions if keyword is empty
    }
  }, 500); // 500ms debounce time

  // Only trigger suggestions when the user types something
  const handleInputChange = (e) => {
    setValues({ ...values, keyword: e.target.value });
    fetchSuggestions(e.target.value); // Fetch suggestions when input changes
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!values.keyword || values.keyword.trim() === "") {
      console.log("Please enter a keyword to search.");
      return;
    }

    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword.trim()}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setValues({ ...values, keyword: suggestion }); // Set the selected suggestion as the keyword
    setSuggestions([]); // Clear the suggestions after selection
    handleSubmit(); // Trigger search when suggestion is selected
  };

  return (
    <div>
      <form
        className="d-flex"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword || ""}
          onChange={handleInputChange} // Handle change via the new function
        />
        <button
          className="btn btn-outline-secondary"
          type="button" // Change to type="button" so it won't trigger form submit
          onClick={handleSubmit} // Trigger search on click of the button
        >
          Search
        </button>
      </form>

      {/* Display suggestions if available */}
      {suggestions.length > 0 && (
        <ul className="list-group">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion._id} // Unique key based on _id
              className="list-group-item list-group-item-action"
              onClick={() => handleSuggestionClick(suggestion.name)} // Handle click on suggestion
              dangerouslySetInnerHTML={{
                __html: highlightMatch(suggestion.name, values.keyword), // Highlight matching text
              }}
            ></li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
