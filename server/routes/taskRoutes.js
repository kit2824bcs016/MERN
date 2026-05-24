const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");


// CREATE TASK
router.post("/", createTask);

// GET TASKS
router.get("/", getTasks);

// UPDATE TASK
router.put("/:id", updateTask);

// DELETE TASK
router.delete("/:id", deleteTask);


module.exports = router;