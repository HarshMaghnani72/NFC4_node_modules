const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });
const rooms = new Map();

wss.on('connection', (ws, req) => {
    const roomId = req.url.split('/').pop();
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(ws);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'whiteboard') {
            rooms.get(roomId).forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'whiteboard', data: data.content }));
                }
            });
        } else if (data.type === 'pomodoro') {
            rooms.get(roomId).forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'pomodoro', time: data.time }));
                }
            });
        }
    });

    ws.on('close', () => {
        rooms.get(roomId).delete(ws);
        if (rooms.get(roomId).size === 0) {
            rooms.delete(roomId);
        }
    });
});

exports.startSession = (req, res) => {
    try {
        const { groupId } = req.body;
        res.json({ message: 'Virtual room session started', roomId: groupId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.endSession = (req, res) => {
    try {
        const { roomId } = req.body;
        if (rooms.has(roomId)) {
            rooms.get(roomId).forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'end' }));
                    client.close();
                }
            });
            rooms.delete(roomId);
        }
        res.json({ message: 'Virtual room session ended' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.upgradeWebSocket = (server) => {
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
};