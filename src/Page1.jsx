import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaVolumeUp, FaArrowLeft } from "react-icons/fa";
import "./Page1.css"; // Import external CSS

function Page1() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [responseText, setResponseText] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(""); // "describe" or "extract"
  const [retryCount, setRetryCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const MAX_RETRIES = 3;
  const TIMEOUT_DURATION = 30000; // 30 seconds timeout

  useEffect(() => {
    let storedImage = localStorage.getItem("capturedImage");

    if (storedImage) {
      console.log("🖼️ Stored Image in LocalStorage:", storedImage);
      setCapturedImage(storedImage);
    } else {
      console.warn("❌ No image found! Retrying...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (capturedImage) {
      console.log("✅ Image Loaded, Asking user what to do...");
      speakText("What do you want to do? Say 'describe image' or 'extract text'.");
      
      // Delay recognition start to ensure text is spoken first
      setTimeout(() => startVoiceRecognition(), 3000);
    }
    return () => stopVoiceRecognition();
  }, [capturedImage]);
  

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const processImage = async (mode, currentRetry = 0) => {
    if (!capturedImage) {
      if (currentRetry < 3) {
        console.warn("⏳ Image not available yet, retrying...");
        setTimeout(() => processImage(mode, currentRetry + 1), 500);
      } else {
        console.error("❌ No image available. Please capture again.");
        alert("No image available. Please capture again.");
      }
      return;
    }

    setIsLoading(true);
    setLoadingType(mode);
    setRetryCount(currentRetry);
    setProgress(0);
    console.log(`🚀 Sending ${mode} request to backend... (Attempt ${currentRetry + 1}/${MAX_RETRIES})`);

    const requestBody = { image: capturedImage.split(",")[1], mode };
    let progressInterval = null;
    let timeoutId = null;

    try {
      // Create an AbortController for timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

      // Progress simulation
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 1;
        });
      }, 1000);

      const response = await fetch("https://flask-backend-1-ep66.onrender.com/process-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      if (timeoutId) clearTimeout(timeoutId);
      if (progressInterval) clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) throw new Error(`Server Error: ${response.status} ${response.statusText}`);

      const contentType = response.headers.get("Content-Type");
      console.log("📌 Response Content-Type:", contentType);

      if (contentType && contentType.includes("multipart/mixed")) {
        const parsedResponse = await parseMultipart(response);
        setResponseText(parsedResponse.text);

        if (parsedResponse.text) speakText(parsedResponse.text);

        if (parsedResponse.audioBlob) {
          const audioURL = URL.createObjectURL(parsedResponse.audioBlob);
          setAudioSrc(audioURL);
        }
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      if (progressInterval) clearInterval(progressInterval);
      
      if (error.name === 'AbortError') {
        console.error("⏰ Request timed out");
        if (currentRetry < MAX_RETRIES) {
          const backoffTime = Math.min(1000 * Math.pow(2, currentRetry), 10000);
          console.log(`Retrying in ${backoffTime/1000} seconds...`);
          await sleep(backoffTime);
          processImage(mode, currentRetry + 1);
        } else {
          alert("Request timed out after multiple attempts. Please try again later.");
        }
      } else {
        console.error("❌ Error:", error);
        if (currentRetry < MAX_RETRIES) {
          const backoffTime = Math.min(1000 * Math.pow(2, currentRetry), 10000);
          console.log(`Retrying in ${backoffTime/1000} seconds...`);
          await sleep(backoffTime);
          processImage(mode, currentRetry + 1);
        } else {
          alert("Processing failed after multiple attempts. Please try again later.");
        }
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      if (progressInterval) clearInterval(progressInterval);
      setIsLoading(false);
      setLoadingType("");
      setProgress(0);
    }
  };

  const parseMultipart = async (response) => {
    try {
      const rawData = await response.arrayBuffer();
      const textDecoder = new TextDecoder();
      const rawString = textDecoder.decode(rawData); // Convert to string

      console.log("🔍 Raw response string:", rawString); // Debugging

      const boundaryMatch = rawString.match(/--\S+/);
      if (!boundaryMatch) {
        throw new Error("Boundary not found in response");
      }
      const boundary = boundaryMatch[0];

      const parts = rawString.split(boundary).filter(part => part.includes("Content-Type"));

      let text = "", audioBlob = null;
      let audioStartIndex = null;

      for (const part of parts) {
        if (part.includes("application/json")) {
          try {
            const jsonMatch = part.match(/{.*}/s);
            if (jsonMatch) {
              text = JSON.parse(jsonMatch[0]).text;
            }
          } catch (error) {
            console.error("❌ Error parsing JSON part:", error);
          }
        }
        if (part.includes("audio/mpeg")) {
          audioStartIndex = rawString.indexOf(part) + part.length;
        }
      }

      if (audioStartIndex !== null) {
        const audioArray = rawData.slice(audioStartIndex);
        audioBlob = new Blob([audioArray], { type: "audio/mpeg" });
      }

      return { text, audioBlob };
    } catch (error) {
      console.error("❌ Error parsing multipart response:", error);
      return { text: "Error parsing response.", audioBlob: null };
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("❌ Speech recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("🗣️ Recognized:", transcript);

      if (!capturedImage) {
        console.warn("⏳ No image yet! Waiting...");
        setTimeout(() => recognition.onresult(event), 500);
        return;
      }

      if (transcript.includes("describe image")) {
        console.log("📷 Describing image...");
        processImage("description");
      } else if (transcript.includes("extract text")) {
        console.log("📝 Extracting text...");
        processImage("text");
      } else if (transcript.includes("take new picture") || transcript.includes("back")) {
        console.log("📸 Navigating back to camera page...");
        localStorage.removeItem("capturedImage");
        navigate("/camera");
        return; // Stop further execution
      } else {
        console.log("🤔 Unrecognized command:", transcript);
      }

      // Restart recognition for next command
      recognition.stop();
      setTimeout(() => recognition.start(), 500);
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };


  // ✅ Function to read extracted text aloud
  const speakText = (text) => {
    if (!text) {
      console.error("❌ No text to read.");
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1; // Adjust speed if needed
    synth.speak(utterance);
  };

  const handleBackClick = () => {
    console.log("🔙 Going back to camera page...");
    localStorage.removeItem("capturedImage");
    navigate("/camera");
  };

  return (
    <div className="page-container">
      <button className="back-button" onClick={handleBackClick}>
        <FaArrowLeft /> Back
      </button>
      
      <h2 className="page-title">Captured Image</h2>

      {capturedImage ? (
        <img src={capturedImage} alt="Captured" className="captured-image" />
      ) : (
        <p className="error-text">❌ No image available</p>
      )}

      <div className="button-container">
        <button 
          onClick={() => processImage("description")} 
          className={`button ${isLoading && loadingType === "description" ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading && loadingType === "description" ? (
            <span className="loading-spinner"></span>
          ) : (
            "📸 Describe Image"
          )}
        </button>
        <button 
          onClick={() => processImage("text")} 
          className={`button ${isLoading && loadingType === "text" ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading && loadingType === "text" ? (
            <span className="loading-spinner"></span>
          ) : (
            "📝 Extract Text"
          )}
        </button>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <span className="loading-spinner"></span>
            <p className="loading-text">
              {loadingType === "description" ? "Describing image..." : "Extracting text..."}
            </p>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              <p className="progress-text">
                {retryCount > 0 ? `Attempt ${retryCount + 1}/${MAX_RETRIES}` : "Processing..."}
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="response-text">{responseText}</p>

      {audioSrc && (
        <button onClick={() => speakText(responseText)} className="audio-button">
          <FaVolumeUp size={30} />
        </button>
      )}
    </div>
  );
}

export default Page1;
