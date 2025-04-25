// import React, { useState, useEffect } from "react";

// const AIHealthAssistant = () => {
//     const [chatHistory, setChatHistory] = useState([]);
//     const [question, setQuestion] = useState("");
//     const [loading, setLoading] = useState(false);

//     const askQuestion = async (query) => {
//         const userQuestion = query || question.trim();
//         if (!userQuestion) {
//             alert("Please enter a question!");
//             return;
//         }

//         const newChat = [...chatHistory, { type: "user", text: userQuestion }];
//         setChatHistory(newChat);
//         setQuestion("");
//         setLoading(true);

//         try {
//             const response = await fetch("https://ai-chatbot-woj4.onrender.com/health_query", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ question: userQuestion })
//             });

//             if (!response.ok) throw new Error("Server error");
//             const data = await response.json();

//             setChatHistory([...newChat, { type: "ai", text: data.answer }]);
//             setLoading(false);
//         } catch (error) {
//             console.error("Fetch error:", error);
//             setChatHistory([...newChat, { type: "ai", text: "Error fetching response." }]);
//             setLoading(false);
//         }
//     };

//     const startVoiceRecognition = () => {
//         try {
//             const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//             recognition.lang = "en-US";
//             recognition.start();

//             recognition.onresult = (event) => {
//                 const spokenText = event.results[0][0].transcript;
//                 setQuestion(spokenText);
//                 askQuestion(spokenText);
//             };

//             recognition.onerror = (event) => {
//                 alert("Voice recognition error: " + event.error);
//             };
//         } catch (error) {
//             alert("Your browser does not support speech recognition.");
//         }
//     };

//     const clearHistory = async () => {
//         try {
//             await fetch("https://ai-chatbot-woj4.onrender.com/clear_history", { method: "POST" });
//             setChatHistory([]);
//         } catch (error) {
//             console.error("Clear history error:", error);
//             alert("Error clearing history.");
//         }
//     };

//     return (
//         <div style={{ textAlign: "center", padding: "20px", color: "white", backgroundColor: "#121212" }}>
//             <h2>AI Health Assistant</h2>
//             <div style={{ width: "90%", maxWidth: "500px", height: "400px", overflowY: "auto", background: "#1e1e1e", padding: "15px", borderRadius: "10px", margin: "auto", display: "flex", flexDirection: "column" }}>
//                 {chatHistory.map((chat, index) => (
//                     <div key={index} style={{ alignSelf: chat.type === "user" ? "flex-end" : "flex-start", background: chat.type === "user" ? "#007bff" : "#4caf50", color: "white", padding: "10px", borderRadius: "15px", margin: "5px 0", maxWidth: "75%", wordWrap: "break-word" }}>
//                         <strong>{chat.type === "user" ? "You:" : "AI:"}</strong> {chat.text}
//                     </div>
//                 ))}
//                 {loading && <p style={{ color: "#bbb" }}>Thinking... <span className="loader"></span></p>}
//             </div>
//             <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", alignItems: "center", width: "90%", maxWidth: "500px" }}>
//                 <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a health question..." style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "none", fontSize: "16px", marginRight: "10px", background: "#333", color: "white" }} />
//                 <button onClick={() => askQuestion()}>📩</button>
//                 <button onClick={startVoiceRecognition}>🎤</button>
//             </div>
//             <button onClick={clearHistory} style={{ marginTop: "10px", padding: "10px", borderRadius: "10px" }}>🗑 Clear History</button>
//         </div>
//     );
// };

// export default AIHealthAssistant;

//new
// import React, { useState, useEffect } from "react";

// const AIHealthAssistant = () => {
//     const [chatHistory, setChatHistory] = useState([]);
//     const [question, setQuestion] = useState("");
//     const [loading, setLoading] = useState(false);

//     const askQuestion = async (query) => {
//         const userQuestion = query || question.trim();
//         if (!userQuestion) {
//             alert("Please enter a question!");
//             return;
//         }

//         const newChat = [...chatHistory, { type: "user", text: userQuestion }];
//         setChatHistory(newChat);
//         setQuestion("");
//         setLoading(true);

//         try {
//             const response = await fetch("https://ai-chatbot-woj4.onrender.com/health_query", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ question: userQuestion }),
//             });

