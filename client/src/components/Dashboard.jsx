import { useState, useEffect } from "react";
import { fetchHealthRecords, deleteHealthRecord } from "../services/api";
import AddHealthRecord from "./AddHealthRecord";
import SearchBar from "./SearchBar";
import { motion } from "framer-motion";
import RecordModal from "./RecordModal";

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // New state for sorting order

  useEffect(() => {
    const fetchRecords = async () => {
      const data = await fetchHealthRecords();
      setRecords(data);
      setFilteredRecords(data);
    };

    fetchRecords();
  }, []);

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteHealthRecord(id);
    setRecords(records.filter((record) => record._id !== id));
    setFilteredRecords(filteredRecords.filter((record) => record._id !== id));
  };

  const handleSearch = (searchTerm, filterType) => {
    let results = records;
    if (searchTerm) {
      results = results.filter((record) => {
        if (filterType === "date") {
          return record.date.includes(searchTerm);
        } else if (filterType === "heartRate") {
          return record.heartRate.toString().includes(searchTerm);
        } else if (filterType === "bodyTemperature") {
          return record.bodyTemperature.toString().includes(searchTerm);
        } else if (filterType === "bloodPressure") {
          return (
            record.bloodPressure.systolic.toString().includes(searchTerm) ||
            record.bloodPressure.diastolic.toString().includes(searchTerm)
          );
        }
        return false;
      });
    }
    setFilteredRecords(results);
  };

  const handleSort = (field) => {
    const sortedRecords = [...filteredRecords].sort((a, b) => {
      if (field === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (field === "heartRate") {
        return sortOrder === "asc"
          ? a.heartRate - b.heartRate
          : b.heartRate - a.heartRate;
      } else if (field === "bodyTemperature") {
        return sortOrder === "asc"
          ? a.bodyTemperature - b.bodyTemperature
          : b.bodyTemperature - a.bodyTemperature;
      } else if (field === "bloodPressure") {
        return sortOrder === "asc"
          ? a.bloodPressure.systolic - b.bloodPressure.systolic ||
              a.bloodPressure.diastolic - b.bloodPressure.diastolic
          : b.bloodPressure.systolic - a.bloodPressure.systolic ||
              b.bloodPressure.diastolic - a.bloodPressure.diastolic;
      }
      return 0;
    });
    setFilteredRecords(sortedRecords);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Health Metrics Dashboard</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Add New Record
      </button>
      <SearchBar onSearch={handleSearch} />
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => handleSort("date")}
      >
        Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => handleSort("heartRate")}
      >
        Sort by Heart Rate {sortOrder === "asc" ? "↑" : "↓"}
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => handleSort("bodyTemperature")}
      >
        Sort by Body Temperature {sortOrder === "asc" ? "↑" : "↓"}
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => handleSort("bloodPressure")}
      >
        Sort by Blood Pressure {sortOrder === "asc" ? "↑" : "↓"}
      </button>
      <AddHealthRecord
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshRecords={() => {
          fetchHealthRecords().then((data) => {
            setRecords(data);
            setFilteredRecords(data);
          });
        }}
      />
      {filteredRecords.length ? (
        <motion.table
          className="table-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Body Temperature</th>
              <th className="px-4 py-2">Blood Pressure</th>
              <th className="px-4 py-2">Heart Rate</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <motion.tr
                key={record._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white"
              >
                <td className="border px-4 py-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    record.bodyTemperature > 37
                      ? "bg-red-500 text-white"
                      : "bg-yellow-200"
                  }`}
                >
                  {record.bodyTemperature}°C
                </td>
                <td
                  className={`border px-4 py-2 ${
                    record.bloodPressure.systolic > 120
                      ? "bg-red-500 text-white"
                      : "bg-yellow-200"
                  }`}
                >
                  {record.bloodPressure.systolic}/
                  {record.bloodPressure.diastolic}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    record.heartRate > 100
                      ? "bg-red-500 text-white"
                      : "bg-yellow-200"
                  }`}
                >
                  {record.heartRate} bpm
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleView(record)}
                  >
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => handleDelete(record._id)}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No health records available.
        </motion.p>
      )}
      {selectedRecord && (
        <RecordModal
          record={selectedRecord}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRecord(null);
          }}
          onUpdate={(updatedRecord) => {
            setRecords(
              records.map((record) =>
                record._id === updatedRecord._id ? updatedRecord : record
              )
            );
            setFilteredRecords(
              filteredRecords.map((record) =>
                record._id === updatedRecord._id ? updatedRecord : record
              )
            );
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
