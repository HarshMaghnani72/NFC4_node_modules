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
const notificationRouter = require('./routes/notification.routes');
const virtualRoomRouter = require('./routes/virtualroom.routes');
const { setupWebSocketServer } = require('./handlers/websocket_handler');
const http = require('http');
const agenticAIRoutes = require('./routes/agenticAI');
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // Session TTL: 24 hours
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production with HTTPS
      sameSite: 'none', // Allow cross-site usage, adjust based on your needs
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/schedule', scheduleRouter);
app.use('/chat', chatRouter);
app.use('/progress', progressRouter);
app.use('/virtualroom', virtualRoomRouter);
app.use('/notification', notificationRouter);
<<<<<<< HEAD

// WebSocket setup
=======
app.use('/api/agentic-ai', agenticAIRoutes);
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e
setupWebSocketServer(server);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:'.red, err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 8000; // Changed to 8000 to avoid conflict with frontend

connect()
  .then(() => {
    console.log('Connected to database'.cyan);
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`.yellow);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:'.red, err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:'.red, err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:'.red, promise, 'reason:', reason);
  process.exit(1);
});