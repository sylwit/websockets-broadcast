const WebSocket = require("ws");
const redis = require("redis");

const subscriber = redis.createClient({
    url: "redis://redis:6379"
});
const publisher = subscriber.duplicate();
const WS_CHANNEL = "ws:messages";

const wss = new WebSocket.Server({port: process.env.PORT});

wss.on("connection", async ws => {
    ws.on("message", async data => {
        console.log(`received ${data}`)
        const message = JSON.parse(data);

        if (message.type === "broadcast") {
            try {
                await publisher.publish(WS_CHANNEL, message.msg)
            } catch (e) {
                console.log(`error ${e}`)
            }
        } else {

            ws.send(`${message.msg}\n`);
        }
    });


    await subscriber.subscribe(WS_CHANNEL, (message) => {
        console.log(message); // 'message'
        ws.send(`[BROADCAST] ${message}\n`);
    });

});

(async () => {
    await publisher.connect()
    await subscriber.connect();
})();