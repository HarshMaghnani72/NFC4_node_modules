const User = require('../models/user.models');
const Category = require('../models/category.models');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');

/**
 * Create a support agent
 * @route POST /admin/createAgent
 */
const createAgent = async (req, res) => {
    try {
        validateSignUpData(req);

        const user = req.body;

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const ALLOWED_INSERT = ['firstName', 'lastName', 'email', 'password', 'phone', 'age', 'gender', 'profilePicture'];

        const isAllowed = Object.keys(user).every(k => ALLOWED_INSERT.includes(k));

        if (!isAllowed)
            throw new Error("Invalid data");

        const newUser = new User({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: hashedPassword,
            age: user.age,
            gender: user.gender,
            userType: 'userAgent'
        });
        await newUser.save();

        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            gender: user.gender,
            userType: 'userAgent'
        });
    } catch (err) {
        res.status(400).json({ "Error saving the info": err.message });
    }
};

/**
 * Create a new category
 * @route POST /admin/categories
 */
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const category = await Category.create({
            name,
            description,
            createdBy: req.user._id
        });

        return res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update a category
 * @route PUT /admin/categories/:id
 */
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        if (name) category.name = name;
        if (description) category.description = description;
        await category.save();

        return res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete a category
 * @route DELETE /admin/categories/:id
 */
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if category is used in any tickets
        const ticketCount = await Ticket.countDocuments({ category: req.params.id });
        if (ticketCount > 0) {
            return res.status(400).json({ error: 'Cannot delete category with associated tickets' });
        }

        await category.remove();
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get all categories
 * @route GET /admin/categories
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('createdBy', 'firstName lastName');
            console.log('Fetched categories:', categories);
        return res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get all users (for admin user management)
 * @route GET /admin/users
 */
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (role) query.userType = role;

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update user role
 * @route PUT /admin/users/:id/role
 */
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'userAgent', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.userType = role;
        await user.save();

        return res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createAgent,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getAllUsers,
    updateUserRole
};