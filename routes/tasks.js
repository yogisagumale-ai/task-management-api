const express = require("express");
const { run, get, all } = require("../database/database");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

const allowedStatuses = ["pending", "in-progress", "completed"];

router.use(authenticateToken);

// GET all tasks belonging to the logged-in user
router.get("/", async (req, res) => {
  try {
    const tasks = await all(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC",
      [req.user.id]
    );
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch tasks" });
  }
});

// GET one task
router.get("/:id", async (req, res) => {
  try {
    const task = await get(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch task" });
  }
});

// CREATE task
router.post("/", async (req, res) => {
  try {
    const { title, description = "", status = "pending" } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Status must be pending, in-progress, or completed."
      });
    }

    const result = await run(
      "INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)",
      [title.trim(), String(description).trim(), status, req.user.id]
    );

    const task = await get("SELECT * FROM tasks WHERE id = ?", [result.id]);

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ error: "Could not create task" });
  }
});

// UPDATE task
router.put("/:id", async (req, res) => {
  try {
    const { title, description = "", status = "pending" } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Status must be pending, in-progress, or completed."
      });
    }

    const existingTask = await get(
      "SELECT id FROM tasks WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    await run(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [title.trim(), String(description).trim(), status, req.params.id, req.user.id]
    );

    const task = await get(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ error: "Could not update task" });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    const result = await run(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete task" });
  }
});

module.exports = router;
