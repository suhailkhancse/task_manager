require("dotenv").config();
console.log("JWT Secret Key:", process.env.JWT_SECRET); // Debugging JWT Secret

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
