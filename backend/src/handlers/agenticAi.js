const User = require('../models/user.model');
const Group = require('../models/group.model');
const Notification = require('../models/notification.model');

// Simulated external API for educational rewards (replace with real API integration)
const rewardAPI = {
  async getCoupon(userId, subject) {
    return { code: `COUPON-${userId}-${Date.now()}`, value: '50% off', platform: subject.includes('Math') ? 'Khan Academy' : 'Coursera' };
  },
  async getTutorSession(userId) {
    return { sessionId: `TUTOR-${userId}-${Date.now()}`, duration: '30min', platform: 'TutorMe' };
  }
};

// Personalized Study Plan Generator
exports.generateStudyPlan = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const groups = await Group.find({ members: userId });
    const plan = {
      tasks: [],
      schedule: [],
      resources: []
    };

    // Generate tasks based on subjects and learning style
    user.subjects.forEach(subject => {
      plan.tasks.push({
        title: `Study ${subject} - ${user.learningStyle} focus`,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        type: user.learningStyle === 'Visual' ? 'Watch Video' : user.learningStyle === 'Auditory' ? 'Listen to Lecture' : 'Practice Problems'
      });
    });

    // Schedule group sessions
    groups.forEach(group => {
      plan.schedule.push({
        groupId: group._id,
        time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        duration: '1h',
        title: `Group Study: ${group.name}`
      });
    });

    // Recommend resources
    plan.resources = user.subjects.map(subject => ({
      subject,
      url: `https://example.com/${subject.toLowerCase()}-resources`,
      type: user.learningStyle
    }));

    await User.findByIdAndUpdate(userId, { $push: { studyPlans: plan } });
    await Notification.create({
      userId,
      message: 'A new personalized study plan has been generated for you!',
      read: false
    });
    return plan;
  } catch (error) {
    console.error('Error in generateStudyPlan:', error);
    throw error;
  }
};

// Keep other functions unchanged
exports.optimizeGroups = async () => {
  try {
    const groups = await Group.find().populate('members', 'xp studyHours tasksCompleted');
    for (const group of groups) {
      const activityThreshold = 50;
      if (group.activityScore < activityThreshold && group.members.length < group.maxMembers) {
        const potentialMembers = await User.find({
          subjects: { $in: group.subjects },
          learningStyle: group.learningStyle,
          acceptInvites: true,
          _id: { $nin: group.members }
        }).sort({ studyHours: -1 }).limit(3);

        for (const user of potentialMembers) {
          group.pendingInvites.push(user._id);
          await Notification.create({
            userId: user._id,
            message: `You're invited to join ${group.name} to boost group productivity!`,
            read: false
          });
        }
        await group.save();
      }
    }
    console.log('Group optimization completed');
  } catch (error) {
    console.error('Error in optimizeGroups:', error);
  }
};

exports.allocateRewards = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const contributionScore = user.studyHours + user.tasksCompleted * 2 + user.xp / 10;
    let reward = null;

    if (contributionScore > 100) {
      reward = await rewardAPI.getCoupon(userId, user.subjects[0]);
    } else if (contributionScore > 50) {
      reward = await rewardAPI.getTutorSession(userId);
    }

    if (reward) {
      await User.findByIdAndUpdate(userId, {
        $push: { rewards: { type: reward.platform, value: reward.code || reward.sessionId, awardedAt: new Date() } }
      });
      await Notification.create({
        userId,
        message: `Congratulations! You've earned a ${reward.platform} ${reward.code ? 'coupon' : 'tutor session'}!`,
        read: false
      });
    }
  } catch (error) {
    console.error('Error in allocateRewards:', error);
    throw error;
  }
};

exports.recommendResources = async (groupId) => {
  try {
    const group = await Group.findById(groupId).populate('members', 'learningStyle subjects');
    if (!group) throw new Error('Group not found');

    const primaryLearningStyle = group.learningStyle;
    const resources = group.subjects.map(subject => ({
      subject,
      url: `https://example.com/${subject.toLowerCase()}-resources`,
      type: primaryLearningStyle,
      recommendedAt: new Date()
    }));

    await Group.findByIdAndUpdate(groupId, { $push: { recommendedResources: { $each: resources } } });
    await Notification.create({
      userId: group.members.map(m => m._id),
      message: `New ${primaryLearningStyle} resources recommended for ${group.name}!`,
      read: false
    });
  } catch (error) {
    console.error('Error in recommendResources:', error);
    throw error;
  }
};

exports.monitorGroupHealth = async (groupId) => {
  try {
    const group = await Group.findById(groupId).populate('members', 'studyHours ratings');
    if (!group) throw new Error('Group not found');

    const lowEngagementUsers = group.members.filter(member => member.studyHours < 10);
    if (lowEngagementUsers.length > group.members.length / 2) {
      await Notification.create({
        userId: group.members.map(m => m._id),
        message: `Group ${group.name} shows low engagement. Consider scheduling a check-in or joining a new group.`,
        read: false
      });

      const activeUsers = await User.find({
        subjects: { $in: group.subjects },
        learningStyle: group.learningStyle,
        acceptInvites: true,
        _id: { $nin: group.members },
        studyHours: { $gte: 20 }
      }).limit(2);

      for (const user of activeUsers) {
        group.pendingInvites.push(user._id);
        await Notification.create({
          userId: user._id,
          message: `You're invited to join ${group.name} to enhance group activity!`,
          read: false
        });
      }
      await group.save();
    }
  } catch (error) {
    console.error('Error in monitorGroupHealth:', error);
    throw error;
  }
};