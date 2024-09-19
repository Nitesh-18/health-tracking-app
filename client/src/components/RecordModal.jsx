import { useState, useEffect } from "react";
import { updateHealthRecord } from "../services/api";
import { motion } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const inputVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const updateAnimation = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

function RecordModal({ record, isOpen, onClose, onUpdate }) {
  const [form, setForm] = useState({
    date: new Date(record.date).toISOString().split("T")[0],
    bodyTemperature: record.bodyTemperature,
    systolic: record.bloodPressure.systolic,
    diastolic: record.bloodPressure.diastolic,
    heartRate: record.heartRate,
  });

  // Update form state when the record changes
  useEffect(() => {
    setForm({
      date: new Date(record.date).toISOString().split("T")[0],
      bodyTemperature: record.bodyTemperature,
      systolic: record.bloodPressure.systolic,
      diastolic: record.bloodPressure.diastolic,
      heartRate: record.heartRate,
    });
  }, [record]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRecord = await updateHealthRecord(record._id, {
        date: form.date,
        bodyTemperature: parseFloat(form.bodyTemperature),
        bloodPressure: {
          systolic: parseInt(form.systolic),
          diastolic: parseInt(form.diastolic),
        },
        heartRate: parseInt(form.heartRate),
      });

      onUpdate(updatedRecord);
      onClose();
    } catch (error) {
      console.error("Error updating record:", error);
    }
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
        exit="hidden"
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          Record Details
        </h2>
        <form onSubmit={handleSubmit}>
          <motion.label
            className="block mb-4"
            variants={updateAnimation}
            initial="hidden"
            animate="visible"
          >
            <span className="text-gray-300">Date:</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 p-3 rounded-md mt-1"
            />
          </motion.label>
          <motion.label
            className="block mb-4"
            variants={updateAnimation}
            initial="hidden"
            animate="visible"
          >
            <span className="text-gray-300">Body Temperature (°F):</span>
            <input
              type="number"
              name="bodyTemperature"
              value={form.bodyTemperature}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 p-3 rounded-md mt-1"
            />
          </motion.label>
          <motion.label
            className="block mb-4"
            variants={updateAnimation}
            initial="hidden"
            animate="visible"
          >
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
          </motion.label>
          <motion.label
            className="block mb-4"
            variants={updateAnimation}
            initial="hidden"
            animate="visible"
          >
            <span className="text-gray-300">Heart Rate (bpm):</span>
            <input
              type="number"
              name="heartRate"
              value={form.heartRate}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 p-3 rounded-md mt-1"
            />
          </motion.label>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-600"
            >
              Save Changes
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

export default RecordModal;
