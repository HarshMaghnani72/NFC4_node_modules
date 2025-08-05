import express from 'express';
import Group from '../models/Group.js';
import { connectToDatabase } from '../lib/mongodb.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await connectToDatabase();
    const { userId } = req.query;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    const groups = await Group.find({ members: userId });
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

export default router;