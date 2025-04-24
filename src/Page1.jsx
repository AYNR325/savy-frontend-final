//this code only support english language response

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaVolumeUp, FaArrowLeft } from "react-icons/fa";
// import "./Page1.css"; // Import external CSS
// import ObjectFinder from "./ObjectFinder";

// function Page1() {
//   const navigate = useNavigate();
//   const recognitionRef = useRef(null);
//   const [responseText, setResponseText] = useState("");
//   const [audioSrc, setAudioSrc] = useState(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingType, setLoadingType] = useState(""); // "describe" or "extract"
//   const [retryCount, setRetryCount] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const MAX_RETRIES = 3;
//   const TIMEOUT_DURATION = 30000; // 30 seconds timeout

//   useEffect(() => {
//     let storedImage = localStorage.getItem("capturedImage");

//     if (storedImage) {
//       console.log("🖼️ Stored Image in LocalStorage:", storedImage);
//       setCapturedImage(storedImage);
//     } else {
//       console.warn("❌ No image found! Retrying...");
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
//     }
//   }, []);

//   useEffect(() => {
//     if (capturedImage) {
//       console.log("✅ Image Loaded, Asking user what to do...");
//       speakText("What do you want to do? .");

//       // Delay recognition start to ensure text is spoken first
//       setTimeout(() => startVoiceRecognition(), 3000);
//     }
//     return () => stopVoiceRecognition();
//   }, [capturedImage]);

//   const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//   const processImage = async (mode, currentRetry = 0) => {
//     if (!capturedImage) {
//       if (currentRetry < 3) {
//         console.warn("⏳ Image not available yet, retrying...");
//         setTimeout(() => processImage(mode, currentRetry + 1), 500);
//       } else {
//         console.error("❌ No image available. Please capture again.");
//         alert("No image available. Please capture again.");
//       }
//       return;
//     }

//     setIsLoading(true);
//     setLoadingType(mode);
//     setRetryCount(currentRetry);
//     setProgress(0);
//     console.log(`🚀 Sending ${mode} request to backend... (Attempt ${currentRetry + 1}/${MAX_RETRIES})`);

//     const requestBody = { image: capturedImage.split(",")[1], mode };
//     let progressInterval = null;
//     let timeoutId = null;

//     try {
//       // Create an AbortController for timeout
//       const controller = new AbortController();
//       timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

//       // Progress simulation
//       progressInterval = setInterval(() => {
//         setProgress(prev => {
//           if (prev >= 90) return prev;
//           return prev + 1;
//         });
//       }, 1000);

//       const response = await fetch("https://flask-backend-1-ep66.onrender.com/process-image", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody),
//         signal: controller.signal
//       });

//       if (timeoutId) clearTimeout(timeoutId);
//       if (progressInterval) clearInterval(progressInterval);
//       setProgress(100);

//       if (!response.ok) throw new Error(`Server Error: ${response.status} ${response.statusText}`);

//       const contentType = response.headers.get("Content-Type");
//       console.log("📌 Response Content-Type:", contentType);

//       if (contentType && contentType.includes("multipart/mixed")) {
//         const parsedResponse = await parseMultipart(response);
//         setResponseText(parsedResponse.text);

//         if (parsedResponse.text) speakText(parsedResponse.text);

//         if (parsedResponse.audioBlob) {
//           const audioURL = URL.createObjectURL(parsedResponse.audioBlob);
//           setAudioSrc(audioURL);
//         }
//       } else {
//         throw new Error("Unexpected response format");
//       }
//     } catch (error) {
//       if (timeoutId) clearTimeout(timeoutId);
//       if (progressInterval) clearInterval(progressInterval);

//       if (error.name === 'AbortError') {
//         console.error("⏰ Request timed out");
//         if (currentRetry < MAX_RETRIES) {
//           const backoffTime = Math.min(1000 * Math.pow(2, currentRetry), 10000);
//           console.log(`Retrying in ${backoffTime/1000} seconds...`);
//           await sleep(backoffTime);
//           processImage(mode, currentRetry + 1);
//         } else {
//           alert("Request timed out after multiple attempts. Please try again later.");
//         }
//       } else {
//         console.error("❌ Error:", error);
//         if (currentRetry < MAX_RETRIES) {
//           const backoffTime = Math.min(1000 * Math.pow(2, currentRetry), 10000);
//           console.log(`Retrying in ${backoffTime/1000} seconds...`);
//           await sleep(backoffTime);
//           processImage(mode, currentRetry + 1);
//         } else {
//           alert("Processing failed after multiple attempts. Please try again later.");
//         }
//       }
//     } finally {
//       if (timeoutId) clearTimeout(timeoutId);
//       if (progressInterval) clearInterval(progressInterval);
//       setIsLoading(false);
//       setLoadingType("");
//       setProgress(0);
//     }
//   };

