import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import {
  getAllChats,
  getChatById,
  createNewChat,
  sendMessage,
  deleteChat,
} from "../api";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* =========================
     Load all chats
  ==========================*/
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const data = await getAllChats();
      setChats(data);

      if (data.length > 0) {
        loadChat(data[0]._id);
      }
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  /* =========================
     Load chat by ID
  ==========================*/
  const loadChat = async (chatId) => {
    try {
      setLoading(true);
      const data = await getChatById(chatId);
      setActiveChat(data);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load chat", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Create new chat
  ==========================*/
  const handleNewChat = async () => {
    try {
      const newChat = await createNewChat();
      setChats((prev) => [newChat, ...prev]);
      loadChat(newChat._id);
    } catch (err) {
      console.error("Failed to create chat", err);
    }
  };

  /* =========================
     Send message
  ==========================*/
  const handleSendMessage = async (text) => {
    if (!activeChat || !text.trim()) return;

    try {
      const newMessage = await sendMessage(activeChat._id, text);
      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  /* =========================
     Delete chat
  ==========================*/
  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));

      if (activeChat?._id === chatId) {
        setActiveChat(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete chat", err);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100 flex overflow-hidden">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50"></div>
        <svg className="w-6 h-6 text-white relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:relative z-40 transition-transform duration-300 ease-in-out
        w-80 md:w-96 h-full flex flex-col
      `}>
        <Sidebar
          chats={chats}
          activeChatId={activeChat?._id}
          onSelectChat={(id) => {
            loadChat(id);
            if (window.innerWidth < 768) setSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Gradient Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        
        {/* Chat Title Bar (Minimal) */}
        {activeChat && !loading && (
          <div className="px-6 py-3 border-b border-gray-700/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30"></div>
                    <div className="relative w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-200">{activeChat?.title || "New Chat"}</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-gray-400">
                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* AI Status */}
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-full border border-gray-700/30">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-300">AI Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Content */}
        <main className="flex-1 overflow-hidden relative">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-full blur-lg"></div>
                  <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gradient-to-r from-indigo-500 to-purple-600 mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 border-b-purple-500"></div>
                  </div>
                </div>
                <p className="text-gray-300 font-medium">Loading conversation...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
              </div>
            </div>
          ) : activeChat ? (
            <>
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <ChatWindow messages={messages} />
                </div>
                <div className="border-t border-gray-700/30">
                  <ChatInput sendMessage={handleSendMessage} />
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6">
              <div className="max-w-2xl text-center">
                <div className="relative mb-8">
                  <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-full flex items-center justify-center border border-gray-700/30 backdrop-blur-sm">
                    <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                  Welcome to Your AI Assistant
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                  Select a conversation from the sidebar or start a new chat to begin collaborating with AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleNewChat}
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50"></div>
                    <span className="relative flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Start New Chat</span>
                    </span>
                  </button>
                  <button
                    onClick={() => window.innerWidth < 768 && setSidebarOpen(true)}
                    className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 font-semibold rounded-xl border border-gray-700/50 hover:border-indigo-500/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Browse Conversations
                  </button>
                </div>
                
                {/* Quick Tips */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                    <div className="text-2xl mb-2">💡</div>
                    <h4 className="font-semibold text-gray-200 mb-1">Ask Anything</h4>
                    <p className="text-sm text-gray-400">Questions, explanations, or creative ideas</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-semibold text-gray-200 mb-1">Fast Responses</h4>
                    <p className="text-sm text-gray-400">Get instant AI-powered answers</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                    <div className="text-2xl mb-2">🔒</div>
                    <h4 className="font-semibold text-gray-200 mb-1">Private & Secure</h4>
                    <p className="text-sm text-gray-400">Your conversations are confidential</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Status Bar (Minimal) */}
        {activeChat && (
          <footer className="px-6 py-2 border-t border-gray-700/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4 text-gray-400">
                  <span>Chat ID: {activeChat?._id?.slice(-8)}</span>
                  <span className="text-gray-600">•</span>
                  <span>Created: {new Date(activeChat?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">Connected</span>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default ChatPage;