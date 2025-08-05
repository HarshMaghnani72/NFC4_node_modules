const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const agenticAI = require('./agenticAI');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { name, email, password, institute, subjects, language, availability, learningStyle, acceptInvites } = req.body;

    // Validate required fields
    if (!name || !email || !password || !institute) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate learningStyle
    const validLearningStyles = ['Visual', 'Auditory', 'Kinesthetic', 'Mixed'];
    if (learningStyle && !validLearningStyles.includes(learningStyle)) {
      return res.status(400).json({ error: 'Invalid learning style' });
    }

    // Validate availability dates
    if (availability && availability.start && availability.end) {
      if (new Date(availability.start) >= new Date(availability.end)) {
        return res.status(400).json({ error: 'Availability start must be before end' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      institute,
      subjects: subjects || [],
      language: language || 'English',
      availability: availability || {},
      learningStyle: learningStyle || 'Mixed',
      acceptInvites: acceptInvites !== undefined ? acceptInvites : true
    });

    await user.save();
    req.session.userId = user._id;

    // Trigger agentic AI features
    await agenticAI.generateStudyPlan(user._id); // Generate initial study plan
    await agenticAI.allocateRewards(user._id); // Check for initial rewards (e.g., welcome coupon)

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.session.userId = user._id;
        res.json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
};

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                name,
                email,
                password: 'google-auth',
                institute: '',
                subjects: [],
                language: 'English',
                availability: {},
                learningStyle: 'Visual'
            });
            await user.save();
        }
        req.session.userId = user._id;
        res.json({ message: 'Google login successful', userId: user._id });
    } catch (error) {
        res.status(400).json({ error: 'Google login failed: ' + error.message });
    }
};