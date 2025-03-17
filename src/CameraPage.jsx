import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function CameraPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  useEffect(() => {
    startCamera();
    speak(`Camera opened. Say take picture to capture. Say ${isFrontCamera ? "back camera" : "front camera"} to change cameras.`);
    startVoiceRecognition();
  }, [isFrontCamera]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: isFrontCamera ? "user" : { exact: "environment" } },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert to Data URL and store in localStorage
    const imageData = canvas.toDataURL("image/png");
    localStorage.setItem("capturedImage", imageData);

    stopCamera(); // Stop camera after capturing

    // Navigate to description page
    speak("Picture captured, processing now.");
    setTimeout(() => navigate("/Page1"), 1000);
  };

  const switchCamera = () => {
    stopCamera();
    const newCameraMode = !isFrontCamera;
    speak(`Switching to ${newCameraMode ? "front" : "back"} camera`);
    setIsFrontCamera(newCameraMode);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Recognized:", transcript);

      if (transcript.includes("take picture")) {
        captureImage();
      } else if (
        transcript.includes("flip camera") || 
        transcript.includes("front camera") || 
        transcript.includes("back camera") || 
        transcript.includes("change camera") ||
        transcript.includes("other camera") ||
        transcript.includes("switch camera")
      ) {
        switchCamera();
      } else if (transcript.includes("back") || transcript.includes("go home")) {
        goBackToHome();
      }
    };

    recognition.start();
  };

  const goBackToHome = () => {
    stopCamera();
    speak("Going back to home page");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="container">
      <button className="back-button" onClick={goBackToHome}>
        <FaArrowLeft /> Back
      </button>
      
      <h1>Camera Page</h1>
      
      <div className="camera-box">
        <video ref={videoRef} className="camera-feed" autoPlay></video>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <p className="camera-instruction">
        Say "Take Picture" to capture or say "{isFrontCamera ? "Back Camera" : "Front Camera"}" to toggle
      </p>
      <div className="button-container">
        <button className="camera-button" onClick={captureImage}>
          Take Picture
        </button>
        <button className="switch-button" onClick={switchCamera}>
          {isFrontCamera ? "Back Camera" : "Front Camera"}
        </button>
      </div>
    </div>
  );
}

export default CameraPage;
