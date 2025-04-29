import { useState } from "react";
import "../style/styles.css";
import axios from "axios";

function ChatCompanion() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      // 사용자 메시지 추가
      const userMessage = { text: input, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        // OpenAI API 호출
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo", // 또는 gpt-4, 사용 가능한 모델 확인 필요
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: input },
            ],
            max_tokens: 150,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        // OpenAI 응답 메시지 추가
        const botMessage = {
          text: response.data.choices[0].message.content.trim(),
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("OpenAI API 호출 오류:", error);
        setMessages((prev) => [
          ...prev,
          { text: "오류가 발생했습니다. 다시 시도해주세요.", sender: "bot" },
        ]);
      } finally {
        setIsLoading(false);
      }
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
      />
      <button onClick={handleSend} disabled={isLoading}>
        {isLoading ? "처리 중..." : "보내기"}
      </button>
      <button style={{ marginTop: "1rem" }}>고전 가요 듣기</button>
    </div>
  );
}

export default ChatCompanion;
