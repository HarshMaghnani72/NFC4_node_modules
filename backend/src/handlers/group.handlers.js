const Group = require('../models/group.model');
const User = require('../models/user.model');
const { KMeans } = require('ml-kmeans');
const { RandomForestClassifier } = require('ml-random-forest');
const agenticAI = require('./agenticAi');

exports.getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const groups = await Group.find({
      subjects: { $in: user.subjects },
      learningStyle: user.learningStyle,
      members: { $nin: [req.session.userId] }
    }).populate('members', 'name xp studyHours tasksCompleted ratings');

    if (!groups || groups.length === 0) {
      await User.findByIdAndUpdate(req.session.userId, {
        $push: { matchHistory: { groups: [], timestamp: new Date(), scores: [] } }
      });
      return res.json([]);
    }

    const trainingData = [];
    const labels = [];
    const userFeatures = [
      user.subjects.length || 0,
      user.learningStyle === 'Visual' ? 1 : user.learningStyle === 'Auditory' ? 2 : 3,
      user.studyHours || 0,
      user.tasksCompleted || 0,
      user.xp || 0,
      (user.ratings.length ? user.ratings.reduce((sum, r) => sum + r.score, 0) / user.ratings.length : 0)
    ];

    for (const group of groups) {
      const memberCount = group.members.length || 1;
      const avgMemberXP = group.members.reduce((sum, m) => sum + (m.xp || 0), 0) / memberCount;
      const avgStudyHours = group.members.reduce((sum, m) => sum + (m.studyHours || 0), 0) / memberCount;
      const avgRating = group.members.reduce((sum, m) => {
        const rating = m.ratings.length ? m.ratings.reduce((rSum, r) => rSum + r.score, 0) / m.ratings.length : 0;
        return sum + rating;
      }, 0) / memberCount;
      const commonSubjects = group.subjects.filter(s => user.subjects.includes(s)).length;
      const features = [
        commonSubjects || 0,
        group.learningStyle === user.learningStyle ? 1 : 0,
        avgStudyHours || 0,
        group.members.length || 0,
        avgMemberXP || 0,
        avgRating || 0
      ];
      trainingData.push(features);
      labels.push(group.members.length > 2 && avgMemberXP > 100 ? 1 : 0);
    }

    let predictions = new Array(groups.length).fill(0);
    if (trainingData.length >= 2 && trainingData.every(features => features.length === 6)) {
      try {
        const options = { seed: 42, maxFeatures: 0.8, replacement: true, nEstimators: 50 };
        const classifier = new RandomForestClassifier(options);
        classifier.train(trainingData, labels);
        predictions = classifier.predict(trainingData);
      } catch (error) {
        console.warn('Random Forest training failed:', error.message);
      }
    }

    const scoredGroups = groups.map((group, index) => {
      let compatibilityScore = 0;
      const commonSubjects = group.subjects.filter(s => user.subjects.includes(s)).length;
      compatibilityScore += (commonSubjects / (user.subjects.length || 1)) * 45;
      if (group.learningStyle === user.learningStyle) {
        compatibilityScore += 25;
      }
      const avgMemberXP = group.members.length
        ? group.members.reduce((sum, m) => sum + (m.xp || 0), 0) / group.members.length
        : 0;
      compatibilityScore += (Math.min(avgMemberXP / (user.xp || 1), 1)) * 30;
      return {
        ...group._doc,
        compatibilityScore: Math.max(compatibilityScore, predictions[index] * 100)
      };
    });

    scoredGroups.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    await User.findByIdAndUpdate(req.session.userId, {
      $push: { matchHistory: { groups: scoredGroups.map(g => g._id), timestamp: new Date(), scores: predictions } }
    });

    res.json(scoredGroups);
  } catch (error) {
    console.error('Error in getMatches:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await Group.findById(groupId);
    const user = await User.findById(req.session.userId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.acceptInvites) return res.status(403).json({ error: 'User has disabled group invites' });
    if (group.members.length >= group.maxMembers) return res.status(400).json({ error: 'Group has reached maximum members' });
    if (!group.members.includes(req.session.userId)) {
      group.members.push(req.session.userId);
      await group.save();
      await require('./notification.handlers').sendNotification(
        group.members.filter(id => id.toString() !== req.session.userId),
        `New member ${user.name} joined group ${group.name}`
      );
      await Group.findByIdAndUpdate(groupId, { $inc: { activityScore: 10 } });
      await agenticAI.recommendResources(groupId); // Recommend resources on join
      await agenticAI.allocateRewards(req.session.userId); // Check for rewards
    }
    res.json({ message: 'Joined group successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, subjects, learningStyle, maxMembers, description } = req.body;
    const group = new Group({
      name,
      subjects,
      learningStyle,
      maxMembers: maxMembers || 5,
      description: description || '',
      members: [req.session.userId],
      activityScore: 0
    });
    await group.save();
    await agenticAI.recommendResources(group._id); // Recommend resources for new group
    await agenticAI.generateStudyPlan(req.session.userId); // Generate study plan for creator
    res.status(201).json({ message: 'Group created', groupId: group._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email xp');
    if (!group) return res.status(404).json({ error: 'Group not found' });
    await agenticAI.monitorGroupHealth(req.params.id); // Monitor group health on access
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.approveInvite = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!group.pendingInvites.includes(userId)) {
      return res.status(400).json({ error: 'No pending invite for this user' });
    }
    if (group.members.length >= group.maxMembers) return res.status(400).json({ error: 'Group has reached maximum members' });
    group.pendingInvites = group.pendingInvites.filter(id => id.toString() !== userId);
    group.members.push(userId);
    await group.save();
    await require('./notification.handlers').sendNotification(
      [userId],
      `Your invite to group ${group.name} was approved`
    );
    await Group.findByIdAndUpdate(groupId, { $inc: { activityScore: 5 } });
    await agenticAI.recommendResources(groupId); // Recommend resources on new member
    await agenticAI.allocateRewards(userId); // Check for rewards
    res.json({ message: 'Invite approved' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.declineInvite = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    group.pendingInvites = group.pendingInvites.filter(id => id.toString() !== userId);
    await group.save();
    await require('./notification.handlers').sendNotification(
      [userId],
      `Your invite to group ${group.name} was declined`
    );
    res.json({ message: 'Invite declined' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.autonomousGroupFormation = async (req, res) => {
  try {
    const users = await User.find({ acceptInvites: true });
    if (users.length < 2) return res.status(400).json({ error: 'Not enough users for group formation' });

    const features = users.map(user => [
      user.subjects.length,
      user.learningStyle === 'Visual' ? 1 : user.learningStyle === 'Auditory' ? 2 : 3,
      user.studyHours || 0,
      user.tasksCompleted || 0,
      user.xp || 0,
      (user.ratings.reduce((sum, r) => sum + r.score, 0) / (user.ratings.length || 1)) || 0
    ]);

    const kmeans = KMeans(features, Math.min(10, Math.floor(users.length / 2)), { seed: 42 });
    const clusters = kmeans.clusters.reduce((acc, cluster, idx) => {
      acc[cluster] = acc[cluster] || [];
      acc[cluster].push(users[idx]._id);
      return acc;
    }, {});

    const createdGroups = [];
    for (const cluster of Object.values(clusters)) {
      if (cluster.length >= 2) {
        const representativeUser = await User.findById(cluster[0]);
        const group = new Group({
          name: `Auto-Group-${Date.now()}`,
          subjects: representativeUser.subjects,
          learningStyle: representativeUser.learningStyle,
          maxMembers: Math.min(cluster.length + 2, 10),
          description: `Automatically formed group for ${representativeUser.subjects.join(', ')}`,
          members: cluster,
          pendingInvites: [],
          activityScore: 0
        });
        await group.save();
        createdGroups.push(group._id);
        await require('./notification.handlers').sendNotification(
          cluster,
          `You have been added to a new auto-formed group: ${group.name}`
        );
        await agenticAI.recommendResources(group._id); // Recommend resources for new group
        for (const userId of cluster) {
          await agenticAI.generateStudyPlan(userId); // Generate study plans for members
          await agenticAI.allocateRewards(userId); // Check for rewards
        }
      }
    }

    res.json({ message: 'Autonomous group formation completed', groupsCreated: createdGroups.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupSuccessMetrics = async (req, res) => {
  try {
    const groups = await Group.find().select('name members activityScore maxMembers description recommendedResources');
    const metrics = await Promise.all(groups.map(async group => {
      const members = await User.find({ _id: { $in: group.members } }).select('tasksCompleted xp rewards');
      const avgTasksCompleted = members.reduce((sum, m) => sum + m.tasksCompleted, 0) / members.length;
      const avgXP = members.reduce((sum, m) => sum + m.xp, 0) / members.length;
      const rewardCount = members.reduce((sum, m) => sum + m.rewards.length, 0);
      return {
        groupId: group._id,
        name: group.name,
        description: group.description,
        memberCount: group.members.length,
        maxMembers: group.maxMembers,
        activityScore: group.activityScore,
        avgTasksCompleted,
        avgXP,
        rewardCount,
        recommendedResources: group.recommendedResources.length
      };
    }));
    res.json(metrics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const groups = await Group.find({ 
      $or: [
        { members: userId },
        { pendingInvites: userId }
      ]
    }).populate('members', 'name email xp');

    const formattedGroups = groups.map(group => ({
      groupId: group._id,
      name: group.name,
      description: group.description,
      subjects: group.subjects,
      learningStyle: group.learningStyle,
      memberCount: group.members.length,
      maxMembers: group.maxMembers,
      activityScore: group.activityScore,
      isMember: group.members.some(member => member._id.toString() === userId),
      isPending: group.pendingInvites.includes(userId),
      members: group.members.map(member => ({
        id: member._id,
        name: member.name,
        email: member.email,
        xp: member.xp
      })),
      recommendedResources: group.recommendedResources
    }));

    await agenticAI.generateStudyPlan(userId); // Generate/update study plan on access
    res.json(formattedGroups);
  } catch (error) {
    console.error('Error in getMyGroups:', error);
    res.status(400).json({ error: error.message });
  }
};