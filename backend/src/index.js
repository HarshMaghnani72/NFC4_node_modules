require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const colors = require('colors');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { connect } = require('./config/dbconnection');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const groupRouter = require('./routes/group.routes');
const scheduleRouter = require('./routes/schedule.routes');
const chatRouter = require('./routes/chat.routes');
const progressRouter = require('./routes/progress.routes');
const virtualRoomRouter = require('./routes/virtualroom.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',
    credentials: true
}));

// Session middleware for cookie-based authentication
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/schedule', scheduleRouter);
app.use('/chat', chatRouter);
app.use('/progress', progressRouter);
app.use('/virtualroom', virtualRoomRouter);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack.red);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

connect()
    .then(() => {
        console.log("Connected to database".cyan);
        app.listen(PORT, () => {
            console.log(`Listening to port ${PORT}`.yellow);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:'.red, err);
        process.exit(1);
    });