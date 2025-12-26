import { useState, useRef, useEffect } from "react";

const ChatInput = ({ sendMessage }) => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const handleTypingEnd = () => {
    const timer = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timer);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 md:px-6 py-4 bg-gradient-to-t from-gray-900 to-gray-800/80 border-t border-gray-700/50 backdrop-blur-lg">
      <div className="max-w-4xl mx-auto">
        {/* Typing indicator */}
        {isTyping && (
          <div className="mb-4 px-4 py-2 bg-gray-800/60 rounded-xl border border-gray-700/50 inline-flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm text-gray-300 font-medium">AI Assistant is typing...</span>
          </div>
        )}

        {/* Quick Prompts - Now moved to top */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => {
                setText("Explain quantum computing in simple terms");
                textareaRef.current?.focus();
              }}
              className="px-4 py-2 text-sm bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-200 whitespace-nowrap flex items-center space-x-2 shadow-lg"
            >
              <span>🔬</span>
              <span>Explain quantum computing</span>
            </button>
            <button
              onClick={() => {
                setText("Write a creative story about a robot learning to paint");
                textareaRef.current?.focus();
              }}
              className="px-4 py-2 text-sm bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-200 whitespace-nowrap flex items-center space-x-2 shadow-lg"
            >
              <span>🎨</span>
              <span>Creative story</span>
            </button>
            <button
              onClick={() => {
                setText("Help me debug this code...");
                textareaRef.current?.focus();
              }}
              className="px-4 py-2 text-sm bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-200 whitespace-nowrap flex items-center space-x-2 shadow-lg"
            >
              <span>💻</span>
              <span>Debug code</span>
            </button>
          </div>
        </div>

        {/* Main Input Area */}
        <div className="relative">
          {/* Decorative gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm opacity-50"></div>
          
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl">
            {/* Textarea */}
            <div className="px-4 pt-3">
              <textarea
                ref={textareaRef}
                value={text}
                placeholder="Message AI Assistant..."
                onChange={(e) => {
                  setText(e.target.value);
                  handleTypingStart();
                }}
                onKeyDown={handleKeyDown}
                onBlur={handleTypingEnd}
                rows="1"
                className="w-full px-1 py-3 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none overflow-hidden max-h-32 text-lg font-light"
                style={{ minHeight: '56px' }}
              />
            </div>

            {/* Bottom Actions Row */}
            <div className="px-4 py-3 border-t border-gray-700/50 flex items-center justify-between">
              {/* Left Actions */}
              <div className="flex items-center space-x-1">
                <button 
                  className="p-2.5 text-gray-400 hover:text-indigo-400 hover:bg-gray-800/60 rounded-xl transition-all duration-200 group relative"
                  title="Attach file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Attach file
                  </div>
                </button>
                
                <button 
                  className="p-2.5 text-gray-400 hover:text-green-400 hover:bg-gray-800/60 rounded-xl transition-all duration-200 group relative"
                  title="Insert image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Insert image
                  </div>
                </button>
                
                <button 
                  className="p-2.5 text-gray-400 hover:text-yellow-400 hover:bg-gray-800/60 rounded-xl transition-all duration-200 group relative"
                  title="Add emoji"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Add emoji
                  </div>
                </button>
              </div>

              {/* Middle - Character Count & Voice */}
              <div className="flex items-center space-x-3">
                {/* Character Count */}
                {text.length > 0 && (
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${text.length > 3500 ? 'bg-red-500/10 text-red-400' : text.length > 2000 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                    {text.length}/4000
                  </div>
                )}
                
                {/* Voice Input */}
                <button 
                  className="p-2.5 text-gray-400 hover:text-pink-400 hover:bg-gray-800/60 rounded-xl transition-all duration-200 group relative"
                  title="Voice input"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Voice input
                  </div>
                </button>
              </div>

              {/* Right - Send Button */}
              <div className="flex items-center space-x-2">
                {/* Quick AI Actions */}
                <div className="hidden md:flex items-center space-x-1">
                  <button 
                    onClick={() => {
                      setText("Can you help me with research on...");
                      textareaRef.current?.focus();
                    }}
                    className="p-2.5 text-gray-400 hover:text-green-400 hover:bg-gray-800/60 rounded-xl transition-all duration-200 group relative"
                    title="Research mode"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setText("Can you write code for...");
                      textareaRef.current?.focus();
                    }}
                    className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-gray-800/60 rounded-xl transition-all duration-200 group relative"
                    title="Code generation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className={`
                    px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-medium
                    ${text.trim() 
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105' 
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  {text.trim() ? (
                    <>
                      <span className="text-white">Send</span>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Send</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-800/50 rounded text-gray-300 mx-1">Enter</kbd> to send • 
            <kbd className="px-2 py-1 bg-gray-800/50 rounded text-gray-300 mx-1">Shift</kbd> + 
            <kbd className="px-2 py-1 bg-gray-800/50 rounded text-gray-300 mx-1">Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;