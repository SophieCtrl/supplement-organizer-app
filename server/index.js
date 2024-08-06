const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // The URL of your frontend application
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Import routes
const userRoutes = require("./routes/users.routes");
const supplementRoutes = require("./routes/supplements.routes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/supplements", supplementRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
