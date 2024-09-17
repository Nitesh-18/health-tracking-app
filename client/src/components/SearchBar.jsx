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
    <div className="mb-6 flex space-x-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="bg-gray-800 text-gray-100 border-gray-700 p-3 rounded-md w-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
      />
      <select
        value={filterType}
        onChange={handleFilterChange}
        className="bg-gray-800 text-gray-100 border-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
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