//   const parseMultipart = async (response) => {
//     try {
//       const rawData = await response.arrayBuffer();
//       const textDecoder = new TextDecoder();
//       const rawString = textDecoder.decode(rawData); // Convert to string

//       console.log("🔍 Raw response string:", rawString); // Debugging

//       const boundaryMatch = rawString.match(/--\S+/);
//       if (!boundaryMatch) {
//         throw new Error("Boundary not found in response");
//       }
//       const boundary = boundaryMatch[0];

//       const parts = rawString.split(boundary).filter(part => part.includes("Content-Type"));

//       let text = "", audioBlob = null;
//       let audioStartIndex = null;

//       for (const part of parts) {
//         if (part.includes("application/json")) {
//           try {
//             const jsonMatch = part.match(/{.*}/s);
//             if (jsonMatch) {
//               text = JSON.parse(jsonMatch[0]).text;
//             }
//           } catch (error) {
//             console.error("❌ Error parsing JSON part:", error);
//           }
//         }
//         if (part.includes("audio/mpeg")) {
//           audioStartIndex = rawString.indexOf(part) + part.length;
//         }
//       }

//       if (audioStartIndex !== null) {
//         const audioArray = rawData.slice(audioStartIndex);
//         audioBlob = new Blob([audioArray], { type: "audio/mpeg" });
//       }

//       return { text, audioBlob };
//     } catch (error) {
//       console.error("❌ Error parsing multipart response:", error);
//       return { text: "Error parsing response.", audioBlob: null };
//     }
//   };

//   const startVoiceRecognition = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.error("❌ Speech recognition is not supported.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true; // Keep listening
//     recognition.lang = "en-US";
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//       const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
//       console.log("🗣️ Recognized:", transcript);

//       if (!capturedImage) {
//         console.warn("⏳ No image yet! Waiting...");
//         setTimeout(() => recognition.onresult(event), 500);
//         return;
//       }

//       if (
//         transcript.includes("describe image") ||
//         transcript.includes("image") ||
//         transcript.includes("describe")
//       ) {
//         console.log("📷 Describing image...");
//         processImage("description");
//       } else if (
//         transcript.includes("extract text") ||
//         transcript.includes("text") ||
//         transcript.includes("extract")
//       ) {
//         console.log("📝 Extracting text...");
//         processImage("text");
//       } else if (
//         transcript.includes("take new picture") ||
//         transcript.includes("back")
//       ) {
//         console.log("📸 Navigating back to camera page...");
//         localStorage.removeItem("capturedImage");
//         navigate("/camera");
//         return; // Stop further execution
//       } else {
//         console.log("🤔 Unrecognized command:", transcript);
//       }

//       // Restart recognition for next command
//       recognition.stop();
//       setTimeout(() => recognition.start(), 500);
//     };

//     recognition.onerror = (event) => {
//       console.error("❌ Speech recognition error:", event.error);
//     };

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   const stopVoiceRecognition = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//   };

//   // ✅ Function to read extracted text aloud
//   const speakText = (text) => {
//     if (!text) {
//       console.error("❌ No text to read.");
//       return;
//     }

//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     utterance.rate = 1; // Adjust speed if needed
//     synth.speak(utterance);
//   };

//   const handleBackClick = () => {
//     console.log("🔙 Going back to camera page...");
//     localStorage.removeItem("capturedImage");
//     navigate("/camera");
//   };
//   // const handleStartDetection = () => {
//   //   if (objectToFind.trim() !== "") {
//   //     setIsCapturing(true);
//   //     setMessage("");
//   //     setDetections([]);
//   //     setHasDetectedOnce(false);
//   //     setIsLoading(true);
//   //     setLoadingType("object");
//   //     if (noObjectTimer) {
//   //       clearTimeout(noObjectTimer);
//   //       setNoObjectTimer(null);
//   //     }
//   //     navigate("/object-finder");
//   //   } else {
//   //     alert("Please say an object to find.");
//   //   }
//   // };

//   const handleStartDetection=()=>{
//     navigate("/ObjectFinder");
//   }
//   return (
//     <div className="page-container">
//       <button className="back-button" onClick={handleBackClick}>
//         <FaArrowLeft /> Back
//       </button>

