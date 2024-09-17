import { useState } from "react";
import { updateHealthRecord } from "../services/api";
import { motion } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

function RecordModal({ record, isOpen, onClose, onUpdate }) {
  const [form, setForm] = useState({
    date: new Date(record.date).toISOString().split("T")[0],
    bodyTemperature: record.bodyTemperature,
    systolic: record.bloodPressure.systolic,
    diastolic: record.bloodPressure.diastolic,
    heartRate: record.heartRate,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Record Details</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Date:
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </label>
          <label className="block mb-2">
            Body Temperature (°C):
            <input
              type="number"
              name="bodyTemperature"
              value={form.bodyTemperature}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </label>
          <label className="block mb-2">
            Blood Pressure (Systolic/Diastolic):
            <input
              type="number"
              name="systolic"
              placeholder="Systolic"
              value={form.systolic}
              onChange={handleChange}
              className="w-full border p-2"
            />
            <input
              type="number"
              name="diastolic"
              placeholder="Diastolic"
              value={form.diastolic}
              onChange={handleChange}
              className="w-full border p-2 mt-2"
            />
          </label>
          <label className="block mb-2">
            Heart Rate (bpm):
            <input
              type="number"
              name="heartRate"
              value={form.heartRate}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </label>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 mt-4 ml-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default RecordModal;
