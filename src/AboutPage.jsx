import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { FaArrowLeft } from "react-icons/fa";

function AboutPage() {
  const navigate = useNavigate(); // ✅ Initialize useNavigate
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    stopSpeech(); // Ensure any previous speech is stopped before starting
    speak();
    startVoiceRecognition();

    return () => {
      stopSpeech();
      stopVoiceRecognition();
    };
  }, []);

  const speak = () => {
    stopSpeech(); // Stop any speech before speaking new text

    const text =
      "Hello, I am SAVY! I am here to assist you in describing the world around you. I can help you understand your surroundings by providing detailed descriptions and can also extract and read text from images. All my functions are voice-controlled, ensuring a seamless hands-free experience. I strive to make your interactions smooth and effortless. I hope you enjoy using my features and find them helpful. Thank you!";

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.lang = "en-US";

    // ✅ Navigate to home after speech completes
    utteranceRef.current.onend = () => {
      console.log("🛑 Speech completed. Navigating to home...");
      navigate("/"); // ✅ Redirect to home
    };

    speechSynthesis.speak(utteranceRef.current);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Recognized:", transcript);

      if (transcript.includes("stop")) {
        console.log("STOP detected. Stopping speech and recognition.");
        stopSpeech();
        stopVoiceRecognition();
      } else if (transcript.includes("back") || transcript.includes("home")) {
        goBackToHome();
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current.start();
  };

  const stopSpeech = () => {
    console.log("Forcefully stopping speech...");
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel(); // HARD STOP
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      console.log("Stopping voice recognition...");
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const goBackToHome = () => {
    stopSpeech();
    stopVoiceRecognition();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center p-6">
      <button 
        className="back-button" 
        onClick={goBackToHome}
      >
        <FaArrowLeft /> Back
      </button>
      
      <h1 className="text-3xl font-bold mt-10">About SAVY</h1>
      <p className="mt-4 text-gray-400 text-lg">
        I am here to assist you in describing the world around you. I can help
        you understand your surroundings by providing detailed descriptions and
        can also extract and read text from images.
      </p>
      <p className="mt-2 text-gray-400 text-lg">
        All my functions are voice-controlled, ensuring a seamless hands-free
        experience. I strive to make your interactions smooth and effortless.
      </p>
      <p className="mt-2 text-gray-400 text-lg">
        I hope you enjoy using my features and find them helpful. Thank you!
      </p>
    </div>
  );
}

export default AboutPage;
