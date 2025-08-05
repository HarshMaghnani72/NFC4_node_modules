const express = require('express');
const router = express.Router();
const upload = require('../middleware/cloudinaryStorage');
const { userAuth, agentAuth } = require('../middleware/auth.middleware');
const {
    createTicket,
    viewAllTickets,
    viewMyTickets,
    addChatMessage,
    assignTicket,
    updateTicketStatus,
    voteTicket,
    getAllTicketsUnfiltered,
    getAllTicketsDetailed,
    searchTickets,
    closeTicket,
    generateShareLink,
    viewSharedTicket,
    getTicketStatusCounts,
    getTicketById
} = require('../handlers/ticket.handlers');

router.post('/createTicket', userAuth, upload.array('attachments', 3), createTicket);
router.get('/', agentAuth, viewAllTickets);
router.get('/my', userAuth, viewMyTickets);
router.patch('/addChat/:id', userAuth, addChatMessage);
router.put('/:id/assign', agentAuth, assignTicket);
router.put('/:id/status', agentAuth, updateTicketStatus);
router.put('/:id/vote', userAuth, voteTicket);
router.get('/all', userAuth, getAllTicketsUnfiltered);
router.get('/detailed', agentAuth, getAllTicketsDetailed);
router.get('/search', userAuth, searchTickets);
router.put('/:id/close', userAuth, closeTicket);
router.post('/:id/share', userAuth, generateShareLink);
router.get('/share/:shareToken', viewSharedTicket);
router.get('/status-counts', userAuth, getTicketStatusCounts);
router.get('/:id', userAuth, getTicketById);
module.exports = router;