import React, { useState } from "react";

const MatchScreen = ({
  userState,
  messages,
  messageCount,
  socket,
  pinned,
  onUnpin,
  freezeCountdown,
}) => {
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send_message", { text: input, time: Date.now() });
    setInput("");
  };

  const renderCountdown = () => {
    if (freezeCountdown === null) return null;
    const percentage = (freezeCountdown / 10) * 100;
    return (
      <div className="mt-2 flex flex-col items-center">
        <div className="relative w-20 h-20">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 36 36"
          >
            <path
              className="text-pink-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-pink-600 transition-all duration-1000"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-pink-700 font-bold text-lg">
            {freezeCountdown}s
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl border-4 border-indigo-100">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center">
        Your Daily Match
      </h2>
      <p className="text-sm text-gray-500 mb-4 text-center">
        State:{" "}
        <span className="font-semibold text-indigo-600">{userState}</span>
      </p>

      {pinned ? (
        <button
          onClick={onUnpin}
          className="mb-4 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full transition-all shadow-md"
        >
          💔 Unpin Match
        </button>
      ) : (
        <div className="mb-4 text-sm text-pink-600 font-medium text-center">
          You’ve unpinned. Reflection period started.
          {renderCountdown()}
        </div>
      )}

      <div className="h-64 overflow-y-auto border border-indigo-200 rounded-xl p-3 mb-4 bg-indigo-50">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-md p-2 mb-2 text-sm text-gray-800"
            >
              {msg.text}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">
            No messages yet. Start the conversation!
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          className="flex-grow border border-gray-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={userState === "frozen"}
        />
        <button
          onClick={sendMessage}
          disabled={userState === "frozen"}
          className={`px-4 py-2 rounded-full text-white font-semibold shadow-md transition-all ${
            userState === "frozen"
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          🚀 Send
        </button>
      </div>

      <div className="mt-4 text-sm text-green-600 text-center">
        📩 Message Progress:{" "}
        <span className="font-bold">{messageCount}/100</span>
      </div>
    </div>
  );
};

export default MatchScreen;
