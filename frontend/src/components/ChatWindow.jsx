import { useEffect, useRef } from "react";

const ChatWindow = ({ messages }) => {
  const bottomRef = useRef(null);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for message grouping
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((msg, index) => {
      const messageDate = formatDate(msg.timestamp);

      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = { date: messageDate, messages: [] };
        groups.push(currentGroup);
      }

      currentGroup.messages.push({ ...msg, index });
    });

    return groups;
  };

  // Check if consecutive messages are from same sender
  const isSameSender = (current, previous) => {
    if (!previous) return false;
    return current.role === previous.role;
  };

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800/50">
      {/* Welcome message when no messages */}
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-full blur-xl"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Welcome to ChatApp
          </h3>
          <p className="text-gray-300 max-w-md mb-8 text-lg">
            Start a conversation with your AI assistant. I'm here to help with anything you need!
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="text-2xl mb-2">✨</div>
              <h4 className="font-semibold text-gray-200 mb-1">Creative Writing</h4>
              <p className="text-sm text-gray-400">Stories, poems, and content creation</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-semibold text-gray-200 mb-1">Research</h4>
              <p className="text-sm text-gray-400">Analysis and information gathering</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300 group">
              <div className="text-2xl mb-2">💡</div>
              <h4 className="font-semibold text-gray-200 mb-1">Problem Solving</h4>
              <p className="text-sm text-gray-400">Solutions and strategic thinking</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-semibold text-gray-200 mb-1">Code Generation</h4>
              <p className="text-sm text-gray-400">Programming and debugging</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages container with date grouping */}
      {messages.length > 0 && (
        <div className="px-4 md:px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {groupMessagesByDate().map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-6">
                {/* Date separator */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700/50"></div>
                  </div>
                  <div className="relative">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 text-sm text-gray-400 rounded-full border border-gray-700/50">
                      {group.date}
                    </span>
                  </div>
                </div>

                {/* Messages in this group */}
                {group.messages.map((msg, msgIndex) => {
                  const isUser = msg.role === "user";
                  const previousMessage = msgIndex > 0 ? group.messages[msgIndex - 1] : null;
                  const showAvatar = !isSameSender(msg, previousMessage);
                  const timeAgo = formatTime(msg.timestamp);

                  return (
                    <div
                      key={msg.index}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} group animate-fade-in`}
                    >
                      {/* AI Message */}
                      {!isUser && (
                        <div className="flex items-start space-x-3 max-w-[90%] md:max-w-[85%]">
                          {/* Avatar */}
                          {showAvatar && (
                            <div className="flex-shrink-0">
                              <div className="relative group/avatar">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30 group-hover/avatar:opacity-50 transition-opacity"></div>
                                <div className="relative w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Message Content */}
                          <div className={`flex flex-col ${!showAvatar ? "ml-12" : ""}`}>
                            {showAvatar && (
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-semibold text-gray-300">AI Assistant</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">{timeAgo}</span>
                              </div>
                            )}
                            <div className="relative">
                              <div className={`
                                rounded-2xl px-5 py-4 backdrop-blur-sm
                                ${showAvatar
                                  ? 'rounded-tl-none bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50'
                                  : 'ml-1 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/30'
                                }
                                shadow-xl
                              `}>
                                <div className="prose prose-invert max-w-none">
                                  <p className="text-gray-100 whitespace-pre-wrap leading-relaxed text-[15px]">
                                    {msg.content}
                                  </p>
                                </div>
                              </div>

                              {/* Message actions */}
                              <div className="absolute -bottom-2 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="flex items-center space-x-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg px-3 py-1.5 shadow-lg border border-gray-700/50 backdrop-blur-sm">
                                  <button className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200" title="Copy">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  </button>
                                  <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200" title="Share">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                  </button>
                                  <button className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200" title="Save">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* User Message */}
                      {isUser && (
                        <div className="flex items-start justify-end space-x-3 max-w-[90%] md:max-w-[85%]">
                          {/* Message Content */}
                          <div className="flex flex-col items-end">
                            {showAvatar && (
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xs text-gray-400">{timeAgo}</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-sm font-semibold text-gray-300">You</span>
                              </div>
                            )}
                            <div className="relative group/message">
                              <div className={`
                                rounded-2xl px-5 py-4 shadow-xl
                                ${showAvatar
                                  ? 'rounded-tr-none bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                                  : 'mr-1 bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90'
                                }
                                relative overflow-hidden
                              `}>
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-20"></div>
                                <p className="relative text-white whitespace-pre-wrap leading-relaxed text-[15px] font-medium">
                                  {msg.content}
                                </p>
                              </div>

                              {/* Message status indicator */}
                              <div className="absolute -bottom-2 right-4 flex items-center space-x-2">
                                <span className="text-xs text-gray-500 opacity-0 group-hover/message:opacity-100 transition-opacity duration-300">
                                  {msg.status || "Delivered"}
                                </span>
                                {msg.status === "sent" && (
                                  <svg className="w-4 h-4 text-gray-500 opacity-0 group-hover/message:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Avatar */}
                          {showAvatar && (
                            <div className="flex-shrink-0">
                              <div className="relative group/avatar">
                                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full blur opacity-30 group-hover/avatar:opacity-50 transition-opacity"></div>
                                <div className="relative w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Typing indicator */}
            {messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-start space-x-3 max-w-[85%]">
                <div className="relative group/avatar">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30 group-hover/avatar:opacity-50 transition-opacity"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-semibold text-gray-300">AI Assistant</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">typing...</span>
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 px-5 py-4 shadow-xl backdrop-blur-sm">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom reference for auto-scroll */}
            <div ref={bottomRef} />
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;