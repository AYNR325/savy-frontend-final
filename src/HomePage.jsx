import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  useEffect(() => {
    speak("Hello, welcome to Savy. Say Camera to proceed or Say about you to know more.");
    startVoiceRecognition();
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Recognized:", transcript);

      if (transcript.includes("camera")) {
        speak("Opening camera");
        setTimeout(() => navigate("/camera"), 1000);
      } else if (transcript.includes("about you")) {
        speak("Opening about page");
        setTimeout(() => navigate("/aboutpage"), 1000);
      }
    };

    recognitionRef.current.start();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Welcome to Savy</h1>
      <p className="mt-4 text-gray-400">Say "Camera" to open the camera</p>
      <p className="mt-2 text-gray-400">Say "Tell me about you" to learn more</p>

      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600" 
        onClick={() => navigate("/camera")}>
        Open Camera
      </button>
        <br></br>
        <br></br>
      <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600" 
        onClick={() => navigate("/aboutpage")}>
        About SAVY
      </button>
    </div>
  );
}

export default HomePage;
