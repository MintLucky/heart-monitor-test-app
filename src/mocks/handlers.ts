import { ws } from "msw";

// Generate random heart rate within the allowed range (26-250)
const getRandomHeartRate = () => {
  return Math.floor(Math.random() * (250 - 26 + 1)) + 26;
};

const chat = ws.link("ws://localhost:8080");

export const handlers = [
  chat.addEventListener("connection", ({ client }) => {
    console.log("WebSocket client connected");
    // Send a random heart rate value every 5 seconds
    const intervalId = setInterval(() => {
        const newRate = getRandomHeartRate();
        const message = JSON.stringify({ heartRate: newRate });
        client.send(message);
        console.log("Heart rate sent:", newRate);
      }, 5000); // Send every 5 seconds
    client.addEventListener("close", () => {
      clearInterval(intervalId);
      console.log("WebSocket connection closed");
    });
  }),
];