import React, { useState, useEffect, useRef } from "react";
import HeartRateControls from "./components/HeartRateControls";
import HeartAnimation from "./components/HeartAnimation";
import "./App.css";

// Setup WebSocket mock
// import { setupWorker } from "msw/browser";
// import { setupServer } from "msw/node";
// import { handlers } from "./mocks/handlers";
import { handlers } from './mocks/handlers';


// // Setup MSW worker
// const worker = setupWorker(handlers);
// worker.start();


const App: React.FC = () => {
  const [heartRate, setHeartRate] = useState<number>(70);
  const [isServerMode, setIsServerMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  // Heart rate validation function
  const validateHeartRate = (rate: number): boolean => {
    if (rate < 26 || rate > 250) {
      setError(`Heart rate must be between 26 and 250 BPM (current: ${rate})`);
      return false;
    }
    setError(null);
    return true;
  };

  // Update heart rate with validation
  const updateHeartRate = (newRate: number) => {
    if (!isServerMode && validateHeartRate(newRate)) {
      setHeartRate(newRate);
    }
  };

  // Handle WebSocket connection
  useEffect(() => {
    if (isServerMode) {
      
      ws.current = new WebSocket("ws://localhost:8080");

      ws.current.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.heartRate !== undefined) {
            setHeartRate(data.heartRate);
            validateHeartRate(data.heartRate); // Just for error display
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Server connection failed. Switching to manual mode.");
        setIsServerMode(false);
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [isServerMode]);

  // Calculate heart color based on rate
  const getHeartColor = (): string => {
    if (heartRate <= 110) return "#4CAF50"; // Green
    if (heartRate <= 180) return "#FFC107"; // Yellow
    return "#F44336"; // Red
  };

  return (
    <div className="app">
      <h1>Heart Rate Monitor</h1>

      <div className="heart-container">
        <HeartAnimation heartRate={heartRate} color={getHeartColor()} />
      </div>

      <div className="controls-container">
        <HeartRateControls
          heartRate={heartRate}
          updateHeartRate={updateHeartRate}
          isServerMode={isServerMode}
          setIsServerMode={setIsServerMode}
        />

        {error && <div className="error-message">{error}</div>}

        <div className="heart-rate-display">
          <h2>
            Current Heart Rate:{" "}
            <span style={{ color: getHeartColor() }}>{heartRate} BPM</span>
          </h2>
          <div className="heart-rate-status">
            Status:{" "}
            {heartRate <= 110
              ? "Normal"
              : heartRate <= 180
              ? "Elevated"
              : "High"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