//             if (!response.ok) throw new Error("Server error");
//             const data = await response.json();

//             const aiResponse = data.answer;
//             setChatHistory([...newChat, { type: "ai", text: aiResponse }]);
//             setLoading(false);

//             // Speak the AI response
//             speakText(aiResponse);
//         } catch (error) {
//             console.error("Fetch error:", error);
//             setChatHistory([...newChat, { type: "ai", text: "Error fetching response." }]);
//             setLoading(false);
//         }
//     };

//     const startVoiceRecognition = () => {
//         try {
//             const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//             if (!SpeechRecognition) {
//                 alert("Your browser does not support speech recognition.");
//                 return;
//             }

//             const recognition = new SpeechRecognition();
//             recognition.lang = "en-US";
//             recognition.continuous = true; // Keep listening until the user stops speaking
//             recognition.interimResults = true; // Show partial results as the user speaks

//             recognition.start();

//             recognition.onresult = (event) => {
//                 const spokenText = event.results[0][0].transcript;
//                 setQuestion(spokenText);
//                 console.log("Spoken Text: ", spokenText); // Log for debugging
//                 askQuestion(spokenText);
//             };

//             recognition.onerror = (event) => {
//                 console.error("Recognition error:", event.error);
//                 alert(`Voice recognition error: ${event.error}`);
//             };

//             recognition.onend = () => {
//                 console.log("Speech recognition has ended.");
//                 // You can optionally restart recognition here if needed
//                 // recognition.start();
//             };
//         } catch (error) {
//             alert("Error starting voice recognition.");
//         }
//     };

//     const clearHistory = async () => {
//         try {
//             await fetch("https://ai-chatbot-woj4.onrender.com/clear_history", { method: "POST" });
//             setChatHistory([]);
//         } catch (error) {
//             console.error("Clear history error:", error);
//             alert("Error clearing history.");
//         }
//     };

//     const speakText = (text) => {
//         const speech = new SpeechSynthesisUtterance(text);
//         speech.lang = "en-US";
//         window.speechSynthesis.speak(speech);
//     };

//     return (
//         <div style={{ textAlign: "center", padding: "20px", color: "white", backgroundColor: "#121212" }}>
//             <h2>AI Health Assistant</h2>
//             <div style={{ width: "90%", maxWidth: "500px", height: "400px", overflowY: "auto", background: "#1e1e1e", padding: "15px", borderRadius: "10px", margin: "auto", display: "flex", flexDirection: "column" }}>
//                 {chatHistory.map((chat, index) => (
//                     <div key={index} style={{ alignSelf: chat.type === "user" ? "flex-end" : "flex-start", background: chat.type === "user" ? "#007bff" : "#4caf50", color: "white", padding: "10px", borderRadius: "15px", margin: "5px 0", maxWidth: "75%", wordWrap: "break-word" }}>
//                         <strong>{chat.type === "user" ? "You:" : "AI:"}</strong> {chat.text}
//                     </div>
//                 ))}
//                 {loading && <p style={{ color: "#bbb" }}>Thinking... <span className="loader"></span></p>}
//             </div>
//             <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", alignItems: "center", width: "90%", maxWidth: "500px" }}>
//                 <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a health question..." style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "none", fontSize: "16px", marginRight: "10px", background: "#333", color: "white" }} />
//                 <button onClick={() => askQuestion()}>📩</button>
//                 <button onClick={startVoiceRecognition}>🎤</button>
//             </div>
//             <button onClick={clearHistory} style={{ marginTop: "10px", padding: "10px", borderRadius: "10px" }}>🗑 Clear History</button>
//         </div>
//     );
// };

// export default AIHealthAssistant;

// import React, { useState, useEffect, useRef } from "react";

// const AIHealthAssistant = () => {
//     const [chatHistory, setChatHistory] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const recognitionRef = useRef(null);
//     const isRecognizing = useRef(false);
//     const [textInput, setTextInput] = useState("");

//     useEffect(() => {
//         initVoiceRecognition();
//     }, []);

//     const initVoiceRecognition = () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) {
//             alert("Your browser does not support speech recognition.");
//             return;
//         }

//         const recognition = new SpeechRecognition();
//         recognition.lang = "en-US";
//         recognition.continuous = false;
//         recognition.interimResults = false;

