import React, { useState, useRef, useEffect } from "react";
import "../style/openChatRoom.css";

const OpenChatRoom = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "시스템", text: "안녕하세요! 채팅을 시작해보세요." },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message function
  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed === "") return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "나", text: trimmed },
    ]);
    setInput("");
  };

  // Debounce to prevent double execution
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedHandleSend = debounce(handleSend, 100);

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.repeat) {
      e.preventDefault();
      debouncedHandleSend();
    }
  };

  return (
    <div className="container">
      <h1>오픈 채팅방</h1>

      <div className="chat-area">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-line ${
              msg.sender === "나" ? "my-message" : "other-message"
            }`}
          >
            {msg.sender !== "나" && (
              <span className="chat-sender">{msg.sender}</span>
            )}
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={debouncedHandleSend}>보내기</button>
      </div>
    </div>
  );
};

export default OpenChatRoom;
