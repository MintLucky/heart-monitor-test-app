import React, { useEffect, useState } from 'react';
import './HeartRateControls.css';

interface HeartRateControlsProps {
  heartRate: number;
  updateHeartRate: (rate: number) => void;
  isServerMode: boolean;
  setIsServerMode: (isServer: boolean) => void;
}

const HeartRateControls: React.FC<HeartRateControlsProps> = ({
  heartRate,
  updateHeartRate,
  isServerMode,
  setIsServerMode,
}) => {
  const [inputValue, setInputValue] = useState<string>(heartRate.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    const newRate = parseInt(inputValue, 10);
    if (!isNaN(newRate)) {
      updateHeartRate(newRate);
    }
  };

  const handleIncrement = (amount: number) => {
    updateHeartRate(heartRate + amount);
  };

  const handleModeToggle = () => {
    setIsServerMode(!isServerMode);
  };

  useEffect(() => {
    setInputValue(heartRate.toString());
  }
  , [heartRate]);

  return (
    <div className="heart-rate-controls">
      <div className="mode-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={isServerMode}
            onChange={handleModeToggle}
          />
          <span className="slider round"></span>
        </label>
        <span>Server Heart Rate {isServerMode ? "(ON)" : "(OFF)"}</span>
      </div>

      <div className={`manual-controls ${isServerMode ? 'disabled' : ''}`}>
        <div className="input-group">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
            disabled={isServerMode}
            min="26"
            max="250"
          />
          <button 
            onClick={handleInputSubmit}
            disabled={isServerMode}
          >
            Set
          </button>
        </div>

        <div className="button-group">
          <div className="button-row">
            <button onClick={() => handleIncrement(-50)} disabled={isServerMode}>-50</button>
            <button onClick={() => handleIncrement(-10)} disabled={isServerMode}>-10</button>
            <button onClick={() => handleIncrement(-5)} disabled={isServerMode}>-5</button>
            <button onClick={() => handleIncrement(-2)} disabled={isServerMode}>-2</button>
            <button onClick={() => handleIncrement(-1)} disabled={isServerMode}>-1</button>
          </div>
          <div className="button-row">
            <button onClick={() => handleIncrement(1)} disabled={isServerMode}>+1</button>
            <button onClick={() => handleIncrement(2)} disabled={isServerMode}>+2</button>
            <button onClick={() => handleIncrement(5)} disabled={isServerMode}>+5</button>
            <button onClick={() => handleIncrement(10)} disabled={isServerMode}>+10</button>
            <button onClick={() => handleIncrement(50)} disabled={isServerMode}>+50</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartRateControls;