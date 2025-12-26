import { useState } from "react";

const Sidebar = ({
    chats,
    activeChatId,
    onSelectChat,
    onNewChat,
    onDeleteChat,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    // Generate a random avatar color based on chat title
    const getAvatarColor = (title) => {
        const colors = [
            'from-blue-500 to-cyan-500',
            'from-purple-500 to-pink-500',
            'from-orange-500 to-red-500',
            'from-green-500 to-emerald-500',
            'from-indigo-500 to-purple-600',
            'from-pink-500 to-rose-500',
            'from-amber-500 to-yellow-500',
            'from-teal-500 to-cyan-500'
        ];
        const index = title ? title.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800/80 backdrop-blur-sm border-r border-gray-700/30">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-700/30">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                                ChatApp
                            </h1>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-400">Connected</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Chat Button */}
                <button
                    onClick={onNewChat}
                    className="group relative w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-3 border border-gray-700/50 hover:border-indigo-500/30"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="relative text-lg font-medium">New Chat</span>
                </button>
            </div>

            {/* Chat List Header */}
            <div className="px-6 py-4 border-b border-gray-700/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Conversations</h2>
                        <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/20">
                            {chats.length}
                        </span>
                    </div>
                    <button className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                        <div className="relative mb-6">
                            <div className="absolute -inset-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full blur-lg opacity-50"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-full flex items-center justify-center border border-gray-700/30">
                                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">No conversations yet</h3>
                        <p className="text-gray-500 text-sm mb-6">Create your first chat to get started</p>
                        <button
                            onClick={onNewChat}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-300 rounded-lg border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-200 text-sm font-medium"
                        >
                            Start chatting
                        </button>
                    </div>
                ) : (
                    <div className="p-3 space-y-1">
                        {chats.map((chat) => (
                            <div
                                key={chat._id}
                                className={`
                                    relative group rounded-xl transition-all duration-300
                                    ${activeChatId === chat._id
                                        ? 'bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/5 border-l-4 border-indigo-400 shadow-lg'
                                        : 'hover:bg-gray-800/30 hover:shadow-md'
                                    }
                                `}
                            >
                                {/* Chat Item */}
                                <div className="flex items-center justify-between p-3">
                                    <button
                                        onClick={() => onSelectChat(chat._id)}
                                        className="flex-1 flex items-center space-x-3 text-left group/chat"
                                    >
                                        {/* Chat Avatar */}
                                        <div className="relative">
                                            <div className={`absolute -inset-1 bg-gradient-to-r ${getAvatarColor(chat.title)} rounded-lg blur opacity-30 ${activeChatId === chat._id ? 'opacity-50' : 'group-hover/chat:opacity-40'}`}></div>
                                            <div className={`
                                                relative w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg
                                                ${activeChatId === chat._id 
                                                    ? `bg-gradient-to-r ${getAvatarColor(chat.title)}` 
                                                    : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/30'
                                                }
                                            `}>
                                                {activeChatId === chat._id ? (
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-sm font-medium text-gray-400">
                                                        {chat.title ? chat.title.charAt(0).toUpperCase() : 'N'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Chat Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`
                                                    font-semibold truncate text-[15px]
                                                    ${activeChatId === chat._id ? 'text-white' : 'text-gray-200 group-hover/chat:text-white'}
                                                `}>
                                                    {chat.title || "New Chat"}
                                                </h3>
                                                <span className={`
                                                    text-xs ml-2 whitespace-nowrap
                                                    ${activeChatId === chat._id ? 'text-indigo-300' : 'text-gray-500 group-hover/chat:text-gray-400'}
                                                `}>
                                                    {formatDate(chat.createdAt || chat.updatedAt || new Date())}
                                                </span>
                                            </div>
                                            {chat.lastMessage ? (
                                                <p className="text-sm text-gray-400 truncate">
                                                    {chat.lastMessage.text}
                                                </p>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                                                    <span className="text-xs text-gray-500 italic">No messages yet</span>
                                                </div>
                                            )}
                                        </div>
                                    </button>

                                    {/* Delete Button with Confirmation */}
                                    <div className="flex items-center space-x-2 pl-2">
                                        {showDeleteConfirm === chat._id ? (
                                            <div className="flex items-center space-x-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-1 border border-gray-700/50">
                                                <button
                                                    onClick={() => {
                                                        onDeleteChat(chat._id);
                                                        setShowDeleteConfirm(null);
                                                    }}
                                                    className="px-2 py-1 text-xs bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded transition-all duration-200 text-xs font-medium"
                                                    title="Delete permanently"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(null)}
                                                    className="px-2 py-1 text-xs bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-300 rounded transition-all duration-200 text-xs font-medium"
                                                    title="Cancel"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowDeleteConfirm(chat._id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                                                title="Delete chat"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-700/30">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl blur opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative flex items-center space-x-3 p-3 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700/30">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30"></div>
                            <div className="relative w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-200 truncate">John Doe</h4>
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
                                <p className="text-xs text-gray-400 truncate">Premium Plan</p>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;