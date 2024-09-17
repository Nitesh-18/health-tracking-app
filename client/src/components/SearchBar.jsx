// components/SearchBar.jsx
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("date");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value, filterType);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <div className="mb-4 flex space-x-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded w-full"
      />
      <select
        value={filterType}
        onChange={handleFilterChange}
        className="border p-2 rounded"
      >
        <option value="date">Date</option>
        <option value="heartRate">Heart Rate</option>
        <option value="bodyTemperature">Body Temperature</option>
        <option value="bloodPressure">Blood Pressure</option>
      </select>
    </div>
  );
}

export default SearchBar;
