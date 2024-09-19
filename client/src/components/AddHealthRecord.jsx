import { useState, useEffect } from "react";
import { createHealthRecord, updateHealthRecord } from "../services/api";
import { motion } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const inputVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

function AddHealthRecord({ isOpen, onClose, selectedRecord, refreshRecords }) {
  const [form, setForm] = useState({
    date: "",
    bodyTemperature: "",
    systolic: "",
    diastolic: "",
    heartRate: "",
  });

  useEffect(() => {
    if (selectedRecord) {
      setForm({
        date: new Date(selectedRecord.date).toISOString().split("T")[0],
        bodyTemperature: selectedRecord.bodyTemperature,
        systolic: selectedRecord.bloodPressure.systolic,
        diastolic: selectedRecord.bloodPressure.diastolic,
        heartRate: selectedRecord.heartRate,
      });
    } else {
      setForm({
        date: "",
        bodyTemperature: "",
        systolic: "",
        diastolic: "",
        heartRate: "",
      });
    }
  }, [selectedRecord]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { date, bodyTemperature, systolic, diastolic, heartRate } = form;

    const record = {
      date,
      bodyTemperature: parseFloat(bodyTemperature),
      bloodPressure: {
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
      },
      heartRate: parseInt(heartRate),
    };

    if (selectedRecord) {
      await updateHealthRecord(selectedRecord._id, record);
    } else {
      await createHealthRecord(record);
    }

    refreshRecords(); // Refresh the list of records
    setForm({
      date: "",
      bodyTemperature: "",
      systolic: "",
      diastolic: "",
      heartRate: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
        variants={inputVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          {selectedRecord ? "Update Health Record" : "Add New Health Record"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-300">Date:</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 p-3 rounded-md mt-1"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-300">Body Temperature (°F):</span>
            <input
              type="number"
              name="bodyTemperature"
              value={form.bodyTemperature}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 p-3 rounded-md mt-1"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-300">
              Blood Pressure (Systolic/Diastolic):
            </span>
            <div className="flex space-x-2">
              <input
                type="number"
                name="systolic"
                placeholder="Systolic"
                value={form.systolic}
                onChange={handleChange}
                className="w-full bg-gray-700 text-gray-100 border border-gray-600 p-3 rounded-md"
              />
              <input
                type="number"
                name="diastolic"
                placeholder="Diastolic"
                value={form.diastolic}
                onChange={handleChange}
                className="w-full bg-gray-700 text-gray-100 border border-gray-600 p-3 rounded-md"
              />
            </div>
          </label>
          <label className="block mb-4">
            <span className="text-gray-300">Heart Rate (bpm):</span>
            <input
              type="number"
              name="heartRate"
              value={form.heartRate}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 p-3 rounded-md mt-1"
            />
          </label>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-600"
            >
              {selectedRecord ? "Update Record" : "Add Record"}
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddHealthRecord;
