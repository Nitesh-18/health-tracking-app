const API_URL = "https://health-tracking.onrender.com/";

// Fetch all records
export const fetchHealthRecords = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

// Create a new record
export const createHealthRecord = async (record) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });
  return response.json();
};

// Fetch a specific record
export const fetchHealthRecordById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};

// Update a record
export const updateHealthRecord = async (id, updatedRecord) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRecord),
  });
  return response.json();
};

// Delete a record
export const deleteHealthRecord = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
