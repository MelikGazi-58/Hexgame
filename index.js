const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on("connection", (ws) => {

    const player = {
        ws,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        admin: true
    };

    clients.push(player);

    ws.send(JSON.stringify({
        type: "you_are",
        color: player.color,
        admin: true
    }));

    ws.on("message", (msg) => {
        const data = JSON.parse(msg);

        // Lobideki ayarlar
        if (data.type === "config" || data.type === "config_map" || data.type === "config_difficulty") {
            clients.forEach(c => c.ws.send(msg));
        }

        // OYUN BAŞLAT
        if (data.type === "start") {

            const payload = {
                type: "start_game",
                cells: {},              // oyun haritası (şimdilik boş)
                moves: [],
                current_player: null,
                players_info: {}
            };

            clients.forEach(c => {
                c.ws.send(JSON.stringify(payload));
            });
        }
    });

    ws.on("close", () => {
        clients = clients.filter(c => c.ws !== ws);
    });
});

console.log("WebSocket server çalışıyor: ws://localhost:8080");
