
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Search } from "lucide-react";

// function ObjectFinder() {
//   const [stream, setStream] = useState(null);
//   const [detections, setDetections] = useState([]);
//   const [lastDetections, setLastDetections] = useState([]);
//   const [objectToFind, setObjectToFind] = useState("");
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [message, setMessage] = useState("");
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function startCamera() {
//       try {
//         const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
//         setStream(videoStream);
//       } catch (error) {
//         console.error("Error starting camera:", error);
//       }
//     }
//     startCamera();
//   }, []);

//   useEffect(() => {
//     if (stream && videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }
//   }, [stream]);

//   useEffect(() => {
//     if (!isCapturing) return;
//     const interval = setInterval(captureFrame, 1000);
//     return () => clearInterval(interval);
//   }, [isCapturing]);

//   const captureFrame = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const imageData = canvas.toDataURL("image/jpeg");
//     sendToBackend(imageData);
//   };

//   const sendToBackend = async (imageData) => {
//     try {
//       const response = await fetch("http://127.0.0.1:5000/detect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ image: imageData.split(",")[1], object: objectToFind }),
//       });

//       const result = await response.json();
//       if (result.detections && result.detections.length > 0) {
//         setDetections(result.detections);
//         setLastDetections(result.detections);
//         setMessage("");
//         drawBoundingBox(result.detections);
//         speakNavigation(result.detections[0].navigation);
//       } else {
//         setDetections([]);
//         setMessage(`No ${objectToFind} detected.`);
//       }
//     } catch (error) {
//       console.error("Error sending image to backend:", error);
//       setMessage("Error connecting to backend.");
//     }
//   };

//   const drawBoundingBox = (detections) => {
//     if (!canvasRef.current || !videoRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     detections.forEach((det) => {
//       const [x1, y1, x2, y2] = det.bbox;
//       ctx.strokeStyle = "lime";
//       ctx.lineWidth = 3;
//       ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
//       ctx.fillStyle = "lime";
//       ctx.font = "16px Arial";
//       ctx.fillText(det.label || "Unknown", x1, y1 - 5);
//     });
//   };

//   const speakNavigation = (text) => {
//     if (!text || isSpeaking) return;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.onstart = () => setIsSpeaking(true);
//     utterance.onend = () => setIsSpeaking(false);
//     window.speechSynthesis.speak(utterance);
//   };

//   const handleStartDetection = () => {
//     if (objectToFind.trim()) {
//       setIsCapturing(true);
//       setMessage("");
//       setDetections([]);
//     } else {
//       alert("Please enter an object to find.");
//     }
//   };

//   const handleVoiceSearch = () => {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = 'en-US';
//     recognition.onresult = (event) => {
//       const object = event.results[0][0].transcript;
//       setObjectToFind(object);
//       handleStartDetection();
//     };
//     recognition.start();
//   };

//   return (
//     <div style={{
//       minHeight: "100vh",
//       color: "white",
//       padding: "20px"
//     }}>
//       {/* Back Button */}
//       <button
//   onClick={() => navigate(-1)}
//   style={{
//     position: "fixed", // <-- fixed to screen
//     top: "20px",
//     left: "20px",
//     backgroundColor: "#00f2a9",
//     color: "black",
//     border: "none",
//     padding: "8px 14px",
//     borderRadius: "10px",
//     fontWeight: "bold",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     width: "fit-content",
//     zIndex: 1000 // stays above other content
//   }}
// >
//   <ArrowLeft size={20} /> Back
// </button>


//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
//         <div style={{ position: "relative" }}>
//           <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "500px", borderRadius: "15px", border: "2px solid #00f2a9" }} />
//           <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", maxWidth: "500px" }} />
//         </div>

//         <input
//           type="text"
//           value={objectToFind}
//           onChange={(e) => setObjectToFind(e.target.value)}
//           placeholder="Enter object to find"
//           style={{ padding: "10px", borderRadius: "10px", width: "300px", border: "2px solid #00f2a9", backgroundColor: "#001f3f", color: "white" }}
//         />

//         <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//           <button onClick={handleStartDetection} style={buttonStyle}>
//             🔍 Start Detection
//           </button>
//           <button onClick={handleVoiceSearch} style={buttonStyle}>
//             🎤 Voice Search
//           </button>
//         </div>

//         {message && (
//           <div style={{ backgroundColor: "#ff5555", padding: "10px 20px", borderRadius: "10px" }}>
//             <strong>{message}</strong>
//           </div>
//         )}

//         {lastDetections.length > 0 && (
//           <div style={{ backgroundColor: "#0066ff", padding: "15px 20px", borderRadius: "10px", marginTop: "10px" }}>
//             <h3 style={{ marginBottom: "10px" }}>Navigation:</h3>
//             <p>{lastDetections[0].navigation}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const buttonStyle = {
//   padding: "15px 30px",
//   backgroundColor: "#00f2a9",
//   color: "black",
//   fontWeight: "bold",
//   borderRadius: "12px",
//   border: "none",
//   cursor: "pointer",
//   fontSize: "16px"
// };

// export default ObjectFinder;

//new
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function ObjectFinder() {
  const navigate = useNavigate();

  const [stream, setStream] = useState(null);
  const [detections, setDetections] = useState([]);
  const [lastDetections, setLastDetections] = useState([]);
  const [objectToFind, setObjectToFind] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState("");
  const [noObjectTimer, setNoObjectTimer] = useState(null);
  const [hasDetectedOnce, setHasDetectedOnce] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [videoDevices, setVideoDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

const [isLoading, setIsLoading] = useState(false);


  const startCamera = async (deviceId = null) => {
    try {
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "environment" },
      };
      const videoStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(videoStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const switchCamera = () => {
    if (videoDevices.length < 2) {
      alert("No secondary camera found.");
      return;
    }
    const nextIndex = (currentDeviceIndex + 1) % videoDevices.length;
    setCurrentDeviceIndex(nextIndex);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    startCamera(videoDevices[nextIndex].deviceId);
  };

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      setVideoDevices(videoInputs);
      startCamera(videoInputs[0]?.deviceId);
    };
    getDevices();
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!isCapturing) return;
    const interval = setInterval(captureFrame, 10000);
    return () => clearInterval(interval);
  }, [isCapturing, objectToFind]);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) sendToBackend(blob);
      else console.error("Failed to create blob from canvas.");
    }, "image/jpeg", 0.8);
  };

  const sendToBackend = async (imageBlob) => {
    try {
    setIsLoading(true);
      const formData = new FormData();
      formData.append("image", imageBlob, "frame.jpg");
      formData.append("object", objectToFind.toLowerCase().trim());

      const response = await fetch("https://object-finder-final.onrender.com/detect", {
        method: "POST",
        body: formData,
      });

      if (response.status === 404) {
        if (!hasDetectedOnce && !noObjectTimer) {
          const timer = setTimeout(() => {
            setMessage(`No ${objectToFind} detected.`);
            setNoObjectTimer(null);
          }, 30000);
          setNoObjectTimer(timer);
        }
        setDetections([]);
        return;
      }

      const result = await response.json();
      if (result.detections?.length > 0) {
    setIsLoading(false);
        setDetections(result.detections);
        setLastDetections(result.detections);
        setMessage("");
        setHasDetectedOnce(true);
        drawBoundingBox(result.detections);
        playBuzzer();
        speakNavigation(result.detections[0].navigation);
        if (noObjectTimer) {
          clearTimeout(noObjectTimer);
          setNoObjectTimer(null);
        }
      } else {
        setDetections([]);
      }
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setMessage("Error connecting to backend.");
    }
  };

  const drawBoundingBox = (detections) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(({ bbox, label = "Unknown" }) => {
      const [x1, y1, x2, y2] = bbox;
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.fillStyle = "red";
      ctx.font = "16px Arial";
      ctx.fillText(label, x1, y1 - 5);
    });
  };

  const playBuzzer = () => {
    const audio = new Audio("/alert-33762.mp3");
    audio.play().catch(err => console.error("Audio playback failed:", err));
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 10000);
  };

  const speakNavigation = (text) => {
    if (!text || isSpeaking) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // VOICE LISTENING
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Voice recognition started");
      setMessage("Listening... Please say the object name or say 'switch camera'");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.toLowerCase().trim();
      console.log("Recognized command:", spokenText);

      if (spokenText.includes("switch camera")) {
        switchCamera();
        setMessage("Switching camera...");
      } else {
        setObjectToFind(spokenText);
        setIsCapturing(true);
        setMessage("");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setMessage("Speech recognition error. Try again.");
    };

    recognition.onend = () => {
      console.log("Voice recognition ended");
    };

    recognition.start();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() => navigate("/camera")}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          backgroundColor: "#00f2a9",
          color: "black",
          border: "none",
          padding: "8px 14px",
          borderRadius: "10px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          width: "fit-content",
          zIndex: 1000,
        }}
      >
        <ArrowLeft size={20} />
      </button>

      <button
        onClick={switchCamera}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "10px",
          fontWeight: "bold",
          width: "fit-content",
          cursor: "pointer",
        }}
      >
        🔄 Switch Camera
      </button>