//         recognition.onstart = () => {
//             isRecognizing.current = true;
//             console.log("Voice recognition started.");
//         };

//         recognition.onresult = (event) => {
//             const spokenText = event.results[0][0].transcript;
//             console.log("Heard:", spokenText);
//             handleQuestion(spokenText);
//         };

//         recognition.onerror = (event) => {
//             console.error("Recognition error:", event.error);
//             isRecognizing.current = false;
//         };

//         recognition.onend = () => {
//             console.log("Recognition ended");
//             isRecognizing.current = false;
//             if (!loading) restartRecognition();
//         };

//         recognitionRef.current = recognition;
//         recognition.start();
//     };

//     const restartRecognition = () => {
//         setTimeout(() => {
//             if (recognitionRef.current && !isRecognizing.current && !loading) {
//                 try {
//                     recognitionRef.current.start();
//                 } catch (err) {
//                     console.warn("Restart error:", err.message);
//                 }
//             }
//         }, 1000);
//     };

//     const handleQuestion = async (userQuestion) => {
//         if (!userQuestion) return;

//         const newChat = [...chatHistory, { type: "user", text: userQuestion }];
//         setChatHistory(newChat);
//         setLoading(true);

//         try {
//             const response = await fetch("https://ai-chatbot-woj4.onrender.com/health_query", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ question: userQuestion }),
//             });

//             if (!response.ok) throw new Error("Server error");
//             const data = await response.json();

//             const aiResponse = data.answer;
//             setChatHistory((prev) => [...prev, { type: "ai", text: aiResponse }]);
//             setLoading(false);

//             // Speak and restart recognition after speaking
//             speakText(aiResponse);
//         } catch (error) {
//             console.error("Fetch error:", error);
//             setChatHistory((prev) => [...prev, { type: "ai", text: "Error fetching response." }]);
//             setLoading(false);
//             speakText("Sorry, there was an error getting the response.");
//         }
//     };

//     const speakText = (text) => {
//         const synth = window.speechSynthesis;

//         // Stop recognition if it's running
//         if (recognitionRef.current && isRecognizing.current) {
//             recognitionRef.current.abort();  // Force stop immediately
//             isRecognizing.current = false;
//             console.log("Recognition aborted before speaking.");
//         }

//         // Cancel any ongoing speech
//         if (synth.speaking) {
//             synth.cancel();
//         }

//         const speech = new SpeechSynthesisUtterance(text);
//         speech.lang = "en-US";
//         speech.rate = 1;
//         speech.pitch = 1;

//         speech.onstart = () => {
//             console.log("Speech started.");
//         };

//         speech.onend = () => {
//             console.log("Speech ended. Restarting recognition...");
//             setTimeout(() => {
//                 restartRecognition();
//             }, 1000); // slight delay for mic to become ready
//         };

//         synth.speak(speech);
//     };

//     const clearHistory = async () => {
//         try {
//             await fetch("https://ai-chatbot-woj4.onrender.com/clear_history", { method: "POST" });
//             setChatHistory([]);
//         } catch (error) {
//             console.error("Clear history error:", error);
//             alert("Error clearing history.");
//         }
//     };

//     return (
//         <div style={{ textAlign: "center", padding: "20px", color: "white", backgroundColor: "#121212" }}>
//             <h2>AI Health Assistant</h2>
//             <div style={{
//                 width: "90%", maxWidth: "500px", height: "400px", overflowY: "auto",
//                 background: "#1e1e1e", padding: "15px", borderRadius: "10px",
//                 margin: "auto", display: "flex", flexDirection: "column"
//             }}>
//                 {chatHistory.map((chat, index) => (
//                     <div key={index} style={{
//                         alignSelf: chat.type === "user" ? "flex-end" : "flex-start",
//                         background: chat.type === "user" ? "#007bff" : "#4caf50",
//                         color: "white", padding: "10px", borderRadius: "15px",
//                         margin: "5px 0", maxWidth: "75%", wordWrap: "break-word"
//                     }}>
//                         <strong>{chat.type === "user" ? "You:" : "AI:"}</strong> {chat.text}
//                     </div>
//                 ))}
//                 {loading && <p style={{ color: "#bbb" }}>Thinking... <span className="loader"></span></p>}
//             </div>
//             <form
//     onSubmit={(e) => {
//         e.preventDefault();
//         if (textInput.trim()) {
//             handleQuestion(textInput.trim());
//             setTextInput("");
//         }
//     }}
//     style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}
// >
//     <input
//         type="text"
//         value={textInput}
//         onChange={(e) => setTextInput(e.target.value)}
//         placeholder="Type your question..."
//         style={{
//             flex: 1,
//             maxWidth: "350px",
//             padding: "10px",
//             borderRadius: "10px",
//             border: "1px solid #ccc",
//             fontSize: "16px"
//         }}
//     />
//     <button
//         type="submit"
//         style={{
//             padding: "10px 15px",
//             borderRadius: "10px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             fontSize: "16px"
//         }}
//     >
//         Send
//     </button>
// </form>

