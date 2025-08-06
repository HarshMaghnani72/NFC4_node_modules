const User = require('../models/user.model');
const Group = require('../models/group.model');
const Notification = require('../models/notification.model');
const mongoose = require('mongoose');

const generateStudyPlan = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error(`Invalid userId: ${userId}`);
  }
  console.log('agenticAi.generateStudyPlan called with userId:', userId); // Debug log
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const studyPlan = {
    userId,
    tasks: user.subjects.map(subject => ({
      title: `Study ${subject} - ${user.learningStyle} focus`,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      type: 'Watch Video'
    })),
    schedule: [],
    resources: user.subjects.map(subject => ({
      subject,
      url: `https://example.com/${subject.toLowerCase()}-resources`,
      type: user.learningStyle
    }))
  };

  user.studyPlans.push(studyPlan);
  await user.save();

  await Notification.create({
    userId,
    message: 'A new personalized study plan has been generated for you!',
    type: 'StudyPlan',
    timestamp: new Date()
  });

  return studyPlan;
};

const allocateRewards = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error(`Invalid userId: ${userId}`);
  }
  console.log('agenticAi.allocateRewards called with userId:', userId); // Debug log
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const contributionScore = user.studyHours + user.tasksCompleted * 2 + user.xp / 10;
  if (contributionScore > 50) {
    const reward = {
      type: 'Coupon',
      value: `COUPON-${userId}-${Date.now()}`,
      awardedAt: new Date()
    };
    user.rewards.push(reward);
    await user.save();

    await Notification.create({
      userId,
      message: `You earned a new reward: ${reward.type}!`,
      type: 'Reward',
      timestamp: new Date()
    });
  }
};

const recommendResources = async (groupId) => {
  if (!mongoose.isValidObjectId(groupId)) {
    throw new Error(`Invalid groupId: ${groupId}`);
  }
  console.log('agenticAi.recommendResources called with groupId:', groupId); // Debug log
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  const resources = group.subjects.map(subject => ({
    subject,
    url: `https://example.com/${subject.toLowerCase()}-resources`,
    type: group.learningStyle,
    recommendedAt: new Date()
  }));

  group.recommendedResources.push(...resources);
  await group.save();

  for (const memberId of group.members) {
    await Notification.create({
      userId: memberId,
      message: `New resources recommended for group ${group.name}!`,
      type: 'Resource',
      timestamp: new Date()
    });
  }
};

const monitorGroupHealth = async (groupId) => {
  if (!mongoose.isValidObjectId(groupId)) {
    throw new Error(`Invalid groupId: ${groupId}`);
  }
  console.log('agenticAi.monitorGroupHealth called with groupId:', groupId); // Debug log
  const group = await Group.findById(groupId).populate('members');
  if (!group) throw new Error('Group not found');

  const lowEngagementMembers = group.members.filter(member => member.studyHours < 10);
  if (lowEngagementMembers.length > group.members.length / 2) {
    for (const memberId of group.members) {
      await Notification.create({
        userId: memberId,
        message: `Group ${group.name} has low engagement. Consider increasing participation!`,
        type: 'GroupHealth',
        timestamp: new Date()
      });
    }
  }
};

const optimizeGroups = async () => {
  console.log('agenticAi.optimizeGroups called'); // Debug log
  const groups = await Group.find().populate('members');
  for (const group of groups) {
    if (group.activityScore < 50) {
      const highPerformers = await User.find({
        acceptInvites: true,
        studyHours: { $gt: 20 },
        _id: { $nin: group.members }
      }).limit(2);

      for (const user of highPerformers) {
        group.members.push(user._id);
        await Notification.create({
          userId: user._id,
          message: `You've been invited to join group ${group.name}!`,
          type: 'GroupInvite',
          timestamp: new Date()
        });
      }
      await group.save();
    }
  }
};

module.exports = {
  generateStudyPlan,
  allocateRewards,
  recommendResources,
  monitorGroupHealth,
  optimizeGroups
};