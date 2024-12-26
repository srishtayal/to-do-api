const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id;

  try {
    await db.query('INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)', [
      title,
      description,
      status,
      userId,
    ]);
    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, status } = req.body;
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const [task] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [
      userId,
    ]);
    if (task.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await db.query('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [
      title,
      description,
      status,
      taskId,
    ]);
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const [task] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [
      userId,
    ]);
    if (task.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
