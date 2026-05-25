require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management API Running",
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/dropout", require("./routes/dropoutRoutes"));


// Wrong API route message
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});