import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCamera, FaRedo, FaRobot,FaSearch, FaHeartbeat  } from "react-icons/fa";

const CameraPage = () => {
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

    const imageData = canvas.toDataURL("image/png");
    localStorage.setItem("capturedImage", imageData);

    stopCamera();
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
      } else if (
        transcript.includes("object finder") ||
        transcript.includes("find object") ||
        transcript.includes("object") ||
        transcript.includes("find ") 
      ) {
        speak("Opening object finder.");
        stopCamera();
        setTimeout(() => navigate("/ObjectFinder"), 1000);
      } else if (
        transcript.includes("ai assistant") ||
        transcript.includes("health assistant") ||
        transcript.includes("chatbot") ||
        transcript.includes("talk to assistant")
      ) {
        speak("Opening AI health assistant.");
        stopCamera();
        setTimeout(() => navigate("/AIHealthAssistant"), 1000);
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
        <FaArrowLeft />
      </button>
  
      {/* Camera Preview */}
      <div className="camera-box">
        <video ref={videoRef} className="camera-feed" autoPlay></video>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <p className="camera-instruction">
        Say "Take Picture" to capture or say "{isFrontCamera ? "Back Camera" : "Front Camera"}" to toggle
      </p>
  
      {/* Styled Button Layout */}
      <div className="button-group">
        <div className="row">
          <button onClick={captureImage} className="styled-button">
            <FaCamera size={20} />
            <span>Take Picture</span>
          </button>
  
          <button onClick={switchCamera} className="styled-button">
            <FaRedo size={20} />
            <span>{isFrontCamera ? "Back Camera" : "Front Camera"}</span>
          </button>
        </div>
        <button 
  onClick={() => navigate("/AIHealthAssistant")} 
  className="chatbot-button"
>
  <FaRobot size={30} />
</button>
  
        <div className="row center">
          <button onClick={() => navigate("/ObjectFinder")} className="styled-button">
            <FaSearch size={20} />
            <span>Object Finder</span>
          </button>
        </div>
      </div>
    </div>
  );
  
};



export default CameraPage;