//             <button onClick={clearHistory} style={{ marginTop: "10px", padding: "10px", borderRadius: "10px" }}>
//                 🗑 Clear History
//             </button>
//         </div>
//     );
// };

// export default AIHealthAssistant;

import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

const AIHealthAssistant = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);
  const isRecognizing = useRef(false);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    initVoiceRecognition();
  }, []);

  const initVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isRecognizing.current = true;
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      handleQuestion(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      isRecognizing.current = false;
    };

    recognition.onend = () => {
      isRecognizing.current = false;
      if (!loading) restartRecognition();
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const restartRecognition = () => {
    setTimeout(() => {
      if (recognitionRef.current && !isRecognizing.current && !loading) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.warn("Restart error:", err.message);
        }
      }
    }, 1000);
  };

  const handleQuestion = async (userQuestion) => {
    if (!userQuestion) return;

    const newChat = [...chatHistory, { type: "user", text: userQuestion }];
    setChatHistory(newChat);
    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-chatbot-woj4.onrender.com/health_query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userQuestion }),
        }
      );

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();

      const aiResponse = data.answer;
      setChatHistory((prev) => [...prev, { type: "ai", text: aiResponse }]);
      setLoading(false);
      speakText(aiResponse);
    } catch (error) {
      console.error("Fetch error:", error);
      setChatHistory((prev) => [
        ...prev,
        { type: "ai", text: "Error fetching response." },
      ]);
      setLoading(false);
      speakText("Sorry, there was an error getting the response.");
    }
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;

    if (recognitionRef.current && isRecognizing.current) {
      recognitionRef.current.abort();
      isRecognizing.current = false;
    }

    if (synth.speaking) synth.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    speech.onend = () => {
      setTimeout(() => {
        restartRecognition();
      }, 1000);
    };

    synth.speak(speech);
  };

  return (
    //         <div style={{
    //             backgroundColor: "transparent",
    //             height: "100vh",
    //             padding: "20px",
    //             display: "flex",
    //             flexDirection: "column",
    //             alignItems: "center",
    //             color: "white"
    //         }}>
    //             <div style={{
    //                 backgroundColor: "rgba(0,0,0,0.2)",
    //                 borderRadius: "20px",
    //                 padding: "20px",
    //                 width: "90%",
    //                 maxWidth: "400px",
    //                 height: "70%",
    //                 overflowY: "auto",
    //                 marginBottom: "20px",
    //                 backdropFilter: "blur(5px)"
    //             }}>
    //                {chatHistory.map((chat, index) => (
    //   <div
    //     key={index}
    //     style={{
    //       display: 'flex',
    //       justifyContent: chat.type === 'user' ? 'flex-start' : 'flex-end',
    //       marginBottom: '10px',
    //     }}
    //   >
    //     <div
    //       style={{
    //         background: chat.type === 'user' ? '#007bff' : 'rgba(255, 255, 255, 0.1)',
    //         color: 'white',
    //         padding: '10px 15px',
    //         borderRadius: '20px',
    //         maxWidth: '70%',
    //         wordWrap: 'break-word',
    //         borderTopLeftRadius: chat.type === 'user' ? '0' : '20px',
    //         borderTopRightRadius: chat.type === 'user' ? '20px' : '0',
    //       }}
    //     >
    //       {chat.text}
    //     </div>
    //   </div>
    // ))}

    //                 {loading && <p style={{ color: "#bbb" }}>Thinking...</p>}
    //             </div>

    //             <form
    //                 onSubmit={(e) => {
    //                     e.preventDefault();
    //                     if (textInput.trim()) {
    //                         handleQuestion(textInput.trim());
    //                         setTextInput("");
    //                     }
    //                 }}
    //                 style={{
    //                     display: "flex",
    //                     alignItems: "center",
    //                     justifyContent: "center",
    //                     width: "90%",
    //                     maxWidth: "400px",
    //                     backgroundColor: "rgba(0,0,0,0.2)",
    //                     borderRadius: "25px",
    //                     padding: "10px 15px",
    //                     gap: "10px",
    //                     backdropFilter: "blur(5px)"
    //                 }}
    //             >
    //                 <input
    //                     type="text"
    //                     value={textInput}
    //                     onChange={(e) => setTextInput(e.target.value)}
    //                     placeholder="Type a message ..."
    //                     style={{
    //                         flex: 1,
    //                         backgroundColor: "transparent",
    //                         border: "none",
    //                         outline: "none",
    //                         color: "white",
    //                         fontSize: "16px"
    //                     }}
    //                 />
    //                 <button
    //                     type="submit"
    //                     style={{
    //                         backgroundColor: "#007bff",
    //                         border: "none",
    //                         borderRadius: "50%",
    //                         width: "40px",
    //                         height: "40px",
    //                         display: "flex",
    //                         alignItems: "center",
    //                         justifyContent: "center",
    //                         cursor: "pointer",
    //                         boxShadow: "0 0 10px #007bff"
    //                     }}
    //                 >
    //                     <FaPaperPlane color="white" size={16} />
    //                 </button>
    //             </form>
    //         </div>

    // <div style={{
    //     minHeight: "100dvh", // better than height: 100vh
    //     display: "flex",
    //     flexDirection: "column",
    //     // justifyContent: "space-between", // pushes footer/form down
    //     padding: "10px",
    //     background:"transparent",
    //     color: "white",
    //     boxSizing: "border-box",

    //   }}>
    // <div
    // className="chat-bot-container"
    //   style={{
    //     height: "100dvh",
    //     display: "flex",
    //     flexDirection: "column",
    //     padding: "10px",
    //     background: "transparent",
    //     color: "white",
    //     boxSizing: "border-box",
    //     justifyContent: "space-between",
        
    //   }}
    // >
    <div 
  style={{
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center horizontally
    // justifyContent: "center", // Center vertically
    padding: "20px",
    background: "transparent",
    color: "white",
    boxSizing: "border-box",
    position: "absolute", // Add this
    top: 0,              // Add this
    left: 0,             // Add this
    right: 0,            // Add this
    bottom: 0,           // Add this
  }}
>
      {/*     
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "20px",
          padding: "15px",
          width: "100%", // take full width
          maxWidth: "500px",
          height: "65dvh", // responsive height
          overflowY: "auto",
          marginBottom: "15px",
          backdropFilter: "blur(5px)",
          boxSizing: "border-box",
        }}
      > */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "20px",
          padding: "15px",
          width: "100%",
          maxWidth: "500px",
          flex:"1", 
          overflowY: "auto",
          marginBottom: "15px",
          backdropFilter: "blur(5px)",
          boxSizing: "border-box",
        }}
      >
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: chat.type === "user" ? "flex-start" : "flex-end",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                background:
                  chat.type === "user" ? "#007bff" : "rgba(255, 255, 255, 0.1)",
                color: "white",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "70%",
                wordWrap: "break-word",
                borderTopLeftRadius: chat.type === "user" ? "0" : "20px",
                borderTopRightRadius: chat.type === "user" ? "20px" : "0",
              }}
            >
              {chat.text}
            </div>
          </div>
        ))}

        {loading && <p style={{ color: "#bbb" }}>Thinking...</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (textInput.trim()) {
            handleQuestion(textInput.trim());
            setTextInput("");
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "25px",
          padding: "8px 12px",
          gap: "10px",
          backdropFilter: "blur(5px)",
          boxSizing: "border-box",
        }}
      >
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type a message ..."
          style={{
            flex: 1,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "16px",
            minWidth: 0, // prevents overflow
          }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 0 10px #007bff",
          }}
        >
          <FaPaperPlane color="white" size={16} />
        </button>
      </form>
    </div>
  );
};

export default AIHealthAssistant;
