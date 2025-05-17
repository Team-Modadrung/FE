import React, { useState, useEffect, useRef, useCallback } from "react";
import "../style/chatCompanion.css"; // CSS 파일 임포트
import axios from "axios";

const initialBotGreeting =
  "안녕하세요. 저는 당신의 이야기를 귀 기울여 들어줄 마음 상담 AI입니다. 어떤 이야기든 편안하게 나눠주세요.";

function ChatCompanion() {
  const [messages, setMessages] = useState([
    { text: initialBotGreeting, sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBoxRef = useRef(null);
  const lastTranscriptRef = useRef("");
  const recognition = useRef(null);
  const speechUtterance = useRef(null);
  const speechSynthesis = useRef(window.speechSynthesis || null);

  // 음성 인식 및 합성 초기화
  useEffect(() => {
    if (
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    recognition.current = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.current.lang = "ko-KR";
    recognition.current.interimResults = true;

    recognition.current.onstart = () => {
      setIsListening(true);
      lastTranscriptRef.current = "";
      if (speechSynthesis.current?.speaking) {
        speechSynthesis.current.cancel();
      }
    };

    recognition.current.onresult = (event) => {
      let currentTranscript = "";
      let isFinalResult = false;
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          isFinalResult = true;
        }
      }
      setInput(currentTranscript);
      if (
        isFinalResult &&
        currentTranscript.trim() &&
        currentTranscript.trim() !== lastTranscriptRef.current
      ) {
        lastTranscriptRef.current = currentTranscript.trim();
        handleSend(currentTranscript.trim());
      }
    };

    recognition.current.onend = () => setIsListening(false);
    recognition.current.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
      setIsListening(false);
      alert("음성 인식 중 오류가 발생했습니다: " + event.error);
    };

    if (speechSynthesis.current) {
      speechUtterance.current = new SpeechSynthesisUtterance();
      speechUtterance.current.lang = "ko-KR";
      speechUtterance.current.rate = 1;
      speechUtterance.current.pitch = 1;
    }

    return () => {
      if (recognition.current) recognition.current.stop();
      if (speechSynthesis.current?.speaking) speechSynthesis.current.cancel();
    };
  }, []);

  // 채팅 박스 자동 스크롤
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading, isListening]);

  // 음성 인식 시작/중지
  const handleListen = useCallback(() => {
    if (!recognition.current) return;
    if (!isListening) {
      setInput("");
      lastTranscriptRef.current = "";
      if (speechSynthesis.current?.speaking) {
        speechSynthesis.current.cancel();
      }
      recognition.current.start();
    } else {
      recognition.current.stop();
    }
  }, [isListening]);

  // OpenAI API 호출
  const callOpenAIAPI = useCallback(async (userMessage) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reply = response.data.reply;
      const botMessage = { text: reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);

      if (speechSynthesis.current && speechUtterance.current) {
        if (speechSynthesis.current.speaking) {
          speechSynthesis.current.cancel();
        }
        speechUtterance.current.text = reply;
        speechSynthesis.current.speak(speechUtterance.current);
      }

      return botMessage;
    } catch (err) {
      console.error("API 호출 오류:", err);
      const errorMessage = {
        text: "죄송합니다. 답변 생성 중 오류가 발생했습니다.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
      return errorMessage;
    }
  }, []);

  // 메시지 전송
  const handleSend = useCallback(
    async (messageToSend) => {
      const trimmedMessage = messageToSend.trim();
      if (isLoading || !trimmedMessage) return;

      setIsLoading(true);
      if (isListening && recognition.current) recognition.current.stop();
      if (speechSynthesis.current?.speaking) speechSynthesis.current.cancel();

      const userMessage = { text: trimmedMessage, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      await callOpenAIAPI(trimmedMessage);
      setIsLoading(false);
    },
    [isLoading, isListening, callOpenAIAPI]
  );

  // 수동 전송
  const handleManualSend = useCallback(() => {
    if (input.trim() && !isLoading) {
      handleSend(input.trim());
    }
  }, [input, isLoading, handleSend]);

  return (
    <div className="chat-companion">
      <h2 className="chat-companion-title">마음 나누기 AI 챗봇</h2>
      <p className="chat-companion-warning">
        [주의] 이 챗봇은 AI이며 전문적인 심리 상담이나 치료를 대체할 수
        없습니다. 심각한 어려움을 겪고 계시거나 위기 상황 시에는 반드시
        전문가(1393, 1577-0199 등)와 상담하세요.
      </p>
      <div
        className="chat-companion-box"
        ref={chatBoxRef}
        role="log"
        aria-live="polite"
      >
        {messages.map((msg, index) => (
          <p
            key={`${msg.sender}-${index}`}
            className={`chat-companion-message ${
              msg.sender === "user" ? "user" : "bot"
            }`}
          >
            {msg.text}
          </p>
        ))}
        {isLoading && (
          <p className="chat-companion-status loading">
            답변을 생각하고 있어요...
          </p>
        )}
        {isListening && (
          <p className="chat-companion-status listening">듣고 있어요...</p>
        )}
      </div>
      <div className="chat-companion-input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="하고 싶은 이야기를 편하게 입력하세요..."
          className="chat-companion-input"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && !isLoading) {
              handleManualSend();
            }
          }}
          aria-label="메시지 입력"
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleListen}
            disabled={isLoading}
            className="chat-companion-button listen"
            aria-label={isListening ? "듣기 중단" : "음성으로 말하기"}
          >
            {isListening ? "■" : "말하기"}
          </button>
          <button
            onClick={handleManualSend}
            disabled={isLoading || !input.trim()}
            className="chat-companion-button send"
            aria-label="메시지 전송"
          >
            {isLoading ? "..." : "전송"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatCompanion;
