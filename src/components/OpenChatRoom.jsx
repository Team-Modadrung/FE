import React, { useState, useRef, useEffect } from "react";
import "../style/openChatRoom.css";
import axios from "axios";

const OpenChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const API = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get("/region-chat");
        setMessages(res.data.messages);
      } catch (err) {
        console.error("메시지 불러오기 실패:", err);
        alert("❌ 로그인 해주세요.");
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 새 메시지 수신 시 다른 사람 메시지일 경우 TTS 실행
  useEffect(() => {
    if (messages.length === 0) return;
    const myName = localStorage.getItem("name");
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.userName !== myName) {
      playTTS(lastMsg.message);
    }
  }, [messages]);

  const handleSend = async (msgText) => {
    const trimmed = msgText.trim();
    if (trimmed === "") return;

    try {
      await API.post("/region-chat", { message: trimmed });
      const res = await API.get("/region-chat");
      setMessages(res.data.messages);
      setInput("");
    } catch (err) {
      console.error("메시지 전송 실패:", err);
      alert("❌ 메시지를 전송하지 못했습니다.");
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedHandleSend = debounce(() => handleSend(input), 100);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.repeat) {
      e.preventDefault();
      debouncedHandleSend();
    }
  };

  // 음성 인식 → 인식 끝나면 바로 메시지 전송
  const handleSpeak = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.start();

    recognition.onresult = async (event) => {
      const speechResult = event.results[0][0].transcript;
      setInput(speechResult);
      await handleSend(speechResult); // 인식된 내용 바로 전송
    };

    recognition.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
      alert("❌ 음성 인식에 실패했습니다.");
    };
  };

  // TTS 함수
  const playTTS = (text) => {
    if (!window.speechSynthesis) {
      console.warn("TTS 지원 안됨");
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ko-KR";
    window.speechSynthesis.speak(utter);
  };

  const myName = localStorage.getItem("name");

  return (
    <div className="container">
      <h1>오픈 채팅방</h1>

      <div className="chat-area">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat-line ${
              msg.userName === myName ? "my-message" : "other-message"
            }`}
          >
            {msg.userName !== myName && (
              <span className="chat-sender">{msg.userName}</span>
            )}
            <div className="chat-bubble">{msg.message}</div>
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
        <button onClick={handleSpeak}>말하기</button>
        <button onClick={debouncedHandleSend}>보내기</button>
      </div>
    </div>
  );
};

export default OpenChatRoom;
