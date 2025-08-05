const Ticket = require('../models/ticket.models');
const User = require('../models/user.models');
const Category = require('../models/category.models');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
/**
 * Create a new ticket (authenticated user or agent)
 * @route POST /ticket/createTicket
 */
const createTicket = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;
        const files = req.files;

        if (!title || !description || !category) {
            return res.status(400).json({ error: 'Title, description, and category are required.' });
        }

        // Validate category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ error: 'Invalid category.' });
        }

        // Validate priority
        if (priority && !['high', 'medium', 'low'].includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority. Must be high, medium, or low.' });
        }

        const attachments = files?.map(file => file.path) || [];

        const ticket = await Ticket.create({
            title,
            description,
            category,
            priority: priority || 'medium',
            createdBy: req.user._id,
            attachments
        });

        // Send email notification
        await sendEmailNotification(req.user.email, 'Ticket Created', `Your ticket "${title}" has been created successfully.`);

        return res.status(201).json({
            message: 'Ticket created successfully',
            ticket: {
                ...ticket.toJSON(),
                conversationCount: ticket.chat.length
            }
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * View all tickets (admin/agent) with pagination, filters, and sorting
 * @route GET /ticket?page=1&limit=10&status=open&category=xyz&sort=createdAt&sortByPriority=true&createdBy=email&minConversations=2&maxConversations=10
 */
const viewAllTickets = async (req, res) => {
    try {
        // Restrict to admin or agent
        if (!['admin', 'userAgent'].includes(req.user.userType)) {
            return res.status(403).json({ error: 'Unauthorized: Admin or Agent access required' });
        }

        const {
            page = 1,
            limit = 10,
            status,
            category,
            sort = 'createdAt',
            sortByPriority,
            sortByConversations,
            createdBy,
            minConversations,
            maxConversations,
            priority
        } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;
        if (minConversations || maxConversations) {
            query['chat.length'] = {};
            if (minConversations) query['chat.length'].$gte = parseInt(minConversations);
            if (maxConversations) query['chat.length'].$lte = parseInt(maxConversations);
        }
        if (createdBy) {
            const user = await User.findOne({ email: createdBy });
            if (user) query.createdBy = user._id;
            else return res.status(400).json({ error: 'User not found' });
        }

        const total = await Ticket.countDocuments(query);

        let sortOptions = { [sort]: -1 };
        if (sortByPriority === 'true') {
            sortOptions = { priority: -1, [sort]: -1 };
        } else if (sortByConversations === 'true') {
            sortOptions = { 'chat.length': -1, [sort]: -1 };
        }

        const tickets = await Ticket.find(query)
            .populate('createdBy', 'firstName lastName email')
            .populate('category', 'name')
            .populate('assignedTo', 'firstName lastName email')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const ticketsWithConversationCount = tickets.map(ticket => ({
            ...ticket.toJSON(),
            conversationCount: ticket.chat.length
        }));

        return res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            tickets: ticketsWithConversationCount
        });
    } catch (error) {
        console.error('Error fetching all tickets:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * View logged-in user's own tickets with pagination
 * @route GET /ticket/my?page=1&limit=10&status=open&category=xyz&sort=createdAt&sortByPriority=true&sortByConversations=true
 */
const viewMyTickets = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            category,
            sort = 'createdAt',
            sortByPriority,
            sortByConversations,
            priority
        } = req.query;
        const skip = (page - 1) * limit;

        let query = { createdBy: req.user._id };
        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        const total = await Ticket.countDocuments(query);

        let sortOptions = { [sort]: -1 };
        if (sortByPriority === 'true') {
            sortOptions = { priority: -1, [sort]: -1 };
        } else if (sortByConversations === 'true') {
            sortOptions = { 'chat.length': -1, [sort]: -1 };
        }

        const tickets = await Ticket.find(query)
            .populate('category', 'name')
            .populate('assignedTo', 'firstName lastName email')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const ticketsWithConversationCount = tickets.map(ticket => ({
            ...ticket.toJSON(),
            conversationCount: ticket.chat.length
        }));

        return res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            tickets: ticketsWithConversationCount
        });
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get all tickets without any filtration (admin only)
 * @route GET /ticket/all?page=1&limit=10&sort=createdAt&sortByPriority=true&sortByConversations=true
 */
