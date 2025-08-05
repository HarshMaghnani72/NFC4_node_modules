const User = require('../models/user.model');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

exports.getSchedule = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.json(user.availability);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateSchedule = async (req, res) => {
    try {
        const { availability } = req.body;
        await User.findByIdAndUpdate(req.session.userId, { availability });
        res.json({ message: 'Schedule updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.syncGoogleCalendar = async (req, res) => {
    try {
        const { accessToken } = req.body;
        oauth2Client.setCredentials({ access_token: accessToken });
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const user = await User.findById(req.session.userId);
        const { start, end } = user.availability;

        const event = {
            summary: 'Study Group Session',
            start: { dateTime: start.toISOString() },
            end: { dateTime: end.toISOString() }
        };

        await calendar.events.insert({
            calendarId: 'primary',
            resource: event
        });

        res.json({ message: 'Calendar synced successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Calendar sync failed: ' + error.message });
    }
};