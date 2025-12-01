const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

// 1) HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("HexGame WebSocket server is running.");
});

// 2) Bu HTTP server üzerinden WebSocket upgrade
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
    console.log("Client connected");

    const player = {
        ws,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        admin: true
    };

    clients.push(player);

    ws.on("message", (msg) => {
        console.log("Received:", msg.toString());

        // broadcast example:
        clients.forEach(c => {
            c.ws.send(msg.toString());
        });
    });

    ws.on("close", () => {
        clients = clients.filter(c => c.ws !== ws);
    });
});

// 3) Railway bunu dinler
server.listen(PORT, () => {
    console.log("Server running on port:", PORT);
});
