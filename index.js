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

let client;

try {
  client = mqtt.connect(brokerAddress);
} catch (error) {
  console.error("Error connecting to MQTT broker:", error.message);
}

if (client) {
  client.on("error", (err) => {
    console.error("Connection error:", err);
  });

  client.on("connect", () => {
    console.log("Connected to MQTT broker");

    client.subscribe(topicData, { qos: 1 }, (err) => {
      if (err) {
        console.error("Error subscribing to topic:", err);
      } else {
        console.log(`Subscribed to topic: ${topicData}`);
      }
    });
  });

  client.on("message", (topic, message) => {
    console.log(`Received message from topic: ${topic}`);
    console.log(`Message: ${message.toString()}`);
    sendIncomingData({
      topic: topic,
      message: message.toString(),
    });
  });
}
