# 🧠 MeetingMind  

![GitHub stars](https://img.shields.io/github/stars/amriteshanand0129/MeetingMind)<br>
![GitHub forks](https://img.shields.io/github/forks/amriteshanand0129/MeetingMind)

MeetingMind is an AI-powered meeting assistant that **transcribes speech into text**, analyzes it using **Gemini**, and extracts **meeting summaries, calendar events, to-do tasks, and important emails** that need to be sent.  

---

## 📖 About the Project  

Managing meeting notes manually is time-consuming and prone to errors. **MeetingMind automates this process** by converting speech to text, analyzing it with **Gemini**, and generating:  
✅ **A concise meeting summary**  
✅ **Calendar events mentioned in the meeting**  
✅ **Actionable to-do tasks**  
✅ **Drafts of important emails based on discussions**  

This project simplifies **meeting documentation and follow-ups**, improving productivity.  

---

## 🚀 Key Features  

✔ **Real-time Speech-to-Text Conversion** (Using AWS Transcribe)  
✔ **AI-Powered Meeting Analysis** (Gemini integration)  
✔ **Automatic Summary Generation** (Concise, AI-driven insights)  
✔ **Task & Event Extraction** (Detects to-do tasks and calendar events)  
✔ **Smart Email Drafting** (Identifies required emails from discussions)  
✔ **User-Friendly Interface** (Easy navigation and interaction)  

---

## 🛠️ Tech Stack  

### **Frontend**  
- **React.js** – Interactive UI  
- **Tailwind CSS** – Modern styling  

### **Backend**  
- **Node.js & Express.js** – Server-side logic  
- **Gemini API** – AI-powered analysis  
- **MongoDB** – Database for storing meeting records  

---
## ⚙️ Installation and Setup  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/amritesh2901/MeetingMind.git
cd MeetingMind
```

### **2️⃣ Install Dependencies**
```sh
# Installing backend dependencies
cd backend
npm i
# Installing frontend dependencies
cd ../frontend
npm i
```

### **3️⃣ Set Up Environment Variables**
Create a .env file in the backend directory and add:
```sh
DB_URL="your_database_url"
SECRET="your_secret_key"
GEMINI_API_KEY="your_gemini_api_key"
PORT="your_backend_server_port" # Optional
```

### **4️⃣ Start the Backend Server**
```sh
cd backend
npm start
```
Backend will run at http://localhost:8080 or http://localhost:PORT 🚀

### **5️⃣ Start the Frontend**
```sh
cd frontend
npm run dev
```
Frontend will run at http://localhost:5173 🎨

⚠️ Make sure to add .env to .gitignore to prevent exposing sensitive data.

🌟 Show Some Love!
If you found this project helpful, please ⭐ star this repository and share it! 🚀