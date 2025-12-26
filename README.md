# AI Chatting App

A full-stack AI-powered chatting application that allows users to communicate with an AI assistant. The application leverages a modern tech stack with a React frontend and a Node.js/Express backend, integrated with Hugging Face's inference API for AI responses.

## 🚀 Features

- **AI Chat Interface**: Real-time chat with an AI assistant powered by the `HuggingFaceH4/zephyr-7b-beta` model.
- **User Authentication**: Secure signup and login functionality using JWT and bcrypt.
- **Real-time Updates**: Socket.io integration for real-time communication.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.
- **Modern Frontend**: Fast and efficient UI built with React and Vite.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **AI Integration**: OpenAI SDK (configured for Hugging Face Inference API)
- **Real-time**: Socket.io

## 📂 Project Structure

```
├── backend/            # Express server and API logic
│   ├── config/         # Database configuration
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes (Auth, Chat)
│   ├── middleware/     # Auth middleware
│   ├── aiService.js    # AI integration logic
│   └── server.js       # Entry point
│
└── frontend/           # React application
    ├── src/            # Components and pages
    ├── public/         # Static assets
    └── vite.config.js  # Vite configuration
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_huggingface_api_key
```
*(Note: The AI service is configured to use the Hugging Face API via the OpenAI SDK compatible endpoint. You may need a Hugging Face Access Token).*

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The application should now be accessible at `http://localhost:5173`.

## 📡 API Endpoints

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Chat**: Endpoints for handling chat history and messaging.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
