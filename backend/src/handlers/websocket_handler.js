const WebSocket = require('ws');
const User = require('../models/user.model');
const Group = require('../models/group.model');

let wss;

function setupWebSocketServer(server) {
  try {
    wss = new WebSocket.Server({ server, port: 8080 });
    console.log('WebSocket server started on ws://localhost:8080');

    wss.clients = new Set();

    wss.on('connection', async (ws, req) => {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const userId = url.searchParams.get('userId');
        const groups = url.searchParams.get('groups')?.split(',') || [];

        // Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
          console.error('Invalid userId:', userId);
          ws.close(1008, 'Invalid userId');
          return;
        }

        // Validate groups
        const validGroups = [];
        for (const groupId of groups) {
          if (!mongoose.Types.ObjectId.isValid(groupId)) {
            console.error('Invalid groupId:', groupId);
            continue;
          }
          const group = await Group.findById(groupId);
          if (!group || !group.members.some(member => member._id.toString() === userId)) {
            console.error('User not a member of group:', groupId);
            continue;
          }
          validGroups.push(groupId);
        }

        ws.isAlive = true;
        ws.userId = userId;
        ws.groups = validGroups;

        console.log(`WebSocket connected: userId=${userId}, groups=${validGroups.join(',')}`);

        ws.on('pong', () => {
          ws.isAlive = true;
        });

        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message);
            if (data.type === 'joinGroup' && mongoose.Types.ObjectId.isValid(data.groupId)) {
              const group = await Group.findById(data.groupId);
              if (group && group.members.some(member => member._id.toString() === userId)) {
                ws.groups.push(data.groupId);
                console.log(`User ${userId} joined group ${data.groupId}`);
              }
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        });

        ws.on('close', () => {
          wss.clients.delete(ws);
          console.log(`WebSocket disconnected: userId=${userId}`);
        });

        wss.clients.add(ws);
      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close(1011, 'Server error');
      }
    });

    // Heartbeat
    const interval = setInterval(() => {
      wss.clients.forEach(ws => {
        if (!ws.isAlive) {
          console.log(`Terminating inactive client: userId=${ws.userId}`);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    wss.on('close', () => {
      clearInterval(interval);
      console.log('WebSocket server closed');
    });

    wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  } catch (error) {
    console.error('Failed to start WebSocket server:', error);
  }
}

function getWebSocketServer() {
  if (!wss) {
    console.error('WebSocket server not initialized');
    throw new Error('WebSocket server not initialized');
  }
  return wss;
}

module.exports = { setupWebSocketServer, getWebSocketServer };