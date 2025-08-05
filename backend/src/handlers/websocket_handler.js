const WebSocket = require('ws');

let wss;

function setupWebSocketServer(server) {
    wss = new WebSocket.Server({ server });
    
    wss.clients = new Set();
    
    wss.on('connection', (ws, req) => {
        // Assuming userId and groups are sent as query params or headers
        // Example: ws://localhost:8080?userId=123&groups=group1,group2
        const url = new URL(req.url, `http://${req.headers.host}`);
        const userId = url.searchParams.get('userId');
        const groups = url.searchParams.get('groups')?.split(',') || [];

        ws.isAlive = true;
        ws.userId = userId;
        ws.groups = groups;

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                if (data.type === 'joinGroup') {
                    ws.groups.push(data.groupId);
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        });

        ws.on('close', () => {
            wss.clients.delete(ws);
        });
    });

    // Heartbeat to keep connections alive
    const interval = setInterval(() => {
        wss.clients.forEach(ws => {
            if (!ws.isAlive) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on('close', () => clearInterval(interval));
}

function getWebSocketServer() {
    return wss;
}

module.exports = { setupWebSocketServer, getWebSocketServer };