# 📘 StudyRevise - Backend

The backend for **StudyRevise**, a smart learning assistant that helps users upload PDFs and automatically generate quizzes using AI.  
This service is built with **Node.js**, **Express**, **TypeScript**, and **MongoDB** to ensure performance, security, and scalability.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Secure login & registration using JWT tokens and cookies.
- 📄 **PDF Management**
  - Upload, process, and store PDFs.
  - Extract text for quiz generation.
- 🧠 **AI-Powered Quiz Generation**
  - Automatically generate MCQs, SAQs, and LAQs from uploaded PDFs.
  - Fallback static quiz generation when AI is unavailable.
- 📊 **Quiz Tracking**
  - Store and retrieve quiz progress for each user.
- 🌐 **CORS & Environment Config**
  - Proper configuration for secure API access from frontend.

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Cookies |
| Environment Validation | Zod |
| AI Integration | OpenAI (configurable) |

---

## ⚙️ Environment Variables

Create a `.env` file in your backend root directory:

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb+srv://<your-mongo-uri>
MONGODB_DB_NAME=studyrevise
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=your_openai_key
AI_MODEL=openai/gpt-5-mini


# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the server
npm start
