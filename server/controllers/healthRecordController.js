import HealthRecord from "../models/healthRecord.js";

// Get all health records
export const getHealthRecords = async (req, res, next) => {
  try {
    const healthRecords = await HealthRecord.find();
    res.status(200).json(healthRecords);
  } catch (error) {
    next(error);
  }
};

// Create a new health record
export const createHealthRecord = async (req, res, next) => {
  try {
    const newRecord = new HealthRecord(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

// Get a specific health record by ID
export const getHealthRecordById = async (req, res, next) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);
    if (!healthRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(healthRecord);
  } catch (error) {
    next(error);
  }
};

// Update a health record
export const updateHealthRecord = async (req, res, next) => {
  try {
    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure the update respects schema validation
      }
    );
    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    next(error);
  }
};

// Delete a health record
export const deleteHealthRecord = async (req, res, next) => {
  try {
    const deletedRecord = await HealthRecord.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    next(error);
  }
};
