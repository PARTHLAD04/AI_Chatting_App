import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // backend base URL
});

// Automatically attach token if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


// Signup
export const signupUser = async (formData) => {
  const res = await API.post("/auth/signup", formData);
  return res.data;
};

// Login
export const loginUser = async (formData) => {
  const res = await API.post("/auth/login", formData);
  return res.data;
};


export const getAllChats = async () => {
  const res = await API.get("/chat/all");
  return res.data;
};

export const getChatById = async (chatId) => {
  const res = await API.get(`/chat/${chatId}`);
  return res.data;
};

export const createNewChat = async () => {
  const res = await API.post("/chat/new");
  return res.data;
};

export const sendMessage = async (chatId, message) => {
  const res = await API.post("/chat/send", { chatId, message });
  return res.data;
};

export const deleteChat = async (chatId) => {
  const res = await API.delete(`/chat/${chatId}`);
  return res.data;
};


export default API;
