const mongoose = require('mongoose');

const connect = async (req, res) => {
    await mongoose.connect(process.env.MONGO_URI);
}

module.exports = { connect };