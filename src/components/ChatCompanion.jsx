import { useState } from "react";
import "../style/styles.css";

function ChatCompanion() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setMessages((prev) => [
        ...prev,
        { text: "네, 어떤 도움을 드릴까요?", sender: "bot" },
      ]);
      setInput("");
    }
  };

  return (
    <div className="container">
      <h2>말벗과 대화하기</h2>
      <div
        style={{
          height: "60vh",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "1rem",
        }}
      >
        {messages.map((msg, index) => (
          <p
            key={index}
            style={{
              fontSize: "1.5rem",
              textAlign: msg.sender === "user" ? "right" : "left",
              color: msg.sender === "user" ? "blue" : "black",
              margin: "0.5rem",
            }}
          >
            {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요"
        style={{
          width: "100%",
          fontSize: "1.5rem",
          padding: "0.5rem",
          marginBottom: "1rem",
        }}
      />
      <button onClick={handleSend}>보내기</button>
      <button style={{ marginTop: "1rem" }}>고전 가요 듣기</button>
    </div>
  );
}

export default ChatCompanion;
