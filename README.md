# Savy Platform for Visually Impaired People 👁️ 

<div>
  <p>
    <strong>An AI-Powered Platform for Visually Impaired People</strong>
  </p>
  <p>
    <a href="https://savy-frontend-final.onrender.com" target="_blank">🌐 Live Demo</a>
  </p>
</div>

## 🌟 About

Savy is a comprehensive platform designed to enhance the daily lives of visually impaired individuals through advanced AI technologies. The platform provides voice-controlled assistance for various tasks, making the world more accessible through technology.

## ✨ Key Features

- **Voice-Controlled Interface**: Complete hands-free operation for easy navigation
- **Multi-Language Image Description**: 
  - Powered by Google's Gemini AI
  - Voice-activated image capture with "capture image" command
  - Interactive language selection through voice commands
  - Provides detailed descriptions in chosen language (Hindi, Marathi, or English)
  - Dual output: both written text and voice narration
  - Features:
    - Natural voice commands for image capture
    - Language preference selection via voice
    - High-quality image descriptions
    - Real-time voice feedback
    - Option to repeat or clarify descriptions

- **Smart Object Finder**:
  - Voice-activated object detection using YOLO8 and Roboflow API
  - Real-time camera scanning
  - Audio feedback with buzzer alerts
  - Step-by-step navigation instructions when objects are detected

- **AI Chatbot Assistant**:
  - Powered by Google's Gemini AI
  - Voice-interactive conversational interface
  - Features:
    - Natural language understanding
    - Multi-language support (English, Hindi, Marathi)
    - Voice input and output
    - Context-aware responses
    - General knowledge queries
    - Real-time information access
    - Personalized assistance
    - Voice command controls

- **Multi-Language Text Extraction**:
  - Powered by Tesseract OCR ML model
  - Supports multiple Indian languages:
    - English
    - Hindi (हिंदी)
    - Marathi (मराठी)
  - Features:
    - Automatic language detection
    - High-accuracy text recognition
    - Voice output of extracted text
    - Support for different text formats and fonts
    - Real-time text extraction from camera feed
    - Export extracted text in multiple formats

## 🛠️ Tech Stack

- **Frontend**: React
- **AI & ML**:
  - Google Gemini AI
  - YOLO8 for object detection
  - Roboflow API
  - Tesseract OCR with custom ML models for:
    - English (eng)
    - Hindi (hin)
    - Marathi (mar)
- **Voice Control**: 
  - Web Speech API
  - Custom voice command processing
  - Multi-language voice recognition
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React Icons
- **Code Quality**: ESLint

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/AYNR325/savy-frontend-final.git
cd nsavy-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file and add your API keys
GEMINI_API_KEY=your_gemini_api_key
ROBOFLOW_API_KEY=your_roboflow_api_key
```

4. Install Tesseract OCR and language data:
```bash
# For Windows
winget install Tesseract.Tesseract
# Download language data files for Hindi and Marathi
# Place them in the Tesseract installation directory
```

5. Start the development server:
```bash
npm run dev
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📁 Project Structure

```
nsavy-app/
├── src/
│   ├── assets/         # Static assets
│   ├── Chatbot.jsx     # AI Chatbot component
│   ├── ObjectFinder.jsx      # Object Finder component
│   ├── CameraPage.jsx        # Camera functionality
│   ├── HomePage.jsx          # Home page component
│   ├── TextExtractor.jsx     # Multi-language text extraction
│   ├── ImageDescription.jsx  # Voice-controlled image description
│   └── App.jsx              # Main application component
├── public/             # Public assets
└── package.json        # Project dependencies
```

## 🎯 Use Cases

- **Daily Navigation**: Find objects and navigate spaces independently
- **Information Access**: 
  - Get descriptions of images and extract text from documents
  - Read text in multiple languages (English, Hindi, Marathi)
  - Convert printed text to speech in preferred language
  - Capture and understand images through voice commands
- **General Assistance**: 
  - Ask any question or query through voice commands
  - Get real-time information and answers
  - Multi-language support for queries
- **Multi-language Support**: Receive information in preferred languages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. We especially encourage contributions that improve accessibility features.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

- Ayush Rokade - [@AYNR325](https://github.com/AYNR325)

---

<div align="center">
  <p>Made with ❤️ for making the world more accessible</p>
</div>
