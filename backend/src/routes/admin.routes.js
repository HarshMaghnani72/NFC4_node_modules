const express = require('express');
const adminRouter = express.Router();
const { adminAuth } = require('../middleware/auth.middleware');
const { userAuth } = require('../middleware/auth.middleware');
const {
    createAgent,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getAllUsers,
    updateUserRole
} = require('../handlers/admin.handlers');

adminRouter.post('/createAgent', adminAuth, createAgent);
adminRouter.post('/categories', adminAuth, createCategory);
adminRouter.put('/categories/:id', adminAuth, updateCategory);
adminRouter.delete('/categories/:id', adminAuth, deleteCategory);
adminRouter.get('/categories', userAuth, getAllCategories);
adminRouter.get('/users', adminAuth, getAllUsers);
adminRouter.put('/users/:id/role', adminAuth, updateUserRole);

module.exports = adminRouter;