import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { connectToDatabase } from '../lib/mongodb.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await connectToDatabase();
    const { userId } = req.query;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    await connectToDatabase();
    const { userId } = req.body;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/', async (req, res) => {
  try {
    await connectToDatabase();
    const { id, userId, ...update } = req.body;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { $set: update },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

export default router;