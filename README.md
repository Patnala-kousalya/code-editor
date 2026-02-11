# 🚀 Advanced Web Code Editor (React + Monaco)

A modern browser-based code editor built using React and Monaco Editor with an advanced UI, real-time keyboard event debugger, command palette, and production-ready deployment support.

---

## 🌟 Overview

This project demonstrates a fully functional web code editor interface inspired by modern developer tools. It focuses on usability, keyboard interaction architecture, responsive layout, and real-world deployment practices.

---

## ✨ Features

- ⚡ Monaco Editor integration (VS Code engine)
- 🎨 Modern dark UI with glassmorphism styling
- ⌨️ Real-time keyboard Event Debugger
- 💾 Save shortcut support (Ctrl + S)
- 🔎 Command Palette (Ctrl + K)
- 📊 Status bar for typing and actions
- 📱 Responsive workspace layout
- 🐳 Docker support for containerized deployment
- ⚡ Built using Vite for high performance

---

## 🧠 Key Functionalities

### Code Editor
- Syntax-ready editing environment
- Word wrap enabled
- Custom font support
- Optimized layout rendering

### Event Debugger
Tracks and displays:
- key pressed
- ctrl usage
- shift usage
- editor activity

### Command Palette
Provides quick actions:
- Save file
- Clear editor
- Toggle editor behaviors

### Status Bar
Displays:
- Ready state
- Typing state
- Save confirmation

---

## 🛠 Tech Stack

Frontend:
- React.js
- Monaco Editor
- Vite
- CSS (Advanced UI styling)

Tools:
- Docker
- GitHub

---

## 📦 Installation

npm install  
npm run dev  

Application runs at:  
http://localhost:5173

---

## 🏗 Production Build

npm run build  
npm run preview  

---

## 🐳 Docker Usage

Build container:

docker build -t code-editor .

Run container:

docker run -p 5173:5173 code-editor

---

## 📂 Project Structure

src/
 ├── App.jsx
 ├── main.jsx
 ├── index.css

components/
 ├── Editor
 ├── DebugPanel
 ├── CommandPalette

---

## 🚀 Deployment

This project can be deployed using:

- Vercel
- Netlify
- Docker
- Render

---

## 🔧 Advanced Concepts Implemented

- Monaco editor browser integration
- Keyboard shortcut architecture
- Event state tracking in React
- Glassmorphism UI layering
- Responsive editor workspace
- Command palette interaction flow

---

## 📈 Future Enhancements

- Multi-language editor support
- Theme switcher
- File explorer UI
- Git integration
- AI-assisted coding panel

---

## 📸 Screenshots

(Add project UI screenshots here)

---

## 👨‍💻 Author

Your Name  
Frontend Developer  

---

## 📜 License

MIT License
