// backend/src/routes/group.routes.js
const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); // Adjust path if needed

router.post('/join', async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user?.id; // Assuming authentication middleware

    if (!groupId || !userId) {
      return res.status(400).json({ error: 'Group ID and User ID are required' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ error: 'Group is full' });
    }

    group.pendingMembers = group.pendingMembers || [];
    group.pendingMembers.push(userId);
    await group.save();

    res.status(200).json({ message: 'Join request sent successfully' });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

module.exports = router;