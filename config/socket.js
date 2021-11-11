const WebSocket = require('ws')

clients = []

function noop() {

}

function heartbeat() {
    this.isAlive = true;
}

const StartServer = async => {
    const wss = new WebSocket.Server({ port: 8080 }, () => {
        console.log('server started')
    })

    wss.on('connection', (ws) => {
        ws.isAlive = true;
        ws.on('pong', heartbeat);

        clients.push(ws)

        ws.on('message', (data) => {
            console.log('server started' + data)
            ws.send(data)
        })
    })

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping(noop);
        });
    }, 10000);

    wss.on('close', function close() {
        clearInterval(interval);
        console.log("closed");
    });

    wss.on('listening', () => {
        console.log('listening on 8080')
    })
}

module.exports = { clients, StartServer }