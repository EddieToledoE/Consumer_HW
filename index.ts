import mqtt from "mqtt";
import io from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

const brokerAddress: string =
  process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const topicData: string = process.env.TOPIC_DATA || "data";
const socket = io(process.env.SOCKET_SERVER_URL ?? "", {
  transports: ["websocket"],
});

const sendIncomingData = (data: { topic: string; message: string }) => {
  socket.emit("IncomingData", data);
};

let client: mqtt.MqttClient;

try {
  client = mqtt.connect(brokerAddress);
} catch (error: any) {
  console.error("Error connecting to MQTT broker:", error.message);
}
client = mqtt.connect(brokerAddress);
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
