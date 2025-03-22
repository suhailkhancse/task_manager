const express = require("express");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Task Routes
router.post("/createtasks", authMiddleware, createTask);
router.get("/gettasks", authMiddleware, getTasks);
router.put("/updatetasks/:id", authMiddleware, updateTask);
router.delete("/deletetasks/:id", authMiddleware, deleteTask);

module.exports = router;
