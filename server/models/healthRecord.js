import { Schema, model } from "mongoose";

const HealthRecordSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  bodyTemperature: {
    type: Number,
    required: true,
  },
  bloodPressure: {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true },
  },
  heartRate: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("HealthRecord", HealthRecordSchema);
