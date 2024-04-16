const mqtt = require("mqtt");
const io = require("socket.io-client");
const dote = require("dotenv");
dote.config();
const brokerAddress = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const topicData = process.env.TOPIC_DATA || "data";
const socket = io(process.env.SOCKET_SERVER_URL, { transports: ["websocket"] });

const sendIncomingData = (data) => {
  socket.emit("IncomingData", data);
};

const client = mqtt.connect(brokerAddress);

client.on("error", (err) => {
  console.error("Connection error:", err);
  process.exit(1);
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  client.subscribe(topicData, { qos: 1 });
  console.log(`Subscribed to topic: ${topicData}`);
});

client.on("message", (topic, message) => {
  console.log(`Received message from topic: ${topic}`);
  console.log(`Message: ${message.toString()}`);
  sendIncomingData({
    topic: topic,
    message: message.toString(),
  });
});
