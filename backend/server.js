import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import taskRoutes from './routes/tasks.js';
import groupRoutes from './routes/groups.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/tasks', taskRoutes);
app.use('/groups', groupRoutes);
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Catch-all for 404
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.path}`); // Debug log
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});