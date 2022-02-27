const nbClients = document.getElementsByTagName('form').length
let sockets = []

for (let i = 0; i < nbClients; i++) {
    const form = document.getElementsByTagName('form')[i]

    form.onsubmit = () => {
        const msg = form.getElementsByTagName('input')[0].value
        textarea.value += `[sent] ${msg}\n`
        socket.send(msg);
        return false
    };

    const url = `ws://localhost:${8080 + i}`
    const socket = new WebSocket(url);
    const textarea = form.getElementsByTagName('textarea')[0]
    socket.onopen = function (e) {
        // alert("[open] Connection established");
        textarea.value += `[open] Connection established to websocket ${url}\n`
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            textarea.value += `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}\n`;
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            textarea.value += '[close] Connection died\n';
        }
    };

    socket.onerror = function (error) {
        textarea.value += `[error] ${error.message}\n`;
    };

    socket.onmessage = function (event) {
        textarea.value +=  `[message] Data received from server: ${event.data}`;
    };
}
