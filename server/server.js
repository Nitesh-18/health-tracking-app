import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import healthRecordRoutes from "./routes/healthRecordRoutes.js";

dotenv.config(); // Initialize environment variables

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://health-tracking-app-jmv3.onrender.com/", // Replace with your deployed frontend URL
  })
);

app.use(express.json()); // JSON parser

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/health-records", healthRecordRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Health Tracking App API");
});

// Handle 404 errors (for undefined routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (for unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
