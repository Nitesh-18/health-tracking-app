import { useState, useEffect } from "react";
import { fetchHealthRecords, deleteHealthRecord } from "../services/api";
import AddHealthRecord from "./AddHealthRecord";
import RecordModal from "./RecordModal";
import { motion } from "framer-motion";

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      const data = await fetchHealthRecords();
      setRecords(data);
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
  };

  const refreshRecords = async () => {
    const data = await fetchHealthRecords();
    setRecords(data);
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
      <AddHealthRecord
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshRecords={refreshRecords}
      />
      {records.length ? (
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
            {records.map((record) => (
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
                    record.bodyTemperature < 36.5 ||
                    record.bodyTemperature > 37.5
                      ? "bg-red-500 text-white"
                      : "bg-yellow-200"
                  }`}
                >
                  {record.bodyTemperature}°C
                </td>
                <td
                  className={`border px-4 py-2 ${
                    record.bloodPressure.systolic < 90 ||
                    record.bloodPressure.systolic > 120 ||
                    record.bloodPressure.diastolic < 60 ||
                    record.bloodPressure.diastolic > 80
                      ? "bg-red-500 text-white"
                      : "bg-yellow-200"
                  }`}
                >
                  {record.bloodPressure.systolic}/
                  {record.bloodPressure.diastolic}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    record.heartRate < 60 || record.heartRate > 100
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
          isOpen={true}
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
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
