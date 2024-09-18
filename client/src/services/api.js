const API_URL = "https://health-tracking.onrender.com/api/health-records";

// Fetch all records
export const fetchHealthRecords = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch records");
    return response.json();
  } catch (error) {
    console.error("Error fetching health records:", error);
    return null;
  }
};

// Create a new record
export const createHealthRecord = async (record) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });
    if (!response.ok) throw new Error("Failed to create record");
    return response.json();
  } catch (error) {
    console.error("Error creating health record:", error);
    return null;
  }
};

// Fetch a specific record
export const fetchHealthRecordById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch record");
    return response.json();
  } catch (error) {
    console.error("Error fetching health record by ID:", error);
    return null;
  }
};

// Update a record
export const updateHealthRecord = async (id, updatedRecord) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecord),
    });
    if (!response.ok) throw new Error("Failed to update record");
    return response.json();
  } catch (error) {
    console.error("Error updating health record:", error);
    return null;
  }
};

// Delete a record
export const deleteHealthRecord = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete record");
  } catch (error) {
    console.error("Error deleting health record:", error);
  }
};
