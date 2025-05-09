import React, { useState, useEffect, useRef } from "react";
import HeartRateControls from "./components/HeartRateControls";
import HeartAnimation from "./components/HeartAnimation";
import "./App.css";

enum HeartRateBordersEnum {
  MIN = 26,
  MAX = 250,
}

enum HeartRateStatusEnum {
  Normal = "Normal",
  Elevated = "Elevated",
  High = "High",
}

enum HeartRateColorEnum {
  Normal = "#4CAF50", // Green
  Elevated = "#FFC107", // Yellow
  High = "#F44336", // Red
}
interface HeartRateData {
  heartRate: number;
  status: HeartRateStatusEnum;
  color: HeartRateColorEnum;
}

const App: React.FC = () => {
  const [heartData, setHeartData] = useState<HeartRateData>({
    heartRate: 70,
    status: HeartRateStatusEnum.Normal,
    color: HeartRateColorEnum.Normal,
  });
  const [isServerMode, setIsServerMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  // Heart rate validation function
  const validateHeartRate = (rate: number): boolean => {
    if (rate < HeartRateBordersEnum.MIN || rate > HeartRateBordersEnum.MAX) {
      setError(`Heart rate must be between 26 and 250 BPM (current: ${rate})`);
      return false;
    }
    setError(null);
    return true;
  };

  // Update heart rate with validation
  const updateHeartRate = (newRate: number) => {
    if (validateHeartRate(newRate)) {
      setHeartData((prevData) => ({
        ...prevData,
        heartRate: newRate,
        status:
          newRate <= 110
            ? HeartRateStatusEnum.Normal
            : newRate <= 180
            ? HeartRateStatusEnum.Elevated
            : HeartRateStatusEnum.High,
        color:
          newRate <= 110
            ? HeartRateColorEnum.Normal
            : newRate <= 180
            ? HeartRateColorEnum.Elevated
            : HeartRateColorEnum.High,
      }));
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
          console.log("Received data:", data);
          if (data.heartRate !== undefined) {
            updateHeartRate(data.heartRate);
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


  return (
    <div className="app">
      <h1>Heart Rate Monitor</h1>

      <div className="heart-container">
        <HeartAnimation
          heartRate={heartData.heartRate}
          color={heartData.color}
        />
      </div>

      <div className="controls-container">
        <HeartRateControls
          heartRate={heartData.heartRate}
          updateHeartRate={updateHeartRate}
          isServerMode={isServerMode}
          setIsServerMode={setIsServerMode}
        />

        {error && <div className="error-message">{error}</div>}

        <div className="heart-rate-display">
          <h2>
            Current Heart Rate:{" "}
            <span style={{ color: heartData.color }}>
              {heartData.heartRate} BPM
            </span>
          </h2>
          <div className="heart-rate-status">Status: {heartData.status}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
