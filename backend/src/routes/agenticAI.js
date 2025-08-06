const express = require('express');
const router = express.Router();
const agenticAIController = require('../handlers/agenticAi');

// Admin-only endpoint to optimize all groups
router.post('/optimize-groups', agenticAIController.optimizeGroups);

// User-specific endpoints
router.post('/study-plan', agenticAIController.generateStudyPlan);
router.post('/allocate-rewards', agenticAIController.allocateRewards);
router.post('/groups/:groupId/recommend-resources', agenticAIController.recommendResources);
router.post('/groups/:groupId/monitor-health', agenticAIController.monitorGroupHealth);

module.exports = router;