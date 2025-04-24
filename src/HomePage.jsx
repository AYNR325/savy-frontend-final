import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    speak("Hello, welcome to Savy");
    setTimeout(() => navigate("/camera"), 3000); // Redirect to camera after speaking
  }, [navigate]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Welcome to Savy</h1>
      <p className="mt-4 text-gray-400">Navigating to the camera...</p>
    </div>
  );
}

export default HomePage;