//       <h2 className="page-title">Captured Image</h2>

//       {capturedImage ? (
//         <img src={capturedImage} alt="Captured" className="captured-image" />
//       ) : (
//         <p className="error-text">❌ No image available</p>
//       )}

//       <div className="button-container">
//         <button
//           onClick={() => processImage("description")}
//           className={`button ${isLoading && loadingType === "description" ? "loading" : ""}`}
//           disabled={isLoading}
//         >
//           {isLoading && loadingType === "description" ? (
//             <span className="loading-spinner"></span>
//           ) : (
//             "📸 Describe Image"
//           )}
//         </button>
//         <button
//           onClick={() => processImage("text")}
//           className={`button ${isLoading && loadingType === "text" ? "loading" : ""}`}
//           disabled={isLoading}
//         >
//           {isLoading && loadingType === "text" ? (
//             <span className="loading-spinner"></span>
//           ) : (
//             "📝 Extract Text"
//           )}
//         </button>
//         {/* <button
//         onClick={handleStartDetection}
//         className={`button ${isLoading && loadingType === "object" ? "loading" : ""}`}
//         disabled={isLoading}
//       >
//         {isLoading && loadingType === "object" ? (
//           <span className="loading-spinner"></span>
//         ) : (
//           "🎙️ Object Finder"
//         )}
//       </button>
//       <button className="btn btn-primary" onClick={() => navigate("/injurydetection")}>
//       Injury Detection
//     </button> */}
//       </div>

//       {isLoading && (
//         <div className="loading-overlay">
//           <div className="loading-content">
//             <span className="loading-spinner"></span>
//             <p className="loading-text">
//               {loadingType === "description" ? "Describing image..." : "Extracting text..."}
//             </p>
//             <div className="progress-container">
//               <div className="progress-bar" style={{ width: `${progress}%` }}></div>
//               <p className="progress-text">
//                 {retryCount > 0 ? `Attempt ${retryCount + 1}/${MAX_RETRIES}` : "Processing..."}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <p className="response-text">{responseText}</p>

//       {audioSrc && (
//         <button onClick={() => speakText(responseText)} className="audio-button">
//           <FaVolumeUp size={30} />
//         </button>
//       )}
//     </div>

//   );
// }

// export default Page1;