<button
  onClick={() => {
    if (objectToFind.trim() !== "") {
      setIsCapturing(true);
      setMessage("");
    }
  }}
  style={{
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#1EFFB2",
    color: "#001f3f",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    width: "fit-content",
    cursor: "pointer",
  }}
>
  🔍 Start Detection
</button>


      <p style={{ color: "#1EFFB2", fontWeight: "bold" }}>
        Current Camera: {videoDevices[currentDeviceIndex]?.label || "Default"}
      </p>

      <div
        style={{
          position: "relative",
          border: "3px solid #1EFFB2",
          borderRadius: "15px",
          boxShadow: "0 0 15px #1EFFB2",
          overflow: "hidden",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", height: "auto" }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      <input
        type="text"
        value={objectToFind}
        onChange={(e) => setObjectToFind(e.target.value)}
        style={{
          padding: "12px",
          border: "2px solid #1EFFB2",
          borderRadius: "10px",
          width: "300px",
          backgroundColor: "#001f3f",
          color: "#1EFFB2",
          fontWeight: "bold",
          textAlign: "center",
        }}
        placeholder="Say or enter object to find"
      />

      {!hasDetectedOnce && message && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#ffcccc",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "bold", color: "#cc0000" }}>
            {message}
          </p>
        </div>
      )}

<style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
{isLoading && (
  <div
    style={{
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div style={{
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #1EFFB2',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 0.8s linear infinite'
        }}></div>
  </div>
)}


      {lastDetections.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#1EFFB2",
            borderRadius: "10px",
            textAlign: "center",
            color: "#003366",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Navigation:</h2>
          <p>{lastDetections[0].navigation}</p>
        </div>
      )}
    </div>
  );
}

export default ObjectFinder;