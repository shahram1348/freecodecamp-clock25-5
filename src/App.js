import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);

  const handleReset = () => {
    // Stop the timer
    setIsRunning(false);

    // Reset break and session lengths to default values
    setBreakLength(5);
    setSessionLength(25);

    // Reset time left to default (25 minutes = 1500 seconds)
    setTimeLeft(1500);

    // Reset to session mode
    setIsSession(true);

    // Reset audio
    const audio = document.getElementById("beep");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
  useEffect(() => {
    let intervalId;
    if (isRunning && timeLeft >= 0) {
      // Changed from timeLeft > 0
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            // Play audio when timer reaches zero
            const audio = document.getElementById("beep");
            audio.play();
            // Switch between Session and Break
            setIsSession(!isSession);
            return isSession ? breakLength * 60 : sessionLength * 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, isSession, breakLength, sessionLength]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Update the initial timeLeft state to match session length

  // Make sure timeLeft updates when sessionLength changes

  const handleBreakDecrement = () => {
    if (breakLength > 1 && !isRunning) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60 && !isRunning) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1 && !isRunning) {
      setSessionLength(sessionLength - 1);
      if (isSession) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60 && !isRunning) {
      setSessionLength(sessionLength + 1);
      if (isSession) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <div className="length-controls">
        <div id="break-label">
          <h2>Break Length</h2>
          <button id="break-decrement" onClick={handleBreakDecrement}>
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={handleBreakIncrement}>
            +
          </button>
        </div>
        <div id="session-label">
          <h2>Session Length</h2>
          <button id="session-decrement" onClick={handleSessionDecrement}>
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={handleSessionIncrement}>
            +
          </button>
        </div>
      </div>
      <div className="timer">
        <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
      <audio
        id="beep"
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}

export default App;
