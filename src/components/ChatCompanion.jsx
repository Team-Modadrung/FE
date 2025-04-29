import { useState } from "react";
import "../style/styles.css";
import axios from "axios";

function ChatCompanion() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (isLoading || !input.trim()) return; // 중복 전송 방지 + 빈 입력 무시

    setIsLoading(true); // 즉시 처리 중 상태 설정
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage = {
        text: response.data.choices[0].message.content.trim(),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("OpenAI API 호출 오류:", error);

      const errorText =
        error.response?.status === 429
          ? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
          : "오류가 발생했습니다. 다시 시도해주세요.";

      setMessages((prev) => [...prev, { text: errorText, sender: "bot" }]);
    } finally {
      setIsLoading(false);
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
          borderRadius: "5px",
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
        {isLoading && <p style={{ color: "gray" }}>응답 생성 중...</p>}
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
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />
      <button onClick={handleSend} disabled={isLoading}>
        {isLoading ? "처리 중..." : "보내기"}
      </button>
      <button style={{ marginTop: "1rem" }}>고전 가요 듣기</button>
    </div>
  );
}

export default ChatCompanion;
