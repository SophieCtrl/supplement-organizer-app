const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = process.env.PORT || 5005;
const userRoutes = require("./routes/users.routes");
const supplementRoutes = require("./routes/supplements.routes");
const authRoutes = require("./routes/auth.routes");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // The URL of your frontend application
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Public Route - accessible to everyone
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/supplements", supplementRoutes);
app.use("/auth", authRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