//this code supports multi language response(english,hindi,marathi)

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
  const TIMEOUT_DURATION = 50000; // 50 seconds timeout
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [awaitingLanguage, setAwaitingLanguage] = useState(true);
  const [languageSet, setLanguageSet] = useState(false);
  // const [actionSelected, setActionSelected] = useState(false); // New state to track action selection
  const [actionSelected, setActionSelected] = useState(""); // store mode string
  const languageSetRef = useRef(false);
  const actionSelectedRef = useRef(false);
  const selectedLanguageRef = useRef("en"); // default value is optional

  console.log("🔍 Selected Language:", selectedLanguage); // Debugging
  console.log("🌐 Awaiting Language:", awaitingLanguage);

  console.log(`Selected language for backend: ${selectedLanguage}`);

  console.log(
    "🔎 languageSet:",
    languageSetRef.current,
    "| actionSelected:",
    actionSelectedRef.current
  );

  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  // useEffect(() => {
  //   if (responseText) {
  //     setTimeout(() => {
  //       setActionSelected(""); // Reset so new command can be taken
  //       startVoiceRecognition(); // Listen again
  //     }, 4000); // Adjust delay if needed
  //   }
  // }, [responseText]);

  // useEffect(() => {
  //   if (responseText) {
  //     setTimeout(() => {
  //       setActionSelected(""); // Optional UI reset
  //       actionSelectedRef.current = false; // ✅ This is the real reset
  //       languageSetRef.current = false;    // ✅ Also reset language for new session
  //       startVoiceRecognition();
  //     }, 4000);
  //   }
  // }, [responseText]);

  useEffect(() => {
    // Only trigger the processImage if the language has been set and the action is selected
    if (languageSet && capturedImage && actionSelected) {
      console.log(`🌍 Final language for backend: ${selectedLanguage}`);
      processImage(actionSelected, selectedLanguage);
    }
  }, [selectedLanguage, capturedImage, actionSelected]); // Depend on both selectedLanguage, capturedImage, and actionSelected

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
      speakText(
        "Please select a language by saying English, Hindi, or Marathi."
      );
      setTimeout(() => startVoiceRecognition(), 3000);
    }
    return () => stopVoiceRecognition();
  }, [capturedImage]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const processImage = async (mode, language, currentRetry = 0) => {
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
    console.log(
      `🚀 Sending ${mode} request to backend... (Attempt ${
        currentRetry + 1
      }/${MAX_RETRIES})`
    );
    console.log(`🌍 Final language for backend: ${selectedLanguage}`);
    console.log(language);

    const requestBody = {
      image: capturedImage.split(",")[1],
      mode,
      language: language, // Pass selected language
    };
    console.log("📤 Request Body:", requestBody); // Debugging
    let progressInterval = null;
    let timeoutId = null;

    try {
      // Create an AbortController for timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

      // Progress simulation
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 1;
        });
      }, 1000);

      const response = await fetch(
        "https://description-extraction-backend.onrender.com/process-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        }
      );

      if (timeoutId) clearTimeout(timeoutId);
      if (progressInterval) clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok)
        throw new Error(
          `Server Error: ${response.status} ${response.statusText}`
        );

      const contentType = response.headers.get("Content-Type");
      console.log("📌 Response Content-Type:", contentType);

      if (contentType && contentType.includes("multipart/mixed")) {
        const parsedResponse = await parseMultipart(response);
        setResponseText(parsedResponse.text);

        // if (parsedResponse.text) speakText(parsedResponse.text);
        if (parsedResponse.text) {
          console.log("📝 Text received:", parsedResponse.text);
        }

        // if (parsedResponse.audioBlob) {
        //   const audioURL = URL.createObjectURL(parsedResponse.audioBlob);
        //   setAudioSrc(audioURL);
        // }
        // if (parsedResponse.audioBlob) {
        //   const audioURL = URL.createObjectURL(parsedResponse.audioBlob);
        //   setAudioSrc(audioURL);

        //   const audio = new Audio(audioURL);
        //   audio
        //     .play()
        //     .catch((err) => console.error("🔈 Audio play error:", err));
        // }
        if (parsedResponse.audioBlob) {
          const audioURL = URL.createObjectURL(parsedResponse.audioBlob);
          const audio = new Audio(audioURL);
          audio.load(); // Explicitly load the audio
          audio
            .play()
            .then(() => console.log("🔈 Audio playing successfully"))
            .catch((err) => console.error("🔈 Audio play error:", err));
        }
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      if (progressInterval) clearInterval(progressInterval);

      if (error.name === "AbortError") {
        console.error("⏰ Request timed out");
        if (currentRetry < MAX_RETRIES) {
          const backoffTime = Math.min(1000 * Math.pow(2, currentRetry), 10000);
          console.log(`Retrying in ${backoffTime / 1000} seconds...`);
          await sleep(backoffTime);
          processImage(mode, currentRetry + 1);
        } else {
          alert(
            "Request timed out after multiple attempts. Please try again later."
          );
        }
      } else {
        console.error("❌ Error:", error);
        if (currentRetry < MAX_RETRIES) {
          const backoffTime = Math.min(1000 * Math.pow(2, currentRetry), 10000);
          console.log(`Retrying in ${backoffTime / 1000} seconds...`);
          await sleep(backoffTime);
          processImage(mode, currentRetry + 1);
        } else {
          alert(
            "Processing failed after multiple attempts. Please try again later."
          );
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
      const rawString = textDecoder.decode(rawData);

      console.log("🔍 Raw response string:", rawString); // Debugging

      const boundaryMatch = rawString.match(/--\S+/);
      if (!boundaryMatch) {
        throw new Error("Boundary not found in response");
      }
      const boundary = boundaryMatch[0];

      let text = "";
      let audioBlob = null;

      // Extract JSON text
      const jsonMatch = rawString.match(
        /Content-Type: application\/json\r\n\r\n([\s\S]*?)\r\n--/
      );
      if (jsonMatch) {
        const jsonText = jsonMatch[1];
        text = JSON.parse(jsonText).text;
      }

      // Extract Audio (audio part after the boundary)
      const audioHeader = "Content-Type: audio/mpeg\r\n\r\n";
      const audioStartIndex =
        rawString.indexOf(audioHeader) + audioHeader.length;
      const audioEndIndex = rawString.indexOf(boundary, audioStartIndex);

      if (audioStartIndex !== -1 && audioEndIndex !== -1) {
        const audioData = rawData.slice(audioStartIndex, audioEndIndex);
        audioBlob = new Blob([audioData], { type: "audio/mpeg" });
      }

      return { text, audioBlob };
    } catch (error) {
      console.error("❌ Error parsing multipart response:", error);
      return { text: "Error parsing response.", audioBlob: null };
    }
  };

  //   const startVoiceRecognition = () => {
  //     const SpeechRecognition =
  //       window.SpeechRecognition || window.webkitSpeechRecognition;
  //     if (!SpeechRecognition) {
  //       console.error("❌ Speech recognition is not supported.");
  //       return;
  //     }

  //     const recognition = new SpeechRecognition();
  //     recognition.continuous = true;
  //     recognition.lang = "en-US";  // You can make this dynamic if needed
  //     recognition.interimResults = false;

  // recognition.onresult = (event) => {
  //   const transcript = event.results[event.results.length - 1][0].transcript
  //     .toLowerCase()
  //     .trim();
  //   console.log("🗣️ Recognized:", transcript);

  //   // Step 1: Language selection
  //   if (!languageSet) {
  //     if (transcript.includes("english")) {
  //       setSelectedLanguage("en");
  //       setLanguageSet(true);
  //       speakText("English selected. Now tell me what to do: describe image or extract text.");
  //       return;
  //     } else if (transcript.includes("hindi")) {
  //       setSelectedLanguage("hi");
  //       setLanguageSet(true);
  //       speakText("Hindi selected. Now tell me what to do: describe image or extract text.");
  //       return;
  //     } else if (transcript.includes("marathi")) {
  //       setSelectedLanguage("mr");
  //       setLanguageSet(true);
  //       speakText("Marathi selected. Now tell me what to do: describe image or extract text.");
  //       return;
  //     } else {
  //       speakText("I did not understand the language. Please say English, Hindi, or Marathi.");
  //       return;
  //     }
  //   }

  //   // Step 2: Action selection (only after languageSet = true)
  //   if (languageSet && !actionSelected) {
  //     if (transcript.includes("describe image") || transcript.includes("describe")) {
  //       setActionSelected("description");
  //       speakText("Describing image now.");
  //       recognition.stop();
  //       return;
  //     } else if (transcript.includes("extract text") || transcript.includes("extract")) {
  //       setActionSelected("text");
  //       speakText("Extracting text now.");
  //       recognition.stop();
  //       return;
  //     } else {
  //       speakText("Please say 'describe image' or 'extract text'.");
  //       return;
  //     }
  //   }

  //   if (!capturedImage) {
  //     console.warn("⏳ No image yet! Waiting...");
  //     return;
  //   }

  //   // After the action is selected, the `useEffect` will trigger `processImage`
  //   console.log("🌍 Language for processing:", selectedLanguage);
  //   console.log("🔍 languageSet:", languageSet, "| actionSelected:", actionSelected);

  // };

  // console.log(languageSet); // Debugging
  // recognition.onend = () => {
  //   if (languageSet && !actionSelected) {
  //     console.log("🔄 Restarting recognition...");
  //     recognition.start();
  //   } else {
  //     console.log("✅ Action selected. No need to restart recognition.");
  //   }
  // };

  //     recognition.onerror = (event) => {
  //       console.error("❌ Speech recognition error:", event.error);
  //     };

  //     recognition.start();
  //     recognitionRef.current = recognition;
  //   };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("❌ Speech recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();
      console.log("🗣️ Recognized:", transcript);
      console.log(
        "🔍 languageSet:",
        languageSetRef.current,
        "| actionSelected:",
        actionSelectedRef.current
      );

      if (!languageSetRef.current) {
        if (transcript.includes("english")) {
          setSelectedLanguage("en");
          languageSetRef.current = true;
          speakText(
            "English selected. Now tell me what to do: describe image or extract text."
          );
          return;
        } else if (transcript.includes("hindi")) {
          setSelectedLanguage("hi");
          languageSetRef.current = true;
          speakText(
            "Hindi selected. Now tell me what to do: describe image or extract text."
          );
          return;
        } else if (transcript.includes("marathi")) {
          setSelectedLanguage("mr");
          languageSetRef.current = true;
          speakText(
            "Marathi selected. Now tell me what to do: describe image or extract text."
          );
          return;
        } else {
          speakText(
            "I did not understand the language. Please say English, Hindi, or Marathi."
          );
          return;
        }
      }

      // if (languageSetRef.current && !actionSelectedRef.current) {
      //   if (transcript.includes("describe image") || transcript.includes("describe")) {
      //     console.log("📷 Describing image...");
      //     setActionSelected("description");
      //     actionSelectedRef.current = true;
      //     recognition.stop();
      //     return;
      //   } else if (transcript.includes("extract text") || transcript.includes("extract")) {
      //     console.log("📝 Extracting text...");
      //     setActionSelected("text");
      //     actionSelectedRef.current = true;
      //     recognition.stop();
      //     return;
      //   } else {
      //     speakText("Please say 'describe image' or 'extract text' to proceed.");
      //     return;
      //   }
      // }
      if (languageSetRef.current && !actionSelectedRef.current) {
        if (
          transcript.includes("describe image") ||
          transcript.includes("describe")
        ) {
          console.log("📷 Describing image...");
          setActionSelected("description");
          actionSelectedRef.current = true;

          if (capturedImage) {
            console.log("🚀 Calling processImage for description...");
            processImage("description", selectedLanguageRef.current);
          } else {
            console.warn("⚠️ No image captured yet!");
            speakText("No image captured yet. Please take a photo first.");
          }

          recognition.stop();
          return;
        } else if (
          transcript.includes("extract text") ||
          transcript.includes("extract")
        ) {
          console.log("📝 Extracting text...");
          setActionSelected("text");
          actionSelectedRef.current = true;

          if (capturedImage) {
            console.log("🚀 Calling processImage for text extraction...");
            processImage("text", selectedLanguageRef.current);
          } else {
            console.warn("⚠️ No image captured yet!");
            speakText("No image captured yet. Please take a photo first.");
          }

          recognition.stop();
          return;
        } else {
          speakText(
            "Please say 'describe image' or 'extract text' to proceed."
          );
          return;
        }
      }
    };

    recognition.onend = () => {
      if (!actionSelectedRef.current) {
        console.log("🔄 Restarting recognition...");
        recognition.start();
      } else {
        console.log("✅ Action selected. No need to restart.");
      }
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

  const speakText = (text) => {
    if (!window.speechSynthesis) {
      console.error("❌ Speech synthesis is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // You can also dynamically set the language based on selectedLanguage
    switch (selectedLanguage) {
      case "hi":
        utterance.lang = "hi-IN";
        break;
      case "mr":
        utterance.lang = "mr-IN";
        break;
      case "en":
      default:
        utterance.lang = "en-US";
        break;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleBackClick = () => {
    console.log("🔙 Going back to camera page...");
    localStorage.removeItem("capturedImage");
    navigate("/camera");
  };

  const handleStartDetection = () => {
    navigate("/ObjectFinder");
  };
  return (
    <div className="page-container">
      <button className="back-button" onClick={handleBackClick}>
        <FaArrowLeft /> Back
      </button>

      <div
        className="custom-dropdown-container top-bar"
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          
        }}
      >
        <span
          style={{ marginRight: "8px", fontWeight: "600", fontSize: "17px" }}
        >
          🌐 Select Language:
        </span>
        {["en", "hi", "mr"].map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            className={`custom-dropdown-button ${
              selectedLanguage === lang ? "active" : ""
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>


<div className="main-content">
      <h2 className="page-title">Captured Image</h2>
      {capturedImage ? (
        <img src={capturedImage} alt="Captured" className="captured-image" />
      ) : (
        <p className="error-text">❌ No image available</p>
      )}

      <div className="button-container">
        <button
          onClick={() => processImage("description", selectedLanguage)}
          className={`button ${
            isLoading && loadingType === "description" ? "loading" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading && loadingType === "description" ? (
            <span className="loading-spinner"></span>
          ) : (
            "📸 Describe Image"
          )}
        </button>
        <button
          onClick={() => processImage("text", selectedLanguage)}
          className={`button ${
            isLoading && loadingType === "text" ? "loading" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading && loadingType === "text" ? (
            <span className="loading-spinner"></span>
          ) : (
            "📝 Extract Text"
          )}
        </button>
      </div>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <span className="loading-spinner"></span>
            <p className="loading-text">
              {loadingType === "description"
                ? "Describing image..."
                : "Extracting text..."}
            </p>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
              <p className="progress-text">
                {retryCount > 0
                  ? `Attempt ${retryCount + 1}/${MAX_RETRIES}`
                  : "Processing..."}
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="response-text">{responseText}</p>

      {audioSrc && (
        <button
          onClick={() => speakText(responseText)}
          className="audio-button"
        >
          <FaVolumeUp size={30} />
        </button>
      )}
    </div>
  );
}

export default Page1;
