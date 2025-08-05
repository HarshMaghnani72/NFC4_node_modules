const jwt = require('jsonwebtoken');
const User = require('../models/user.models');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token)
            throw new Error("Invalid Token");
        const decodedMsg = await jwt.verify(token, process.env.SECRET_KEY);
        const { _id } = decodedMsg;

        if (!_id)
            throw new Error("Invalid token");

        const user = await User.findById(_id);

        if (!user)
            throw new Error("User not found");
        else {
            req.user = user;
            next();
        }
    } catch (err) {
        res.status(400).json({ "Error": err.message });
    }
}

const agentAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token)
            throw new Error("Invalid Token");
        const decodedMsg = await jwt.verify(token, process.env.SECRET_KEY);
        const { _id } = decodedMsg;

        if (!_id)
            throw new Error("Invalid token");

        const user = await User.findById(_id);

        if (!user)
            throw new Error("User not found");
        else {
            if (user.userType == 'user') {
                res.status(401).json({ "Error": "Invalid Access" });
            } else {
                req.user = user;
                next();
            }
        }
    } catch (err) {
        res.status(400).json({ "Error": err.message });
    }
}

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token)
            throw new Error("Invalid Token");
        const decodedMsg = await jwt.verify(token, process.env.SECRET_KEY);
        const { _id } = decodedMsg;

        if (!_id)
            throw new Error("Invalid token");

        const user = await User.findById(_id);

        if (!user)
            throw new Error("User not found");
        else {
            if (user.userType != 'admin') {
                res.status(401).json({ "Error": "Invalid Access" });
            } else {
                req.user = user;
                next();
            }
        }
    } catch (err) {
        res.status(400).json({ "Error": err.message });
    }
}


module.exports = {
    userAuth, adminAuth, agentAuth
};