const getAllTicketsUnfiltered = async (req, res) => {
    try {
        // if (req.user.userType !== 'admin') {
        //     return res.status(403).json({ error: 'Unauthorized: Admin access required' });
        // }

        const {
            page = 1,
            limit = 10,
            sort = 'createdAt',
            sortByPriority,
            sortByConversations
        } = req.query;
        const skip = (page - 1) * limit;

        const total = await Ticket.countDocuments();

        let sortOptions = { [sort]: -1 };
        if (sortByPriority === 'true') {
            sortOptions = { priority: -1, [sort]: -1 };
        } else if (sortByConversations === 'true') {
            sortOptions = { 'chat.length': -1, [sort]: -1 };
        }

        const tickets = await Ticket.find()
            .populate('createdBy', 'firstName lastName email')
            .populate('category', 'name')
            .populate('assignedTo', 'firstName lastName email')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const ticketsWithConversationCount = tickets.map(ticket => ({
            ...ticket.toJSON(),
            conversationCount: ticket.chat.length
        }));

        return res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            tickets: ticketsWithConversationCount
        });
    } catch (error) {
        console.error('Error fetching all tickets:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get all tickets with detailed information (admin/agent)
 * @route GET /ticket/detailed?page=1&limit=10&status=open&category=xyz&sort=createdAt&sortByPriority=true&sortByConversations=true&createdBy=email&minConversations=2&maxConversations=10
 */
const getAllTicketsDetailed = async (req, res) => {
    try {
        // Restrict to admin or agent
        if (!['admin', 'userAgent'].includes(req.user.userType)) {
            return res.status(403).json({ error: 'Unauthorized: Admin or Agent access required' });
        }

        const {
            page = 1,
            limit = 10,
            status,
            category,
            sort = 'createdAt',
            sortByPriority,
            sortByConversations,
            createdBy,
            minConversations,
            maxConversations,
            priority
        } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;
        if (minConversations || maxConversations) {
            query['chat.length'] = {};
            if (minConversations) query['chat.length'].$gte = parseInt(minConversations);
            if (maxConversations) query['chat.length'].$lte = parseInt(maxConversations);
        }
        if (createdBy) {
            const user = await User.findOne({ email: createdBy });
            if (user) query.createdBy = user._id;
            else return res.status(400).json({ error: 'User not found' });
        }

        const total = await Ticket.countDocuments(query);

        let sortOptions = { [sort]: -1 };
        if (sortByPriority === 'true') {
            sortOptions = { priority: -1, [sort]: -1 };
        } else if (sortByConversations === 'true') {
            sortOptions = { 'chat.length': -1, [sort]: -1 };
        }

        const tickets = await Ticket.find(query)
            .populate('createdBy', 'firstName lastName email')
            .populate('category', 'name description')
            .populate('assignedTo', 'firstName lastName email')
            .populate('chat.sender', 'firstName lastName')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const ticketsWithConversationCount = tickets.map(ticket => ({
            ...ticket.toJSON(),
            conversationCount: ticket.chat.length
        }));

        return res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            tickets: ticketsWithConversationCount
        });
    } catch (error) {
        console.error('Error fetching detailed tickets:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Search tickets by title, description, or category
 * @route GET /ticket/search?query=xyz&page=1&limit=10&status=open&sort=createdAt&sortByPriority=true&sortByConversations=true&createdBy=email&priority=high
 */
const searchTickets = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };

        if (req.user.userType === 'user') {
            searchQuery.createdBy = req.user._id;
        }

        const total = await Ticket.countDocuments(searchQuery);

        const tickets = await Ticket.find(searchQuery)
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        return res.status(200).json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            tickets
        });
    } catch (error) {
        console.error('Error searching tickets:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


/**
 * Generate a publicly shareable link for ticket conversation
 * @route POST /ticket/:id/share
 */
const generateShareLink = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        const shareLink = `${process.env.CLIENT_URL}/ticket/${req.params.id}`;

        return res.status(200).json({
            message: 'Share link generated successfully',
            shareLink,
            ticket: {
                ...ticket.toJSON(),
                conversationCount: ticket.chat.length
            }
        });
    } catch (error) {
        console.error('Error generating share link:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * View shared ticket conversation (public access)
 * @route GET /ticket/share/:shareToken
 */
const viewSharedTicket = async (req, res) => {
    try {
        // Decode JWT share token
        let decoded;
        try {
            decoded = jwt.verify(req.params.shareToken, process.env.SECRET_KEY);
        } catch (jwtError) {
            console.error('Invalid share token:', jwtError);
            return res.status(401).json({ error: 'Invalid or expired share token' });
        }

        const ticket = await Ticket.findById(decoded.ticketId)
            .populate('createdBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('category', 'name')
            .populate('chat.sender', 'firstName lastName');

        if (!ticket) {
            return res.status(404).json({ error: 'Shared ticket not found' });
        }

        return res.status(200).json({
            ticket: {
                ...ticket.toJSON(),
                conversationCount: ticket.chat.length
            }
        });
    } catch (error) {
        console.error('Error viewing shared ticket:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Close ticket by owner when satisfied
 * @route PUT /ticket/:id/close
 */
const closeTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (ticket.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Only the ticket owner can close this ticket' });
        }

        if (ticket.status === 'closed') {
            return res.status(400).json({ error: 'Ticket is already closed' });
        }

        ticket.status = 'closed';
        await ticket.save();

        // Send email notification to assigned agent (if exists)
        if (ticket.assignedTo) {
            const agent = await User.findById(ticket.assignedTo);
            await sendEmailNotification(agent.email, 'Ticket Closed', `Ticket "${ticket.title}" has been closed by the owner.`);
        }

        return res.status(200).json({
            message: 'Ticket closed successfully',
            ticket: {
                ...ticket.toJSON(),
                conversationCount: ticket.chat.length
            }
        });
    } catch (error) {
        console.error('Error closing ticket:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Assign ticket to an agent
 * @route PUT /ticket/:id/assign
 */
const assignTicket = async (req, res) => {
    try {
        if (!['admin', 'userAgent'].includes(req.user.userType)) {
            return res.status(403).json({ error: 'Unauthorized: Agent or Admin access required' });
        }

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (ticket.status !== 'open') {
            return res.status(400).json({ error: 'Only open tickets can be assigned' });
        }

        ticket.assignedTo = req.user._id;
        ticket.status = 'in-progress';
        await ticket.save();

        // Send email notification
        await sendEmailNotification(req.user.email, 'Ticket Assigned', `Ticket "${ticket.title}" has been assigned to you.`);

        return res.status(200).json({
            message: 'Ticket assigned successfully',
            ticket: {
                ...ticket.toJSON(),
                conversationCount: ticket.chat.length
            }
        });
    } catch (error) {
        console.error('Error assigning ticket:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update ticket status
 * @route PUT /ticket/:id/status
 */
const updateTicketStatus = async (req, res) => {
    try {
        if (!['admin', 'userAgent'].includes(req.user.userType)) {
            return res.status(403).json({ error: 'Unauthorized: Agent or Admin access required' });
        }

        const { status } = req.body;
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        ticket.status = status;
        await ticket.save();

        // Send email notification to ticket creator
        const creator = await User.findById(ticket.createdBy);
        await sendEmailNotification(creator.email, 'Ticket Status Updated', `Your ticket "${ticket.title}" status has been updated to ${status}.`);

        return res.status(200).json({
            message: 'Ticket status updated successfully',
            ticket: {
                ...ticket.toJSON(),
                conversationCount: ticket.chat.length
            }
        });
    } catch (error) {
        console.error('Error updating ticket status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Add chat message to ticket
 * @route PATCH /ticket/addChat/:id
 */
const addChatMessage = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message cannot be empty.' });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found.' });
        }

        // Allow only ticket creator, assigned agent, or admin to comment
        if (
            ticket.createdBy.toString() !== req.user._id.toString() &&
            req.user.userType === 'user'
        ) {
            return res.status(403).json({ error: 'Unauthorized to comment on this ticket.' });
        }

        ticket.chat.push({
            sender: req.user._id,
            message,
            timestamp: new Date()
        });

        await ticket.save();

        // Send email notification to ticket creator if commenter is not the creator
        if (ticket.createdBy.toString() !== req.user._id.toString()) {
            const creator = await User.findById(ticket.createdBy);
            await sendEmailNotification(creator.email, 'New Comment on Ticket', `A new comment has been added to your ticket "${ticket.title}".`);
        }

        // Send email notification to assigned agent if commenter is not the agent
        if (ticket.assignedTo && ticket.assignedTo.toString() !== req.user._id.toString()) {
            const agent = await User.findById(ticket.assignedTo);
            await sendEmailNotification(agent.email, 'New Comment on Ticket', `A new comment has been added to ticket "${ticket.title}".`);
        }

        return res.status(200).json({
            message: 'Message added.',
            chat: ticket.chat,
            conversationCount: ticket.chat.length
        });
    } catch (error) {
        console.error('Error adding chat message:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Upvote or downvote a ticket
 * @route PUT /ticket/:id/vote
 */
const voteTicket = async (req, res) => {
    try {
        const { voteType } = req.body; // 'upvote' or 'downvote'
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (voteType === 'upvote') {
            ticket.upvotes += 1;
        } else if (voteType === 'downvote') {
            ticket.downvotes += 1;
        } else {
            return res.status(400).json({ error: 'Invalid vote type' });
        }

        await ticket.save();
        return res.status(200).json({
            message: `Ticket ${voteType}d successfully`,
            ticket: {
                ...ticket.toJSON(),
                conversationCount: ticket.chat.length
            }
        });
    } catch (error) {
        console.error('Error voting on ticket:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Email notification utility
 */
const sendEmailNotification = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
/**
 * Get ticket counts by status (admin/agent)
 * @route GET /ticket/status-counts
 */
const getTicketStatusCounts = async (req, res) => {
    try {
        const userType = req.user.userType;

        if (!['admin', 'userAgent', 'user'].includes(userType)) {
            return res.status(403).json({ error: 'Unauthorized: Access denied' });
        }

        const matchStage =
            userType === 'user'
                ? { $match: { createdBy: req.user._id } }
                : {}; // No filter for admin/agent

        const pipeline = [
            ...(matchStage.$match ? [matchStage] : []),
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: '$_id',
                    count: 1
                }
            }
        ];

        const counts = await Ticket.aggregate(pipeline);

        const statusCounts = {
            open: 0,
            'in-progress': 0,
            resolved: 0,
            closed: 0,
            total: 0
        };

        counts.forEach(({ status, count }) => {
            if (status in statusCounts) {
                statusCounts[status] = count;
                statusCounts.total += count;
            }
        });

        return res.status(200).json({
            message: 'Ticket status counts retrieved successfully',
            counts: statusCounts
        });
    } catch (error) {
        console.error('Error fetching ticket status counts:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email')
            .populate('category', 'name')
            .populate('chat.sender', 'firstName lastName email');

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        const ticketsWithConversationCount = {
            ...ticket.toJSON(),
            conversationCount: ticket.chat.length
        };

        res.status(200).json(ticketsWithConversationCount);
    } catch (error) {
        console.error('Error fetching ticket by ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    createTicket,
    viewAllTickets,
    viewMyTickets,
    addChatMessage,
    assignTicket,
    updateTicketStatus,
    voteTicket,
    searchTickets,
    getAllTicketsUnfiltered,
    closeTicket,
    generateShareLink,
    viewSharedTicket,
    getAllTicketsDetailed,
    getTicketStatusCounts,
    getTicketById
};