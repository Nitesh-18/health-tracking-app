import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHealthRecordById, updateHealthRecord } from "../services/api";
import { motion } from "framer-motion";

function EditHealthRecord() {
  const { id } = useParams();
  const [form, setForm] = useState({
    date: "",
    bodyTemperature: "",
    systolic: "",
    diastolic: "",
    heartRate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHealthRecordById(id).then((record) =>
      setForm({
        date: new Date(record.date).toISOString().split("T")[0],
        bodyTemperature: record.bodyTemperature,
        systolic: record.bloodPressure.systolic,
        diastolic: record.bloodPressure.diastolic,
        heartRate: record.heartRate,
      })
    );
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateHealthRecord(id, {
      date: form.date,
      bodyTemperature: parseFloat(form.bodyTemperature),
      bloodPressure: {
        systolic: parseInt(form.systolic),
        diastolic: parseInt(form.diastolic),
      },
      heartRate: parseInt(form.heartRate),
    });
    navigate("/");
  };

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold mb-4">Edit Health Record</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields for date, body temperature, blood pressure, and heart rate */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
        >
          Save Changes
        </button>
      </form>
    </motion.div>
  );
}

export default EditHealthRecord;
