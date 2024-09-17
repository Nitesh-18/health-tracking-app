import { useState, useEffect } from "react";
import { fetchHealthRecords, deleteHealthRecord } from "../services/api";
import AddHealthRecord from "./AddHealthRecord";
import SearchBar from "./SearchBar";
import { motion } from "framer-motion";
import RecordModal from "./RecordModal";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

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
    <div className="container mx-auto p-6 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Health Metrics Dashboard</h1>
      <button
        className="bg-teal-500 text-white px-5 py-3 mb-6 rounded shadow-lg hover:bg-teal-400 transition duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        Add New Record
      </button>
      <SearchBar onSearch={handleSearch} />
      <div className="mb-6 flex gap-4">
        {["date", "heartRate", "bodyTemperature", "bloodPressure"].map(
          (field) => (
            <button
              key={field}
              className="bg-indigo-500 text-white px-4 py-2 rounded shadow-lg hover:bg-indigo-400 transition duration-300"
              onClick={() => handleSort(field)}
            >
              Sort by {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          )
        )}
      </div>
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
          className="table-auto w-full text-gray-100"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr className="bg-gray-800">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Body Temperature</th>
              <th className="px-6 py-4">Blood Pressure</th>
              <th className="px-6 py-4">Heart Rate</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <motion.tr
                key={record._id}
                variants={scaleUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 hover:bg-gray-700"
              >
                <td className="border px-6 py-4">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td
                  className={`border px-6 py-4 ${
                    record.bodyTemperature > 37
                      ? "bg-red-600 text-white"
                      : "bg-yellow-400"
                  }`}
                >
                  {record.bodyTemperature}°C
                </td>
                <td
                  className={`border px-6 py-4 ${
                    record.bloodPressure.systolic > 120
                      ? "bg-red-600 text-white"
                      : "bg-yellow-400"
                  }`}
                >
                  {record.bloodPressure.systolic}/
                  {record.bloodPressure.diastolic}
                </td>
                <td
                  className={`border px-6 py-4 ${
                    record.heartRate > 100
                      ? "bg-red-600 text-white"
                      : "bg-yellow-400"
                  }`}
                >
                  {record.heartRate} bpm
                </td>
                <td className="border px-6 py-4">
                  <button
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-400 transition duration-300"
                    onClick={() => handleView(record)}
                  >
                    View
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded ml-2 hover:bg-red-500 transition duration-300"
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
          className="text-gray-400"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
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
